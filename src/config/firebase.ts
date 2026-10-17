/**
 * Configuración web de Firebase (Consola → Configuración del proyecto → Tus apps → Web).
 *
 * Estos valores NO son secretos: Firebase los diseñó para ir dentro del sitio.
 * La protección de los datos la dan las reglas de Firestore (firestore.rules).
 *
 * Mientras `apiKey` esté vacío, el juego funciona igual pero sin ranking.
 */
export const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "malvinizados-e50e8.firebaseapp.com",
  projectId: "malvinizados-e50e8",
  storageBucket: "malvinizados-e50e8.firebasestorage.app",
  messagingSenderId: "234930656901",
  appId: "",
};

export const RANKING_COLLECTION = "ranking";
