import { UserRole } from '../types';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
}

type DemoRole = 'patient' | 'doctor';
type StoredUserProfile = UserProfile & { password: string; createdAt: string; updatedAt: string };
type AuthStateListener = (user: UserProfile | null) => void;

const USERS_STORAGE_KEY = 'hellodoc_users';
const CURRENT_USER_STORAGE_KEY = 'hellodoc_current_user';

const DEMO_USERS: Record<DemoRole, { email: string; password: string; name: string; role: DemoRole }> = {
  patient: {
    email: 'demo.patient@hellodoc.app',
    password: 'Demo@123456',
    name: 'Demo Patient',
    role: 'patient',
  },
  doctor: {
    email: 'demo.doctor@hellodoc.app',
    password: 'Demo@123456',
    name: 'Demo Doctor',
    role: 'doctor',
  },
};

const authListeners = new Set<AuthStateListener>();

const nowIso = () => new Date().toISOString();
const createId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `uid-${Date.now()}`);

const getStoredUsers = (): StoredUserProfile[] => {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredUserProfile[];
  } catch {
    return [];
  }
};

const saveStoredUsers = (users: StoredUserProfile[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const stripPassword = (profile: StoredUserProfile): UserProfile => ({
  uid: profile.uid,
  email: profile.email,
  name: profile.name,
  role: profile.role
});

const setCurrentUserId = (uid: string | null) => {
  if (!uid) {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, uid);
  }
};

const notifyAuthListeners = () => {
  const currentUser = authService.getCurrentUser();
  authListeners.forEach((listener) => listener(currentUser));
};

export const authService = {
  async register(email: string, password: string, name: string, role: UserRole) {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      throw new Error('A user already exists with this email.');
    }

    const profile: StoredUserProfile = {
      uid: createId(),
      email,
      name,
      role,
      password,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    users.push(profile);
    saveStoredUsers(users);
    setCurrentUserId(profile.uid);
    notifyAuthListeners();
    return stripPassword(profile);
  },

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const profile = users.find((user) => user.email.toLowerCase() === normalizedEmail && user.password === password);
    if (!profile) {
      throw new Error('Invalid email or password.');
    }
    setCurrentUserId(profile.uid);
    notifyAuthListeners();
    return stripPassword(profile);
  },

  async loginWithGoogle() {
    return this.loginWithDemo('patient');
  },

  async loginWithDemo(role: DemoRole) {
    const demoUser = DEMO_USERS[role];
    const users = getStoredUsers();
    let profile = users.find((user) => user.email.toLowerCase() === demoUser.email.toLowerCase());
    if (!profile) {
      profile = {
        uid: createId(),
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        password: demoUser.password,
        createdAt: nowIso(),
        updatedAt: nowIso()
      };
      users.push(profile);
      saveStoredUsers(users);
    }
    setCurrentUserId(profile.uid);
    notifyAuthListeners();
    return stripPassword(profile);
  },

  async logout() {
    setCurrentUserId(null);
    notifyAuthListeners();
  },

  async resetPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const exists = users.some((user) => user.email.toLowerCase() === normalizedEmail);
    if (!exists) {
      throw new Error('No user found with this email.');
    }
  },

  async getProfile(uid: string) {
    const users = getStoredUsers();
    const profile = users.find((user) => user.uid === uid);
    return profile ? stripPassword(profile) : null;
  },

  getCurrentUser(): UserProfile | null {
    const uid = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!uid) return null;
    const users = getStoredUsers();
    const profile = users.find((user) => user.uid === uid);
    return profile ? stripPassword(profile) : null;
  },

  onAuthStateChanged(listener: AuthStateListener) {
    authListeners.add(listener);
    listener(this.getCurrentUser());
    return () => {
      authListeners.delete(listener);
    };
  },

  async updateProfile(uid: string, updates: { name?: string; email?: string }) {
    const users = getStoredUsers();
    const index = users.findIndex((user) => user.uid === uid);
    if (index === -1) {
      throw new Error('User profile not found.');
    }

    const current = users[index];
    const nextEmail = updates.email?.trim() || current.email;
    if (updates.email) {
      const duplicate = users.find((user) => user.uid !== uid && user.email.toLowerCase() === nextEmail.toLowerCase());
      if (duplicate) {
        throw new Error('This email is already used by another account.');
      }
    }

    users[index] = {
      ...current,
      name: updates.name ?? current.name,
      email: nextEmail,
      updatedAt: nowIso()
    };
    saveStoredUsers(users);
    notifyAuthListeners();
    return stripPassword(users[index]);
  }
};
