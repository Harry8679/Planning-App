/**
 * Validation d'email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validation de mot de passe (minimum 6 caractères)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validation de mot de passe fort
 * Au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
 */
export const isStrongPassword = (password: string): boolean => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * Calculer la force du mot de passe (0-4)
 */
export const getPasswordStrength = (password: string): number => {
  let strength = 0;

  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;

  return Math.min(strength, 4);
};

/**
 * Validation du nom (minimum 2 caractères)
 */
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

/**
 * Validation de la correspondance des mots de passe
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Validation du titre d'événement
 */
export const isValidEventTitle = (title: string): boolean => {
  return title.trim().length >= 3 && title.trim().length <= 100;
};

/**
 * Validation de la description d'événement
 */
export const isValidEventDescription = (description: string): boolean => {
  return description.trim().length <= 500;
};

/**
 * Validation de la plage de dates
 */
export const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate <= endDate;
};

/**
 * Validation qu'une date n'est pas dans le passé
 */
export const isNotPastDate = (date: Date): boolean => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date >= now;
};

/**
 * Nettoyer une chaîne de caractères
 */
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

/**
 * Validation d'URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validation de numéro de téléphone français
 */
export const isValidFrenchPhone = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone);
};

/**
 * Obtenir les erreurs de validation pour un formulaire d'événement
 */
export interface EventValidationErrors {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: string;
}

export const validateEventForm = (
  title: string,
  description: string,
  startDate: Date,
  endDate: Date
): EventValidationErrors => {
  const errors: EventValidationErrors = {};

  if (!isValidEventTitle(title)) {
    errors.title = 'Le titre doit contenir entre 3 et 100 caractères';
  }

  if (description && !isValidEventDescription(description)) {
    errors.description = 'La description ne peut pas dépasser 500 caractères';
  }

  if (!startDate) {
    errors.startDate = 'La date de début est requise';
  }

  if (!endDate) {
    errors.endDate = 'La date de fin est requise';
  }

  if (startDate && endDate && !isValidDateRange(startDate, endDate)) {
    errors.dateRange = 'La date de fin doit être postérieure à la date de début';
  }

  return errors;
};

/**
 * Obtenir les erreurs de validation pour un formulaire d'inscription
 */
export interface SignUpValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const validateSignUpForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): SignUpValidationErrors => {
  const errors: SignUpValidationErrors = {};

  if (!isValidName(name)) {
    errors.name = 'Le nom doit contenir au moins 2 caractères';
  }

  if (!isValidEmail(email)) {
    errors.email = 'Veuillez entrer une adresse email valide';
  }

  if (!isValidPassword(password)) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
  }

  if (!doPasswordsMatch(password, confirmPassword)) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  return errors;
};

/**
 * Obtenir les erreurs de validation pour un formulaire de connexion
 */
export interface SignInValidationErrors {
  email?: string;
  password?: string;
}

export const validateSignInForm = (
  email: string,
  password: string
): SignInValidationErrors => {
  const errors: SignInValidationErrors = {};

  if (!isValidEmail(email)) {
    errors.email = 'Veuillez entrer une adresse email valide';
  }

  if (!password) {
    errors.password = 'Le mot de passe est requis';
  }

  return errors;
};

/**
 * Vérifier si un objet d'erreurs est vide
 */
export const hasErrors = (errors: Record<string, unknown>): boolean => {
  return Object.keys(errors).length > 0;
};