import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const app = express();
app.use(cors());

const rawBodySaver = (req, _res, buf) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString('utf8');
  }
};

app.use(express.json({ verify: rawBodySaver }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'appointments.json');

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '1159132301'; // E.164 display only
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || '';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || 'v21.0';
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || '';
const WHATSAPP_APP_SECRET = process.env.WHATSAPP_APP_SECRET || '';

const ensureDataFile = async () => {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, '[]', 'utf-8');
  }
};

const readAppointments = async () => {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, 'utf-8');
  return JSON.parse(raw);
};

const writeAppointments = async (appointments) => {
  await fs.writeFile(dataFile, JSON.stringify(appointments, null, 2), 'utf-8');
};

const sendWhatsAppMessage = async ({ to, message }) => {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    return { ok: false, error: 'WhatsApp no configurado.' };
  }
  const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    return { ok: false, error: data };
  }
  return { ok: true, data };
};

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    whatsappNumber: WHATSAPP_NUMBER || null,
    whatsappConfigured: Boolean(WHATSAPP_TOKEN && WHATSAPP_PHONE_NUMBER_ID)
  });
});

app.get('/api/appointments', async (_req, res) => {
  try {
    const appointments = await readAppointments();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron leer los turnos.' });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { client, phone, service, professional, date, time, status, source } = req.body || {};
    if (!client || !service || !professional || !date || !time) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    const appointments = await readAppointments();
    const newAppointment = {
      id: Date.now(),
      client,
      phone: phone || '',
      service,
      professional,
      date,
      time,
      status: status || 'Confirmado',
      source: source || 'bot'
    };

    appointments.push(newAppointment);
    await writeAppointments(appointments);

    let whatsappResult = null;
    if (phone) {
      const message = `Hola ${client}, tu turno está confirmado.\nServicio: ${service}\nProfesional: ${professional}\nFecha: ${date}\nHora: ${time}`;
      whatsappResult = await sendWhatsAppMessage({ to: phone, message });
    }

    return res.status(201).json({ appointment: newAppointment, whatsapp: whatsappResult });
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo guardar el turno.' });
  }
});

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token && token === WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

const isValidSignature = (req) => {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature || !WHATSAPP_APP_SECRET || !req.rawBody) return false;
  const expected = `sha256=${crypto
    .createHmac('sha256', WHATSAPP_APP_SECRET)
    .update(req.rawBody, 'utf8')
    .digest('hex')}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};

app.post('/webhook', (req, res) => {
  if (!isValidSignature(req)) {
    return res.sendStatus(401);
  }
  // TODO: handle incoming messages if needed
  return res.sendStatus(200);
});

app.post('/api/whatsapp/send', async (req, res) => {
  try {
    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      return res.status(400).json({ error: 'WhatsApp no configurado.' });
    }
    const { to, message } = req.body || {};
    if (!to || !message) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    const result = await sendWhatsAppMessage({ to, message });
    if (!result.ok) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo enviar el mensaje.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API escuchando en http://localhost:${PORT}`);
});
