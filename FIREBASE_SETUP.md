# Firebase Setup Anleitung

Folge diesen Schritten, um dein Firebase-Projekt einzurichten.

## Schritt 1: Firebase-Projekt erstellen

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Klicke auf **"Projekt hinzufügen"** / **"Add project"**
3. Projektname: `Netflixe` (oder ein anderer Name)
4. Google Analytics: kannst du deaktivieren (optional)
5. Klicke auf **"Projekt erstellen"**

## Schritt 2: Web-App registrieren

1. In der Firebase Console, klicke auf das **Web-Symbol** `</>`
2. App-Nickname: `Netflixe Web`
3. **Firebase Hosting** nicht aktivieren (wir nutzen Netlify)
4. Klicke auf **"App registrieren"**

## Schritt 3: Firebase-Konfiguration kopieren

Du bekommst einen Konfigurationsblock wie diesen:

```javascript
const firebaseConfig = {
  apiKey: "IHR-API-KEY",
  authDomain: "ihr-projekt.firebaseapp.com",
  projectId: "ihr-projekt-id",
  storageBucket: "ihr-projekt.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

**WICHTIG:** Kopiere diese Konfiguration - du brauchst sie gleich!

## Schritt 4: Firebase Storage aktivieren

1. Gehe in der linken Sidebar zu **"Build"** → **"Storage"**
2. Klicke auf **"Get started"**
3. Wähle **"Start in test mode"** (wir konfigurieren die Regeln später)
4. Wähle einen Standort (z.B. `europe-west3` für Frankfurt)
5. Klicke auf **"Done"**

## Schritt 5: Firestore Database aktivieren

1. Gehe zu **"Build"** → **"Firestore Database"**
2. Klicke auf **"Create database"**
3. Wähle **"Start in test mode"**
4. Wähle den gleichen Standort wie bei Storage
5. Klicke auf **"Enable"**

## Schritt 6: Security Rules konfigurieren

### Storage Rules
1. Gehe zu **Storage** → **Rules**
2. Ersetze die Regeln mit:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /videos/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. Klicke auf **"Publish"**

### Firestore Rules
1. Gehe zu **Firestore Database** → **Rules**
2. Ersetze die Regeln mit:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /videos/{videoId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. Klicke auf **"Publish"**

> **Hinweis:** Diese Regeln erlauben jedem Zugriff. Der Passwortschutz (`derkomische`) bleibt im Frontend aktiv.

## Schritt 7: Konfiguration in Code einfügen

Öffne die Datei `firebase-config.js` in deinem Projekt und füge deine Firebase-Konfiguration ein:

```javascript
// firebase-config.js
const firebaseConfig = {
  apiKey: "DEIN-API-KEY",              // ← Hier einfügen
  authDomain: "dein-projekt.firebaseapp.com",
  projectId: "dein-projekt-id",
  storageBucket: "dein-projekt.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## ✅ Fertig!

Firebase ist jetzt einsatzbereit. Nach dem nächsten Deployment können alle Nutzer alle Videos sehen!

## Kostenlose Limits (Spark Plan)

- **Storage:** 5 GB
- **Downloads:** 1 GB/Tag  
- **Firestore Reads:** 50K/Tag
- **Firestore Writes:** 20K/Tag

Für die meisten Anwendungsfälle absolut ausreichend! 🎉
