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

💾 **Lokale Speicherung**
- Videos werden im Browser gespeichert (localStorage)
- IndexedDB-Fallback für größere Dateien
- Keine Server-Abhängigkeit

🎨 **Modernes Design**
- Dunkles Theme mit Glassmorphismus
- Vibrant Color Palette
- Responsive Design für alle Geräte
- Smooth Animations

## Verwendung

### Lokal testen

1. Öffnen Sie `index.html` in einem modernen Browser
2. Klicken Sie auf "Video hochladen"
3. Geben Sie das Passwort ein: `derkomische`
4. Wählen Sie ein Video oder mehrere Video-Teile
5. Geben Sie einen Namen ein und laden Sie hoch
6. Klicken Sie auf ein Video in der Galerie zum Abspielen

### Auf Netlify deployen

#### Option 1: Drag & Drop
1. Gehen Sie zu [Netlify Drop](https://app.netlify.com/drop)
2. Ziehen Sie den gesamten Projektordner in das Fenster
3. Warten Sie auf das Deployment
4. Ihre Website ist live!

#### Option 2: Git-basiertes Deployment
1. Erstellen Sie ein GitHub-Repository
2. Pushen Sie diesen Code zum Repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```
3. Gehen Sie zu [Netlify](https://app.netlify.com)
4. Klicken Sie auf "New site from Git"
5. Wählen Sie Ihr Repository
6. Build-Einstellungen:
   - Build command: (leer lassen)
   - Publish directory: `.`
7. Klicken Sie auf "Deploy site"

## Technische Details

### Browser-Kompatibilität
- Chrome/Edge (empfohlen)
- Firefox
- Safari

### Storage-Limits
- localStorage: ~5-10 MB pro Video
- IndexedDB: Deutlich größer (abhängig vom Browser)

### Unterstützte Video-Formate
- MP4 (empfohlen)
- WebM
- OGG
- Alle vom Browser unterstützten Formate

## Hinweise

⚠️ **Wichtig**: Da die Videos im Browser gespeichert werden, sind sie nur auf dem Gerät sichtbar, auf dem sie hochgeladen wurden. Für eine Multi-User-Lösung mit zentralem Storage ist ein Backend-Service erforderlich.

## Lizenz

Dieses Projekt ist frei verfügbar für private und kommerzielle Nutzung.
