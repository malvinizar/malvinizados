"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, signInAnonymously, type User } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { FIREBASE_CONFIG } from "@/config/firebase";

/** ¿Está cargada la configuración web de Firebase? */
export function firebaseConfigured(): boolean {
  return Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.appId);
}

let app: FirebaseApp | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!firebaseConfigured()) throw new Error("Firebase no está configurado");
  if (!app) app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
  return app;
}

export function db(): Firestore {
  return getFirestore(getFirebaseApp());
}

/** Ingreso anónimo: los alumnos no necesitan crear cuenta. */
export async function ensureAnonymousUser(): Promise<User> {
  const auth = getAuth(getFirebaseApp());
  if (auth.currentUser) return auth.currentUser;
  const cred = await signInAnonymously(auth);
  return cred.user;
}
