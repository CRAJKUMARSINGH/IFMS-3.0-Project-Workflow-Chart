import { useState } from "react";

const vendorSteps = [
  {
    id: "V1",
    icon: "🔍",
    title: "विक्रेता की जाँच",
    subtitle: "Vendor Check in Database",
    desc: "प्रथम बिल प्रस्तुत करने से पहले जाँचें कि विक्रेता (ठेकेदार) IFMS डेटाबेस में पहले से पंजीकृत है या नहीं।",
    color: "#6366f1",
    bg: "#eef2ff",
    border: "#c7d2fe",
    branch: true,
  },
];

const vendorNew = [
  {
    id: "N1",
    icon: "📝",
    title: "विक्रेता विवरण भरें",
    subtitle: "Enter Vendor Details",
    desc: "नाम, पता, PAN नंबर, GST नंबर, बैंक खाता विवरण (IFSC, खाता संख्या) भरे जाते हैं।",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
  },
  {
    id: "N2",
    icon: "🏦",
    title: "बैंक खाता सत्यापन",
    subtitle: "Bank Account Verification",
    desc: "PFMS/बैंक के माध्यम से बैंक खाते की प्रामाणिकता की जाँच की जाती है।",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    id: "N3",
    icon: "✅",
    title: "विक्रेता ID उत्पन्न",
    subtitle: "Vendor ID Generated",
    desc: "सत्यापन के बाद IFMS में विक्रेता को एक अद्वितीय Vendor ID प्रदान की जाती है।",
    color: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    tag: "Vendor ID",
  },
];

const wamSteps = [
  {
    id: "W1",
    icon: "📋",
    title: "WAM में कार्यादेश जोड़ना",
    subtitle: "Add Work Order in WAM",
    desc: "Work Accounting Module (WAM) में Work Order की प्रविष्टि की जाती है। यह प्रक्रिया प्रथम बिल से पहले अनिवार्य है।",
    color: "#0ea5e9",
    bg: "#f0f9ff",
    border: "#bae6fd",
    fields: ["Work Order संख्या", "कार्य का नाम", "ठेकेदार का नाम", "अनुबंध राशि"],
  },
  {
    id: "W2",
    icon: "🔗",
    title: "ID लिंकेज",
    subtitle: "Linking IDs in IFMS",
    desc: "Work Order को AS (प्रशासनिक स्वीकृति), FS (वित्तीय स्वीकृति), TS (तकनीकी स्वीकृति) और BOQ से स्वचालित रूप से जोड़ा जाता है।",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    fields: ["AS ID", "FS ID", "TS ID", "BOQ ID", "WO ID"],
  },
  {
    id: "W3",
    icon: "📦",
    title: "पैकेज कार्य लिंकेज",
    subtitle: "Package Work Linkage",
    desc: "यदि एक बोली में अनेक कार्यों का पैकेज है तो प्रत्येक कार्य की AS/FS/TS/BOQ ID को उस Work Order से अलग-अलग लिंक किया जाता है।",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
    isPackage: true,
    fields: ["कार्य 1 की IDs", "कार्य 2 की IDs", "कार्य 3 की IDs"],
  },
];

const billSteps = [
  {
    id: "B1",
    icon: "📏",
    title: "माप पुस्तिका (MB)",
    subtitle: "Measurement Book",
    desc: "अभियंता द्वारा कार्य स्थल पर माप लेकर MB में दर्ज किया जाता है।",
    color: "#6366f1",
    bg: "#eef2ff",
    border: "#c7d2fe",
  },
  {
    id: "B2",
    icon: "🧾",
    title: "बिल तैयार करना",
    subtitle: "Bill Preparation",
    desc: "BOQ की दरों के अनुसार माप के आधार पर Running Account Bill (RAB) या Final Bill तैयार किया जाता है।",
    color: "#0ea5e9",
    bg: "#f0f9ff",
    border: "#bae6fd",
  },
  {
    id: "B3",
    icon: "🔎",
    title: "बिल जाँच एवं पास",
    subtitle: "Bill Check & Pass",
    desc: "SDO/EE स्तर पर बिल की तकनीकी एवं वित्तीय जाँच होती है और IFMS में पास किया जाता है।",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    id: "B4",
    icon: "💸",
    title: "भुगतान",
    subtitle: "Payment via PFMS",
    desc: "IFMS/PFMS के माध्यम से भुगतान सीधे विक्रेता के बैंक खाते में DBT (Direct Benefit Transfer) से होता है।",
    color: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    final: true,
  },
];

function StepCard({
  step,
  index,
  total,
  showConnector = true,
}: {
  step: (typeof wamSteps)[0] & { fields?: string[]; isPackage?: boolean; tag?: string; branch?: boolean; final?: boolean };
  index: number;
  total: number;
  showConnector?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 6 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 14, minWidth: 40 }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: open ? step.color : "#fff",
            border: `3px solid ${step.color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            cursor: "pointer",
            boxShadow: open ? `0 4px 16px ${step.color}55` : "0 2px 8px rgba(0,0,0,0.07)",
            transition: "all 0.2s",
          }}
        >
          {step.icon}
        </div>
        {showConnector && index < total - 1 && (
          <div style={{ width: 3, minHeight: 20, background: step.color, opacity: 0.25, margin: "2px 0" }} />
        )}
      </div>
      <div
        onClick={() => setOpen(!open)}
        style={{
          flex: 1,
          background: open ? step.bg : "#fff",
          border: `2px solid ${open ? step.color : step.border}`,
          borderRadius: 12,
          padding: "11px 14px",
          cursor: "pointer",
          boxShadow: open ? `0 4px 20px ${step.color}20` : "0 1px 6px rgba(0,0,0,0.04)",
          transition: "all 0.2s",
          marginBottom: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
              <span style={{ background: step.color, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "1px 7px" }}>
                {step.id}
              </span>
              {"tag" in step && step.tag && (
                <span style={{ background: step.color + "18", color: step.color, fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "1px 7px", border: `1px solid ${step.color}44` }}>
                  🔑 {step.tag} उत्पन्न
                </span>
              )}
              {"isPackage" in step && step.isPackage && (
                <span style={{ background: "#fef2f2", color: "#ef4444", fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "1px 7px", border: "1px solid #fecaca" }}>
                  📦 पैकेज
                </span>
              )}
              {"final" in step && step.final && (
                <span style={{ background: "#ecfdf5", color: "#10b981", fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "1px 7px", border: "1px solid #a7f3d0" }}>
                  🎯 अंतिम चरण
                </span>
              )}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{step.title}</div>
            <div style={{ fontSize: 11, color: "#64748b", fontStyle: "italic" }}>{step.subtitle}</div>
          </div>
          <div style={{ color: step.color, opacity: 0.5, fontSize: 14 }}>{open ? "▲" : "▼"}</div>
        </div>
        {open && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${step.color}44` }}>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "#374151", lineHeight: 1.65 }}>{step.desc}</p>
            {"fields" in step && step.fields && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {step.fields.map((f) => (
                  <span key={f} style={{ background: step.color + "18", color: step.color, fontSize: 11, fontWeight: 600, borderRadius: 6, padding: "3px 9px", border: `1px solid ${step.color}33` }}>
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle, color }: { icon: string; title: string; subtitle: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0 10px", padding: "10px 14px", background: color + "12", borderRadius: 10, border: `1.5px solid ${color}33` }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color }}>{title}</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>{subtitle}</div>
      </div>
    </div>
  );
}

export default function WAMChart() {
  const [vendorExists, setVendorExists] = useState<boolean | null>(null);

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Noto Sans Devanagari', sans-serif", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", minHeight: "100vh", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e40af 60%, #0ea5e9 100%)", borderRadius: 20, padding: "1.8rem 2rem", marginBottom: "1.5rem", color: "#fff", textAlign: "center", boxShadow: "0 8px 32px rgba(14,165,233,0.25)" }}>
          <div style={{ fontSize: 38, marginBottom: 6 }}>🏗️➡️💳</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>WAM — कार्यादेश प्रविष्टि एवं भुगतान</h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, opacity: 0.75 }}>Work Accounting Module · Vendor Registration · Bill & Payment Flow</p>
          <p style={{ margin: "8px 0 0", fontSize: 12, opacity: 0.55 }}>यह चार्ट IFMS चार्ट (चरण 9 के बाद) से आगे की प्रक्रिया बताता है</p>
        </div>

        {/* SECTION 1 — Vendor */}
        <SectionHeader icon="👤" title="चरण क: विक्रेता पंजीकरण" subtitle="Vendor Registration Process" color="#6366f1" />

        {/* Vendor Check */}
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 6 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 14, minWidth: 40 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#6366f1", border: "3px solid #6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔍</div>
            <div style={{ width: 3, minHeight: 16, background: "#6366f1", opacity: 0.25, margin: "2px 0" }} />
          </div>
          <div style={{ flex: 1, background: "#eef2ff", border: "2px solid #6366f1", borderRadius: 12, padding: "11px 14px", marginBottom: 4 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
              <span style={{ background: "#6366f1", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "1px 7px" }}>V1</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>विक्रेता की जाँच करें</div>
            <div style={{ fontSize: 11, color: "#64748b", fontStyle: "italic", marginBottom: 10 }}>Vendor Check in IFMS Database</div>
            <div style={{ fontSize: 13, color: "#374151", marginBottom: 12 }}>प्रथम बिल से पहले जाँचें — क्या विक्रेता IFMS डेटाबेस में पहले से है?</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setVendorExists(true)}
                style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "2px solid #10b981", background: vendorExists === true ? "#10b981" : "#fff", color: vendorExists === true ? "#fff" : "#10b981", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
              >
                ✅ हाँ, डेटाबेस में है
              </button>
              <button
                onClick={() => setVendorExists(false)}
                style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "2px solid #ef4444", background: vendorExists === false ? "#ef4444" : "#fff", color: vendorExists === false ? "#fff" : "#ef4444", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
              >
                ❌ नहीं, नया जोड़ना है
              </button>
            </div>
          </div>
        </div>

        {/* Conditional: New Vendor Flow */}
        {vendorExists === false && (
          <div style={{ marginLeft: 54, borderLeft: "3px dashed #ef4444", paddingLeft: 16, marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>🔴 नया विक्रेता — निम्न चरण पूरे करें:</div>
            {vendorNew.map((s, i) => (
              <StepCard key={s.id} step={s as Parameters<typeof StepCard>[0]["step"]} index={i} total={vendorNew.length} />
            ))}
          </div>
        )}

        {vendorExists === true && (
          <div style={{ marginLeft: 54, background: "#ecfdf5", border: "2px solid #10b981", borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: "#065f46" }}>
            ✅ <strong>विक्रेता पहले से पंजीकृत है</strong> — सीधे WAM में Work Order प्रविष्टि पर जाएँ।
          </div>
        )}

        {vendorExists === null && (
          <div style={{ marginLeft: 54, background: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
            ऊपर विकल्प चुनें — प्रक्रिया अनुसार अगला चरण दिखाई देगा
          </div>
        )}

        {/* SECTION 2 — WAM */}
        <SectionHeader icon="📋" title="चरण ख: WAM में कार्यादेश प्रविष्टि" subtitle="Work Order Entry & ID Linkage in WAM" color="#0ea5e9" />
        {wamSteps.map((s, i) => (
          <StepCard key={s.id} step={s as Parameters<typeof StepCard>[0]["step"]} index={i} total={wamSteps.length} />
        ))}

        {/* Package Diagram */}
        <div style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", borderRadius: 14, padding: "1.2rem 1.5rem", margin: "10px 0 0", color: "#fff" }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>📦 पैकेज बोली में एकाधिक कार्य — ID लिंकेज</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["कार्य 1", "कार्य 2", "कार्य 3"].map((work, i) => (
              <div key={i} style={{ flex: 1, minWidth: 160, background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#7dd3fc", marginBottom: 6 }}>{work}</div>
                {["AS ID", "FS ID", "TS ID", "BOQ ID"].map((id) => (
                  <div key={id} style={{ fontSize: 11, color: "#94a3b8", padding: "2px 0" }}>↳ {id}</div>
                ))}
                <div style={{ marginTop: 6, fontSize: 11, color: "#fbbf24", fontWeight: 600 }}>↓ WO ID (साझा)</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
            <strong style={{ color: "#f1f5f9" }}>नियम:</strong> एक पैकेज बोली में सभी कार्यों का एक साझा Work Order होता है, परंतु प्रत्येक कार्य की AS/FS/TS/BOQ ID अलग-अलग उस Work Order से लिंक की जाती है।
          </div>
        </div>

        {/* SECTION 3 — Bill */}
        <SectionHeader icon="💳" title="चरण ग: बिल एवं भुगतान" subtitle="Bill Preparation & Payment Process" color="#10b981" />
        {billSteps.map((s, i) => (
          <StepCard key={s.id} step={s as Parameters<typeof StepCard>[0]["step"]} index={i} total={billSteps.length} />
        ))}

        {/* Footer */}
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)", borderRadius: 14, padding: "1rem 1.5rem", marginTop: 14, color: "#fff", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>🔗 IFMS में सम्पूर्ण ID शृंखला</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "AS ID", color: "#0ea5e9" },
              { label: "FS ID", color: "#10b981" },
              { label: "TS ID", color: "#ef4444" },
              { label: "BOQ ID", color: "#f59e0b" },
              { label: "WO ID", color: "#6366f1" },
              { label: "Vendor ID", color: "#8b5cf6" },
              { label: "Bill ID", color: "#0ea5e9" },
            ].map((item, i, arr) => (
              <span key={item.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ background: item.color + "28", color: item.color, border: `1.5px solid ${item.color}`, borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700 }}>{item.label}</span>
                {i < arr.length - 1 && <span style={{ color: "#475569", fontSize: 14 }}>→</span>}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: "#64748b" }}>
            किसी भी चरण पर क्लिक करें — विवरण देखने के लिए | IFMS Rajasthan
          </div>
        </div>
      </div>
    </div>
  );
}
