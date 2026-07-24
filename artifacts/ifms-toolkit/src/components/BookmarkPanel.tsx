import { useState } from "react";
import { useBookmarks, type Bookmark } from "@/context/BookmarkContext";

const SOURCE_CFG = {
  workflow: { label: "IFMS कार्यप्रवाह", icon: "📌", color: "#6366f1", bg: "#eef2ff" },
  wam:      { label: "WAM / विक्रेता",   icon: "📋", color: "#10b981", bg: "#ecfdf5" },
  print:    { label: "प्रिंट गाइड",      icon: "🖨️", color: "#f59e0b", bg: "#fffbeb" },
};

function NoteEditor({ bm }: { bm: Bookmark }) {
  const { updateNote } = useBookmarks();
  const [val, setVal] = useState(bm.note);
  const [editing, setEditing] = useState(false);

  function save() {
    updateNote(bm.id, val.trim());
    setEditing(false);
  }

  return editing ? (
    <div style={{ marginTop: 6 }}>
      <textarea
        autoFocus
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="यहाँ अपना नोट लिखें…"
        rows={2}
        style={{ width: "100%", padding: "6px 10px", borderRadius: 7, border: "1.5px solid #93c5fd", fontSize: 11, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box", color: "#1e293b" }}
      />
      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        <button onClick={save} style={{ padding: "4px 12px", background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✓ सेव</button>
        <button onClick={() => { setVal(bm.note); setEditing(false); }} style={{ padding: "4px 10px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>रद्द</button>
      </div>
    </div>
  ) : (
    <div
      onClick={() => setEditing(true)}
      style={{ marginTop: 6, padding: "5px 9px", background: bm.note ? "#f0f9ff" : "#f8fafc", border: `1.5px dashed ${bm.note ? "#93c5fd" : "#e2e8f0"}`, borderRadius: 7, cursor: "pointer", fontSize: 11, color: bm.note ? "#1e293b" : "#94a3b8", lineHeight: 1.5 }}
    >
      {bm.note || "✏️ नोट जोड़ें…"}
    </div>
  );
}

export default function BookmarkPanel() {
  const { bookmarks, remove, clearAll, setPanelOpen, panelOpen } = useBookmarks();
  const [confirmClear, setConfirmClear] = useState(false);
  const [filterSrc, setFilterSrc] = useState<"all" | "workflow" | "wam" | "print">("all");

  if (!panelOpen) return null;

  const filtered = filterSrc === "all" ? bookmarks : bookmarks.filter(b => b.source === filterSrc);
  const grouped: Record<string, Bookmark[]> = {};
  for (const b of filtered) {
    if (!grouped[b.source]) grouped[b.source] = [];
    grouped[b.source].push(b);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setPanelOpen(false)}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 500 }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "min(400px, 100vw)",
        background: "#fff", zIndex: 501, display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.18)", fontFamily: "inherit",
      }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", padding: "16px 18px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ fontSize: 22 }}>🔖</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>मेरे Bookmarks</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{bookmarks.length} सुरक्षित</div>
              </div>
            </div>
            <button onClick={() => setPanelOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: "50%", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>✕</button>
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {(["all", "workflow", "wam", "print"] as const).map(src => {
              const cfg = src === "all" ? { label: "सभी", icon: "📚" } : SOURCE_CFG[src];
              const count = src === "all" ? bookmarks.length : bookmarks.filter(b => b.source === src).length;
              return (
                <button key={src} onClick={() => setFilterSrc(src)} style={{ padding: "4px 10px", background: filterSrc === src ? "#fff" : "rgba(255,255,255,0.15)", color: filterSrc === src ? "#1d4ed8" : "rgba(255,255,255,0.8)", border: "none", borderRadius: 20, fontSize: 11, fontWeight: filterSrc === src ? 800 : 600, cursor: "pointer", fontFamily: "inherit" }}>
                  {cfg.icon} {cfg.label} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
          {bookmarks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🔖</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>कोई Bookmark नहीं</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>किसी भी step के 🔖 icon पर क्लिक करके save करें।</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>इस section में कोई bookmark नहीं।</div>
            </div>
          ) : (
            Object.entries(grouped).map(([src, bms]) => {
              const cfg = SOURCE_CFG[src as keyof typeof SOURCE_CFG];
              return (
                <div key={src} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, padding: "6px 10px", background: cfg.bg, borderRadius: 8 }}>
                    <span style={{ fontSize: 14 }}>{cfg.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: cfg.color }}>{cfg.label}</span>
                    <span style={{ fontSize: 10, color: cfg.color, marginLeft: "auto", background: cfg.color + "22", padding: "1px 8px", borderRadius: 10, fontWeight: 700 }}>{bms.length}</span>
                  </div>
                  {bms.map(bm => (
                    <div key={bm.id} style={{ background: "#f8fafc", border: `1.5px solid ${bm.color}33`, borderLeft: `4px solid ${bm.color}`, borderRadius: "0 10px 10px 0", padding: "10px 12px", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 18, flexShrink: 0 }}>{bm.icon}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#1e293b" }}>{bm.title}</div>
                            {bm.subtitle && <div style={{ fontSize: 10, color: "#64748b" }}>{bm.subtitle}</div>}
                          </div>
                        </div>
                        <button onClick={() => remove(bm.id)} style={{ background: "none", border: "none", color: "#cbd5e1", fontSize: 14, cursor: "pointer", padding: "2px 4px", flexShrink: 0 }} title="हटाएँ">✕</button>
                      </div>
                      <NoteEditor bm={bm} />
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {bookmarks.length > 0 && (
          <div style={{ borderTop: "1.5px solid #e2e8f0", padding: "10px 16px", flexShrink: 0, display: "flex", justifyContent: "flex-end", gap: 8 }}>
            {!confirmClear ? (
              <button onClick={() => setConfirmClear(true)} style={{ padding: "7px 14px", background: "#fff", color: "#ef4444", border: "1.5px solid #fecaca", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🗑️ सब मिटाएँ</button>
            ) : (
              <>
                <button onClick={() => { clearAll(); setConfirmClear(false); }} style={{ padding: "7px 14px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>हाँ, मिटाएँ</button>
                <button onClick={() => setConfirmClear(false)} style={{ padding: "7px 14px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>रद्द</button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
