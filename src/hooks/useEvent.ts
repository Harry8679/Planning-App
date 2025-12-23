import { useContext } from 'react';
import { EventContext } from '../contexts/EventContext';
import { EventContextType } from '../types/event.types';

/**
 * Hook personnalisé pour accéder au contexte des événements
 * @throws {Error} Si utilisé en dehors d'un EventProvider
 */
export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);

  if (context === undefined) {
    throw new Error('useEvents doit être utilisé à l\'intérieur d\'un EventProvider');
  }

  return context;
};