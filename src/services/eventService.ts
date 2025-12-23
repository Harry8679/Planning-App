import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, getDocs, getDoc, Timestamp, QueryConstraint } from 'firebase/firestore';
import { db } from './firebase';
import type { Event, EventFormData, EventFilters } from '../types/event.types';
import type { DocumentSnapshot, DocumentData } from 'firebase/firestore';


const EVENTS_COLLECTION = 'events';

/**
 * Type interne Firestore (sans id)
 */
type EventFirestore = Omit<Event, 'id'>;

/**
 * Mapper Firestore → Event
 */
const mapDocToEvent = (
  docSnap: DocumentSnapshot<DocumentData>
): Event => {
  const data = docSnap.data() as EventFirestore;

  return {
    id: docSnap.id,
    ...data,
  };
};


/**
 * Créer un nouvel événement
 */
export const createEvent = async (
  userId: string,
  data: EventFormData
): Promise<string> => {
  try {
    const eventData: EventFirestore = {
      userId,
      title: data.title,
      description: data.description || '',
      startDate: Timestamp.fromDate(data.startDate),
      endDate: Timestamp.fromDate(data.endDate),
      color: data.color,
      reminder: data.reminder,
      reminderMinutes: data.reminderMinutes ?? 15,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), eventData);
    return docRef.id;
  } catch (error: unknown) {
    console.error("Erreur lors de la création de l'événement:", error);
    throw error;
  }
};

/**
 * Mettre à jour un événement
 */
export const updateEvent = async (
  eventId: string,
  data: EventFormData
): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);

    const updateData: Partial<EventFirestore> = {
      title: data.title,
      description: data.description || '',
      startDate: Timestamp.fromDate(data.startDate),
      endDate: Timestamp.fromDate(data.endDate),
      color: data.color,
      reminder: data.reminder,
      reminderMinutes: data.reminderMinutes ?? 15,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(eventRef, updateData);
  } catch (error: unknown) {
    console.error("Erreur lors de la mise à jour de l'événement:", error);
    throw error;
  }
};

/**
 * Supprimer un événement
 */
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, EVENTS_COLLECTION, eventId));
  } catch (error: unknown) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    throw error;
  }
};

/**
 * Récupérer un événement par ID
 */
export const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const eventSnap = await getDoc(doc(db, EVENTS_COLLECTION, eventId));
    return eventSnap.exists() ? mapDocToEvent(eventSnap) : null;
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    throw error;
  }
};

/**
 * Récupérer tous les événements d'un utilisateur
 */
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('startDate', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToEvent);
  } catch (error: unknown) {
    console.error('Erreur lors de la récupération des événements:', error);
    throw error;
  }
};

/**
 * Récupérer les événements avec filtres
 */
export const getFilteredEvents = async (
  userId: string,
  filters?: EventFilters
): Promise<Event[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
    ];

    if (filters?.startDate) {
      constraints.push(
        where('startDate', '>=', Timestamp.fromDate(filters.startDate))
      );
    }

    if (filters?.endDate) {
      constraints.push(
        where('startDate', '<=', Timestamp.fromDate(filters.endDate))
      );
    }

    if (filters?.colors?.length) {
      constraints.push(where('color', 'in', filters.colors));
    }

    constraints.push(orderBy('startDate', 'asc'));

    const snapshot = await getDocs(
      query(collection(db, EVENTS_COLLECTION), ...constraints)
    );

    let events = snapshot.docs.map(mapDocToEvent);

    if (filters?.searchQuery) {
      const search = filters.searchQuery.toLowerCase();
      events = events.filter(
        e =>
          e.title.toLowerCase().includes(search) ||
          e.description?.toLowerCase().includes(search)
      );
    }

    return events;
  } catch (error: unknown) {
    console.error('Erreur lors de la récupération des événements filtrés:', error);
    throw error;
  }
};

/**
 * Récupérer les événements par plage de dates
 */
export const getEventsByDateRange = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Event[]> => {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where('userId', '==', userId),
      where('startDate', '>=', Timestamp.fromDate(startDate)),
      where('startDate', '<=', Timestamp.fromDate(endDate)),
      orderBy('startDate', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToEvent);
  } catch (error: unknown) {
    console.error('Erreur lors de la récupération par date:', error);
    throw error;
  }
};

/**
 * Compter les événements d'un utilisateur
 */
export const countUserEvents = async (userId: string): Promise<number> => {
  try {
    const snapshot = await getDocs(
      query(collection(db, EVENTS_COLLECTION), where('userId', '==', userId))
    );
    return snapshot.size;
  } catch (error: unknown) {
    console.error('Erreur lors du comptage des événements:', error);
    throw error;
  }
};
