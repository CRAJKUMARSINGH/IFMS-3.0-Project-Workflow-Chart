import { useState, useEffect } from "react";
import {
  loadRoster,
  addToRoster,
  removeFromRoster,
  clearRoster,
  decodeSharePayload,
  type RosterEntry,
} from "@/hooks/useProgress";

const CAT_CFG: Record<string, { label: string; icon: string; color: string }> = {
  workflow: { label: "कार्यप्रवाह", icon: "📌", color: "#6366f1" },
  ids:      { label: "ID लिंकेज",  icon: "🔗", color: "#0ea5e9" },
  wam:      { label: "WAM",        icon: "📋", color: "#10b981" },
  payment:  { label: "भुगतान",     icon: "💸", color: "#f59e0b" },
};

function gradeOf(pct: number) {
  if (pct >= 90) return { label: "उत्कृष्ट",   color: "#15803d", bg: "#dcfce7", icon: "🏆" };
  if (pct >= 70) return { label: "बहुत अच्छा", color: "#1d4ed8", bg: "#dbeafe", icon: "🎉" };
  if (pct >= 50) return { label: "ठीक है",      color: "#92400e", bg: "#fef3c7", icon: "📖" };
  return             { label: "सुधार जरूरी",   color: "#991b1b", bg: "#fee2e2", icon: "💪" };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("hi-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function Medal({ rank }: { rank: number }) {
  if (rank === 1) return <span style={{ fontSize: 20 }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: 20 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 20 }}>🥉</span>;
  return <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#f1f5f9", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#64748b" }}>{rank}</span>;
}

export default function SupervisorView({ initialHash }: { initialHash?: string }) {
  const [roster, setRoster] = useState<RosterEntry[]>(() => loadRoster());
  const [pasteInput, setPasteInput] = useState("");
  const [pasteError, setPasteError] = useState("");
  const [pasteSuccess, setPasteSuccess] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [supervisorName, setSupervisorName] = useState(() => localStorage.getItem("ifms_supervisor_name") ?? "");
  const [svNameInput, setSvNameInput] = useState(() => localStorage.getItem("ifms_supervisor_name") ?? "");
  const [editingSvName, setEditingSvName] = useState(!localStorage.getItem("ifms_supervisor_name"));
  const [batchDate, setBatchDate] = useState(() => new Date().toLocaleDateString("en-IN"));

  // Auto-import from URL hash on mount
  useEffect(() => {
    const hash = initialHash ?? window.location.hash;
    const match = hash.match(/#?share=([A-Za-z0-9+/=]+)/);
    if (match) {
      importFromCode(match[1], true);
      window.location.hash = "";
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function importFromCode(code: string, silent = false) {
    const p = decodeSharePayload(code.trim());
    if (!p) {
      if (!silent) setPasteError("❌ यह link/code सही नहीं है। पूरा link paste करें।");
      return;
    }
    const entry = addToRoster({
      name: p.n,
      dept: p.d,
      latestPct: p.s,
      bestPct: p.b,
      totalAttempts: p.a,
      date: p.t,
      catBest: p.c,
    });
    setRoster(loadRoster());
    if (!silent) {
      setPasteInput("");
      setPasteError("");
      setPasteSuccess(`✅ ${entry.name} का score जोड़ा गया!`);
      setTimeout(() => setPasteSuccess(""), 3000);
    }
  }

  function handlePaste() {
    setPasteError("");
    const raw = pasteInput.trim();
    if (!raw) { setPasteError("कुछ paste करें।"); return; }
    // Extract code from full URL or raw code
    const urlMatch = raw.match(/[?#&]?share=([A-Za-z0-9+/=]+)/);
    const code = urlMatch ? urlMatch[1] : raw;
    importFromCode(code);
  }

  function handleRemove(id: string) {
    removeFromRoster(id);
    setRoster(loadRoster());
    setRemoveId(null);
  }

  function handleClear() {
    clearRoster();
    setRoster([]);
    setConfirmClear(false);
  }

  function handleSaveSvName() {
    localStorage.setItem("ifms_supervisor_name", svNameInput.trim());
    setSupervisorName(svNameInput.trim());
    setEditingSvName(false);
  }

  // Sort by bestPct descending
  const ranked = [...roster].sort((a, b) => b.bestPct - a.bestPct);

  // Batch stats
  const avgBest = roster.length ? Math.round(roster.reduce((s, e) => s + e.bestPct, 0) / roster.length) : 0;
  const passing = roster.filter(e => e.bestPct >= 70).length;
  const needsWork = roster.filter(e => e.bestPct < 50).length;

  return (
    <div style={{ padding: "24px 20px" }}>

      {/* ── Supervisor Identity ── */}
      {editingSvName ? (
        <div style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", borderRadius: 14, padding: "18px 20px", marginBottom: 16, boxShadow: "0 4px 18px rgba(30,58,138,0.2)" }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", marginBottom: 4 }}>🧑‍💼 Supervisor / प्रशिक्षक का नाम</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>यह Leaderboard पर दिखेगा।</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={svNameInput}
              onChange={e => setSvNameInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSaveSvName()}
              placeholder="जैसे: श्री रामनाथ वर्मा, AEN"
              autoFocus
              style={{ flex: 1, padding: "10px 14px", borderRadius: 9, border: "none", fontSize: 13, fontFamily: "inherit", outline: "none" }}
            />
            <button onClick={handleSaveSvName} disabled={!svNameInput.trim()}
              style={{ padding: "10px 18px", background: svNameInput.trim() ? "#fff" : "rgba(255,255,255,0.3)", color: "#1d4ed8", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
              ✓ सेव
            </button>
          </div>
        </div>
      ) : (
        <div style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8 55%,#4f46e5)", borderRadius: 14, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>🧑‍💼</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>{supervisorName}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>Supervisor · IFMS Training Batch · {batchDate}</div>
          </div>
          <button onClick={() => setEditingSvName(true)}
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            ✏️ बदलें
          </button>
        </div>
      )}

      {/* ── Batch Summary ── */}
      {roster.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { label: "कुल स्टाफ", value: roster.length, icon: "👥", color: "#1d4ed8", bg: "#dbeafe" },
            { label: "औसत Score", value: `${avgBest}%`, icon: "📊", color: "#059669", bg: "#d1fae5" },
            { label: "उत्तीर्ण (≥70%)", value: passing, icon: "✅", color: "#15803d", bg: "#dcfce7" },
            { label: "सुधार जरूरी", value: needsWork, icon: "⚠️", color: "#92400e", bg: "#fef3c7" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "#64748b", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Import Share Link ── */}
      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>📥 Staff का Score जोड़ें</div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12 }}>Staff के "मेरी प्रगति" टैब से मिला Share Link यहाँ paste करें।</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={pasteInput}
            onChange={e => { setPasteInput(e.target.value); setPasteError(""); }}
            onKeyDown={e => e.key === "Enter" && handlePaste()}
            placeholder="Share link या code यहाँ paste करें…"
            style={{ flex: 1, padding: "10px 14px", borderRadius: 9, border: `1.5px solid ${pasteError ? "#f87171" : "#e2e8f0"}`, fontSize: 12, fontFamily: "inherit", outline: "none", color: "#1e293b" }}
          />
          <button onClick={handlePaste}
            style={{ padding: "10px 18px", background: "linear-gradient(135deg,#1e40af,#4f46e5)", color: "#fff", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
            + जोड़ें
          </button>
        </div>
        {pasteError && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 6 }}>{pasteError}</div>}
        {pasteSuccess && <div style={{ fontSize: 11, color: "#15803d", marginTop: 6, fontWeight: 700 }}>{pasteSuccess}</div>}
      </div>

      {/* ── Empty State ── */}
      {roster.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px 20px", background: "#f8fafc", borderRadius: 14, border: "1.5px dashed #cbd5e1" }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🏆</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>Leaderboard अभी खाली है</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Staff से Share Link माँगें और ऊपर paste करें।</div>
        </div>
      )}

      {/* ── Leaderboard ── */}
      {ranked.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#1e293b" }}>🏆 Leaderboard — Best Score के अनुसार</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => window.print()}
                style={{ padding: "7px 14px", background: "linear-gradient(135deg,#1e40af,#4f46e5)", color: "#fff", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                🖨️ Print
              </button>
              {!confirmClear ? (
                <button onClick={() => setConfirmClear(true)}
                  style={{ padding: "7px 14px", background: "#fff", color: "#ef4444", border: "1.5px solid #fecaca", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  🗑️ सब मिटाएँ
                </button>
              ) : (
                <>
                  <button onClick={handleClear} style={{ padding: "7px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>हाँ</button>
                  <button onClick={() => setConfirmClear(false)} style={{ padding: "7px 12px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>रद्द</button>
                </>
              )}
            </div>
          </div>

          {/* Top 3 podium */}
          {ranked.length >= 2 && (
            <div className="no-print" style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 14, alignItems: "flex-end" }}>
              {[ranked[1], ranked[0], ranked[2]].filter(Boolean).map((e, i) => {
                const actualRank = ranked.indexOf(e) + 1;
                const g = gradeOf(e.bestPct);
                const heights = [76, 96, 60];
                return (
                  <div key={e.id} style={{ flex: 1, maxWidth: 180, background: actualRank === 1 ? "linear-gradient(135deg,#fef9c3,#fde68a)" : "#f8fafc", border: `2px solid ${actualRank === 1 ? "#facc15" : "#e2e8f0"}`, borderRadius: 12, padding: "14px 10px", textAlign: "center", height: heights[i], display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
                    <Medal rank={actualRank} />
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#1e293b" }}>{e.name}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: g.color }}>{e.bestPct}%</div>
                    {e.dept && <div style={{ fontSize: 9, color: "#94a3b8" }}>{e.dept}</div>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Full list */}
          {ranked.map((e, idx) => {
            const g = gradeOf(e.bestPct);
            return (
              <div key={e.id} style={{ display: "flex", gap: 12, alignItems: "center", background: "#fff", border: `1.5px solid ${idx < 3 ? g.bg : "#e2e8f0"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 8, boxShadow: idx === 0 ? "0 2px 10px rgba(250,204,21,0.2)" : "none" }}>
                <div style={{ flexShrink: 0, width: 32, textAlign: "center" }}><Medal rank={idx + 1} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 900, color: "#1e293b" }}>{e.name}</span>
                    <span style={{ background: g.bg, color: g.color, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 6px" }}>{g.icon} {g.label}</span>
                  </div>
                  {e.dept && <div style={{ fontSize: 10, color: "#64748b" }}>{e.dept}</div>}
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    {Object.entries(e.catBest).map(([cat, pct]) => {
                      const cfg = CAT_CFG[cat];
                      if (!cfg) return null;
                      const col = pct >= 70 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
                      return (
                        <span key={cat} style={{ fontSize: 9, color: cfg.color, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 4, padding: "2px 6px", fontWeight: 700 }}>
                          {cfg.icon} {pct}%
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: g.color }}>{e.bestPct}%</div>
                  <div style={{ fontSize: 9, color: "#94a3b8" }}>{e.totalAttempts} प्रयास</div>
                  <div style={{ fontSize: 9, color: "#94a3b8" }}>{fmtDate(e.date)}</div>
                </div>
                {removeId === e.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                    <button onClick={() => handleRemove(e.id)} style={{ padding: "4px 8px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>हटाएँ</button>
                    <button onClick={() => setRemoveId(null)} style={{ padding: "4px 8px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 6, fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>रद्द</button>
                  </div>
                ) : (
                  <button onClick={() => setRemoveId(e.id)} style={{ background: "none", border: "none", color: "#cbd5e1", fontSize: 14, cursor: "pointer", padding: 4, flexShrink: 0 }} title="हटाएँ">✕</button>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* ── Printable Leaderboard ── */}
      <div className="print-only" style={{ fontFamily: "'Segoe UI','Noto Sans Devanagari',sans-serif" }}>
        <div style={{ textAlign: "center", borderBottom: "2px solid #1d4ed8", paddingBottom: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1 }}>GOVERNMENT OF RAJASTHAN · PWD</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#1e3a8a" }}>IFMS Training Leaderboard</div>
          <div style={{ fontSize: 12, color: "#475569" }}>प्रशिक्षण — Score सूची</div>
          {supervisorName && <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Supervisor: {supervisorName} · {batchDate}</div>}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ background: "#1e3a8a", color: "#fff" }}>
              <th style={{ padding: "7px 10px", textAlign: "center", width: 40 }}>रैंक</th>
              <th style={{ padding: "7px 10px", textAlign: "left" }}>नाम</th>
              <th style={{ padding: "7px 10px", textAlign: "left" }}>विभाग</th>
              <th style={{ padding: "7px 10px", textAlign: "center" }}>Best %</th>
              <th style={{ padding: "7px 10px", textAlign: "center" }}>Latest %</th>
              <th style={{ padding: "7px 10px", textAlign: "center" }}>प्रयास</th>
              <th style={{ padding: "7px 10px", textAlign: "center" }}>दर्जा</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((e, idx) => {
              const g = gradeOf(e.bestPct);
              return (
                <tr key={e.id} style={{ background: idx % 2 === 0 ? "#f8fafc" : "#fff", borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "7px 10px", textAlign: "center", fontWeight: 900 }}>{idx + 1}</td>
                  <td style={{ padding: "7px 10px", fontWeight: 800 }}>{e.name}</td>
                  <td style={{ padding: "7px 10px", color: "#64748b" }}>{e.dept || "—"}</td>
                  <td style={{ padding: "7px 10px", textAlign: "center", fontWeight: 900, color: g.color }}>{e.bestPct}%</td>
                  <td style={{ padding: "7px 10px", textAlign: "center" }}>{e.latestPct}%</td>
                  <td style={{ padding: "7px 10px", textAlign: "center" }}>{e.totalAttempts}</td>
                  <td style={{ padding: "7px 10px", textAlign: "center", color: g.color, fontWeight: 700 }}>{g.icon} {g.label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ marginTop: 16, display: "flex", gap: 24, fontSize: 10, color: "#64748b", borderTop: "1px solid #e2e8f0", paddingTop: 8 }}>
          <span>कुल स्टाफ: {roster.length}</span>
          <span>औसत Best Score: {avgBest}%</span>
          <span>उत्तीर्ण (≥70%): {passing}</span>
          <span>सुधार जरूरी (&lt;50%): {needsWork}</span>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 16, fontSize: 10, color: "#cbd5e1" }}>
        🔒 Roster केवल Supervisor के ब्राउज़र में सुरक्षित है
      </div>

      <style>{`
        @media print {
          body > * { display: none !important; }
          .print-only { display: block !important; }
          .no-print { display: none !important; }
        }
        .print-only { display: none; }
      `}</style>
    </div>
  );
}
