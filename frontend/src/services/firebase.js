// Firebase client-side auth integration (optional)
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

let app;
let auth;

export function initFirebase() {
  if (app) return { app, auth };
  const useFirebase = (import.meta.env.VITE_USE_FIREBASE || 'false').toLowerCase() === 'true';
  if (!useFirebase) return { app: null, auth: null };

  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };
  app = initializeApp(config);
  auth = getAuth(app);
  return { app, auth };
}

export function subscribeAuth(callback) {
  const { auth } = initFirebase();
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}

export async function firebaseRegister({ email, password }) {
  const { auth } = initFirebase();
  if (!auth) throw new Error('Firebase disabled');
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function firebaseLogin({ email, password }) {
  const { auth } = initFirebase();
  if (!auth) throw new Error('Firebase disabled');
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function firebaseLogout() {
  const { auth } = initFirebase();
  if (!auth) return;
  await signOut(auth);
}


