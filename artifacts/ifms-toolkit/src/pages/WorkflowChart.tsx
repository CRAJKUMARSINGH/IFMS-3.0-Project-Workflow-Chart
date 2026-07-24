import { useState } from "react";
import { useBookmarks } from "@/context/BookmarkContext";

const steps = [
  { id: 1, icon: "💡", title: "नए काम की कल्पना", subtitle: "Work Conception", desc: "अभियंता / राजनीतिक नेता / जनता की माँग से नए कार्य का प्रस्ताव उत्पन्न होता है।", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", tag: null },
  { id: 2, icon: "📐", title: "प्रारंभिक आकलन", subtitle: "Preliminary Estimate", desc: "अभियंता द्वारा कार्य की प्रारंभिक लागत का अनुमान तैयार किया जाता है।", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", tag: null },
  { id: 3, icon: "🏛️", title: "प्रशासनिक स्वीकृति (AS)", subtitle: "Administrative Sanction", desc: "सरकार / सक्षम प्राधिकारी द्वारा कार्य को प्रशासनिक मंजूरी दी जाती है।", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd", tag: "AS ID" },
  { id: 4, icon: "💰", title: "वित्तीय स्वीकृति (FS)", subtitle: "Financial Sanction", desc: "सरकार द्वारा बजट से धनराशि आवंटित की जाती है और वित्तीय स्वीकृति जारी होती है।", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", tag: "FS ID" },
  { id: 5, icon: "📋", title: "विस्तृत आकलन", subtitle: "Detail Estimate + BOQ", desc: "कार्य का विस्तृत इंजीनियरिंग आकलन एवं BOQ (Bill of Quantities) तैयार होता है।", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", tag: "BOQ ID" },
  { id: 6, icon: "✅", title: "तकनीकी स्वीकृति (TS)", subtitle: "Technical Sanction", desc: "विस्तृत आकलन की तकनीकी जाँच एवं सक्षम अभियंता द्वारा स्वीकृति प्रदान की जाती है।", color: "#ef4444", bg: "#fef2f2", border: "#fecaca", tag: "TS ID" },
  { id: 7, icon: "📢", title: "बोली आमंत्रण", subtitle: "Bid Invitation (Tender)", desc: "BOQ के आधार पर ठेकेदारों से बोलियाँ (Tenders) आमंत्रित की जाती हैं। पैकेज में एक से अधिक कार्य हो सकते हैं।", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", tag: null },
  { id: 8, icon: "📊", title: "बोली स्वीकृति", subtitle: "Bid Acceptance", desc: "उचित बोली का मूल्यांकन कर सबसे योग्य बोलीकर्ता की बोली स्वीकार की जाती है।", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", tag: null },
  { id: 9, icon: "📄", title: "कार्यादेश जारी (Work Order)", subtitle: "Work Order Issued", desc: "ठेकेदार को कार्यादेश जारी किया जाता है। यह AS, FS, TS और BOQ से स्वतः जुड़ा होता है।", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd", tag: "WO ID" },
  { id: 10, icon: "👤", title: "विक्रेता पंजीकरण + WAM", subtitle: "Vendor Registration & WAM Entry", desc: "प्रथम बिल के समय यदि विक्रेता डेटाबेस में नहीं है तो उसे पहले जोड़ा जाता है। फिर WAM में Work Order जोड़ा जाता है।", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", tag: null },
  { id: 11, icon: "💳", title: "बिल प्रस्तुति एवं भुगतान", subtitle: "Bill & Payment via PFMS", desc: "ठेकेदार कार्य की माप के आधार पर बिल प्रस्तुत करता है। PFMS द्वारा सीधे बैंक खाते में DBT भुगतान होता है।", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", tag: null },
];

const linkIds = [
  { label: "AS ID", full: "Administrative Sanction", color: "#0ea5e9", bg: "#f0f9ff" },
  { label: "FS ID", full: "Financial Sanction", color: "#10b981", bg: "#ecfdf5" },
  { label: "TS ID", full: "Technical Sanction", color: "#ef4444", bg: "#fef2f2" },
  { label: "BOQ ID", full: "Bill of Quantities", color: "#f59e0b", bg: "#fffbeb" },
  { label: "WO ID", full: "Work Order", color: "#6366f1", bg: "#eef2ff" },
];

export default function WorkflowChart() {
  const [active, setActive] = useState<number | null>(null);
  const { isBookmarked, toggle } = useBookmarks();

  return (
    <div style={{ padding: "24px 20px" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800, color: "#1e293b" }}>📌 नए कार्य से भुगतान तक — सम्पूर्ण प्रक्रिया</h2>
        <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>किसी भी चरण पर क्लिक करें — विस्तृत जानकारी दिखाई देगी &nbsp;·&nbsp; 🔖 से Bookmark करें</p>
      </div>

      {steps.map((step, idx) => {
        const key = `workflow-${step.id}`;
        const saved = isBookmarked(key);
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "flex-start", marginBottom: 6 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 14, minWidth: 44 }}>
              <div
                onClick={() => setActive(active === step.id ? null : step.id)}
                style={{ width: 44, height: 44, borderRadius: "50%", background: active === step.id ? step.color : "#fff", border: `3px solid ${step.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer", boxShadow: active === step.id ? `0 4px 16px ${step.color}55` : "0 2px 8px rgba(0,0,0,0.08)", transition: "all 0.2s" }}
              >
                {step.icon}
              </div>
              {idx < steps.length - 1 && <div style={{ width: 3, flex: 1, minHeight: 20, background: `linear-gradient(${step.color},${steps[idx + 1].color})`, opacity: 0.3, margin: "2px 0" }} />}
            </div>
            <div
              onClick={() => setActive(active === step.id ? null : step.id)}
              style={{ flex: 1, background: active === step.id ? step.bg : "#fff", border: `2px solid ${active === step.id ? step.color : step.border}`, borderRadius: 14, padding: "13px 16px", cursor: "pointer", boxShadow: active === step.id ? `0 4px 20px ${step.color}22` : "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.2s", marginBottom: 4 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ background: step.color, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "1px 7px" }}>चरण {step.id}</span>
                    {step.tag && <span style={{ background: step.color + "20", color: step.color, fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "1px 7px", border: `1px solid ${step.color}44` }}>🔑 {step.tag} उत्पन्न</span>}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{step.title}</div>
                  <div style={{ fontSize: 11, color: "#64748b", fontStyle: "italic" }}>{step.subtitle}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={e => { e.stopPropagation(); toggle({ source: "workflow", itemKey: key, icon: step.icon, title: step.title, subtitle: step.subtitle, color: step.color }); }}
                    title={saved ? "Bookmark हटाएँ" : "Bookmark करें"}
                    style={{ background: saved ? step.color + "22" : "none", border: `1.5px solid ${saved ? step.color : "#e2e8f0"}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}
                  >
                    {saved ? "🔖" : "🔖"}
                  </button>
                  <div style={{ color: step.color, opacity: 0.5, fontSize: 14 }}>{active === step.id ? "▲" : "▼"}</div>
                </div>
              </div>
              {active === step.id && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${step.color}44`, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
                  {step.desc}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div style={{ background: "linear-gradient(135deg,#1e293b,#334155)", borderRadius: 16, padding: "18px 22px", marginTop: 8 }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>🔗</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>IFMS में स्वचालित ID लिंकेज</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>Automatic ID Linkage — ये सब IDs IFMS में परस्पर जुड़ी रहती हैं</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 14 }}>
          {linkIds.map((item, i) => (
            <span key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ background: item.bg, color: item.color, border: `2px solid ${item.color}`, borderRadius: 10, padding: "7px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{item.label}</div>
                <div style={{ fontSize: 9, opacity: 0.75 }}>{item.full}</div>
              </div>
              {i < linkIds.length - 1 && <span style={{ color: "#475569", fontSize: 16 }}>⟷</span>}
            </span>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: "11px 14px", fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
          <strong style={{ color: "#f8fafc" }}>⚠️ महत्वपूर्ण:</strong> यदि एक बोली में अनेक कार्यों का पैकेज है, तो उन सभी कार्यों की IDs को भी आपस में लिंक करना आवश्यक है।
        </div>
      </div>
    </div>
  );
}
