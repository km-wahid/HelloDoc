import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserRole } from '../types';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
}

export const authService = {
  async register(email: string, password: string, name: string, role: UserRole) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const profile: any = {
      uid: user.uid,
      email,
      name,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'users', user.uid), profile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
    return profile as UserProfile;
  },

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    try {
      const profileDoc = await getDoc(doc(db, 'users', user.uid));
      if (!profileDoc.exists()) {
        throw new Error('User profile not found');
      }
      return profileDoc.data() as UserProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      throw error; 
    }
  },

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    try {
      const profileDoc = await getDoc(doc(db, 'users', user.uid));
      if (!profileDoc.exists()) {
        // Auto-provision Google user as patient by default
        const profile: any = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || 'Google User',
          role: 'patient',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        try {
          await setDoc(doc(db, 'users', user.uid), profile);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
        }
        return profile as UserProfile;
      }
      return profileDoc.data() as UserProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      throw error;
    }
  },

  async logout() {
    await signOut(auth);
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  },

  async getProfile(uid: string) {
    try {
      const profileDoc = await getDoc(doc(db, 'users', uid));
      return profileDoc.exists() ? (profileDoc.data() as UserProfile) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
      return null;
    }
  }
};
