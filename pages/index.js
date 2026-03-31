import { useState, useMemo } from "react";
import Link from "next/link";
import { WOHNUNGEN, SECTIONS, TOTAL_ITEMS } from "../lib/checklistData";
import { useStore } from "../lib/useStore";
import styles from "../styles/Home.module.css";

function formatTs(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE") + " " + d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(startIso, endIso) {
  if (!startIso || !endIso) return null;
  const ms = new Date(endIso) - new Date(startIso);
  const mins = Math.floor(ms / 60000);
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hrs > 0) return `${hrs}h ${rem}min`;
  return `${mins} min`;
}

function ItemNote({ note, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.itemNoteWrap}>
      <button className={styles.noteToggle} onClick={() => setOpen((o) => !o)} title="Notiz">
        {note ? "📝" : "💬"}
        {note && <span className={styles.noteDot} />}
      </button>
      {open && (
        <div className={styles.notePopover}>
          <textarea
            className={styles.noteTextarea}
            placeholder="Notiz zu diesem Punkt…"
            value={note}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            autoFocus
          />
          <button className={styles.noteClose} onClick={() => setOpen(false)}>Schließen</button>
        </div>
      )}
    </div>
  );
}

function SectionBlock({ section, session, wohnung, onToggle, onItemNote, onSectionNote }) {
  const [open, setOpen] = useState(true);
  const checkedCount = section.items.filter((it) => session.checks[it.id]?.done).length;
  const allDone = checkedCount === section.items.length;
  const itemsWithNotes = section.items.filter((it) => session.checks[it.id]?.note);
  const sectionNote = session.sectionNotes[section.id] || "";

  return (
    <div className={`${styles.section} ${allDone ? styles.sectionDone : ""}`}>
      <button className={styles.sectionHeader} onClick={() => setOpen((o) => !o)}>
        <span className={styles.sectionTitle}>{section.title}</span>
        <span className={styles.sectionMeta}>
          <span className={styles.sectionCount}>{checkedCount}/{section.items.length}</span>
          <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}>›</span>
        </span>
      </button>

      {open && (
        <div className={styles.sectionBody}>
          {section.items.map((item) => {
            const check = session.checks[item.id] || {};
            return (
              <div key={item.id} className={`${styles.item} ${check.done ? styles.itemDone : ""}`}>
                <button
                  className={`${styles.checkbox} ${check.done ? styles.checkboxDone : ""}`}
                  onClick={() => onToggle(item.id)}
                  aria-label={item.text}
                >
                  {check.done && (
                    <svg viewBox="0 0 12 12" fill="none" width="12" height="12">
                      <polyline points="1.5,6 5,9.5 10.5,2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <div className={styles.itemContent}>
                  <span className={styles.itemText}>{item.text}</span>
                  {check.done && check.ts && (
                    <span className={styles.itemTs}>✓ {formatTs(check.ts)}</span>
                  )}
                </div>
                <ItemNote note={check.note || ""} onChange={(v) => onItemNote(item.id, v)} />
              </div>
            );
          })}

          <div className={styles.sectionSummary}>
            <div className={styles.sectionSummaryLabel}>Notatka końcowa dla tej sekcji</div>
            <textarea
              className={styles.sectionNoteArea}
              placeholder="Podsumowanie / uwagi dla tej sekcji…"
              value={sectionNote}
              onChange={(e) => onSectionNote(e.target.value)}
              rows={2}
            />
            {(itemsWithNotes.length > 0 || sectionNote) && (
              <div className={styles.autoSummary}>
                <div className={styles.autoSummaryTitle}>Automatische Zusammenfassung</div>
                {itemsWithNotes.map((it) => (
                  <div key={it.id} className={styles.autoSummaryLine}>
                    <span className={styles.autoSummaryItem}>→ {it.text}:</span>
                    <span className={styles.autoSummaryNote}> {session.checks[it.id].note}</span>
                  </div>
                ))}
                {sectionNote && (
                  <div className={styles.autoSummaryLine}>
                    <span className={styles.autoSummaryItem}>→ Bereich-Notiz:</span>
                    <span className={styles.autoSummaryNote}> {sectionNote}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function WohnungView({ wohnung, session, onToggle, onItemNote, onSectionNote, onArchive }) {
  const checkedTotal = useMemo(
    () => Object.values(session.checks).filter((c) => c.done).length,
    [session.checks]
  );
  const pct = Math.round((checkedTotal / TOTAL_ITEMS) * 100);
  const duration = formatDuration(session.startedAt, session.finishedAt);
  const started = session.startedAt ? formatTs(session.startedAt) : null;
  const isComplete = checkedTotal === TOTAL_ITEMS;

  const allNotes = [];
  SECTIONS.forEach((sec) => {
    sec.items.forEach((it) => {
      if (session.checks[it.id]?.note) {
        allNotes.push({ section: sec.title, item: it.text, note: session.checks[it.id].note });
      }
    });
    if (session.sectionNotes[sec.id]) {
      allNotes.push({ section: sec.title, item: "Bereich-Notiz", note: session.sectionNotes[sec.id] });
    }
  });

  return (
    <div className={styles.wohnungView}>
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{pct}%</div>
          <div className={styles.statLabel}>erledigt</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{checkedTotal}/{TOTAL_ITEMS}</div>
          <div className={styles.statLabel}>Punkte</div>
        </div>
        {started && (
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ fontSize: "13px" }}>{started}</div>
            <div className={styles.statLabel}>gestartet</div>
          </div>
        )}
        {duration && (
          <div className={styles.statCard}>
            <div className={styles.statValue}>{duration}</div>
            <div className={styles.statLabel}>Dauer</div>
          </div>
        )}
      </div>

      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: pct + "%" }} />
        </div>
      </div>

      {isComplete && (
        <div className={styles.completeBanner}>
          <span className={styles.completeIcon}>✓</span>
          <span className={styles.completeText}>{wohnung} vollständig abgeschlossen!</span>
        </div>
      )}

      {SECTIONS.map((sec) => (
        <SectionBlock
          key={sec.id}
          section={sec}
          session={session}
          wohnung={wohnung}
          onToggle={(id) => onToggle(wohnung, id)}
          onItemNote={(id, v) => onItemNote(wohnung, id, v)}
          onSectionNote={(v) => onSectionNote(wohnung, sec.id, v)}
        />
      ))}

      {allNotes.length > 0 && (
        <div className={styles.globalSummary}>
          <div className={styles.globalSummaryTitle}>Alle Notizen für {wohnung}</div>
          {allNotes.map((n, i) => (
            <div key={i} className={styles.globalSummaryLine}>
              <span className={styles.globalSummarySection}>[{n.section}]</span>
              <span className={styles.globalSummaryItem}> {n.item}:</span>
              <span className={styles.globalSummaryNote}> {n.note}</span>
            </div>
          ))}
        </div>
      )}

      <button
        className={`${styles.archiveBtn} ${isComplete ? styles.archiveBtnReady : ""}`}
        onClick={() => {
          if (confirm(`Reinigung für ${wohnung} abschließen und als Bericht speichern?\nDie Checkliste wird danach zurückgesetzt.`)) {
            onArchive(wohnung, session);
          }
        }}
      >
        {isComplete ? "✓ Reinigung abschließen & Bericht speichern" : "Reinigung jetzt abschließen & archivieren"}
      </button>
    </div>
  );
}

export default function Home() {
  const [activeWohnung, setActiveWohnung] = useState(WOHNUNGEN[0]);
  const { sessions, history, toggleItem, setItemNote, setSectionNote, archiveAndReset } = useStore();

  if (!sessions) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingDot} />
      </div>
    );
  }

  const session = sessions[activeWohnung];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>◈</span>
            <span className={styles.logoText}>Sprzątanie</span>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.subtitle}>AirBnB · 1–2× w miesiącu</div>
            <Link href="/raporty" className={styles.berichteLink}>
              Raporty {history?.length > 0 && <span className={styles.berichteBadge}>{history.length}</span>}
            </Link>
          </div>
        </div>
      </header>

      <nav className={styles.tabs}>
        {WOHNUNGEN.map((w) => {
          const s = sessions[w];
          const done = Object.values(s.checks).filter((c) => c.done).length;
          const pct = Math.round((done / TOTAL_ITEMS) * 100);
          return (
            <button
              key={w}
              className={`${styles.tab} ${activeWohnung === w ? styles.tabActive : ""}`}
              onClick={() => setActiveWohnung(w)}
            >
              <span className={styles.tabName}>{w}</span>
              <span className={styles.tabPct}>{pct}%</span>
            </button>
          );
        })}
      </nav>

      <main className={styles.main}>
        <WohnungView
          key={activeWohnung}
          wohnung={activeWohnung}
          session={session}
          onToggle={toggleItem}
          onItemNote={setItemNote}
          onSectionNote={setSectionNote}
          onArchive={archiveAndReset}
        />
      </main>
    </div>
  );
}
