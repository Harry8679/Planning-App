import { format, parse, isValid, startOfDay, endOfDay, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formater une date en chaîne de caractères
 */
export const formatDate = (date: Date, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    return format(date, formatStr, { locale: fr });
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return '';
  }
};

/**
 * Formater une date avec l'heure
 */
export const formatDateTime = (date: Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Formater uniquement l'heure
 */
export const formatTime = (date: Date): string => {
  return formatDate(date, 'HH:mm');
};

/**
 * Formater une date de manière relative (ex: "Aujourd'hui", "Hier", etc.)
 */
export const formatRelativeDate = (date: Date): string => {
  const today = startOfDay(new Date());
  const targetDay = startOfDay(date);
  const diffDays = Math.floor((targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Aujourd\'hui';
  if (diffDays === 1) return 'Demain';
  if (diffDays === -1) return 'Hier';
  if (diffDays > 1 && diffDays <= 7) return `Dans ${diffDays} jours`;
  if (diffDays < -1 && diffDays >= -7) return `Il y a ${Math.abs(diffDays)} jours`;

  return formatDate(date, 'dd MMM yyyy');
};

/**
 * Parser une chaîne de date
 */
export const parseDate = (dateStr: string, formatStr: string = 'dd/MM/yyyy'): Date | null => {
  try {
    const parsedDate = parse(dateStr, formatStr, new Date(), { locale: fr });
    return isValid(parsedDate) ? parsedDate : null;
  } catch (error) {
    console.error('Erreur lors du parsing de la date:', error);
    return null;
  }
};

/**
 * Vérifier si une date est valide
 */
export const isValidDate = (date: unknown): boolean => {
  return date instanceof Date && isValid(date);
};

/**
 * Obtenir le début de la journée
 */
export const getStartOfDay = (date: Date): Date => {
  return startOfDay(date);
};

/**
 * Obtenir la fin de la journée
 */
export const getEndOfDay = (date: Date): Date => {
  return endOfDay(date);
};

/**
 * Ajouter des jours à une date
 */
export const addDaysToDate = (date: Date, days: number): Date => {
  return addDays(date, days);
};

/**
 * Soustraire des jours à une date
 */
export const subtractDaysFromDate = (date: Date, days: number): Date => {
  return subDays(date, days);
};

/**
 * Vérifier si deux dates sont le même jour
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Obtenir la durée entre deux dates en minutes
 */
export const getDurationInMinutes = (startDate: Date, endDate: Date): number => {
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.floor(diffMs / (1000 * 60));
};

/**
 * Formater une durée en heures et minutes
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins}min`;
};

/**
 * Vérifier si une date est dans le passé
 */
export const isPastDate = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Vérifier si une date est dans le futur
 */
export const isFutureDate = (date: Date): boolean => {
  return date > new Date();
};

/**
 * Obtenir le jour de la semaine en français
 */
export const getDayOfWeek = (date: Date): string => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[date.getDay()];
};

/**
 * Obtenir le mois en français
 */
export const getMonthName = (date: Date): string => {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return months[date.getMonth()];
};

/**
 * Créer une date à partir de composants
 */
export const createDate = (
  year: number,
  month: number,
  day: number,
  hours: number = 0,
  minutes: number = 0
): Date => {
  return new Date(year, month, day, hours, minutes);
};

/**
 * Obtenir la date du jour à minuit
 */
export const getTodayAtMidnight = (): Date => {
  return startOfDay(new Date());
};