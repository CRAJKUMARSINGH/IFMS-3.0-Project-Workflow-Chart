import { useState } from "react";
import { useBookmarks } from "@/context/BookmarkContext";

const vendorNew = [
  { id: "V1", icon: "📝", title: "विक्रेता विवरण भरें", desc: "नाम, पता, PAN नंबर, GST नंबर, बैंक खाता विवरण (IFSC, खाता संख्या) भरे जाते हैं।", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  { id: "V2", icon: "🏦", title: "बैंक खाता सत्यापन", desc: "PFMS/बैंक के माध्यम से बैंक खाते की प्रामाणिकता की जाँच की जाती है।", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  { id: "V3", icon: "✅", title: "Vendor ID उत्पन्न", desc: "सत्यापन के बाद IFMS में विक्रेता को एक अद्वितीय Vendor ID प्रदान की जाती है।", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", tag: "Vendor ID" },
];

const wamSteps = [
  { id: "W1", icon: "📋", title: "WAM में कार्यादेश प्रविष्टि", desc: "WAM में Work Order संख्या, कार्य का नाम, ठेकेदार का नाम, अनुबंध राशि दर्ज किए जाते हैं।", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd", fields: ["Work Order संख्या", "कार्य का नाम", "ठेकेदार का नाम", "अनुबंध राशि"] },
  { id: "W2", icon: "🔗", title: "ID लिंकेज", desc: "Work Order को AS, FS, TS और BOQ से IFMS में स्वचालित रूप से जोड़ा जाता है।", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", fields: ["AS ID", "FS ID", "TS ID", "BOQ ID", "WO ID"] },
  { id: "W3", icon: "📦", title: "पैकेज ID लिंकेज", desc: "यदि एक बोली में अनेक कार्यों का पैकेज है तो प्रत्येक कार्य की AS/FS/TS/BOQ ID को उस Work Order से अलग-अलग लिंक किया जाता है।", color: "#ef4444", bg: "#fef2f2", border: "#fecaca", fields: ["कार्य 1 की IDs", "कार्य 2 की IDs", "कार्य 3 की IDs"] },
];

const billSteps = [
  { id: "B1", icon: "📏", title: "माप पुस्तिका (MB)", desc: "अभियंता द्वारा कार्य स्थल पर माप लेकर MB में दर्ज किया जाता है।", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
  { id: "B2", icon: "🧾", title: "बिल तैयार करना (RAB/Final)", desc: "BOQ की दरों के अनुसार माप के आधार पर Running Account Bill या Final Bill तैयार किया जाता है।", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  { id: "B3", icon: "🔎", title: "बिल जाँच एवं पास", desc: "SDO/EE स्तर पर बिल की तकनीकी एवं वित्तीय जाँच होती है और IFMS में पास किया जाता है।", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  { id: "B4", icon: "💸", title: "DBT भुगतान", desc: "IFMS/PFMS के माध्यम से भुगतान सीधे विक्रेता के बैंक खाते में DBT (Direct Benefit Transfer) से होता है।", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
];

type StepData = {
  id: string; icon: string; title: string; desc: string;
  color: string; bg: string; border: string;
  tag?: string; fields?: string[];
};

function MiniStep({ step, last = false }: { step: StepData; last?: boolean }) {
  const [open, setOpen] = useState(false);
  const { isBookmarked, toggle } = useBookmarks();
  const key = `wam-${step.id}`;
  const saved = isBookmarked(key);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 6 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 12, minWidth: 38 }}>
        <div onClick={() => setOpen(!open)} style={{ width: 38, height: 38, borderRadius: "50%", background: open ? step.color : "#fff", border: `2.5px solid ${step.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, cursor: "pointer", transition: "all 0.2s" }}>{step.icon}</div>
        {!last && <div style={{ width: 2, minHeight: 16, background: step.color, opacity: 0.25, margin: "2px 0" }} />}
      </div>
      <div onClick={() => setOpen(!open)} style={{ flex: 1, background: open ? step.bg : "#fff", border: `1.5px solid ${open ? step.color : step.border}`, borderRadius: 10, padding: "9px 12px", cursor: "pointer", transition: "all 0.2s", marginBottom: 3 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 5, marginBottom: 2, flexWrap: "wrap" }}>
              <span style={{ background: step.color, color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 5px" }}>{step.id}</span>
              {"tag" in step && step.tag && <span style={{ background: step.color + "18", color: step.color, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 5px", border: `1px solid ${step.color}44` }}>🔑 {step.tag}</span>}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{step.title}</div>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
            <button
              onClick={e => { e.stopPropagation(); toggle({ source: "wam", itemKey: key, icon: step.icon, title: step.title, subtitle: step.id, color: step.color }); }}
              title={saved ? "Bookmark हटाएँ" : "Bookmark करें"}
              style={{ background: saved ? step.color + "22" : "none", border: `1px solid ${saved ? step.color : "#e2e8f0"}`, borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}
            >
              🔖
            </button>
            <span style={{ fontSize: 12, color: step.color, opacity: 0.5 }}>{open ? "▲" : "▼"}</span>
          </div>
        </div>
        {open && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px dashed ${step.color}44` }}>
            <p style={{ margin: "0 0 6px", fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{step.desc}</p>
            {"fields" in step && step.fields && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {step.fields.map(f => <span key={f} style={{ background: step.color + "18", color: step.color, fontSize: 10, fontWeight: 600, borderRadius: 5, padding: "2px 7px", border: `1px solid ${step.color}33` }}>{f}</span>)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHead({ icon, title, sub, color }: { icon: string; title: string; sub: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0 12px", padding: "10px 14px", background: color + "12", borderRadius: 10, border: `1.5px solid ${color}33` }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color }}>{title}</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>{sub}</div>
      </div>
    </div>
  );
}

export default function WAMGuide() {
  const [vendorExists, setVendorExists] = useState<boolean | null>(null);

  return (
    <div style={{ padding: "24px 20px" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", marginBottom: 4, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800, color: "#1e293b" }}>🏗️ WAM प्रविष्टि, विक्रेता पंजीकरण एवं बिल भुगतान</h2>
        <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>यह प्रक्रिया IFMS चार्ट के चरण 9 (Work Order) के बाद प्रारंभ होती है &nbsp;·&nbsp; 🔖 से Bookmark करें</p>
      </div>

      {/* Section A: Vendor */}
      <SectionHead icon="👤" title="चरण क — विक्रेता पंजीकरण" sub="Vendor Registration in IFMS" color="#6366f1" />

      {/* Vendor Check */}
      <div style={{ background: "#eef2ff", border: "2px solid #6366f1", borderRadius: 12, padding: "14px 16px", marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
          <span style={{ background: "#6366f1", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 5px" }}>V1</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>🔍 विक्रेता की जाँच करें</span>
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#374151" }}>प्रथम बिल से पहले जाँचें — क्या विक्रेता IFMS डेटाबेस में पहले से है?</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setVendorExists(true)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "2px solid #10b981", background: vendorExists === true ? "#10b981" : "#fff", color: vendorExists === true ? "#fff" : "#10b981", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            ✅ हाँ, पहले से है
          </button>
          <button onClick={() => setVendorExists(false)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "2px solid #ef4444", background: vendorExists === false ? "#ef4444" : "#fff", color: vendorExists === false ? "#fff" : "#ef4444", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            ❌ नहीं, नया जोड़ना है
          </button>
        </div>
      </div>

      {vendorExists === false && (
        <div style={{ marginLeft: 48, borderLeft: "3px dashed #ef4444", paddingLeft: 16, marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>🔴 नया विक्रेता — निम्न चरण पूरे करें:</div>
          {vendorNew.map((s, i) => <MiniStep key={s.id} step={s} last={i === vendorNew.length - 1} />)}
        </div>
      )}
      {vendorExists === true && (
        <div style={{ marginLeft: 48, background: "#ecfdf5", border: "2px solid #10b981", borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: "#065f46" }}>
          ✅ <strong>विक्रेता पहले से पंजीकृत</strong> — सीधे WAM प्रविष्टि पर जाएँ।
        </div>
      )}
      {vendorExists === null && (
        <div style={{ marginLeft: 48, background: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
          ऊपर विकल्प चुनें
        </div>
      )}

      {/* Section B: WAM */}
      <SectionHead icon="📋" title="चरण ख — WAM में कार्यादेश प्रविष्टि" sub="Work Order Entry & ID Linkage" color="#0ea5e9" />
      {wamSteps.map((s, i) => <MiniStep key={s.id} step={s} last={i === wamSteps.length - 1} />)}

      {/* Package Box */}
      <div style={{ background: "linear-gradient(135deg,#1e293b,#334155)", borderRadius: 12, padding: "14px 18px", margin: "10px 0" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 10 }}>📦 पैकेज बोली में एकाधिक कार्य — ID लिंकेज</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["कार्य 1", "कार्य 2", "कार्य 3"].map((w, i) => (
            <div key={i} style={{ flex: 1, minWidth: 140, background: "rgba(255,255,255,0.07)", borderRadius: 8, padding: "10px 10px", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#7dd3fc", marginBottom: 5 }}>{w}</div>
              {["AS ID", "FS ID", "TS ID", "BOQ ID"].map(id => <div key={id} style={{ fontSize: 10, color: "#94a3b8", padding: "1px 0" }}>↳ {id}</div>)}
              <div style={{ marginTop: 5, fontSize: 10, color: "#fbbf24", fontWeight: 600 }}>↓ WO ID (साझा)</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
          ⚠️ एक पैकेज बोली में सभी कार्यों का एक साझा Work Order होता है परन्तु प्रत्येक कार्य की IDs अलग-अलग उस WO से लिंक की जाती हैं।
        </div>
      </div>

      {/* Section C: Bill */}
      <SectionHead icon="💳" title="चरण ग — बिल एवं भुगतान" sub="Bill Preparation & Payment" color="#10b981" />
      {billSteps.map((s, i) => <MiniStep key={s.id} step={s} last={i === billSteps.length - 1} />)}

      {/* Footer */}
      <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)", borderRadius: 12, padding: "14px 18px", marginTop: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 8, textAlign: "center" }}>🔗 IFMS में सम्पूर्ण ID शृंखला</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          {[{ label: "AS ID", color: "#0ea5e9" }, { label: "FS ID", color: "#10b981" }, { label: "TS ID", color: "#ef4444" }, { label: "BOQ ID", color: "#f59e0b" }, { label: "WO ID", color: "#6366f1" }, { label: "Vendor ID", color: "#8b5cf6" }, { label: "Bill ID", color: "#0ea5e9" }].map((item, i, arr) => (
            <span key={item.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ background: item.color + "28", color: item.color, border: `1.5px solid ${item.color}`, borderRadius: 6, padding: "3px 9px", fontSize: 10, fontWeight: 700 }}>{item.label}</span>
              {i < arr.length - 1 && <span style={{ color: "#475569", fontSize: 12 }}>→</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
