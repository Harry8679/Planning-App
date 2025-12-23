import { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEvents } from '../../hooks/useEvents';
import { EventModal } from '../events/EventModal';
// import { Plus } from 'lucide-react';
import { Event } from '../../types/event.types';

interface MonthViewProps {
  date: Date;
}

export const MonthView = ({ date }: MonthViewProps) => {
  const { events, loading } = useEvents();
  const [monthEvents, setMonthEvents] = useState<Map<string, Event[]>>(new Map());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);

  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { locale: fr });
  const calendarEnd = endOfWeek(monthEnd, { locale: fr });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  useEffect(() => {
    const eventsMap = new Map<string, Event[]>();

    events.forEach(event => {
      const eventDate = event.startDate.toDate();
      const dateKey = format(eventDate, 'yyyy-MM-dd');

      if (!eventsMap.has(dateKey)) {
        eventsMap.set(dateKey, []);
      }
      eventsMap.get(dateKey)?.push(event);
    });

    // Trier les événements de chaque jour
    eventsMap.forEach((dayEvents, key) => {
      eventsMap.set(key, dayEvents.sort((a, b) => 
        a.startDate.toDate().getTime() - b.startDate.toDate().getTime()
      ));
    });

    setMonthEvents(eventsMap);
  }, [events]);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(undefined);
    setSelectedEvent(undefined);
  };

  const getEventsByDay = (day: Date): Event[] => {
    const dateKey = format(day, 'yyyy-MM-dd');
    return monthEvents.get(dateKey) || [];
  };

  return (
    <div className="h-full bg-white">
      <div className="max-w-7xl mx-auto p-6 h-full flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* En-têtes des jours */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-t-lg overflow-hidden">
              {weekDays.map(day => (
                <div
                  key={day}
                  className="bg-gray-50 py-3 text-center text-sm font-semibold text-gray-700"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grille du calendrier */}
            <div className="flex-1 grid grid-cols-7 gap-px bg-gray-200 border-x border-b border-gray-200 rounded-b-lg overflow-hidden">
              {days.map(day => {
                const dayEvents = getEventsByDay(day);
                const isCurrentMonth = isSameMonth(day, date);
                const isCurrentDay = isToday(day);

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)}
                    className={`
                      bg-white p-2 min-h-[120px] cursor-pointer transition-colors
                      hover:bg-gray-50
                      ${!isCurrentMonth ? 'bg-gray-50/50' : ''}
                    `}
                  >
                    <div className="flex flex-col h-full">
                      <span
                        className={`
                          inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full mb-1
                          ${isCurrentDay 
                            ? 'bg-indigo-600 text-white' 
                            : isCurrentMonth 
                              ? 'text-gray-900' 
                              : 'text-gray-400'
                          }
                        `}
                      >
                        {format(day, 'd')}
                      </span>

                      {/* Liste des événements */}
                      <div className="flex-1 space-y-1 overflow-y-auto">
                        {dayEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            onClick={(e) => handleEventClick(event, e)}
                            className={`
                              px-2 py-1 text-xs rounded truncate
                              cursor-pointer transition-colors
                              ${event.color === 'blue' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                event.color === 'green' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                event.color === 'red' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                                event.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                                event.color === 'purple' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' :
                                'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                            `}
                            title={event.title}
                          >
                            {format(event.startDate.toDate(), 'HH:mm')} {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="px-2 py-1 text-xs text-gray-500 font-medium">
                            +{dayEvents.length - 3} autre{dayEvents.length - 3 > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal d'événement */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
        defaultDate={selectedDate}
      />
    </div>
  );
};