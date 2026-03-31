export const WOHNUNGEN = ["Mieszkanie 1", "Mieszkanie 2", "Mieszkanie 3", "Moje mieszkanie"];

export const SECTIONS = [
  {
    id: "allgemein",
    title: "Allgemeine Sauberkeit",
    items: [
      { id: "a1", text: "Alle Ecken kontrollieren ob sauber" },
      { id: "a2", text: "Unter dem Bett kontrollieren" },
      { id: "a3", text: "Hinter dem Bett kontrollieren" },
      { id: "a4", text: "Unter den Schränken kontrollieren" },
      { id: "a5", text: "Fußleisten abwischen" },
      { id: "a6", text: "Oberflächen entstauben: Lampen, Schränke oben, alle Möbel" },
      { id: "a7", text: "Glasplatten abnehmen, abwischen und wieder einsetzen" },
      { id: "a8", text: "Wände kontrollieren auf Schrammstriche oder Kofferschrammen – Auffälligkeiten melden" },
    ],
  },
  {
    id: "bad",
    title: "Bad & Sanitär",
    items: [
      { id: "b1", text: "Duschen komplett entkalken" },
      { id: "b2", text: "Alle Abflüsse testen ob Wasser abfließt" },
      { id: "b3", text: "Wasserhähne fest drehen" },
      { id: "b4", text: "Britta-Wasserfilter prüfen: vollständig vorhanden, ggf. Filter wechseln" },
    ],
  },
  {
    id: "kueche",
    title: "Küche",
    items: [
      { id: "k1", text: "Alle Schubladen öffnen und auf Sauberkeit prüfen" },
      { id: "k2", text: "Kühlschrank komplett durchputzen" },
      { id: "k3", text: "Tiefkühltruhe enteisen oder kontrollieren" },
      { id: "k4", text: "Besteck vollständig zählen und reinigen: Gabeln, Messer, Scheren, Kochlöffel" },
      { id: "k5", text: "Kochgeschirr vollständig zählen und reinigen: Kochtöpfe, Pfannen" },
    ],
  },
  {
    id: "schraenke",
    title: "Schränke & Türen",
    items: [
      { id: "s1", text: "Alle Schränke und Türen öffnen" },
      { id: "s2", text: "Türknäufe und Griffe auf festen Sitz prüfen" },
      { id: "s3", text: "Alle Haken kontrollieren ob fest sitzen" },
    ],
  },
  {
    id: "fenster",
    title: "Fenster & Licht",
    items: [
      { id: "f1", text: "Alle Fenster putzen" },
      { id: "f2", text: "Alle Fensterbänke putzen" },
      { id: "f3", text: "Alle Glühbirnen prüfen ob sie funktionieren" },
    ],
  },
  {
    id: "technik",
    title: "Technik & Elektronik",
    items: [
      { id: "t1", text: "Alle TV-Geräte auf Funktion prüfen" },
      { id: "t3", text: "Fernbedienungen prüfen: vorhanden und Batterien funktionieren" },
    ],
  },
  {
    id: "kueche_elektro",
    title: "Küchengeräte & Elektro",
    items: [
      { id: "ke1", text: "Kochplatten / Herd auf Funktion prüfen" },
      { id: "ke2", text: "Backofen auf Funktion prüfen" },
      { id: "ke3", text: "Mikrowelle auf Funktion prüfen" },
      { id: "ke4", text: "Kaffeemaschine / Wasserkocher auf Funktion prüfen" },
      { id: "ke5", text: "Geschirrspüler auf Funktion prüfen" },
      { id: "ke6", text: "Alle weiteren Küchengeräte auf Funktion prüfen" },
    ],
  },
];

export const TOTAL_ITEMS = SECTIONS.reduce((s, sec) => s + sec.items.length, 0);

export function makeEmptySession() {
  const checks = {};
  SECTIONS.forEach((sec) => sec.items.forEach((item) => {
    checks[item.id] = { done: false, ts: null, note: "" };
  }));
  const sectionNotes = {};
  SECTIONS.forEach((sec) => { sectionNotes[sec.id] = ""; });
  return {
    checks,
    sectionNotes,
    startedAt: null,
    finishedAt: null,
  };
}
