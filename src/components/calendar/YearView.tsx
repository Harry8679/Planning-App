import { useState, useEffect } from 'react';
import { startOfYear, endOfYear, eachMonthOfInterval, format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEvents } from '../../hooks/useEvents';
// import { Event } from '../../types/event.types';

interface YearViewProps {
  date: Date;
}

export const YearView = ({ date }: YearViewProps) => {
  const { events, loading } = useEvents();
  const [yearEvents, setYearEvents] = useState<Map<string, number>>(new Map());

  const yearStart = startOfYear(date);
  const yearEnd = endOfYear(date);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  useEffect(() => {
    const eventsMap = new Map<string, number>();

    events.forEach(event => {
      const eventDate = event.startDate.toDate();
      const dateKey = format(eventDate, 'yyyy-MM-dd');

      if (!eventsMap.has(dateKey)) {
        eventsMap.set(dateKey, 0);
      }
      eventsMap.set(dateKey, (eventsMap.get(dateKey) || 0) + 1);
    });

    setYearEvents(eventsMap);
  }, [events]);

  const getEventCountForDay = (day: Date): number => {
    const dateKey = format(day, 'yyyy-MM-dd');
    return yearEvents.get(dateKey) || 0;
  };

  const MiniMonth = ({ monthDate }: { monthDate: Date }) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const calendarStart = startOfWeek(monthStart, { locale: fr });
    const calendarEnd = endOfWeek(monthEnd, { locale: fr });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
          {format(monthDate, 'MMMM', { locale: fr })}
        </h3>

        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grille des jours */}
        <div className="grid grid-cols-7 gap-1">
          {days.map(day => {
            const isCurrentMonth = isSameMonth(day, monthDate);
            const isCurrentDay = isToday(day);
            const eventCount = getEventCountForDay(day);
            const hasEvents = eventCount > 0;

            return (
              <div
                key={day.toISOString()}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-md
                  relative cursor-pointer transition-all
                  ${isCurrentDay 
                    ? 'bg-indigo-600 text-white font-bold' 
                    : isCurrentMonth 
                      ? 'text-gray-900 hover:bg-gray-100' 
                      : 'text-gray-300'
                  }
                  ${hasEvents && !isCurrentDay ? 'font-semibold' : ''}
                `}
              >
                {format(day, 'd')}
                {hasEvents && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {Array.from({ length: Math.min(eventCount, 3) }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          isCurrentDay ? 'bg-white' : 'bg-indigo-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Statistiques du mois */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            {Array.from(yearEvents.entries())
              .filter(([key]) => {
                const eventDate = new Date(key);
                return isSameMonth(eventDate, monthDate);
              })
              .reduce((sum, [, count]) => sum + count, 0)
            }{' '}
            événement(s)
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Statistiques globales */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {format(date, 'yyyy', { locale: fr })}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <p className="text-3xl font-bold text-indigo-600">
                    {events.length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Événements total
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">
                    {new Set(
                      events.map(e => format(e.startDate.toDate(), 'yyyy-MM-dd'))
                    ).size}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Jours actifs
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">
                    {events.length > 0 
                      ? Math.round(events.length / 12 * 10) / 10 
                      : 0
                    }
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Moyenne par mois
                  </p>
                </div>
              </div>
            </div>

            {/* Grille des mois */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {months.map(month => (
                <MiniMonth key={month.toISOString()} monthDate={month} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};