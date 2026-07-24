import { useState, useRef } from "react";
import {
  loadAttempts,
  clearAttempts,
  loadName,
  saveName,
  loadDept,
  saveDept,
  encodeSharePayload,
  type QuizAttempt,
} from "@/hooks/useProgress";
import Certificate from "@/pages/Certificate";

const CAT_CFG: Record<string, { label: string; icon: string; color: string; bg: string; border: string }> = {
  all:      { label: "सभी श्रेणियाँ", icon: "📚", color: "#4f46e5", bg: "#eef2ff", border: "#c7d2fe" },
  workflow: { label: "कार्यप्रवाह",    icon: "📌", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
  ids:      { label: "ID लिंकेज",      icon: "🔗", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  wam:      { label: "WAM / विक्रेता", icon: "📋", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
  payment:  { label: "बिल / भुगतान",  icon: "💸", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
};

function gradeOf(pct: number) {
  if (pct >= 90) return { label: "उत्कृष्ट",     color: "#15803d", bg: "#dcfce7", icon: "🏆", en: "Excellent" };
  if (pct >= 70) return { label: "बहुत अच्छा",   color: "#1d4ed8", bg: "#dbeafe", icon: "🎉", en: "Very Good" };
  if (pct >= 50) return { label: "ठीक है",        color: "#92400e", bg: "#fef3c7", icon: "📖", en: "Fair" };
  return             { label: "सुधार जरूरी",     color: "#991b1b", bg: "#fee2e2", icon: "💪", en: "Needs Work" };
}

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("hi-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" });
}

function fmtPrint(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

function greeting(name: string): string {
  const hr = new Date().getHours();
  const salute = hr < 12 ? "सुप्रभात" : hr < 17 ? "नमस्कार" : "शुभ संध्या";
  return `${salute}, ${name} जी! 👋`;
}

function MiniBarChart({ attempts }: { attempts: QuizAttempt[] }) {
  const last = [...attempts].sort((a, b) => a.date.localeCompare(b.date)).slice(-12);
  if (last.length < 2) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 64 }}>
        {last.map((a, i) => {
          const h = Math.max(6, (a.pct / 100) * 52);
          const col = a.pct >= 70 ? "#22c55e" : a.pct >= 50 ? "#f59e0b" : "#ef4444";
          const isLast = i === last.length - 1;
          return (
            <div key={a.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, justifyContent: "flex-end", height: 64 }}>
              <div style={{ fontSize: 9, color: isLast ? "#1d4ed8" : "#94a3b8", fontWeight: isLast ? 800 : 400 }}>{a.pct}%</div>
              <div style={{ width: "100%", height: h, background: col, borderRadius: "3px 3px 0 0", opacity: isLast ? 1 : 0.55, boxShadow: isLast ? `0 0 0 2px ${col}44` : "none" }} />
            </div>
          );
        })}
      </div>
      <div style={{ borderTop: "1.5px solid #e2e8f0", marginTop: 2 }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 9, color: "#94a3b8" }}>← पुराना</span>
        <span style={{ fontSize: 9, color: "#94a3b8" }}>नया →</span>
      </div>
    </div>
  );
}

// ── Printable Score Card ─────────────────────────────────────────
function ScoreCard({ name, dept, attempts, catBest }: {
  name: string; dept: string;
  attempts: QuizAttempt[];
  catBest: Record<string, number>;
}) {
  const allAttempts = attempts.filter(a => a.category === "all");
  const best = allAttempts.length ? Math.max(...allAttempts.map(a => a.pct)) : null;
  const latest = allAttempts.length ? allAttempts[allAttempts.length - 1] : null;
  const grade = latest ? gradeOf(latest.pct) : null;

  return (
    <div id="score-card" style={{ background: "#fff", border: "2.5px solid #1d4ed8", borderRadius: 16, padding: "24px 28px", maxWidth: 480, margin: "0 auto", fontFamily: "'Segoe UI','Noto Sans Devanagari',sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, paddingBottom: 14, borderBottom: "2px solid #e2e8f0" }}>
        <div>
          <div style={{ fontSize: 9, color: "#64748b", letterSpacing: 1, marginBottom: 3 }}>GOVERNMENT OF RAJASTHAN · PWD</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#1e3a8a" }}>IFMS Training Score Card</div>
          <div style={{ fontSize: 12, color: "#374151" }}>IFMS प्रशिक्षण प्रमाण-पत्र</div>
        </div>
        <div style={{ fontSize: 32 }}>🏗️</div>
      </div>

      {/* Staff details */}
      <div style={{ background: "#f0f9ff", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div>
            <div style={{ fontSize: 9, color: "#64748b", marginBottom: 1 }}>कर्मचारी का नाम / Staff Name</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#1e293b" }}>{name || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#64748b", marginBottom: 1 }}>विभाग / Department</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{dept || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#64748b", marginBottom: 1 }}>दिनांक / Date</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>{latest ? fmtPrint(latest.date) : fmtPrint(new Date().toISOString())}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#64748b", marginBottom: 1 }}>कुल प्रयास / Attempts</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>{attempts.length}</div>
          </div>
        </div>
      </div>

      {/* Scores */}
      {grade && latest && (
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, background: grade.bg, border: `2px solid ${grade.color}44`, borderRadius: 10, padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>अंतिम Full Quiz</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: grade.color }}>{latest.pct}%</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: grade.color }}>{grade.icon} {grade.label}</div>
          </div>
          {best !== null && (
            <div style={{ flex: 1, background: "#dbeafe", border: "2px solid #93c5fd", borderRadius: 10, padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>सर्वश्रेष्ठ / Best</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#1d4ed8" }}>{best}%</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#1d4ed8" }}>🏆 Best Score</div>
            </div>
          )}
        </div>
      )}

      {/* Category breakdown */}
      {Object.keys(catBest).length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#475569", marginBottom: 8 }}>श्रेणीवार प्रदर्शन / Category Performance</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {Object.entries(catBest).map(([cat, pct]) => {
              const cfg = CAT_CFG[cat] ?? CAT_CFG.all;
              const col = pct >= 70 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
              return (
                <div key={cat} style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, borderRadius: 7, padding: "7px 9px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: cfg.color }}>{cfg.icon} {cfg.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: col }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ borderTop: "1.5px solid #e2e8f0", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 9, color: "#94a3b8" }}>IFMS Rajasthan · Staff Training Toolkit</div>
        <div style={{ fontSize: 9, color: "#94a3b8" }}>ifms.rajasthan.gov.in</div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function Progress({ onShareNavigate }: { onShareNavigate?: () => void }) {
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => loadAttempts());
  const [name, setName] = useState(() => loadName());
  const [dept, setDept] = useState(() => loadDept());
  const [editingName, setEditingName] = useState(!loadName());
  const [nameInput, setNameInput] = useState(() => loadName());
  const [deptInput, setDeptInput] = useState(() => loadDept());
  const [confirmClear, setConfirmClear] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  function handleSaveName() {
    if (!nameInput.trim()) return;
    saveName(nameInput);
    saveDept(deptInput);
    setName(nameInput.trim());
    setDept(deptInput.trim());
    setEditingName(false);
  }

  function handleClear() {
    clearAttempts();
    setAttempts([]);
    setConfirmClear(false);
    setShareLink("");
  }

  function handlePrint() {
    setShowCard(true);
    setTimeout(() => window.print(), 200);
  }

  function handleGenerateShare(catBest: Record<string, number>) {
    const allFullAttempts = attempts.filter(a => a.category === "all");
    const bestAll = allFullAttempts.length ? Math.max(...allFullAttempts.map(a => a.pct)) : 0;
    const allSorted = [...attempts].sort((a, b) => b.date.localeCompare(a.date));
    const latest = allSorted[0];
    const payload = {
      n: name,
      d: dept,
      s: latest?.pct ?? 0,
      b: bestAll,
      a: attempts.length,
      t: latest?.date ?? new Date().toISOString(),
      c: catBest,
    };
    const encoded = encodeSharePayload(payload);
    const url = `${window.location.origin}${window.location.pathname}#share=${encoded}`;
    setShareLink(url);
  }

  async function handleCopyLink() {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* fallback: select text */
    }
  }

  const allSorted = [...attempts].sort((a, b) => b.date.localeCompare(a.date));
  const allFullAttempts = attempts.filter(a => a.category === "all");
  const bestAll = allFullAttempts.length ? Math.max(...allFullAttempts.map(a => a.pct)) : null;
  const latest = allSorted[0] ?? null;
  const latestGrade = latest ? gradeOf(latest.pct) : null;

  const catBest: Record<string, number> = {};
  for (const a of attempts) {
    if (a.category === "all" && a.categoryBreakdown) {
      for (const [cat, v] of Object.entries(a.categoryBreakdown)) {
        const pct = v.total ? Math.round((v.correct / v.total) * 100) : 0;
        if (catBest[cat] === undefined || pct > catBest[cat]) catBest[cat] = pct;
      }
    }
    if (a.category !== "all") {
      if (catBest[a.category] === undefined || a.pct > catBest[a.category]) catBest[a.category] = a.pct;
    }
  }

  const weakAreas   = Object.entries(catBest).filter(([, p]) => p < 70).map(([c]) => c);
  const strongAreas = Object.entries(catBest).filter(([, p]) => p >= 70).map(([c]) => c);

  const certAttempt = allFullAttempts
    .filter(a => a.pct >= 70)
    .sort((a, b) => b.pct - a.pct)[0] ?? null;
  const certLocked = !certAttempt;

  return (
    <div style={{ padding: "24px 20px" }}>

      {/* ── Name Setup / Profile ── */}
      {editingName ? (
        <div style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", borderRadius: 16, padding: "20px 22px", marginBottom: 18, boxShadow: "0 6px 24px rgba(30,58,138,0.25)" }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", marginBottom: 4 }}>👤 अपना परिचय दर्ज करें</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginBottom: 14 }}>यह जानकारी केवल आपके ब्राउज़र में सुरक्षित रहती है।</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 4 }}>कर्मचारी का नाम *</label>
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSaveName()}
                placeholder="जैसे: राकेश शर्मा"
                autoFocus
                style={{ width: "100%", padding: "10px 14px", borderRadius: 9, border: "none", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 4 }}>विभाग / पदनाम (वैकल्पिक)</label>
              <input
                value={deptInput}
                onChange={e => setDeptInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSaveName()}
                placeholder="जैसे: AEN, PWD Jaipur"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 9, border: "none", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
              />
            </div>
            <button
              onClick={handleSaveName}
              disabled={!nameInput.trim()}
              style={{ padding: "11px", background: nameInput.trim() ? "#fff" : "rgba(255,255,255,0.3)", color: nameInput.trim() ? "#1d4ed8" : "rgba(255,255,255,0.5)", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 800, cursor: nameInput.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}
            >
              सुरक्षित करें ✓
            </button>
          </div>
        </div>
      ) : (
        <div style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8 55%,#4f46e5)", borderRadius: 16, padding: "16px 20px", marginBottom: 18, display: "flex", alignItems: "center", gap: 14, boxShadow: "0 4px 20px rgba(30,58,138,0.2)" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, border: "2px solid rgba(255,255,255,0.3)" }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>{greeting(name)}</div>
            {dept && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{dept}</div>}
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>कुल {attempts.length} प्रयास · {allFullAttempts.length} Full Quiz</div>
          </div>
          <button onClick={() => { setNameInput(name); setDeptInput(dept); setEditingName(true); }}
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            ✏️ बदलें
          </button>
        </div>
      )}

      {/* ── No attempts yet ── */}
      {!attempts.length && (
        <div style={{ textAlign: "center", padding: "32px 20px", background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>📊</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>अभी कोई प्रगति नहीं</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>स्व-परीक्षण क्विज़ दें — आपकी प्रगति यहाँ दिखेगी।</div>
        </div>
      )}

      {/* ── Stats ── */}
      {attempts.length > 0 && (
        <>
          {/* ── Certificate Banner ── */}
          {name && certAttempt && (
            <div style={{ background: "linear-gradient(135deg,#713f12,#92400e 40%,#b45309)", borderRadius: 16, padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14, boxShadow: "0 4px 20px rgba(113,63,18,0.3)" }}>
              <div style={{ fontSize: 40, flexShrink: 0 }}>🎓</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#fef3c7" }}>बधाई हो! Certificate के लिए योग्य!</div>
                <div style={{ fontSize: 11, color: "rgba(254,243,199,0.7)", marginTop: 2 }}>आपने Full Quiz में {certAttempt.pct}% score किया — Certificate download करें।</div>
              </div>
              <button
                onClick={() => setShowCert(true)}
                style={{ flexShrink: 0, padding: "10px 18px", background: "#fef3c7", color: "#92400e", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
              >
                🏆 Certificate देखें
              </button>
            </div>
          )}

          {/* Locked certificate hint */}
          {name && certLocked && attempts.length > 0 && (
            <div style={{ background: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: 14, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 28, flexShrink: 0, opacity: 0.5 }}>🔒</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#475569" }}>Certificate अभी locked है</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Full Quiz (सभी श्रेणियाँ) में 70% या अधिक score करें → Certificate unlock होगा।</div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#cbd5e1" }}>{bestAll !== null ? `${bestAll}%` : "—"}</div>
                <div style={{ fontSize: 9, color: "#94a3b8" }}>Best so far</div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, marginBottom: shareLink ? 10 : 16, flexWrap: "wrap" }}>
            {name && (
              <button onClick={handlePrint}
                style={{ flex: 1, minWidth: 120, padding: "10px 14px", background: "linear-gradient(135deg,#1e40af,#4f46e5)", color: "#fff", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                🖨️ Score Card प्रिंट करें
              </button>
            )}
            {name && (
              <button onClick={() => handleGenerateShare(catBest)}
                style={{ flex: 1, minWidth: 120, padding: "10px 14px", background: "linear-gradient(135deg,#059669,#10b981)", color: "#fff", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                📤 Supervisor को Share करें
              </button>
            )}
            {!confirmClear ? (
              <button onClick={() => setConfirmClear(true)}
                style={{ padding: "10px 14px", background: "#fff", color: "#ef4444", border: "1.5px solid #fecaca", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                🗑️ मिटाएँ
              </button>
            ) : (
              <>
                <button onClick={handleClear} style={{ padding: "10px 14px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>हाँ, मिटाएँ</button>
                <button onClick={() => setConfirmClear(false)} style={{ padding: "10px 14px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>रद्द करें</button>
              </>
            )}
          </div>

          {/* Share link panel */}
          {shareLink && (
            <div style={{ background: "#ecfdf5", border: "2px solid #86efac", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#14532d", marginBottom: 6 }}>✅ Share Link तैयार है!</div>
              <div style={{ fontSize: 10, color: "#166534", marginBottom: 8 }}>इस link को copy करके Supervisor को WhatsApp/Email पर भेजें। Supervisor "🏆 Supervisor" टैब में paste करेंगे।</div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, background: "#fff", border: "1.5px solid #86efac", borderRadius: 8, padding: "8px 12px", fontSize: 10, color: "#475569", wordBreak: "break-all", fontFamily: "monospace" }}>
                  {shareLink.length > 80 ? shareLink.slice(0, 80) + "…" : shareLink}
                </div>
                <button onClick={handleCopyLink}
                  style={{ flexShrink: 0, padding: "8px 16px", background: copied ? "#15803d" : "#059669", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}>
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>
              {onShareNavigate && (
                <button onClick={onShareNavigate}
                  style={{ marginTop: 8, width: "100%", padding: "8px", background: "none", border: "1.5px solid #86efac", color: "#15803d", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  🏆 Supervisor Leaderboard देखें →
                </button>
              )}
            </div>
          )}

          {/* Latest result */}
          {latestGrade && (
            <div style={{ background: latestGrade.bg, border: `2px solid ${latestGrade.color}44`, borderRadius: 14, padding: "16px 18px", marginBottom: 14, display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ fontSize: 36 }}>{latestGrade.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>अंतिम प्रयास · {fmt(latest.date)}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: latestGrade.color }}>{latest.pct}% <span style={{ fontSize: 13, fontWeight: 600 }}>({latest.score}/{latest.total})</span></div>
                <div style={{ fontSize: 12, fontWeight: 700, color: latestGrade.color }}>{latestGrade.label} · {latestGrade.en}</div>
              </div>
              {bestAll !== null && (
                <div style={{ textAlign: "center", background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "8px 14px" }}>
                  <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>सर्वश्रेष्ठ</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#1d4ed8" }}>{bestAll}%</div>
                </div>
              )}
            </div>
          )}

          {/* Trend chart */}
          {allFullAttempts.length > 1 && (
            <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", marginBottom: 4 }}>📊 Full Quiz — Score Trend</div>
              <MiniBarChart attempts={allFullAttempts} />
            </div>
          )}

          {/* Category performance */}
          {Object.keys(catBest).length > 0 && (
            <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", marginBottom: 12 }}>📋 श्रेणीवार सर्वश्रेष्ठ प्रदर्शन</div>
              {Object.entries(catBest).map(([cat, pct]) => {
                const cfg = CAT_CFG[cat] ?? CAT_CFG.all;
                const barColor = pct >= 70 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
                return (
                  <div key={cat} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{cfg.icon} {cfg.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 900, color: barColor }}>{pct}%</span>
                    </div>
                    <div style={{ height: 10, background: "#f1f5f9", borderRadius: 5, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 5 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Weak areas */}
          {weakAreas.length > 0 && (
            <div style={{ background: "#fffbeb", border: "2px solid #fde68a", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#92400e", marginBottom: 10 }}>⚠️ इन विषयों में और अभ्यास करें</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {weakAreas.map(cat => {
                  const cfg = CAT_CFG[cat] ?? CAT_CFG.all;
                  return (
                    <div key={cat} style={{ background: "#fff", border: `2px solid ${cfg.border}`, borderRadius: 10, padding: "8px 12px", display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 16 }}>{cfg.icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{cfg.label}</div>
                        <div style={{ fontSize: 10, color: "#92400e" }}>Best {catBest[cat]}% · लक्ष्य 70%</div>
                      </div>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", border: "3px solid #ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#ef4444" }}>{catBest[cat]}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strong areas */}
          {strongAreas.length > 0 && (
            <div style={{ background: "#ecfdf5", border: "2px solid #a7f3d0", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#14532d", marginBottom: 10 }}>✅ आप इन विषयों में निपुण हैं!</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {strongAreas.map(cat => {
                  const cfg = CAT_CFG[cat] ?? CAT_CFG.all;
                  return (
                    <div key={cat} style={{ background: "#fff", border: `2px solid ${cfg.border}`, borderRadius: 10, padding: "8px 12px", display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 16 }}>{cfg.icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{cfg.label}</div>
                        <div style={{ fontSize: 10, color: "#15803d" }}>Best {catBest[cat]}%</div>
                      </div>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", border: "3px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#15803d" }}>{catBest[cat]}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* History */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", marginBottom: 10 }}>🕐 प्रयासों का इतिहास</div>
            {allSorted.map((a, i) => {
              const cfg = CAT_CFG[a.category] ?? CAT_CFG.all;
              const g = gradeOf(a.pct);
              return (
                <div key={a.id} style={{ display: "flex", gap: 12, alignItems: "center", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "11px 14px", marginBottom: 7 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: i === 0 ? "#1d4ed8" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>
                    {allSorted.length - i}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 5, marginBottom: 2, flexWrap: "wrap" }}>
                      <span style={{ background: cfg.bg, color: cfg.color, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 6px" }}>{cfg.icon} {cfg.label}</span>
                      <span style={{ background: g.bg, color: g.color, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 6px" }}>{g.icon} {g.label}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fmt(a.date)}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 17, fontWeight: 900, color: g.color }}>{a.pct}%</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>{a.score}/{a.total}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Printable Score Card (hidden until print) ── */}
      {showCard && (
        <div className="print-only" ref={cardRef} style={{ marginTop: 24 }}>
          <ScoreCard name={name} dept={dept} attempts={attempts} catBest={catBest} />
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 16, fontSize: 10, color: "#cbd5e1" }}>
        🔒 डेटा केवल इस ब्राउज़र में सुरक्षित है · Data stored locally in your browser
      </div>

      <style>{`
        @media print {
          body > * { display: none !important; }
          .print-only { display: block !important; }
          #score-card { border: 2.5px solid #1d4ed8 !important; }
        }
        .print-only { display: none; }
      `}</style>

      {/* ── Certificate Modal ── */}
      {showCert && certAttempt && (
        <Certificate
          name={name}
          dept={dept}
          score={certAttempt.score}
          total={certAttempt.total}
          date={certAttempt.date}
          onClose={() => setShowCert(false)}
        />
      )}
    </div>
  );
}
