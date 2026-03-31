# AirBnB Grundreinigung Checkliste

Interaktive Putz-Checkliste für 4 Wohnungen mit Zeiterfassung, Notizen und automatischer Zusammenfassung.

## Features
- ✅ 4 Wohnungen (Wohnung 1, 2, 3, Meine Wohnung)
- ⏱ Zeitstempel pro Haken + Gesamtdauer der Reinigung
- 📝 Notiz pro Prüfpunkt
- 📋 Abschluss-Notiz pro Bereich
- 🔄 Automatische Zusammenfassung aller Notizen
- 💾 Lokale Speicherung (localStorage, kein Login nötig)

## Deploy auf Vercel (3 Schritte)

### Option A: GitHub + Vercel (empfohlen)

1. **GitHub Repo anlegen**
   - Gehe zu https://github.com/new
   - Repo-Name: `airbnb-checklist` (privat oder öffentlich)
   - Erstelle das Repo

2. **Code hochladen**
   ```bash
   cd airbnb-checklist
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/DEIN-USERNAME/airbnb-checklist.git
   git push -u origin main
   ```

3. **Vercel verbinden**
   - Gehe zu https://vercel.com/new
   - "Import Git Repository" → dein GitHub Repo auswählen
   - Framework: **Next.js** (wird automatisch erkannt)
   - Klick auf **Deploy**
   - Fertig! Du bekommst eine URL wie `airbnb-checklist.vercel.app`

### Option B: Vercel CLI (direkt vom Terminal)

```bash
npm i -g vercel
cd airbnb-checklist
vercel
# Fragen beantworten, dann automatisch deployed
```

## Lokal testen

```bash
cd airbnb-checklist
npm install
npm run dev
# → http://localhost:3000
```

## Hinweis zur Datenspeicherung

Die Daten werden im Browser (localStorage) gespeichert. Das heißt:
- Keine Anmeldung nötig
- Daten bleiben auf dem Gerät gespeichert
- Wer die App auf einem anderen Gerät öffnet, sieht eine leere Liste

Wenn du die Daten geräteübergreifend teilen möchtest (z.B. damit die Putzfrau und du die gleiche Liste siehst), müsste eine Datenbank (z.B. Supabase) integriert werden – sag einfach Bescheid!
