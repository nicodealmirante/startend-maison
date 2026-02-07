import React, { useState, useEffect } from 'react';
import { Clock, User, Check, Sparkles, Star, Menu, X, Instagram, Phone, MapPin } from 'lucide-react';

const EsteticaMaisonApp = () => {
  const [view, setView] = useState('home');
  const [adminTab, setAdminTab] = useState('turnos');
  const [menuOpen, setMenuOpen] = useState(false);

  const [bookingStep, setBookingStep] = useState(1);
  const [bookingProTab, setBookingProTab] = useState('mujer');
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientData, setClientData] = useState({ name: '', phone: '', email: '' });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('maison_appointments');
    return saved ? JSON.parse(saved) : [
      { id: 101, client: "Ana García", service: "Limpieza Facial Profunda", professional: "Lucía Fernández", date: "2024-03-10", time: "10:00", status: "Confirmado" },
      { id: 102, client: "Lucía Pérez", service: "Masaje Descontracturante", professional: "Camila Ruiz", date: "2024-03-10", time: "14:00", status: "Pendiente" }
    ];
  });

  const normalizeProfessionals = (list) => list.map((p) => ({
    ...p,
    timeSlots: p.timeSlots || [],
    startTime: p.startTime || "09:00",
    endTime: p.endTime || "18:00"
  }));

  const [professionals, setProfessionals] = useState(() => {
    const saved = localStorage.getItem('maison_professionals');
    const base = saved ? JSON.parse(saved) : [
      { id: 1, name: "Lucía Fernández", specialties: ["Facial"], timeSlots: ["09:00", "10:00", "11:00", "14:00"], startTime: "09:00", endTime: "18:00" },
      { id: 2, name: "Camila Ruiz", specialties: ["Corporal"], timeSlots: ["12:00", "15:00", "16:00", "18:00"], startTime: "10:00", endTime: "19:00" },
      { id: 3, name: "Sofía Méndez", specialties: ["Ojos"], timeSlots: ["09:00", "13:00", "17:00"], startTime: "09:00", endTime: "17:00" },
      { id: 4, name: "Valentina Ríos", specialties: ["Facial"], timeSlots: ["10:00", "12:00", "15:00", "17:00"], startTime: "10:00", endTime: "18:00" },
      { id: 5, name: "Marco Díaz", specialties: ["Barbería"], timeSlots: ["10:00", "11:00", "12:00", "15:00", "16:00"], startTime: "10:00", endTime: "19:00" },
      { id: 6, name: "Julián Vega", specialties: ["Barbería"], timeSlots: ["09:00", "10:00", "13:00", "16:00"], startTime: "09:00", endTime: "18:00" },
      { id: 7, name: "Tomás Ibarra", specialties: ["Barbería"], timeSlots: ["11:00", "14:00", "17:00", "18:00"], startTime: "11:00", endTime: "20:00" },
      { id: 8, name: "Bruno Molina", specialties: ["Barbería"], timeSlots: ["09:30", "12:30", "15:30", "18:30"], startTime: "09:30", endTime: "19:30" },
    ];
    return normalizeProfessionals(base);
  });

  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('maison_services');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Limpieza Facial Profunda", price: "$15.000", duration: "60 min", category: "Facial", icon: "✨" },
      { id: 2, name: "Lifting de Pestañas", price: "$12.500", duration: "45 min", category: "Ojos", icon: "👁️" },
      { id: 3, name: "Masaje Descontracturante", price: "$18.000", duration: "50 min", category: "Corporal", icon: "💆‍♀️" },
      { id: 4, name: "Drenaje Linfático", price: "$16.000", duration: "50 min", category: "Corporal", icon: "🌿" },
      { id: 5, name: "Peeling Químico", price: "$20.000", duration: "40 min", category: "Facial", icon: "🧪" },
      { id: 6, name: "Perfilado de Cejas", price: "$8.000", duration: "30 min", category: "Ojos", icon: "✏️" },
      { id: 7, name: "Corte de Cabello", price: "$10.000", duration: "30 min", category: "Barbería", icon: "💈" },
      { id: 8, name: "Arreglo de Barba", price: "$9.000", duration: "25 min", category: "Barbería", icon: "🪒" },
      { id: 9, name: "Corte + Barba", price: "$16.000", duration: "50 min", category: "Barbería", icon: "✂️" },
    ];
  });

  const getNextDays = () => {
    const dates = [];
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      if (d.getDay() !== 0) {
        dates.push({
          fullDate: d.toISOString().split('T')[0],
          dayName: days[d.getDay()],
          dayNumber: d.getDate(),
          month: months[d.getMonth()]
        });
      }
    }
    return dates;
  };

  const availableDates = getNextDays();
  const defaultTimeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  useEffect(() => {
    localStorage.setItem('maison_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('maison_professionals', JSON.stringify(professionals));
  }, [professionals]);

  useEffect(() => {
    localStorage.setItem('maison_services', JSON.stringify(services));
  }, [services]);

  const parseDurationMinutes = (duration) => {
    if (!duration) return 0;
    const match = duration.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const toMinutes = (time) => {
    const [h, m] = time.split(':').map(Number);
    return (h * 60) + m;
  };

  const toTime = (minutes) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const generateSlotsFromRange = (startTime, endTime, durationMinutes) => {
    if (!startTime || !endTime || durationMinutes <= 0) return [];
    const start = toMinutes(startTime);
    const end = toMinutes(endTime);
    if (end <= start) return [];
    const slots = [];
    for (let t = start; t + durationMinutes <= end; t += durationMinutes) {
      slots.push(toTime(t));
    }
    return slots;
  };

  const getProfessionalTimeSlots = () => {
    const durationMinutes = parseDurationMinutes(selectedService?.duration);
    const buildForPro = (pro) => {
      const autoSlots = generateSlotsFromRange(pro.startTime, pro.endTime, durationMinutes);
      const manual = pro.timeSlots || [];
      return Array.from(new Set([...manual, ...autoSlots]));
    };

    if (!selectedProfessional || selectedProfessional.id === 'first-time') {
      const all = professionals.flatMap(buildForPro);
      const merged = all.length > 0 ? all : defaultTimeSlots;
      return Array.from(new Set(merged)).sort();
    }

    const merged = buildForPro(selectedProfessional);
    return merged.length > 0 ? merged.sort() : defaultTimeSlots;
  };

  const allCategories = Array.from(new Set(services.map(service => service.category)));
  const barberiaCategories = allCategories.filter(cat => cat === "Barbería");
  const mujerCategories = allCategories.filter(cat => cat !== "Barbería");
  const firstTimeProfessional = {
    id: 'first-time',
    name: "1era vez",
    specialties: bookingProTab === 'barberia' ? barberiaCategories : mujerCategories
  };

  const shuffledProfessionals = useState(() => {
    const copy = [...professionals];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  })[0];

  const filteredServices = selectedProfessional
    ? services.filter(service => selectedProfessional.specialties.includes(service.category))
    : services.filter(service => (bookingProTab === 'barberia' ? service.category === "Barbería" : service.category !== "Barbería"));

  const homeEsteticaServices = services.filter(service => service.category !== "Barbería");
  const homeBarberiaServices = services.filter(service => service.category === "Barbería");

  const handleProfessionalSelect = (professional) => {
    setSelectedProfessional(professional);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingStep(2);
    window.scrollTo(0, 0);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setBookingStep(3);
    window.scrollTo(0, 0);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setBookingStep(4);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setBookingStep(5);
  };

  const handleClientSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      id: Math.floor(Math.random() * 10000),
      client: clientData.name,
      phone: clientData.phone,
      service: selectedService.name,
      professional: selectedProfessional.name,
      date: selectedDate.fullDate,
      time: selectedTime,
      status: "Confirmado"
    };

    setAppointments([...appointments, newAppointment]);
    setView('success');
    window.scrollTo(0, 0);
  };

  const resetBooking = () => {
    setBookingStep(1);
    setBookingProTab('mujer');
    setSelectedProfessional(null);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setClientData({ name: '', phone: '', email: '' });
    setView('home');
  };

  const Navbar = () => (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div
            onClick={() => setView('home')}
            className="flex items-center cursor-pointer font-serif text-2xl text-rose-900 tracking-wider"
          >
            MAISON
            <span className="text-xs ml-1 bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-sans tracking-normal">Estética</span>
          </div>

          <div className="hidden md:flex space-x-8 text-gray-600">
            <button onClick={() => setView('home')} className="hover:text-rose-600 transition">Inicio</button>
            <button onClick={() => { setView('booking'); setBookingStep(1); }} className="hover:text-rose-600 transition">Servicios</button>
            <button
              onClick={() => {
                setView('home');
                setTimeout(() => document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
              className="hover:text-rose-600 transition"
            >
              Nosotros
            </button>
            <button onClick={() => setView('admin')} className="text-rose-900 font-medium hover:text-rose-700 flex items-center gap-1">
              <User size={16} /> Admin
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600">
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          <button onClick={() => { setView('home'); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-rose-50">Inicio</button>
          <button onClick={() => { setView('booking'); setBookingStep(1); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-rose-50">Reservar Turno</button>
          <button
            onClick={() => {
              setView('home');
              setMenuOpen(false);
              setTimeout(() => document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' }), 50);
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-rose-50"
          >
            Nosotros
          </button>
          <button onClick={() => { setView('admin'); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-rose-700 hover:bg-rose-50 font-medium">Acceso Admin</button>
        </div>
      )}
    </nav>
  );

  const HomeView = () => (
    <div className="animate-fade-in">
      <div className="bg-rose-50 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-sm font-bold text-rose-600 tracking-widest uppercase mb-3">Bienvenida a tu espacio</h2>
          <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6 leading-tight">
            Descubre tu mejor versión en <span className="italic text-rose-800">Maison</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Tratamientos personalizados de estética facial y corporal en un ambiente diseñado para tu relajación absoluta.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-3">
            <button
              onClick={() => { setView('booking'); setBookingStep(1); }}
              className="bg-rose-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-rose-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Agendar Cita
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 border border-rose-100 rounded-2xl hover:shadow-md transition">
          <div className="bg-rose-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
            <Sparkles />
          </div>
          <h3 className="font-serif text-xl mb-2">Tecnología Avanzada</h3>
          <p className="text-gray-500 text-sm">Contamos con aparatología de última generación para resultados visibles.</p>
        </div>
        <div className="text-center p-6 border border-rose-100 rounded-2xl hover:shadow-md transition">
          <div className="bg-rose-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
            <Star />
          </div>
          <h3 className="font-serif text-xl mb-2">Profesionales Expertos</h3>
          <p className="text-gray-500 text-sm">Nuestro equipo se capacita constantemente en las últimas tendencias.</p>
        </div>
        <div className="text-center p-6 border border-rose-100 rounded-2xl hover:shadow-md transition">
          <div className="bg-rose-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
            <Clock />
          </div>
          <h3 className="font-serif text-xl mb-2">Atención Puntual</h3>
          <p className="text-gray-500 text-sm">Respetamos tu tiempo. Sistema de turnos organizado y eficiente.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <section id="servicios-mujer" className="mb-12 scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-2xl text-gray-900">Servicios Mujer</h3>
              <p className="text-sm text-gray-500">Estética facial y corporal</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {homeEsteticaServices.map(service => (
              <div
                key={service.id}
                className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition bg-white"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{service.icon}</span>
                  <span className="text-rose-900 font-bold">{service.price}</span>
                </div>
                <h4 className="font-medium text-gray-900">{service.name}</h4>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Clock size={14} /> {service.duration}
                </p>
                <button
                  onClick={() => { setView('booking'); setBookingStep(1); }}
                  className="mt-4 text-sm text-rose-700 hover:text-rose-900"
                >
                  Reservar
                </button>
              </div>
            ))}
            {homeEsteticaServices.length === 0 && (
              <div className="text-sm text-gray-500">No hay servicios disponibles.</div>
            )}
          </div>
        </section>

        <section id="servicios-barberia" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-2xl text-gray-900">Servicios Barbería</h3>
              <p className="text-sm text-gray-500">Cortes y cuidado masculino</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {homeBarberiaServices.map(service => (
              <div
                key={service.id}
                className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition bg-white"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{service.icon}</span>
                  <span className="text-rose-900 font-bold">{service.price}</span>
                </div>
                <h4 className="font-medium text-gray-900">{service.name}</h4>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Clock size={14} /> {service.duration}
                </p>
                <button
                  onClick={() => { setView('booking'); setBookingStep(1); }}
                  className="mt-4 text-sm text-rose-700 hover:text-rose-900"
                >
                  Reservar
                </button>
              </div>
            ))}
            {homeBarberiaServices.length === 0 && (
              <div className="text-sm text-gray-500">No hay servicios disponibles.</div>
            )}
          </div>
        </section>
      </div>

      <section id="nosotros" className="bg-white py-16 border-t border-gray-100 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="font-serif text-3xl text-gray-900 mb-4">Nosotros</h3>
            <p className="text-gray-600 mb-4">
              En Maison combinamos estética avanzada y barbería profesional en un espacio pensado para el bienestar.
              Nuestro equipo trabaja con protocolos personalizados para que cada visita sea única.
            </p>
            <p className="text-gray-600 mb-6">
              Priorizamos la puntualidad, la higiene y la atención cercana. Queremos que te sientas cómodo desde que
              llegás hasta que te vas.
            </p>
            <button
              onClick={() => { setView('booking'); setBookingStep(1); }}
              className="bg-rose-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-rose-800 transition"
            >
              Reservar Ahora
            </button>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8">
            <h4 className="font-serif text-xl text-gray-900 mb-3">Nuestro compromiso</h4>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li>Diagnóstico personalizado y seguimiento.</li>
              <li>Productos de calidad y técnicas actualizadas.</li>
              <li>Ambiente cuidado y atención detallista.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );

  const BookingView = () => (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${bookingStep >= 1 ? 'bg-rose-900 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${bookingStep >= 2 ? 'bg-rose-900 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${bookingStep >= 3 ? 'bg-rose-900 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${bookingStep >= 4 ? 'bg-rose-900 text-white' : 'bg-gray-200 text-gray-500'}`}>4</div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${bookingStep >= 5 ? 'bg-rose-900 text-white' : 'bg-gray-200 text-gray-500'}`}>5</div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[500px]">
        {bookingStep === 1 && (
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-serif text-gray-800 mb-6">Elige Profesional</h2>
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => {
                  setBookingProTab('mujer');
                  setSelectedProfessional(null);
                  setSelectedService(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setBookingStep(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium ${bookingProTab === 'mujer' ? 'bg-rose-900 text-white' : 'bg-rose-50 text-rose-900 hover:bg-rose-100'}`}
              >
                Mujer
              </button>
              <button
                onClick={() => {
                  setBookingProTab('barberia');
                  setSelectedProfessional(null);
                  setSelectedService(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setBookingStep(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium ${bookingProTab === 'barberia' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Barbería
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => handleProfessionalSelect(firstTimeProfessional)}
                className="border border-rose-300 bg-rose-50 rounded-xl p-4 text-left hover:border-rose-400 hover:bg-rose-100 transition"
              >
                <div className="font-medium text-rose-900">{firstTimeProfessional.name}</div>
                <div className="text-xs text-rose-700 mt-1">Sin preferencia de profesional</div>
              </button>
              {(bookingProTab === 'mujer'
                ? shuffledProfessionals.filter(p => !p.specialties.includes("Barbería"))
                : shuffledProfessionals.filter(p => p.specialties.includes("Barbería"))
              ).map(pro => (
                <button
                  key={pro.id}
                  onClick={() => handleProfessionalSelect(pro)}
                  className="border border-gray-200 rounded-xl p-4 text-left hover:border-rose-400 hover:bg-rose-50 transition"
                >
                  <div className="font-medium text-gray-900">{pro.name}</div>
                  <div className="text-xs text-gray-500 mt-1">Especialidades: {pro.specialties.join(', ')}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {bookingStep === 2 && (
          <div className="p-6 md:p-8">
            <button onClick={() => setBookingStep(1)} className="text-sm text-gray-500 hover:text-rose-600 mb-4 flex items-center gap-1">← Volver</button>
            <h2 className="text-2xl font-serif text-gray-800 mb-6">Selecciona un Tratamiento</h2>
            <p className="text-gray-500 mb-6">Con {selectedProfessional.name}</p>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredServices.map(service => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">{service.icon}</span>
                    <span className="text-rose-900 font-bold">{service.price}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-rose-700">{service.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <Clock size={14} /> {service.duration}
                  </p>
                </div>
              ))}
              {filteredServices.length === 0 && (
                <div className="text-sm text-gray-500">No hay servicios disponibles para esta profesional.</div>
              )}
            </div>
          </div>
        )}

        {bookingStep === 3 && (
          <div className="p-6 md:p-8">
            <button onClick={() => setBookingStep(2)} className="text-sm text-gray-500 hover:text-rose-600 mb-4 flex items-center gap-1">← Volver</button>
            <h2 className="text-2xl font-serif text-gray-800 mb-2">Elige un Día</h2>
            <p className="text-gray-500 mb-6">Para {selectedService.name}</p>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {availableDates.map((date, idx) => (
                <div
                  key={idx}
                  onClick={() => handleDateSelect(date)}
                  className="border border-gray-200 rounded-xl p-3 text-center cursor-pointer hover:border-rose-500 hover:bg-rose-50 transition"
                >
                  <div className="text-xs uppercase text-rose-600 font-bold mb-1">{date.month}</div>
                  <div className="text-2xl font-serif text-gray-800 mb-1">{date.dayNumber}</div>
                  <div className="text-sm text-gray-500">{date.dayName}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {bookingStep === 4 && (
          <div className="p-6 md:p-8">
            <button onClick={() => setBookingStep(3)} className="text-sm text-gray-500 hover:text-rose-600 mb-4 flex items-center gap-1">← Volver</button>
            <h2 className="text-2xl font-serif text-gray-800 mb-2">Selecciona Horario</h2>
            <p className="text-gray-500 mb-6">
              {selectedDate.dayName} {selectedDate.dayNumber} de {selectedDate.month}
            </p>

            <div className="grid grid-cols-3 gap-3">
              {getProfessionalTimeSlots().map((time, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTimeSelect(time)}
                  className="border border-gray-200 py-3 rounded-lg text-gray-700 hover:bg-rose-900 hover:text-white hover:border-rose-900 transition"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {bookingStep === 5 && (
          <div className="p-6 md:p-8">
            <button onClick={() => setBookingStep(4)} className="text-sm text-gray-500 hover:text-rose-600 mb-4 flex items-center gap-1">← Volver</button>
            <h2 className="text-2xl font-serif text-gray-800 mb-6">Tus Datos</h2>

            <div className="bg-rose-50 p-4 rounded-lg mb-6 text-sm text-gray-700 border border-rose-100">
              <div className="flex justify-between mb-1">
                <span className="font-bold">Profesional:</span>
                <span>{selectedProfessional.name}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="font-bold">Tratamiento:</span>
                <span>{selectedService.name}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="font-bold">Fecha:</span>
                <span>{selectedDate.dayName} {selectedDate.dayNumber} {selectedDate.month}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Hora:</span>
                <span>{selectedTime} hs</span>
              </div>
            </div>

            <form onSubmit={handleClientSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input
                  required
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  placeholder="Ej. María González"
                  value={clientData.name}
                  onChange={e => setClientData({ ...clientData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono / WhatsApp</label>
                <input
                  required
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  placeholder="Ej. 11 1234 5678"
                  value={clientData.phone}
                  onChange={e => setClientData({ ...clientData, phone: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-rose-800 transition mt-4 shadow-md"
              >
                Confirmar Reserva
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );

  const SuccessView = () => (
    <div className="max-w-xl mx-auto px-4 py-16 text-center animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-rose-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-serif text-gray-900 mb-2">¡Turno Confirmado!</h2>
        <p className="text-gray-500 mb-8">Gracias por elegir Maison. Te esperamos para consentirte.</p>

        <div className="bg-rose-50 p-6 rounded-xl text-left mb-8">
          <p className="text-gray-800 font-medium border-b border-rose-200 pb-2 mb-2">Detalle de la cita:</p>
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
            <p><strong>Profesional:</strong> {selectedProfessional?.name}</p>
            <p><strong>Servicio:</strong> {selectedService?.name}</p>
            <p><strong>Fecha:</strong> {selectedDate?.dayName} {selectedDate?.dayNumber}</p>
            <p><strong>Hora:</strong> {selectedTime} hs</p>
            <p><strong>Cliente:</strong> {clientData.name}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={resetBooking}
            className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition"
          >
            Volver al Inicio
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Te hemos enviado un recordatorio a tu WhatsApp.
            <br />Por cancelaciones, avisar con 24hs de antelación.
          </p>
        </div>
      </div>
    </div>
  );

  const AdminView = () => (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif text-gray-800">Panel de Administración</h2>
          <p className="text-gray-500 text-sm">Gestiona los turnos de la semana</p>
        </div>
        <button
          onClick={() => setView('home')}
          className="text-sm bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-600"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setAdminTab('turnos')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${adminTab === 'turnos' ? 'bg-rose-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Turnos
        </button>
        <button
          onClick={() => setAdminTab('config')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${adminTab === 'config' ? 'bg-rose-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Configuración
        </button>
      </div>

      {adminTab === 'turnos' && (
        <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-1">Turnos Hoy</div>
          <div className="text-3xl font-bold text-rose-900">{appointments.filter(a => a.date.includes('2024-03-10')).length + 1}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-1">Ingresos Estimados</div>
          <div className="text-3xl font-bold text-rose-900">$45.500</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-1">Nuevos Clientes</div>
          <div className="text-3xl font-bold text-rose-900">3</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-medium text-gray-600">Hora</th>
                <th className="p-4 font-medium text-gray-600">Cliente</th>
                <th className="p-4 font-medium text-gray-600">Servicio</th>
                <th className="p-4 font-medium text-gray-600">Profesional</th>
                <th className="p-4 font-medium text-gray-600">Estado</th>
                <th className="p-4 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.slice().reverse().map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-800 font-medium">
                    {appt.time} <span className="text-xs text-gray-400 block">{appt.date}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{appt.client}</div>
                    <div className="text-xs text-gray-500">{appt.phone}</div>
                  </td>
                  <td className="p-4 text-gray-600">{appt.service}</td>
                  <td className="p-4 text-gray-600">{appt.professional || "—"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appt.status === 'Confirmado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-gray-400 hover:text-rose-600">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {appointments.length === 0 && (
          <div className="p-8 text-center text-gray-500">No hay turnos registrados aún.</div>
        )}
      </div>
        </>
      )}

      {adminTab === 'config' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-gray-800">Profesionales</h3>
                <button
                  onClick={() => setProfessionals([...professionals, { id: Date.now(), name: "Nueva Profesional", specialties: ["Facial"], timeSlots: [...defaultTimeSlots], startTime: "09:00", endTime: "18:00" }])}
                  className="text-sm bg-rose-900 text-white px-3 py-1.5 rounded-lg hover:bg-rose-800"
                >
                  Agregar
                </button>
              </div>
              <div className="space-y-3">
                {professionals.map((pro, idx) => (
                  <div key={pro.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={pro.name}
                        onChange={(e) => {
                          const next = [...professionals];
                          next[idx] = { ...next[idx], name: e.target.value };
                          setProfessionals(next);
                        }}
                      />
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={pro.specialties.join(', ')}
                        onChange={(e) => {
                          const next = [...professionals];
                          next[idx] = {
                            ...next[idx],
                            specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          };
                          setProfessionals(next);
                        }}
                      />
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={(pro.timeSlots || []).join(', ')}
                        onChange={(e) => {
                          const next = [...professionals];
                          next[idx] = {
                            ...next[idx],
                            timeSlots: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          };
                          setProfessionals(next);
                        }}
                      />
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={pro.startTime || "09:00"}
                        onChange={(e) => {
                          const next = [...professionals];
                          next[idx] = {
                            ...next[idx],
                            startTime: e.target.value
                          };
                          setProfessionals(next);
                        }}
                      />
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={pro.endTime || "18:00"}
                        onChange={(e) => {
                          const next = [...professionals];
                          next[idx] = {
                            ...next[idx],
                            endTime: e.target.value
                          };
                          setProfessionals(next);
                        }}
                      />
                      <button
                        onClick={() => setProfessionals(professionals.filter(p => p.id !== pro.id))}
                        className="text-sm text-rose-700 hover:text-rose-900"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Especialidades, horarios y entrada/salida separados por coma.</p>
            </div>

          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="font-serif text-lg text-gray-800 mb-4">Servicios por Profesional</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-3 font-medium text-gray-600">Profesional</th>
                    <th className="p-3 font-medium text-gray-600">Especialidades</th>
                    <th className="p-3 font-medium text-gray-600">Servicios</th>
                    <th className="p-3 font-medium text-gray-600">Horarios</th>
                    <th className="p-3 font-medium text-gray-600">Entrada - Salida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {professionals.map((pro) => {
                    const proServices = services.filter(s => pro.specialties.includes(s.category));
                    return (
                      <tr key={pro.id} className="hover:bg-gray-50">
                        <td className="p-3 text-gray-900 font-medium">{pro.name}</td>
                        <td className="p-3 text-gray-600">{pro.specialties.join(', ')}</td>
                        <td className="p-3 text-gray-600">
                          {proServices.length > 0
                            ? proServices.map(s => s.name).join(', ')
                            : "Sin servicios asignados"}
                        </td>
                        <td className="p-3 text-gray-600">
                          {(pro.timeSlots && pro.timeSlots.length > 0) ? pro.timeSlots.join(', ') : "Sin horarios"}
                        </td>
                        <td className="p-3 text-gray-600">
                          {(pro.startTime && pro.endTime) ? `${pro.startTime} - ${pro.endTime}` : "Sin rango"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">Se calcula según coincidencia entre especialidades y categoría del servicio.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-gray-800">Servicios y Valores</h3>
              <button
                onClick={() => setServices([...services, { id: Date.now(), name: "Nuevo Servicio", price: "$0", duration: "30 min", category: "Facial", icon: "✨" }])}
                className="text-sm bg-rose-900 text-white px-3 py-1.5 rounded-lg hover:bg-rose-800"
              >
                Agregar
              </button>
            </div>
            <div className="space-y-3">
              {services.map((service, idx) => (
                <div key={service.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={service.name}
                      onChange={(e) => {
                        const next = [...services];
                        next[idx] = { ...next[idx], name: e.target.value };
                        setServices(next);
                      }}
                    />
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={service.price}
                      onChange={(e) => {
                        const next = [...services];
                        next[idx] = { ...next[idx], price: e.target.value };
                        setServices(next);
                      }}
                    />
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={service.duration}
                      onChange={(e) => {
                        const next = [...services];
                        next[idx] = { ...next[idx], duration: e.target.value };
                        setServices(next);
                      }}
                    />
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={service.category}
                      onChange={(e) => {
                        const next = [...services];
                        next[idx] = { ...next[idx], category: e.target.value };
                        setServices(next);
                      }}
                    />
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={service.icon}
                      onChange={(e) => {
                        const next = [...services];
                        next[idx] = { ...next[idx], icon: e.target.value };
                        setServices(next);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => setServices(services.filter(s => s.id !== service.id))}
                    className="text-xs text-rose-700 hover:text-rose-900 mt-2"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const Footer = () => (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="font-serif text-xl text-white mb-4">MAISON</h3>
          <p className="mb-4 text-gray-400">Tu refugio de belleza y bienestar en la ciudad.</p>
          <div className="flex gap-4">
            <Instagram className="cursor-pointer hover:text-white" />
            <Phone className="cursor-pointer hover:text-white" />
          </div>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Contacto</h4>
          <p className="flex items-center gap-2 mb-2"><MapPin size={16} /> Av. De Mayo 1624 - Ramos Mejia</p>
          <p className="flex items-center gap-2 mb-2"><Phone size={16} /> +54 9 11 6670 4322</p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Horarios</h4>
          <p>Lunes a Sábado</p>
          <p className="text-gray-400">09:00 - 20:00 hs</p>
          <p className="mt-2 text-rose-400 cursor-pointer hover:underline" onClick={() => setView('admin')}>Acceso Staff</p>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 selection:bg-rose-200">
      <Navbar />

      <main>
        {view === 'home' && <HomeView />}
        {view === 'booking' && <BookingView />}
        {view === 'success' && <SuccessView />}
        {view === 'admin' && <AdminView />}
      </main>

      {view !== 'admin' && view !== 'booking' && <Footer />}
    </div>
  );
};

export default EsteticaMaisonApp;
