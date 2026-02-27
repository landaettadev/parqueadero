import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';
import { environment } from '@environments/environment';

let firebaseApp: FirebaseApp | null = null;
let database: Database | null = null;
let auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    firebaseApp = initializeApp(environment.firebase);
  }
  return firebaseApp;
}

export function getFirebaseDatabase(): Database {
  if (!database) {
    const app = getFirebaseApp();
    database = getDatabase(app);
  }
  return database;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    const app = getFirebaseApp();
    auth = getAuth(app);
  }
  return auth;
}
