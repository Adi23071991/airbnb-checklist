import { useState, useEffect, useCallback } from "react";
import { WOHNUNGEN, makeEmptySession } from "./checklistData";

const STORAGE_KEY = "airbnb_checklist_v2";
const HISTORY_KEY = "airbnb_checklist_history_v1";

function defaultState() {
  const sessions = {};
  WOHNUNGEN.forEach((w) => { sessions[w] = makeEmptySession(); });
  return sessions;
}

export function useStore() {
  const [sessions, setSessions] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const base = defaultState();
        WOHNUNGEN.forEach((w) => {
          if (parsed[w]) {
            base[w] = { ...base[w], ...parsed[w] };
            base[w].checks = { ...base[w].checks, ...parsed[w].checks };
            base[w].sectionNotes = { ...base[w].sectionNotes, ...(parsed[w].sectionNotes || {}) };
          }
        });
        setSessions(base);
      } else {
        setSessions(defaultState());
      }
    } catch {
      setSessions(defaultState());
    }

    try {
      const rawH = localStorage.getItem(HISTORY_KEY);
      if (rawH) setHistory(JSON.parse(rawH));
    } catch {}
  }, []);

  const toggleItem = useCallback((wohnung, itemId) => {
    setSessions((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const check = next[wohnung].checks[itemId];
      const now = new Date().toISOString();
      if (!check.done) {
        check.done = true;
        check.ts = now;
        if (!next[wohnung].startedAt) next[wohnung].startedAt = now;
        const allDone = Object.values(next[wohnung].checks).every((c) => c.done);
        if (allDone) next[wohnung].finishedAt = now;
      } else {
        check.done = false;
        check.ts = null;
        next[wohnung].finishedAt = null;
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const setItemNote = useCallback((wohnung, itemId, note) => {
    setSessions((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[wohnung].checks[itemId].note = note;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const setSectionNote = useCallback((wohnung, sectionId, note) => {
    setSessions((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[wohnung].sectionNotes[sectionId] = note;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const archiveAndReset = useCallback((wohnung, currentSession) => {
    const entry = {
      id: Date.now(),
      wohnung,
      archivedAt: new Date().toISOString(),
      session: JSON.parse(JSON.stringify(currentSession)),
    };
    setHistory((prev) => {
      const next = [entry, ...prev];
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    setSessions((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next[wohnung] = makeEmptySession();
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const deleteHistoryEntry = useCallback((id) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.id !== id);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { sessions, history, toggleItem, setItemNote, setSectionNote, archiveAndReset, deleteHistoryEntry };
}
