import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Event, EventFormData, EventContextType } from '../types/event.types';
import * as eventService from '../services/eventService';
import { useAuth } from '../hooks/useAuth';

// eslint-disable-next-line react-refresh/only-export-components
export const EventContext = createContext<EventContextType | undefined>(undefined);

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider = ({ children }: EventProviderProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  /**
   * Charger les événements de l'utilisateur
   */
  useEffect(() => {
    if (!currentUser) {
      setEvents([]);
      setLoading(false);
      return;
    }

    const loadEvents = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const userEvents = await eventService.getUserEvents(currentUser.uid);
        setEvents(userEvents);
      } catch (err: unknown) {
        console.error('Erreur lors du chargement des événements:', err);
        setError('Impossible de charger les événements');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [currentUser]);

  /**
   * Créer un nouvel événement
   */
  const createEvent = async (data: EventFormData): Promise<void> => {
    if (!currentUser) {
      throw new Error('Vous devez être connecté pour créer un événement');
    }

    try {
      await eventService.createEvent(currentUser.uid, data);

      const userEvents = await eventService.getUserEvents(currentUser.uid);
      setEvents(userEvents);
    } catch (err: unknown) {
      console.error("Erreur lors de la création de l'événement:", err);
      throw err;
    }
  };

  /**
   * Mettre à jour un événement
   */
  const updateEvent = async (eventId: string, data: EventFormData): Promise<void> => {
    if (!currentUser) {
      throw new Error('Vous devez être connecté pour modifier un événement');
    }

    try {
      await eventService.updateEvent(eventId, data);

      const userEvents = await eventService.getUserEvents(currentUser.uid);
      setEvents(userEvents);
    } catch (err: unknown) {
      console.error("Erreur lors de la mise à jour de l'événement:", err);
      throw err;
    }
  };

  /**
   * Supprimer un événement
   */
  const deleteEvent = async (eventId: string): Promise<void> => {
    if (!currentUser) {
      throw new Error('Vous devez être connecté pour supprimer un événement');
    }

    try {
      await eventService.deleteEvent(eventId);

      // ✅ mise à jour fonctionnelle (safe)
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err: unknown) {
      console.error("Erreur lors de la suppression de l'événement:", err);
      throw err;
    }
  };

  /**
   * Récupérer un événement par ID
   */
  const getEventById = (eventId: string): Event | undefined => {
    return events.find(event => event.id === eventId);
  };

  /**
   * Récupérer les événements dans une plage de dates
   */
  const getEventsByDateRange = (startDate: Date, endDate: Date): Event[] => {
    return events.filter(event => {
      const eventDate = event.startDate.toDate();
      return eventDate >= startDate && eventDate <= endDate;
    });
  };

  const value: EventContextType = {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventsByDateRange,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};
