import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, 
GoogleAuthProvider, signOut as firebaseSignOut, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import type { User } from 'firebase/auth';
// import { FirebaseError } from 'firebase/app';

import { auth } from './firebase';

/**
 * Inscription avec email et mot de passe
 */
export const signUp = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, { displayName });

    return userCredential.user;
  } catch (error: unknown) {
    console.error("Erreur lors de l'inscription:", error);
    throw error;
  }
};

/**
 * Connexion avec email et mot de passe
 */
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: unknown) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

/**
 * Connexion avec Google
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error: unknown) {
    console.error('Erreur lors de la connexion avec Google:', error);
    throw error;
  }
};

/**
 * Déconnexion
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: unknown) {
    console.error('Erreur lors de la déconnexion:', error);
    throw error;
  }
};

/**
 * Réinitialisation du mot de passe
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    console.error(
      'Erreur lors de la réinitialisation du mot de passe:',
      error
    );
    throw error;
  }
};

/**
 * Mise à jour du profil utilisateur
 */
export const updateUserProfile = async (
  displayName: string,
  photoURL?: string
): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('Aucun utilisateur connecté');
    }

    await updateProfile(auth.currentUser, {
      displayName,
      ...(photoURL ? { photoURL } : {}),
    });
  } catch (error: unknown) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

/**
 * Obtenir l'utilisateur actuel
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};