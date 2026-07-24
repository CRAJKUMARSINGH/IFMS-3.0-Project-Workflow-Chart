import { useState } from "react";

const steps = [
  {
    id: 1,
    icon: "💡",
    title: "नए काम की कल्पना",
    subtitle: "Work Conception",
    desc: "अभियंता / राजनीतिक नेता / जनता की माँग से नए कार्य का प्रस्ताव उत्पन्न होता है।",
    color: "#6366f1",
    bg: "#eef2ff",
    border: "#c7d2fe",
    tag: null,
  },
  {
    id: 2,
    icon: "📐",
    title: "प्रारंभिक आकलन",
    subtitle: "Preliminary Estimate",
    desc: "अभियंता द्वारा कार्य की प्रारंभिक लागत का अनुमान तैयार किया जाता है।",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    tag: null,
  },
  {
    id: 3,
    icon: "🏛️",
    title: "प्रशासनिक स्वीकृति (AS)",
    subtitle: "Administrative Sanction",
    desc: "सरकार / सक्षम प्राधिकारी द्वारा कार्य को प्रशासनिक मंजूरी दी जाती है।",
    color: "#0ea5e9",
    bg: "#f0f9ff",
    border: "#bae6fd",
    tag: "AS ID",
    tagColor: "#0ea5e9",
  },
  {
    id: 4,
    icon: "💰",
    title: "वित्तीय स्वीकृति (FS)",
    subtitle: "Financial Sanction",
    desc: "सरकार द्वारा बजट से धनराशि आवंटित की जाती है और वित्तीय स्वीकृति जारी होती है।",
    color: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    tag: "FS ID",
    tagColor: "#10b981",
  },
  {
    id: 5,
    icon: "📋",
    title: "विस्तृत आकलन",
    subtitle: "Detail Estimate",
    desc: "कार्य का विस्तृत इंजीनियरिंग आकलन एवं BOQ (Bill of Quantities) तैयार होता है।",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    tag: "BOQ ID",
    tagColor: "#f59e0b",
  },
  {
    id: 6,
    icon: "✅",
    title: "तकनीकी स्वीकृति (TS)",
    subtitle: "Technical Sanction",
    desc: "विस्तृत आकलन की तकनीकी जाँच एवं सक्षम अभियंता द्वारा स्वीकृति प्रदान की जाती है।",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
    tag: "TS ID",
    tagColor: "#ef4444",
  },
  {
    id: 7,
    icon: "📢",
    title: "बोली आमंत्रण",
    subtitle: "Bid Invitation (Tender)",
    desc: "BOQ के आधार पर ठेकेदारों से बोलियाँ (Tenders) आमंत्रित की जाती हैं। पैकेज में एक से अधिक कार्य हो सकते हैं।",
    color: "#6366f1",
    bg: "#eef2ff",
    border: "#c7d2fe",
    tag: null,
  },
  {
    id: 8,
    icon: "📊",
    title: "बोली स्वीकृति",
    subtitle: "Bid Acceptance",
    desc: "उचित बोली का मूल्यांकन कर सबसे योग्य बोलीकर्ता की बोली स्वीकार की जाती है।",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    tag: null,
  },
  {
    id: 9,
    icon: "📄",
    title: "कार्यादेश जारी (Work Order)",
    subtitle: "Work Order Issued",
    desc: "ठेकेदार को कार्यादेश जारी किया जाता है। यह AS, FS, TS और BOQ से स्वतः जुड़ा होता है।",
    color: "#0ea5e9",
    bg: "#f0f9ff",
    border: "#bae6fd",
    tag: "WO ID",
    tagColor: "#0ea5e9",
  },
  {
    id: 10,
    icon: "👤",
    title: "विक्रेता पंजीकरण",
    subtitle: "Vendor Registration",
    desc: "प्रथम बिल के समय यदि विक्रेता (Vendor) डेटाबेस में नहीं है तो उसे पहले जोड़ा जाता है। फिर WAM में Work Order जोड़ा जाता है।",
    color: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    tag: null,
  },
  {
    id: 11,
    icon: "💳",
    title: "बिल प्रस्तुति एवं भुगतान",
    subtitle: "Bill & Payment",
    desc: "ठेकेदार कार्य की माप के आधार पर बिल प्रस्तुत करता है। IFMS में सभी IDs स्वतः लिंक होने के कारण भुगतान प्रक्रिया सुचारु होती है।",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    tag: null,
  },
];

const linkBox = {
  title: "IFMS में स्वचालित ID लिंकेज",
  subtitle: "Automatic ID Linkage in IFMS",
  ids: [
    { label: "AS ID", full: "Administrative Sanction", color: "#0ea5e9", bg: "#f0f9ff" },
    { label: "FS ID", full: "Financial Sanction", color: "#10b981", bg: "#ecfdf5" },
    { label: "TS ID", full: "Technical Sanction", color: "#ef4444", bg: "#fef2f2" },
    { label: "BOQ ID", full: "Bill of Quantities", color: "#f59e0b", bg: "#fffbeb" },
    { label: "WO ID", full: "Work Order", color: "#6366f1", bg: "#eef2ff" },
  ],
};

export default function IFMSChart() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', 'Noto Sans Devanagari', sans-serif",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        minHeight: "100vh",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e40af 0%, #4f46e5 60%, #7c3aed 100%)",
            borderRadius: 20,
            padding: "2rem 2.5rem",
            marginBottom: "2rem",
            color: "#fff",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(99,102,241,0.3)",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏗️</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: 0.5 }}>
            IFMS कार्यप्रवाह मार्गदर्शिका
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, opacity: 0.85 }}>
            Integrated Financial Management System — Rajasthan
          </p>
          <p style={{ margin: "10px 0 0", fontSize: 13, opacity: 0.7 }}>
            नए मंत्रालयी स्टाफ के लिए चरण-दर-चरण प्रक्रिया
          </p>
        </div>

        {/* Steps */}
        <div style={{ position: "relative" }}>
          {steps.map((step, idx) => (
            <div key={step.id} style={{ display: "flex", alignItems: "flex-start", marginBottom: 8 }}>
              {/* Left: number + connector */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 16, minWidth: 44 }}>
                <div
                  onClick={() => setActive(active === step.id ? null : step.id)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: active === step.id ? step.color : "#fff",
                    border: `3px solid ${step.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    cursor: "pointer",
                    boxShadow: active === step.id
                      ? `0 4px 16px ${step.color}55`
                      : "0 2px 8px rgba(0,0,0,0.08)",
                    transition: "all 0.2s",
                    zIndex: 2,
                    position: "relative",
                  }}
                >
                  <span>{step.icon}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    style={{
                      width: 3,
                      flex: 1,
                      minHeight: 24,
                      background: `linear-gradient(${step.color}, ${steps[idx + 1].color})`,
                      opacity: 0.35,
                      margin: "2px 0",
                    }}
                  />
                )}
              </div>

              {/* Right: card */}
              <div
                onClick={() => setActive(active === step.id ? null : step.id)}
                style={{
                  flex: 1,
                  background: active === step.id ? step.bg : "#fff",
                  border: `2px solid ${active === step.id ? step.color : step.border}`,
                  borderRadius: 14,
                  padding: "14px 18px",
                  cursor: "pointer",
                  boxShadow: active === step.id
                    ? `0 4px 20px ${step.color}22`
                    : "0 2px 8px rgba(0,0,0,0.05)",
                  transition: "all 0.2s",
                  marginBottom: 4,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          background: step.color,
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 700,
                          borderRadius: 6,
                          padding: "2px 8px",
                        }}
                      >
                        चरण {step.id}
                      </span>
                      {step.tag && (
                        <span
                          style={{
                            background: step.tagColor + "18",
                            color: step.tagColor,
                            fontSize: 11,
                            fontWeight: 700,
                            borderRadius: 6,
                            padding: "2px 8px",
                            border: `1px solid ${step.tagColor}44`,
                          }}
                        >
                          🔑 {step.tag} उत्पन्न
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginTop: 5 }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", fontStyle: "italic" }}>
                      {step.subtitle}
                    </div>
                  </div>
                  <div style={{ fontSize: 18, color: step.color, opacity: 0.6 }}>
                    {active === step.id ? "▲" : "▼"}
                  </div>
                </div>

                {active === step.id && (
                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: `1px dashed ${step.color}44`,
                      fontSize: 14,
                      color: "#374151",
                      lineHeight: 1.7,
                    }}
                  >
                    {step.desc}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* IFMS ID Linkage Box */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            borderRadius: 18,
            padding: "1.5rem 2rem",
            marginTop: "1.5rem",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>🔗</div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>{linkBox.title}</div>
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>{linkBox.subtitle}</div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: "1.2rem" }}>
            {linkBox.ids.map((item, i) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    background: item.bg,
                    color: item.color,
                    border: `2px solid ${item.color}`,
                    borderRadius: 10,
                    padding: "8px 14px",
                    textAlign: "center",
                    minWidth: 90,
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{item.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.8 }}>{item.full}</div>
                </div>
                {i < linkBox.ids.length - 1 && (
                  <div style={{ color: "#64748b", fontSize: 18 }}>⟷</div>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.07)",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 13,
              lineHeight: 1.7,
              color: "#cbd5e1",
            }}
          >
            <strong style={{ color: "#f8fafc" }}>⚠️ महत्वपूर्ण:</strong> IFMS में AS, FS, TS, BOQ और WO की सभी IDs परस्पर स्वचालित रूप से लिंक होती हैं। यदि एक बोली (Bid) में अनेक कार्यों का पैकेज है, तो उन सभी कार्यों की IDs को भी आपस में लिंक करना आवश्यक है।
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: 12, color: "#94a3b8" }}>
          IFMS — Rajasthan | कार्य प्रवाह प्रशिक्षण सामग्री | किसी चरण पर क्लिक करें विवरण देखने के लिए
        </div>
      </div>
    </div>
  );
}
