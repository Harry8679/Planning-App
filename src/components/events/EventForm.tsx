import { useState, useEffect, FormEvent } from 'react';
import { Event, EventFormData } from '../../types/event.types';
import { Calendar, Clock, FileText, Tag, Bell } from 'lucide-react';
import { format } from 'date-fns';

interface EventFormProps {
  event?: Event;
  defaultDate?: Date;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
}

const colorOptions = [
  { value: 'blue', label: 'Bleu', class: 'bg-blue-500' },
  { value: 'green', label: 'Vert', class: 'bg-green-500' },
  { value: 'red', label: 'Rouge', class: 'bg-red-500' },
  { value: 'yellow', label: 'Jaune', class: 'bg-yellow-500' },
  { value: 'purple', label: 'Violet', class: 'bg-purple-500' },
  { value: 'pink', label: 'Rose', class: 'bg-pink-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'gray', label: 'Gris', class: 'bg-gray-500' },
];

export const EventForm = ({ event, defaultDate, onSubmit, onCancel }: EventFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: defaultDate || new Date(),
    endDate: defaultDate || new Date(),
    color: 'blue',
    reminder: false,
    reminderMinutes: 15,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        startDate: event.startDate.toDate(),
        endDate: event.endDate.toDate(),
        color: event.color,
        reminder: event.reminder || false,
        reminderMinutes: event.reminderMinutes || 15,
      });
    }
  }, [event]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'startDate' || name === 'endDate') {
      setFormData(prev => ({ ...prev, [name]: new Date(value) }));
    } else if (name === 'reminderMinutes') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Titre */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Titre de l'événement <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Ex: Réunion d'équipe"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Description
          </div>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          placeholder="Ajoutez des détails sur l'événement..."
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date et heure de début <span className="text-red-500">*</span>
            </div>
          </label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            required
            value={format(formData.startDate, "yyyy-MM-dd'T'HH:mm")}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Date et heure de fin <span className="text-red-500">*</span>
            </div>
          </label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            required
            value={format(formData.endDate, "yyyy-MM-dd'T'HH:mm")}
            onChange={handleChange}
            min={format(formData.startDate, "yyyy-MM-dd'T'HH:mm")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Couleur */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Couleur de l'événement
          </div>
        </label>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {colorOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, color: option.value }))}
              className={`
                w-full aspect-square rounded-lg ${option.class}
                ${formData.color === option.value 
                  ? 'ring-4 ring-offset-2 ring-indigo-500' 
                  : 'hover:scale-110'
                }
                transition-all
              `}
              title={option.label}
            />
          ))}
        </div>
      </div>

      {/* Rappel */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="reminder"
            name="reminder"
            checked={formData.reminder}
            onChange={handleChange}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="reminder" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Activer un rappel
          </label>
        </div>

        {formData.reminder && (
          <div className="ml-6">
            <label htmlFor="reminderMinutes" className="block text-sm text-gray-600 mb-1">
              Rappeler avant
            </label>
            <select
              id="reminderMinutes"
              name="reminderMinutes"
              value={formData.reminderMinutes}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={5}>5 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 heure</option>
              <option value={120}>2 heures</option>
              <option value={1440}>1 jour</option>
            </select>
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enregistrement...' : event ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
};