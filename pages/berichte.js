import { useState } from "react";
import Link from "next/link";
import { useStore } from "../lib/useStore";
import { SECTIONS, TOTAL_ITEMS } from "../lib/checklistData";
import styles from "../styles/Berichte.module.css";

function formatTs(iso) {
  if (!iso) return "–";
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) +
    " " + d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso) {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

function formatDuration(startIso, endIso) {
  if (!startIso || !endIso) return "–";
  const ms = new Date(endIso) - new Date(startIso);
  const mins = Math.floor(ms / 60000);
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hrs > 0) return `${hrs}h ${rem}min`;
  return `${mins} min`;
}

function ReportDetail({ entry, onClose, onDelete }) {
  const { wohnung, session, archivedAt } = entry;
  const checkedCount = Object.values(session.checks).filter((c) => c.done).length;
  const duration = formatDuration(session.startedAt, session.finishedAt || archivedAt);

  const allNotes = [];
  SECTIONS.forEach((sec) => {
    sec.items.forEach((it) => {
      if (session.checks[it.id]?.note) {
        allNotes.push({ section: sec.title, item: it.text, note: session.checks[it.id].note });
      }
    });
    if (session.sectionNotes?.[sec.id]) {
      allNotes.push({ section: sec.title, item: "Bereich-Notiz", note: session.sectionNotes[sec.id] });
    }
  });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalTitle}>{wohnung}</div>
            <div className={styles.modalSub}>{formatDate(archivedAt)}</div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalStats}>
          <div className={styles.mStat}>
            <div className={styles.mStatVal}>{checkedCount}/{TOTAL_ITEMS}</div>
            <div className={styles.mStatLabel}>Punkte erledigt</div>
          </div>
          <div className={styles.mStat}>
            <div className={styles.mStatVal}>{duration}</div>
            <div className={styles.mStatLabel}>Dauer</div>
          </div>
          <div className={styles.mStat}>
            <div className={styles.mStatVal} style={{ fontSize: "13px" }}>{formatTs(session.startedAt)}</div>
            <div className={styles.mStatLabel}>Start</div>
          </div>
          <div className={styles.mStat}>
            <div className={styles.mStatVal} style={{ fontSize: "13px" }}>{formatTs(session.finishedAt || archivedAt)}</div>
            <div className={styles.mStatLabel}>Ende</div>
          </div>
        </div>

        {allNotes.length > 0 ? (
          <div className={styles.notesBlock}>
            <div className={styles.notesTitle}>Auffälligkeiten & Notizen</div>
            {allNotes.map((n, i) => (
              <div key={i} className={styles.noteLine}>
                <span className={styles.noteSection}>[{n.section}]</span>
                <span className={styles.noteItem}> {n.item}:</span>
                <span className={styles.noteText}> {n.note}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noNotes}>Keine Auffälligkeiten notiert.</div>
        )}

        <div className={styles.sectionList}>
          <div className={styles.sectionListTitle}>Alle erledigten Punkte</div>
          {SECTIONS.map((sec) => {
            const items = sec.items.filter((it) => session.checks[it.id]?.done);
            if (!items.length) return null;
            return (
              <div key={sec.id} className={styles.secGroup}>
                <div className={styles.secGroupTitle}>{sec.title}</div>
                {items.map((it) => (
                  <div key={it.id} className={styles.secItem}>
                    <span className={styles.tick}>✓</span>
                    <span className={styles.secItemText}>{it.text}</span>
                    <span className={styles.secItemTs}>{formatTs(session.checks[it.id]?.ts)}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <button className={styles.deleteBtn} onClick={() => {
          if (confirm("Diesen Bericht löschen?")) { onDelete(entry.id); onClose(); }
        }}>
          Bericht löschen
        </button>
      </div>
    </div>
  );
}

export default function Berichte() {
  const { history, deleteHistoryEntry } = useStore();
  const [selected, setSelected] = useState(null);

  const byWohnung = {};
  (history || []).forEach((e) => {
    if (!byWohnung[e.wohnung]) byWohnung[e.wohnung] = [];
    byWohnung[e.wohnung].push(e);
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.backBtn}>← Checkliste</Link>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>◈</span>
            <span className={styles.logoText}>Berichte</span>
          </div>
          <div className={styles.subtitle}>{history?.length || 0} abgeschlossene Reinigungen</div>
        </div>
      </header>

      <main className={styles.main}>
        {(!history || history.length === 0) ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>◎</div>
            <div className={styles.emptyText}>Noch keine abgeschlossenen Reinigungen.</div>
            <div className={styles.emptySub}>Sobald du eine Checkliste archivierst, erscheint sie hier.</div>
            <Link href="/" className={styles.emptyLink}>Zur Checkliste →</Link>
          </div>
        ) : (
          Object.entries(byWohnung).map(([wohnung, entries]) => (
            <div key={wohnung} className={styles.wohnungGroup}>
              <div className={styles.wohnungGroupTitle}>{wohnung}</div>
              {entries.map((entry) => {
                const checkedCount = Object.values(entry.session.checks).filter((c) => c.done).length;
                const pct = Math.round((checkedCount / TOTAL_ITEMS) * 100);
                const duration = formatDuration(entry.session.startedAt, entry.session.finishedAt || entry.archivedAt);
                const noteCount = [
                  ...Object.values(entry.session.checks).filter((c) => c.note),
                  ...Object.values(entry.session.sectionNotes || {}).filter(Boolean),
                ].length;

                return (
                  <button key={entry.id} className={styles.reportCard} onClick={() => setSelected(entry)}>
                    <div className={styles.cardTop}>
                      <div className={styles.cardDate}>{formatDate(entry.archivedAt)}</div>
                      <div className={styles.cardPct} style={{ color: pct === 100 ? "#1a6b4a" : "#888" }}>
                        {pct}%
                      </div>
                    </div>
                    <div className={styles.cardBar}>
                      <div className={styles.cardBarFill} style={{ width: pct + "%" }} />
                    </div>
                    <div className={styles.cardMeta}>
                      <span>⏱ {duration}</span>
                      <span>{checkedCount}/{TOTAL_ITEMS} Punkte</span>
                      {noteCount > 0 && <span className={styles.cardNoteBadge}>📝 {noteCount} Notiz{noteCount > 1 ? "en" : ""}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </main>

      {selected && (
        <ReportDetail
          entry={selected}
          onClose={() => setSelected(null)}
          onDelete={(id) => { deleteHistoryEntry(id); setSelected(null); }}
        />
      )}
    </div>
  );
}
