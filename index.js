import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Check, Sparkles, Star, ChevronRight, Menu, X, Instagram, Phone, MapPin, LayoutDashboard } from 'lucide-react';

const EsteticaMaisonApp = () => {
  // Estado de la aplicación
  const [view, setView] = useState('home'); // home, booking, success, admin
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Estado para la reserva
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientData, setClientData] = useState({ name: '', phone: '', email: '' });
  
  // Base de datos simulada (Mock Data)
  const [appointments, setAppointments] = useState([
    { id: 101, client: "Ana García", service: "Limpieza Facial Profunda", professional: "Lucía Fernández", date: "2024-03-10", time: "10:00", status: "Confirmado" },
    { id: 102, client: "Lucía Pérez", service: "Masaje Descontracturante", professional: "Camila Ruiz", date: "2024-03-10", time: "14:00", status: "Pendiente" }
  ]);

  const services = [
    { id: 1, name: "Limpieza Facial Profunda", price: "$15.000", duration: "60 min", category: "Facial", icon: "✨" },
    { id: 2, name: "Lifting de Pestañas", price: "$12.500", duration: "45 min", category: "Ojos", icon: "👁️" },
    { id: 3, name: "Masaje Descontracturante", price: "$18.000", duration: "50 min", category: "Corporal", icon: "💆‍♀️" },
    { id: 4, name: "Drenaje Linfático", price: "$16.000", duration: "50 min", category: "Corporal", icon: "🌿" },
    { id: 5, name: "Peeling Químico", price: "$20.000", duration: "40 min", category: "Facial", icon: "🧪" },
    { id: 6, name: "Perfilado de Cejas", price: "$8.000", duration: "30 min", category: "Ojos", icon: "✏️" },
  ];
  const professionals = [
    { id: 1, name: "Lucía Fernández", specialty: "Facial" },
    { id: 2, name: "Camila Ruiz", specialty: "Corporal" },
    { id: 3, name: "Sofía Méndez", specialty: "Ojos" },
  ];

  // Generador de fechas próximas
  const getNextDays = () => {
    const dates = [];
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      // Omitir domingos para este negocio
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

  // Horarios disponibles simulados
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  // Manejadores
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setBookingStep(2);
    window.scrollTo(0, 0);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setBookingStep(3);
  };

  const handleProfessionalSelect = (professional) => {
    setSelectedProfessional(professional);
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
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedProfessional(null);
    setSelectedTime(null);
    setClientData({ name: '', phone: '', email: '' });
    setView('home');
  };

  // Componentes de la UI

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
            <button className="hover:text-rose-600 transition">Nosotros</button>
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
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          <button onClick={() => { setView('home'); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-rose-50">Inicio</button>
          <button onClick={() => { setView('booking'); setBookingStep(1); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-rose-50">Reservar Turno</button>
          <button onClick={() => { setView('admin'); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-rose-700 hover:bg-rose-50 font-medium">Acceso Admin</button>
        </div>
      )}
    </nav>
  );

  const HomeView = () => (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-rose-50 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-sm font-bold text-rose-600 tracking-widest uppercase mb-3">Bienvenida a tu espacio</h2>
          <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6 leading-tight">
            Descubre tu mejor versión en <span className="italic text-rose-800">Maison</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Tratamientos personalizados de estética facial y corporal en un ambiente diseñado para tu relajación absoluta.
          </p>
          <button 
            onClick={() => { setView('booking'); setBookingStep(1); }}
            className="bg-rose-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-rose-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Agendar Cita
          </button>
        </div>
      </div>

      {/* Highlights */}
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
    </div>
  );

  const BookingView = () => (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      {/* Progress Bar */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${bookingStep >= 1 ? 'bg-rose-900 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${bookingStep >= 2 ? 'bg-rose-900 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${bookingStep >= 3 ? 'bg-rose-900 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${bookingStep >= 4 ? 'bg-rose-900 text-white' : 'bg-gray-200 text-gray-500'}`}>4</div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${bookingStep >= 5 ? 'bg-rose-900 text-white' : 'bg-gray-200 text-gray-500'}`}>5</div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[500px]">
        {/* Step 1: Select Service */}
        {bookingStep === 1 && (
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-serif text-gray-800 mb-6">Selecciona un Tratamiento</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map(service => (
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
            </div>
          </div>
        )}

        {/* Step 2: Select Date */}
        {bookingStep === 2 && (
          <div className="p-6 md:p-8">
            <button onClick={() => setBookingStep(1)} className="text-sm text-gray-500 hover:text-rose-600 mb-4 flex items-center gap-1">← Volver</button>
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

        {/* Step 3: Select Professional */}
        {bookingStep === 3 && (
          <div className="p-6 md:p-8">
            <button onClick={() => setBookingStep(2)} className="text-sm text-gray-500 hover:text-rose-600 mb-4 flex items-center gap-1">← Volver</button>
            <h2 className="text-2xl font-serif text-gray-800 mb-2">Elige Profesional</h2>
            <p className="text-gray-500 mb-6">
              {selectedDate.dayName} {selectedDate.dayNumber} de {selectedDate.month}
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {professionals.map((pro) => (
                <button
                  key={pro.id}
                  onClick={() => handleProfessionalSelect(pro)}
                  className="border border-gray-200 rounded-xl p-4 text-left hover:border-rose-400 hover:bg-rose-50 transition"
                >
                  <div className="font-medium text-gray-900">{pro.name}</div>
                  <div className="text-xs text-gray-500 mt-1">Especialidad: {pro.specialty}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Select Time */}
        {bookingStep === 4 && (
          <div className="p-6 md:p-8">
            <button onClick={() => setBookingStep(3)} className="text-sm text-gray-500 hover:text-rose-600 mb-4 flex items-center gap-1">← Volver</button>
            <h2 className="text-2xl font-serif text-gray-800 mb-2">Selecciona Horario</h2>
            <p className="text-gray-500 mb-6">
              {selectedDate.dayName} {selectedDate.dayNumber} de {selectedDate.month}
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time, idx) => (
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

        {/* Step 5: Client Form */}
        {bookingStep === 5 && (
          <div className="p-6 md:p-8">
            <button onClick={() => setBookingStep(4)} className="text-sm text-gray-500 hover:text-rose-600 mb-4 flex items-center gap-1">← Volver</button>
            <h2 className="text-2xl font-serif text-gray-800 mb-6">Tus Datos</h2>
            
            <div className="bg-rose-50 p-4 rounded-lg mb-6 text-sm text-gray-700 border border-rose-100">
              <div className="flex justify-between mb-1">
                <span className="font-bold">Tratamiento:</span>
                <span>{selectedService.name}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="font-bold">Profesional:</span>
                <span>{selectedProfessional.name}</span>
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
                  onChange={e => setClientData({...clientData, name: e.target.value})}
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
                  onChange={e => setClientData({...clientData, phone: e.target.value})}
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
            <p><strong>Servicio:</strong> {selectedService?.name}</p>
            <p><strong>Profesional:</strong> {selectedProfessional?.name}</p>
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
          <p className="flex items-center gap-2 mb-2"><MapPin size={16} /> Av. Dorrego 2646, CABA</p>
          <p className="flex items-center gap-2 mb-2"><Phone size={16} /> +54 9 11 6025 3480</p>
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
