import { Event } from '../../types/event.types';
// import { Clock, Calendar, MapPin } from 'lucide-react';
import { Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  compact?: boolean;
}

export const EventCard = ({ event, onClick, compact = false }: EventCardProps) => {
  const startTime = format(event.startDate.toDate(), 'HH:mm');
  const endTime = format(event.endDate.toDate(), 'HH:mm');
  const dateStr = format(event.startDate.toDate(), 'EEEE d MMMM yyyy', { locale: fr });

  const colorClasses = {
    blue: 'border-blue-500 bg-blue-50 hover:bg-blue-100',
    green: 'border-green-500 bg-green-50 hover:bg-green-100',
    red: 'border-red-500 bg-red-50 hover:bg-red-100',
    yellow: 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100',
    purple: 'border-purple-500 bg-purple-50 hover:bg-purple-100',
    pink: 'border-pink-500 bg-pink-50 hover:bg-pink-100',
    indigo: 'border-indigo-500 bg-indigo-50 hover:bg-indigo-100',
    gray: 'border-gray-500 bg-gray-50 hover:bg-gray-100',
  };

  const textColorClasses = {
    blue: 'text-blue-900',
    green: 'text-green-900',
    red: 'text-red-900',
    yellow: 'text-yellow-900',
    purple: 'text-purple-900',
    pink: 'text-pink-900',
    indigo: 'text-indigo-900',
    gray: 'text-gray-900',
  };

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`
          border-l-4 p-3 rounded-lg cursor-pointer transition-all
          ${colorClasses[event.color]}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className={`font-semibold ${textColorClasses[event.color]}`}>
              {event.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>
                {startTime} - {endTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`
        border-l-4 p-4 rounded-lg cursor-pointer transition-all shadow-sm
        ${colorClasses[event.color]}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${textColorClasses[event.color]}`}>
            {event.title}
          </h3>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4" />
              <span className="capitalize">{dateStr}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="w-4 h-4" />
              <span>
                {startTime} - {endTime}
              </span>
            </div>

            {event.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {event.description}
              </p>
            )}
          </div>
        </div>

        <div className="ml-4">
          <div
            className={`w-3 h-3 rounded-full ${
              event.color === 'blue' ? 'bg-blue-500' :
              event.color === 'green' ? 'bg-green-500' :
              event.color === 'red' ? 'bg-red-500' :
              event.color === 'yellow' ? 'bg-yellow-500' :
              event.color === 'purple' ? 'bg-purple-500' :
              event.color === 'pink' ? 'bg-pink-500' :
              event.color === 'indigo' ? 'bg-indigo-500' :
              'bg-gray-500'
            }`}
          />
        </div>
      </div>
    </div>
  );
};