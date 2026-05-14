import {
  initializeApp,
  getApps,
} from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

const firebaseConfig = {
  projectId: 'gen-lang-client-0122965367',
  appId: '1:461742065085:web:7f46c9d2fbca78bd4a7ed4',
  apiKey: 'AIzaSyA1Be2XgQ2zHEePgTya9j9yuuBtz-LXPng',
  authDomain: 'gen-lang-client-0122965367.firebaseapp.com',
  firestoreDatabaseId: 'ai-studio-751682dd-4c31-4510-9351-4c566befbc77',
  storageBucket: 'gen-lang-client-0122965367.firebasestorage.app',
  messagingSenderId: '461742065085',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Add scopes for Google sign-in
googleProvider.addScope('profile');
googleProvider.addScope('email');

export const firebaseAuth = {
  /**
   * Sign in with Google using Firebase
   */
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return {
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || 'User',
        photoUrl: user.photoURL || undefined,
      };
    } catch (error: any) {
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed. Please try again.');
      }
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Sign-in popup was blocked. Please allow popups for this site.');
      }
      if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in was cancelled. Please try again.');
      }
      throw new Error('Failed to sign in with Google: ' + (error.message || error.code));
    }
  },

  /**
   * Sign out from Firebase
   */
  async signOut() {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Failed to sign out: ' + error.message);
    }
  },

  /**
   * Get current user from Firebase
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
};
