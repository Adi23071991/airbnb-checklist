export const WOHNUNGEN = ["Mieszkanie 1", "Mieszkanie 2", "Mieszkanie 3", "Moje mieszkanie"];

export const SECTIONS = [
  {
    id: "allgemein",
    title: "Ogólna czystość",
    items: [
      { id: "a1", text: "Sprawdzić wszystkie kąty czy są czyste" },
      { id: "a2", text: "Sprawdzić pod łóżkiem" },
      { id: "a3", text: "Sprawdzić za łóżkiem" },
      { id: "a4", text: "Sprawdzić pod szafami" },
      { id: "a5", text: "Przetrzeć listwy przypodłogowe" },
      { id: "a6", text: "Odkurzyć powierzchnie: lampy, wierzchy szaf, wszystkie meble" },
      { id: "a7", text: "Zdjąć szklane płyty, przetrzeć i założyć z powrotem" },
      { id: "a8", text: "Sprawdzić ściany pod kątem zarysowań i śladów walizek – zgłosić właścicielowi" },
    ],
  },
  {
    id: "bad",
    title: "Łazienka i sanitariaty",
    items: [
      { id: "b1", text: "Dokładnie odkamieniać prysznic" },
      { id: "b2", text: "Przetestować wszystkie odpływy czy woda spływa" },
      { id: "b3", text: "Dokręcić wszystkie krany" },
      { id: "b4", text: "Sprawdzić filtr Britta: czy jest kompletny, ewentualnie wymienić filtr" },
    ],
  },
  {
    id: "kueche",
    title: "Kuchnia",
    items: [
      { id: "k1", text: "Otworzyć wszystkie szuflady i sprawdzić czystość" },
      { id: "k2", text: "Dokładnie wyczyścić lodówkę w środku" },
      { id: "k3", text: "Rozmrozić lub sprawdzić zamrażarkę" },
      { id: "k4", text: "Policzyć i wyczyścić sztućce: widelce, noże, nożyczki, łyżki" },
      { id: "k5", text: "Policzyć i wyczyścić naczynia: garnki, patelnie" },
    ],
  },
  {
    id: "schraenke",
    title: "Szafy i drzwi",
    items: [
      { id: "s1", text: "Otworzyć wszystkie szafy i drzwi" },
      { id: "s2", text: "Sprawdzić klamki i uchwyty czy są solidnie zamocowane" },
      { id: "s3", text: "Sprawdzić wszystkie haczyki czy są dobrze przymocowane" },
    ],
  },
  {
    id: "fenster",
    title: "Okna i oświetlenie",
    items: [
      { id: "f1", text: "Umyć wszystkie okna" },
      { id: "f2", text: "Przetrzeć wszystkie parapety" },
      { id: "f3", text: "Sprawdzić wszystkie żarówki czy działają" },
    ],
  },
  {
    id: "technik",
    title: "Technika i elektronika",
    items: [
      { id: "t1", text: "Sprawdzić wszystkie telewizory czy działają" },
      { id: "t3", text: "Sprawdzić piloty: czy są i czy baterie działają" },
    ],
  },
  {
    id: "kueche_elektro",
    title: "Kuchniangeräte & Elektro",
    items: [
      { id: "ke1", text: "Sprawdzić płyty grzewcze / kuchenkę czy działają" },
      { id: "ke2", text: "Sprawdzić piekarnik czy działa" },
      { id: "ke3", text: "Sprawdzić mikrofalówkę czy działa" },
      { id: "ke4", text: "Sprawdzić ekspres do kawy / czajnik czy działają" },
      { id: "ke5", text: "Sprawdzić zmywarkę czy działa" },
      { id: "ke6", text: "Sprawdzić pozostałe urządzenia kuchenne czy działają" },
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
