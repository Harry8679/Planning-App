import { useState } from 'react';
import type { Event, EventFormData } from '../../types/event.types';
import { EventForm } from './EventForm';
import { X, Trash2, Calendar, Clock, FileText, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useEvents } from '../../hooks/useEvent';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  defaultDate?: Date;
}

export const EventModal = ({ isOpen, onClose, event, defaultDate }: EventModalProps) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { createEvent, updateEvent, deleteEvent } = useEvents();

  if (!isOpen) return null;

  const handleSubmit = async (data: EventFormData) => {
    try {
      if (event) {
        await updateEvent(event.id, data);
        toast.success('Événement modifié avec succès');
      } else {
        await createEvent(data);
        toast.success('Événement créé avec succès');
      }
      onClose();
    } catch (error) {
      toast.error('Une erreur est survenue');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    try {
      await deleteEvent(event.id);
      toast.success('Événement supprimé');
      onClose();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500',
    gray: 'bg-gray-500',
  };

  // Mode création ou édition
  if (!event || mode === 'edit') {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {event ? 'Modifier l\'événement' : 'Nouvel événement'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <EventForm
              event={event}
              defaultDate={defaultDate}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    );
  }

  // Mode vue détaillée
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full z-10">
          {/* En-tête coloré */}
          <div className={`h-3 rounded-t-2xl ${colorClasses[event.color]}`} />

          <div className="p-6">
            {/* Titre et actions */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h2>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colorClasses[event.color]}`} />
                  <span className="text-sm text-gray-600 capitalize">
                    {event.color}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode('edit')}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Détails de l'événement */}
            <div className="space-y-4">
              {/* Date */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Date</p>
                  <p className="text-gray-600 capitalize">
                    {format(event.startDate.toDate(), 'EEEE d MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>

              {/* Horaires */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Horaires</p>
                  <p className="text-gray-600">
                    {format(event.startDate.toDate(), 'HH:mm')} - {format(event.endDate.toDate(), 'HH:mm')}
                  </p>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">Description</p>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Rappel */}
              {event.reminder && (
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Rappel</p>
                    <p className="text-gray-600">
                      {event.reminderMinutes && event.reminderMinutes >= 60
                        ? `${Math.floor(event.reminderMinutes / 60)} heure${Math.floor(event.reminderMinutes / 60) > 1 ? 's' : ''}`
                        : `${event.reminderMinutes || 15} minutes`
                      } avant
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions de suppression */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              {showDeleteConfirm ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-900 font-medium mb-3">
                    Êtes-vous sûr de vouloir supprimer cet événement ?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDelete}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Confirmer la suppression
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer l'événement
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};