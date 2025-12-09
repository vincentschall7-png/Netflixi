# Netflixe - Video-Hosting Plattform

Eine moderne Web-Anwendung zum Hochladen und Abspielen von Videos mit erweiterten Funktionen.

## Features

✨ **Video-Player mit variabler Geschwindigkeit**
- Geschwindigkeitsregelung von 0.25x bis 10x
- Flüssige Wiedergabe-Steuerung
- Moderner, benutzerfreundlicher Player

🔒 **Sicherer Upload**
- Passwortgeschützter Upload (Passwort: `derkomische`)
- Einzelne Videos oder Video-Teile hochladen
- Automatische Zusammenführung von Video-Chunks

💾 **Cloud-Speicherung mit Firebase**
- Videos werden in Firebase Storage gespeichert
- Alle Benutzer sehen alle Videos
- Real-time Updates bei neuen Videos
- Video-Metadaten in Firestore Database

🎨 **Modernes Design**
- Dunkles Theme mit Glassmorphismus
- Vibrant Color Palette
- Responsive Design für alle Geräte
- Smooth Animations

## Verwendung

### Firebase-Projekt einrichten

**Wichtig:** Bevor du die Website nutzen kannst, musst du ein Firebase-Projekt erstellen und konfigurieren.

1. Folge der Anleitung in [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
2. Kopiere deine Firebase-Konfiguration
3. Füge sie in `firebase-config.js` ein
4. Deploye die Website

### Lokal testen

1. Firebase-Projekt konfigurieren (siehe oben)
2. Öffne `index.html` in einem modernen Browser
3. Klicke auf "Video hochladen"
4. Gebe das Passwort ein: `derkomische`
5. Wähle ein Video oder mehrere Video-Teile
6. Gebe einen Namen ein und lade hoch
7. Alle Benutzer können das Video jetzt sehen und abspielen!

### Auf Netlify deployen

#### Option 1: Über GitHub (empfohlen)

1. Firebase-Projekt einrichten und Konfiguration in `firebase-config.js` eintragen
2. Änderungen zu GitHub pushen:
   ```bash
   git add .
   git commit -m "Add Firebase configuration"
   git push
   ```
3. Gehe zu [Netlify](https://app.netlify.com)
4. Das Repository ist bereits verbunden - Netlify deployt automatisch!
5. Nach wenigen Sekunden ist die neue Version live

#### Option 2: Drag & Drop
1. Firebase konfigurieren
2. Gehe zu [Netlify Drop](https://app.netlify.com/drop)
3. Ziehe den gesamten Projektordner in das Fenster
4. Warten auf das Deployment

## Technische Details

### Technologie-Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Firebase (Google Cloud)
  - Firebase Storage: Video-Dateien
  - Firestore: Video-Metadaten
  - Real-time Database: Live-Updates

### Browser-Kompatibilität
- Chrome/Edge (empfohlen)
- Firefox
- Safari

### Firebase Limits (Kostenloser Plan)
- Storage: 5 GB
- Downloads: 1 GB pro Tag
- Firestore Reads: 50K pro Tag
- Firestore Writes: 20K pro Tag

### Unterstützte Video-Formate
- MP4 (empfohlen)
- WebM
- OGG
- Alle vom Browser unterstützten Formate

## Hinweise

✅ **Multi-User-Lösung**: Alle Benutzer sehen alle hochgeladenen Videos dank Firebase Cloud Storage!

🔐 **Sicherheit**: Der Upload ist durch ein Passwort geschützt. Für zusätzliche Sicherheit kann Firebase Authentication hinzugefügt werden.

## Lizenz

Dieses Projekt ist frei verfügbar für private und kommerzielle Nutzung.
