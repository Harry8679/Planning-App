import { useState } from 'react';
import { DayView } from './DayView';
import { MonthView } from './MonthView';
import { YearView } from './YearView';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addMonths, subMonths, addYears, subYears, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

type ViewMode = 'day' | 'month' | 'year';

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const handlePrevious = () => {
    if (viewMode === 'day') {
      setCurrentDate(subDays(currentDate, 1));
    } else if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subYears(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addYears(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getDateTitle = () => {
    if (viewMode === 'day') {
      return format(currentDate, 'EEEE d MMMM yyyy', { locale: fr });
    } else if (viewMode === 'month') {
      return format(currentDate, 'MMMM yyyy', { locale: fr });
    } else {
      return format(currentDate, 'yyyy', { locale: fr });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header avec navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleToday}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Aujourd'hui
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-900 capitalize">
              {getDateTitle()}
            </h2>
          </div>

          {/* Sélecteur de vue */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'day'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Jour
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'month'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setViewMode('year')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'year'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Année
            </button>
          </div>
        </div>
      </div>

      {/* Contenu du calendrier */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {viewMode === 'day' && <DayView date={currentDate} />}
        {viewMode === 'month' && <MonthView date={currentDate} />}
        {viewMode === 'year' && <YearView date={currentDate} />}
      </div>
    </div>
  );
};