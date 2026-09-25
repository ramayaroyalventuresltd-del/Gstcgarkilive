import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, Language } from '../types';
import { translations, Translations } from '../i18n/translations';
import { auth, googleProvider } from '../firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';

interface AuthContextType {
  user: UserSession | null;
  firebaseUser: FirebaseUser | null;
  language: Language;
  t: Translations;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  login: (username: string, pin: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  quickDemoLogin: (role: 'admin' | 'staff' | 'student') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('gstc_lang') as Language) || 'en';
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('gstc_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('gstc_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Synchronize Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const isAdmin = fbUser.email === 'freelanderdba@gmail.com' || fbUser.email?.includes('admin');
        const session: UserSession = {
          id: fbUser.uid,
          username: fbUser.email?.split('@')[0] || 'google_user',
          name: fbUser.displayName || fbUser.email || 'Authorized User',
          role: isAdmin ? 'admin' : 'staff',
          email: fbUser.email || undefined,
          avatar: fbUser.photoURL || undefined,
        };
        setUser(session);
        localStorage.setItem('gstc_user', JSON.stringify(session));
      }
    });
    return () => unsubscribe();
  }, []);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  const t = translations[language] || translations.en;
  const isRTL = language === 'ar';

  const loginWithGoogle = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const isAdmin = fbUser.email === 'freelanderdba@gmail.com' || fbUser.email?.includes('admin');
      const sessionUser: UserSession = {
        id: fbUser.uid,
        username: fbUser.email?.split('@')[0] || 'google_user',
        name: fbUser.displayName || 'Authorized User',
        role: isAdmin ? 'admin' : 'staff',
        email: fbUser.email || undefined,
        avatar: fbUser.photoURL || undefined,
      };
      setUser(sessionUser);
      localStorage.setItem('gstc_user', JSON.stringify(sessionUser));
      return { success: true };
    } catch (err: unknown) {
      console.error('Google Sign In Error:', err);
      const message = err instanceof Error ? err.message : 'Google authentication failed';
      return { success: false, message };
    }
  };

  const login = async (username: string, pin: string): Promise<{ success: boolean; message?: string }> => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPin = pin.trim();

    // Check Admin
    if (cleanUser === 'admin' && (cleanPin === 'admin123' || cleanPin === 'admin' || cleanPin === '1234')) {
      const adminUser: UserSession = {
        id: 'usr-admin-01',
        username: 'admin',
        name: 'Principal Admin (GSTC)',
        role: 'admin',
        email: 'admin@gstcgarki.edu.ng',
        phone: '0802 345 6789',
      };
      setUser(adminUser);
      localStorage.setItem('gstc_user', JSON.stringify(adminUser));
      return { success: true };
    }

    // Check Staff (e.g. GSTC/Stf/001 or yahaya)
    if (
      cleanUser === 'gstc/stf/001' ||
      cleanUser === 'yahaya' ||
      cleanUser.includes('stf') ||
      cleanUser === 'staff'
    ) {
      const staffUser: UserSession = {
        id: 'usr-stf-001',
        username: 'GSTC/Stf/001',
        name: 'Yahaya (Form Teacher - CCS 1)',
        role: 'staff',
        email: 'habakkukemmanuel0@gmail.com',
        phone: '08063731128',
        assignedClass: 'CCS 1',
        subjectsTaught: ['English Language'],
      };
      setUser(staffUser);
      localStorage.setItem('gstc_user', JSON.stringify(staffUser));
      return { success: true };
    }

    // Check Student or Scratch card pin
    if (
      cleanUser.startsWith('gstc/') ||
      cleanUser === 'student' ||
      cleanUser === 'gstc/2025/001' ||
      cleanPin.includes('-')
    ) {
      const studentUser: UserSession = {
        id: 'usr-std-001',
        username: cleanUser === 'student' ? 'GSTC/2025/001' : username.toUpperCase(),
        name: 'Amina Bello (CCS 1)',
        role: 'student',
        assignedClass: 'CCS 1',
        phone: '0803 111 2233',
      };
      setUser(studentUser);
      localStorage.setItem('gstc_user', JSON.stringify(studentUser));
      return { success: true };
    }

    // General fallback for testing
    if (cleanUser.length > 0 && cleanPin.length > 0) {
      const genericUser: UserSession = {
        id: `usr-${Date.now()}`,
        username: username,
        name: username,
        role: username.includes('stf') ? 'staff' : username.includes('2025') ? 'student' : 'admin',
      };
      setUser(genericUser);
      localStorage.setItem('gstc_user', JSON.stringify(genericUser));
      return { success: true };
    }

    return { success: false, message: t.login.invalidCredentials };
  };

  const quickDemoLogin = (role: 'admin' | 'staff' | 'student') => {
    let sessionUser: UserSession;
    if (role === 'admin') {
      sessionUser = {
        id: 'usr-admin-01',
        username: 'admin',
        name: 'Principal Admin (GSTC)',
        role: 'admin',
        email: 'admin@gstcgarki.edu.ng',
      };
    } else if (role === 'staff') {
      sessionUser = {
        id: 'usr-stf-001',
        username: 'GSTC/Stf/001',
        name: 'Yahaya',
        role: 'staff',
        email: 'habakkukemmanuel0@gmail.com',
        phone: '08063731128',
        assignedClass: 'CCS 1',
        subjectsTaught: ['English Language'],
      };
    } else {
      sessionUser = {
        id: 'usr-std-001',
        username: 'GSTC/2025/001',
        name: 'Amina Bello',
        role: 'student',
        assignedClass: 'CCS 1',
      };
    }
    setUser(sessionUser);
    localStorage.setItem('gstc_user', JSON.stringify(sessionUser));
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('gstc_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        language,
        t,
        isRTL,
        setLanguage,
        login,
        loginWithGoogle,
        quickDemoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
