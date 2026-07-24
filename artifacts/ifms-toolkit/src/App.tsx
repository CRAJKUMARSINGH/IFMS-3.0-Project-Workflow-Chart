import { useState, useEffect } from "react";
import WorkflowChart from "@/pages/WorkflowChart";
import WAMGuide from "@/pages/WAMGuide";
import PrintGuide from "@/pages/PrintGuide";
import IDLookup from "@/pages/IDLookup";
import Quiz from "@/pages/Quiz";
import Progress from "@/pages/Progress";
import SupervisorView from "@/pages/SupervisorView";
import BookmarkPanel from "@/components/BookmarkPanel";
import { BookmarkProvider, useBookmarks } from "@/context/BookmarkContext";
import { loadName } from "@/hooks/useProgress";

/* ── Marquee animation injected once ── */
const marqueeStyle = `
@keyframes ifms-marquee {
  0%   { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
@keyframes ifms-pulse-glow {
  0%, 100% { text-shadow: 0 0 8px rgba(255,215,0,0.6), 0 0 20px rgba(255,165,0,0.3); }
  50%       { text-shadow: 0 0 16px rgba(255,215,0,1),   0 0 40px rgba(255,165,0,0.7); }
}
@keyframes ifms-shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
`;
if (typeof document !== "undefined") {
  const s = document.createElement("style");
  s.textContent = marqueeStyle;
  document.head.appendChild(s);
}

const tabs = [
  { id: "chart",      icon: "📌", label: "IFMS कार्यप्रवाह" },
  { id: "wam",        icon: "📋", label: "WAM / विक्रेता" },
  { id: "print",      icon: "🖨️", label: "प्रिंट गाइड" },
  { id: "lookup",     icon: "🔍", label: "ID खोज" },
  { id: "quiz",       icon: "🎓", label: "स्व-परीक्षण" },
  { id: "progress",   icon: "📈", label: "मेरी प्रगति" },
  { id: "supervisor", icon: "🏆", label: "Supervisor" },
] as const;

type Tab = typeof tabs[number]["id"];

function FloatingBookmarkButton() {
  const { bookmarks, setPanelOpen } = useBookmarks();
  return (
    <button
      onClick={() => setPanelOpen(true)}
      title="Bookmarks खोलें"
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 400,
        width: 52, height: 52, borderRadius: "50%",
        background: "linear-gradient(135deg,#1e40af,#4f46e5)",
        border: "none", boxShadow: "0 4px 20px rgba(30,64,175,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, cursor: "pointer", transition: "transform 0.15s",
        fontFamily: "inherit",
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
    >
      🔖
      {bookmarks.length > 0 && (
        <span style={{
          position: "absolute", top: -2, right: -2,
          background: "#ef4444", color: "#fff",
          fontSize: 10, fontWeight: 900, borderRadius: 10,
          padding: "1px 5px", minWidth: 18, textAlign: "center",
          border: "2px solid #fff", lineHeight: 1.4,
        }}>
          {bookmarks.length}
        </span>
      )}
    </button>
  );
}

function AppInner() {
  const [active, setActive] = useState<Tab>(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("share=")) {
      return "supervisor";
    }
    return "chart";
  });
  const [initialHash] = useState(() =>
    typeof window !== "undefined" ? window.location.hash : ""
  );
  const staffName = loadName();

  useEffect(() => {
    if (initialHash.includes("share=")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [initialHash]);

  return (
    <div style={{ fontFamily: "'Segoe UI','Noto Sans Devanagari',sans-serif", minHeight: "100vh", background: "#f1f5f9" }}>

      {/* ── Festive Ticker Bar ── */}
      <div style={{
        background: "linear-gradient(90deg,#7c3aed,#1d4ed8,#0891b2,#059669,#d97706,#dc2626,#7c3aed)",
        backgroundSize: "300% 100%",
        animation: "ifms-shimmer 6s linear infinite",
        overflow: "hidden", height: 32, display: "flex", alignItems: "center",
      }}>
        <div style={{
          whiteSpace: "nowrap",
          animation: "ifms-marquee 28s linear infinite",
          fontSize: 13, fontWeight: 700, color: "#fff",
          letterSpacing: 0.5,
        }}>
          🪔&nbsp; IFMS 3.0 Rajasthan &nbsp;✦&nbsp; Integrated Financial Management System &nbsp;✦&nbsp;
          राजस्थान सरकार — वित्त विभाग &nbsp;✦&nbsp; PWD / Works Department &nbsp;✦&nbsp;
          मंत्रालयी स्टाफ प्रशिक्षण &nbsp;✦&nbsp; Staff Training Toolkit &nbsp;✦&nbsp;
          🌸&nbsp; जय राजस्थान &nbsp;🌸&nbsp; Jai Rajasthan &nbsp;🪔
        </div>
      </div>

      {/* ── Top Header ── */}
      <div style={{
        background: "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 55%,#4f46e5 100%)",
        color: "#fff", padding: "14px 24px 0",
        boxShadow: "0 4px 20px rgba(30,58,138,0.3)",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Emblem */}
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, flexShrink: 0,
                boxShadow: "0 0 16px rgba(255,215,0,0.3)",
              }}>🏛️</div>
              <div>
                <h1 style={{
                  margin: 0, fontSize: 19, fontWeight: 900, letterSpacing: 0.4,
                  background: "linear-gradient(90deg,#fff 60%,#fde68a)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  IFMS Rajasthan — मंत्रालयी स्टाफ मार्गदर्शिका
                </h1>
                <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.75, letterSpacing: 0.2 }}>
                  🏗️ Integrated Financial Management System &nbsp;·&nbsp; Staff Training Toolkit &nbsp;·&nbsp; v3.0
                </p>
              </div>
            </div>
            {staffName && (
              <button
                onClick={() => setActive("progress")}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  borderRadius: 24, padding: "6px 12px 6px 8px",
                  display: "flex", alignItems: "center", gap: 8,
                  cursor: "pointer", flexShrink: 0, fontFamily: "inherit",
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900, color: "#fff",
                }}>
                  {staffName.charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>{staffName}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", lineHeight: 1.1 }}>📈 प्रगति देखें</div>
                </div>
              </button>
            )}
          </div>
          {/* Tab bar */}
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                style={{
                  padding: "9px 16px",
                  border: "none",
                  borderRadius: "8px 8px 0 0",
                  background: active === t.id
                    ? t.id === "supervisor" ? "#fef9c3" : "#fff"
                    : t.id === "supervisor" ? "rgba(254,249,195,0.15)" : "rgba(255,255,255,0.12)",
                  color: active === t.id
                    ? t.id === "supervisor" ? "#92400e" : "#1d4ed8"
                    : t.id === "supervisor" ? "#fef08a" : "rgba(255,255,255,0.85)",
                  fontWeight: active === t.id ? 800 : 600,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "inherit",
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Page Content ── */}
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {active === "chart"      && <WorkflowChart />}
        {active === "wam"        && <WAMGuide />}
        {active === "print"      && <PrintGuide />}
        {active === "lookup"     && <IDLookup />}
        {active === "quiz"       && <Quiz />}
        {active === "progress"   && <Progress onShareNavigate={() => setActive("supervisor")} />}
        {active === "supervisor" && <SupervisorView initialHash={initialHash} />}
      </div>

      {/* ── Floating Bookmark Button ── */}
      <FloatingBookmarkButton />

      {/* ── Bookmark Panel ── */}
      <BookmarkPanel />

      {/* ══════════════════════════════════════════════
          ── Credits Footer ──
      ══════════════════════════════════════════════ */}
      <footer style={{
        marginTop: 48,
        background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#312e81 100%)",
        color: "#e2e8f0",
        fontFamily: "'Segoe UI','Noto Sans Devanagari',sans-serif",
      }}>
        {/* Decorative top border */}
        <div style={{
          height: 4,
          background: "linear-gradient(90deg,#f59e0b,#ef4444,#8b5cf6,#3b82f6,#10b981,#f59e0b)",
          backgroundSize: "200% 100%",
          animation: "ifms-shimmer 4s linear infinite",
        }} />

        {/* Main credits content */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px 24px" }}>

          {/* Top row — logo + tagline */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🏛️ 🌸 🪔</div>
            <h2 style={{
              margin: "0 0 6px",
              fontSize: 20, fontWeight: 900, letterSpacing: 0.5,
              background: "linear-gradient(90deg,#fde68a,#fff,#fde68a)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              IFMS 3.0 — Rajasthan Government
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", letterSpacing: 0.3 }}>
              Integrated Financial Management System &nbsp;·&nbsp; मंत्रालयी स्टाफ प्रशिक्षण पोर्टल
            </p>
          </div>

          {/* Three-column info grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20, marginBottom: 28,
          }}>
            {/* Column 1 — Project */}
            <div style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "16px 18px",
            }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>📌</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fde68a", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Project</div>
              <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.7 }}>
                IFMS 3.0 Workflow Chart<br />
                PWD / Works Department<br />
                Rajasthan Government<br />
                <span style={{ color: "#86efac" }}>वित्त विभाग, राजस्थान</span>
              </div>
            </div>

            {/* Column 2 — Developer */}
            <div style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "16px 18px",
            }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>👩‍💼</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fde68a", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>An Initiative By</div>
              <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.7 }}>
                <strong style={{ color: "#fff", fontSize: 14 }}>Premlata Jain</strong><br />
                AAO<br />
                PWD Rajasthan<br />
              </div>
            </div>

            {/* Column 3 — Tech Stack */}
            <div style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "16px 18px",
            }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>⚙️</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fde68a", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Tech Stack</div>
              <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.7 }}>
                React 18 + TypeScript<br />
                Vite · Tailwind CSS<br />
                Deployed on <span style={{ color: "#86efac" }}>Netlify</span><br />
                <span style={{ color: "#c4b5fd" }}>Open Source · MIT License</span>
              </div>
            </div>
          </div>

          {/* Related tools row */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12, padding: "14px 18px",
            marginBottom: 24,
            display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12,
          }}>
            <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 700 }}>🔗 Related Tools:</span>
            <a
              href="https://hindibillnote.netlify.app/"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                color: "#fff", textDecoration: "none",
                padding: "6px 14px", borderRadius: 20,
                fontSize: 12, fontWeight: 700,
                boxShadow: "0 2px 10px rgba(124,58,237,0.4)",
                transition: "opacity 0.15s",
              }}
            >
              🪔 Hindi Bill Note Sheet Generator
            </a>
            <a
              href="https://github.com/CRAJKUMARSINGH/IFMS-3.0-Project-Workflow-Chart"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#e2e8f0", textDecoration: "none",
                padding: "6px 14px", borderRadius: 20,
                fontSize: 12, fontWeight: 700,
              }}
            >
              ⭐ GitHub Repository
            </a>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 16,
            display: "flex", flexWrap: "wrap",
            alignItems: "center", justifyContent: "space-between",
            gap: 10,
          }}>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              © 2025 Premlata Jain · IFMS Rajasthan Toolkit · All rights reserved
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ animation: "ifms-pulse-glow 2s ease-in-out infinite" }}>🌸</span>
              <span>जय राजस्थान &nbsp;·&nbsp; Jai Rajasthan</span>
              <span style={{ animation: "ifms-pulse-glow 2s ease-in-out infinite" }}>🪔</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BookmarkProvider>
      <AppInner />
    </BookmarkProvider>
  );
}