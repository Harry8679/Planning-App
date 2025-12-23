import { useState, useMemo } from 'react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { EventCard } from '../events/EventCard';
import { EventModal } from '../events/EventModal';
import { Plus, Clock } from 'lucide-react';
import type { Event } from '../../types/event.types';
import { useEvents } from '../../hooks/useEvent';

interface DayViewProps {
  date: Date;
}

export const DayView = ({ date }: DayViewProps) => {
  const { events, loading } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);

  // ✅ Donnée dérivée → useMemo
  const dayEvents = useMemo(() => {
    const start = startOfDay(date);
    const end = endOfDay(date);

    return events
      .filter(event => {
        const eventDate = event.startDate.toDate();
        return eventDate >= start && eventDate <= end;
      })
      .slice()
      .sort(
        (a, b) =>
          a.startDate.toDate().getTime() -
          b.startDate.toDate().getTime()
      );
  }, [events, date]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(undefined);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="h-full bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 capitalize">
              {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {dayEvents.length} événement{dayEvents.length !== 1 ? 's' : ''} prévu{dayEvents.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleAddEvent}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Ajouter un événement
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : dayEvents.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Aucun événement prévu</p>
            <p className="text-gray-500 text-sm mt-1">
              Ajoutez votre premier événement pour cette journée
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-[80px_1fr] gap-4">
              {hours.map(hour => {
                const hourEvents = dayEvents.filter(
                  e => e.startDate.toDate().getHours() === hour
                );

                return (
                  <div key={hour} className="contents">
                    <div className="text-right pr-4 pt-2">
                      <span className="text-sm font-medium text-gray-500">
                        {hour.toString().padStart(2, '0')}:00
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 min-h-15">
                      {hourEvents.length > 0 && (
                        <div className="space-y-2">
                          {hourEvents.map(event => (
                            <EventCard
                              key={event.id}
                              event={event}
                              onClick={() => handleEventClick(event)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Tous les événements
              </h4>
              <div className="space-y-2">
                {dayEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                    compact
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
        defaultDate={date}
      />
    </div>
  );
};
