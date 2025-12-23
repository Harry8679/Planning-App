import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
// import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { CalendarView } from './components/calendar/CalendarView';

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            {/* Routes protégées */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden bg-gray-50">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Header />
                      <main className="flex-1 overflow-auto">
                        <CalendarView />
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden bg-gray-50">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Header />
                      <main className="flex-1 overflow-auto">
                        <EventsList />
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/stats"
              element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden bg-gray-50">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Header />
                      <main className="flex-1 overflow-auto">
                        <StatsPage />
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden bg-gray-50">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Header />
                      <main className="flex-1 overflow-auto">
                        <ProfilePage />
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden bg-gray-50">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Header />
                      <main className="flex-1 overflow-auto">
                        <SettingsPage />
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Redirection par défaut */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}

// Page de liste des événements
const EventsList = () => {
  const { events, loading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tous les événements</h1>
          <p className="text-gray-600 mt-1">{events.length} événement{events.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => {
            setSelectedEvent(undefined);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nouvel événement
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Aucun événement créé</p>
          <p className="text-gray-500 text-sm mt-1">Commencez par créer votre premier événement</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => {
                setSelectedEvent(event);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
};

// Page des statistiques
const StatsPage = () => {
  const { events } = useEvents();
  
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.startDate.toDate() > new Date()).length;
  const pastEvents = events.filter(e => e.startDate.toDate() < new Date()).length;
  
  const eventsByColor = events.reduce((acc, event) => {
    acc[event.color] = (acc[event.color] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const colorLabels: Record<string, string> = {
    blue: 'Bleu',
    green: 'Vert',
    red: 'Rouge',
    yellow: 'Jaune',
    purple: 'Violet',
    pink: 'Rose',
    indigo: 'Indigo',
    gray: 'Gris',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Statistiques</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalEvents}</p>
            </div>
            <Calendar className="w-12 h-12 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">À venir</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{upcomingEvents}</p>
            </div>
            <Clock className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Passés</p>
              <p className="text-3xl font-bold text-gray-600 mt-2">{pastEvents}</p>
            </div>
            <BarChart3 className="w-12 h-12 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Répartition par couleur</h2>
        <div className="space-y-3">
          {Object.entries(eventsByColor).map(([color, count]) => (
            <div key={color} className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full bg-${color}-500`} />
              <span className="flex-1 text-gray-700">{colorLabels[color]}</span>
              <span className="font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Page de profil
const ProfilePage = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile(displayName);
      toast.success('Profil mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon profil</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{currentUser?.displayName}</h2>
            <p className="text-gray-600">{currentUser?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'affichage
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Page des paramètres
const SettingsPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Préférences</h2>
        <p className="text-gray-600">Cette section sera bientôt disponible.</p>
      </div>
    </div>
  );
};

// Imports nécessaires pour les pages
import { useState } from 'react';
// import { useEvents } from './hooks/useEvents';
import type { Event } from './types/event.types';
import { EventCard } from './components/events/EventCard';
import { EventModal } from './components/events/EventModal';
import { Plus, Calendar, Clock, BarChart3, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/auth/ProtectedRRoutes';
import { useEvents } from './hooks/useEvent';

export default App;