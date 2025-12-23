import { Timestamp } from 'firebase/firestore';

export type EventColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'gray';

export interface Event {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: Timestamp;
  endDate: Timestamp;
  color: EventColor;
  reminder: boolean;
  reminderMinutes?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface EventFormData {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color: EventColor;
  reminder: boolean;
  reminderMinutes?: number;
}

export interface CreateEventData {
  userId: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color: EventColor;
  reminder: boolean;
  reminderMinutes?: number;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  color?: EventColor;
  reminder?: boolean;
  reminderMinutes?: number;
}

export interface EventContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
  createEvent: (data: EventFormData) => Promise<void>;
  updateEvent: (eventId: string, data: EventFormData) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  getEventById: (eventId: string) => Event | undefined;
  getEventsByDateRange: (startDate: Date, endDate: Date) => Event[];
}

export interface EventFilters {
  startDate?: Date;
  endDate?: Date;
  colors?: EventColor[];
  searchQuery?: string;
}