// ============================================
// FIREBASE CONFIGURATION
// ============================================
// WICHTIG: Ersetze diese Werte mit deiner Firebase-Konfiguration
// Siehe FIREBASE_SETUP.md für Anleitung

const firebaseConfig = {
    apiKey: "AIzaSyDTjhUEI3-GqTqbaWx4SHblmy95RVNkCOw",
    authDomain: "netflixe-59005.firebaseapp.com",
    projectId: "netflixe-59005",
    storageBucket: "netflixe-59005.firebasestorage.app",
    messagingSenderId: "9902493784",
    appId: "1:9902493784:web:76bf467fbaa11e7f427a2d",
    measurementId: "G-B7EG0KCJFH"
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
