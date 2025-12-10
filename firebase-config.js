// ============================================
// FIREBASE CONFIGURATION
// ============================================
// WICHTIG: Ersetze diese Werte mit deiner Firebase-Konfiguration
// Siehe FIREBASE_SETUP.md für Anleitung

const firebaseConfig = {
    apiKey: "DEIN-API-KEY",
    authDomain: "dein-projekt.firebaseapp.com",
    projectId: "dein-projekt-id",
    storageBucket: "dein-projekt.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);

// Firebase Services
const storage = firebase.storage();
const db = firebase.firestore();

// Storage Reference
const storageRef = storage.ref();
const videosStorageRef = storageRef.child('videos');

// Firestore Collection Reference
const videosCollection = db.collection('videos');
const foldersCollection = db.collection('folders');
