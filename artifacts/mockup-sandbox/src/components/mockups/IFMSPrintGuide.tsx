export default function IFMSPrintGuide() {
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', 'Noto Sans Devanagari', Arial, sans-serif",
        background: "#f1f5f9",
        minHeight: "100vh",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Print button */}
      <button
        onClick={() => window.print()}
        style={{
          marginBottom: 20,
          padding: "10px 28px",
          background: "linear-gradient(135deg,#1e40af,#4f46e5)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(79,70,229,0.35)",
          letterSpacing: 0.3,
        }}
        className="no-print"
      >
        🖨️ प्रिंट करें / Print
      </button>

      {/* ── PAGE ── */}
      <div
        id="print-page"
        style={{
          width: 900,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
          overflow: "hidden",
          pageBreakInside: "avoid",
        }}
      >
        {/* ===== HEADER ===== */}
        <div
          style={{
            background: "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 50%,#4f46e5 100%)",
            padding: "28px 36px 22px",
            color: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.7, marginBottom: 4, textTransform: "uppercase" }}>
                राजस्थान सरकार · लोक निर्माण विभाग
              </div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, lineHeight: 1.2 }}>
                IFMS कार्यप्रवाह — सम्पूर्ण मार्गदर्शिका
              </h1>
              <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.75 }}>
                Integrated Financial Management System · नए मंत्रालयी स्टाफ हेतु
              </p>
            </div>
            <div style={{ textAlign: "right", opacity: 0.7, fontSize: 12 }}>
              <div style={{ fontSize: 36, marginBottom: 4 }}>🏗️</div>
              <div>संस्करण 1.0</div>
            </div>
          </div>

          {/* Phase pills */}
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            {[
              { label: "चरण 1-6 · कार्य अनुमोदन", color: "#60a5fa" },
              { label: "चरण 7-9 · निविदा एवं WO", color: "#a78bfa" },
              { label: "चरण 10 · WAM प्रविष्टि", color: "#34d399" },
              { label: "चरण 11 · बिल एवं भुगतान", color: "#fbbf24" },
            ].map((p) => (
              <span key={p.label} style={{ background: "rgba(255,255,255,0.15)", color: p.color, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "4px 12px", border: `1px solid ${p.color}55` }}>
                {p.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 32px 32px" }}>

          {/* ===== PART A — MAIN FLOW ===== */}
          <SectionTitle icon="📌" text="भाग क — नए कार्य से कार्यादेश तक" sub="From Work Conception to Work Order" color="#1d4ed8" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {mainFlow.map((step) => (
              <FlowCard key={step.id} step={step} />
            ))}
          </div>

          {/* Arrow timeline */}
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", marginBottom: 20, border: "1.5px solid #e2e8f0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 10, letterSpacing: 1 }}>
              📍 IFMS ID उत्पन्न होने का क्रम
            </div>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
              {[
                { id: "AS ID", color: "#0ea5e9", step: "चरण 3" },
                { id: "FS ID", color: "#10b981", step: "चरण 4" },
                { id: "BOQ ID", color: "#f59e0b", step: "चरण 5" },
                { id: "TS ID", color: "#ef4444", step: "चरण 6" },
                { id: "WO ID", color: "#6366f1", step: "चरण 9" },
                { id: "Vendor ID", color: "#8b5cf6", step: "चरण 10" },
                { id: "Bill ID", color: "#0ea5e9", step: "चरण 11" },
              ].map((item, i, arr) => (
                <span key={item.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ background: item.color + "18", color: item.color, border: `1.5px solid ${item.color}`, borderRadius: 7, padding: "4px 10px", fontSize: 11, fontWeight: 700, textAlign: "center" }}>
                    <div>{item.id}</div>
                    <div style={{ fontSize: 9, opacity: 0.7 }}>{item.step}</div>
                  </span>
                  {i < arr.length - 1 && <span style={{ color: "#94a3b8", fontSize: 16, fontWeight: 700 }}>→</span>}
                </span>
              ))}
            </div>
          </div>

          {/* ===== PART B — WAM & VENDOR ===== */}
          <SectionTitle icon="👤" text="भाग ख — विक्रेता पंजीकरण एवं WAM प्रविष्टि" sub="Vendor Registration & Work Order Entry in WAM" color="#7c3aed" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#ef4444", marginBottom: 8, background: "#fef2f2", borderRadius: 7, padding: "5px 10px", border: "1px solid #fecaca" }}>
                🔴 नया विक्रेता — New Vendor
              </div>
              {vendorSteps.map((s) => <MiniCard key={s.id} step={s} />)}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#0ea5e9", marginBottom: 8, background: "#f0f9ff", borderRadius: 7, padding: "5px 10px", border: "1px solid #bae6fd" }}>
                📋 WAM में Work Order प्रविष्टि
              </div>
              {wamSteps.map((s) => <MiniCard key={s.id} step={s} />)}
            </div>
          </div>

          {/* ===== PART C — PACKAGE ===== */}
          <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, color: "#fff" }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>
              📦 पैकेज बोली — एकाधिक कार्यों की ID लिंकेज
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["कार्य 1", "कार्य 2", "कार्य 3", "कार्य 4"].map((w, i) => (
                <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: 8, padding: "10px 10px", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11 }}>
                  <div style={{ fontWeight: 700, color: "#7dd3fc", marginBottom: 6, fontSize: 12 }}>{w}</div>
                  {["AS ID", "FS ID", "TS ID", "BOQ ID"].map((id) => (
                    <div key={id} style={{ color: "#94a3b8", padding: "1px 0" }}>↳ {id}</div>
                  ))}
                  <div style={{ color: "#fbbf24", fontWeight: 600, marginTop: 6 }}>↓ WO ID (साझा)</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: "#64748b" }}>
              ⚠️ नियम: एक पैकेज बोली में सभी कार्यों का एक साझा Work Order (WO) होता है, परंतु प्रत्येक कार्य की AS/FS/TS/BOQ ID अलग-अलग उस WO से लिंक की जाती है।
            </div>
          </div>

          {/* ===== PART D — BILL & PAYMENT ===== */}
          <SectionTitle icon="💳" text="भाग ग — बिल एवं भुगतान प्रक्रिया" sub="Bill Preparation & Payment via PFMS" color="#0ea5e9" />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 20 }}>
            {billFlow.map((b) => (
              <div key={b.id} style={{ background: b.bg, border: `2px solid ${b.border}`, borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 22 }}>{b.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: b.color, margin: "5px 0 3px" }}>{b.title}</div>
                <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.5 }}>{b.desc}</div>
              </div>
            ))}
          </div>

          {/* ===== IMPORTANT NOTES ===== */}
          <div style={{ background: "#fffbeb", border: "2px solid #fde68a", borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#92400e", marginBottom: 10 }}>⚠️ महत्वपूर्ण बिंदु — Important Notes</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {notes.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 14, marginTop: 1 }}>{n.icon}</span>
                  <span style={{ fontSize: 11, color: "#78350f", lineHeight: 1.55 }}>{n.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== GLOSSARY ===== */}
          <SectionTitle icon="📖" text="शब्द-कोश" sub="Glossary of Terms" color="#475569" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
            {glossary.map((g) => (
              <div key={g.abbr} style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 12px" }}>
                <span style={{ fontWeight: 800, color: "#1e40af", fontSize: 12 }}>{g.abbr}</span>
                <span style={{ color: "#94a3b8", fontSize: 10, margin: "0 4px" }}>·</span>
                <span style={{ fontSize: 11, color: "#374151" }}>{g.full}</span>
              </div>
            ))}
          </div>

          {/* ===== FOOTER ===== */}
          <div style={{ marginTop: 24, borderTop: "2px solid #e2e8f0", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>IFMS Rajasthan · मंत्रालयी स्टाफ प्रशिक्षण सामग्री</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>सभी IDs IFMS में परस्पर स्वतः लिंक होती हैं</div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #print-page { box-shadow: none !important; border-radius: 0 !important; width: 100% !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function SectionTitle({ icon, text, sub, color }: { icon: string; text: string; sub: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 12px", borderLeft: `4px solid ${color}`, paddingLeft: 12 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color }}>{text}</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>{sub}</div>
      </div>
    </div>
  );
}

function FlowCard({ step }: { step: (typeof mainFlow)[0] }) {
  return (
    <div style={{ background: step.bg, border: `2px solid ${step.border}`, borderRadius: 10, padding: "12px 14px", position: "relative" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: step.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
          {step.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
            <span style={{ background: step.color, color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 6px" }}>चरण {step.id}</span>
            {step.tag && (
              <span style={{ background: step.color + "20", color: step.color, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 6px", border: `1px solid ${step.color}44` }}>
                🔑 {step.tag}
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#1e293b", lineHeight: 1.3 }}>{step.title}</div>
          <div style={{ fontSize: 10, color: "#64748b", fontStyle: "italic" }}>{step.subtitle}</div>
          <div style={{ fontSize: 11, color: "#374151", marginTop: 5, lineHeight: 1.5 }}>{step.desc}</div>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ step }: { step: { id: string; icon: string; title: string; desc: string; color: string; bg: string; border: string } }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 10px", background: step.bg, border: `1.5px solid ${step.border}`, borderRadius: 8, marginBottom: 6 }}>
      <span style={{ fontSize: 16 }}>{step.icon}</span>
      <div>
        <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 2 }}>
          <span style={{ background: step.color, color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 5px" }}>{step.id}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>{step.title}</span>
        </div>
        <div style={{ fontSize: 10, color: "#475569", lineHeight: 1.5 }}>{step.desc}</div>
      </div>
    </div>
  );
}

/* ── Data ───────────────────────────────────────────────────── */

const mainFlow = [
  { id: 1, icon: "💡", title: "नए काम की कल्पना", subtitle: "Work Conception", desc: "अभियंता/राजनीतिक नेता/जनता की माँग से नए कार्य का प्रस्ताव।", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", tag: null },
  { id: 2, icon: "📐", title: "प्रारंभिक आकलन", subtitle: "Preliminary Estimate", desc: "अभियंता द्वारा कार्य की प्रारंभिक लागत का अनुमान।", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", tag: null },
  { id: 3, icon: "🏛️", title: "प्रशासनिक स्वीकृति", subtitle: "Administrative Sanction", desc: "सरकार/सक्षम प्राधिकारी द्वारा प्रशासनिक मंजूरी।", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd", tag: "AS ID उत्पन्न" },
  { id: 4, icon: "💰", title: "वित्तीय स्वीकृति", subtitle: "Financial Sanction", desc: "बजट से धनराशि आवंटन एवं वित्तीय स्वीकृति जारी।", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", tag: "FS ID उत्पन्न" },
  { id: 5, icon: "📋", title: "विस्तृत आकलन + BOQ", subtitle: "Detail Estimate & BOQ", desc: "विस्तृत इंजीनियरिंग आकलन एवं Bill of Quantities तैयार।", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", tag: "BOQ ID उत्पन्न" },
  { id: 6, icon: "✅", title: "तकनीकी स्वीकृति", subtitle: "Technical Sanction", desc: "विस्तृत आकलन की तकनीकी जाँच एवं सक्षम अभियंता द्वारा स्वीकृति।", color: "#ef4444", bg: "#fef2f2", border: "#fecaca", tag: "TS ID उत्पन्न" },
  { id: 7, icon: "📢", title: "बोली आमंत्रण", subtitle: "Bid Invitation (Tender)", desc: "BOQ के आधार पर ठेकेदारों से बोलियाँ आमंत्रित। पैकेज में अनेक कार्य सम्भव।", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", tag: null },
  { id: 8, icon: "📊", title: "बोली स्वीकृति", subtitle: "Bid Acceptance", desc: "उचित बोली का मूल्यांकन कर सबसे योग्य बोलीकर्ता की बोली स्वीकृत।", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", tag: null },
  { id: 9, icon: "📄", title: "कार्यादेश जारी (WO)", subtitle: "Work Order Issued", desc: "ठेकेदार को कार्यादेश जारी। AS, FS, TS, BOQ से स्वतः जुड़ता है।", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd", tag: "WO ID उत्पन्न" },
];

const vendorSteps = [
  { id: "V1", icon: "📝", title: "विक्रेता विवरण भरें", desc: "नाम, पता, PAN, GST, बैंक खाता विवरण (IFSC, खाता संख्या) भरे जाते हैं।", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  { id: "V2", icon: "🏦", title: "बैंक खाता सत्यापन", desc: "PFMS/बैंक के माध्यम से बैंक खाते की प्रामाणिकता की जाँच।", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  { id: "V3", icon: "✅", title: "Vendor ID उत्पन्न", desc: "सत्यापन के बाद IFMS में विक्रेता को अद्वितीय Vendor ID प्रदान।", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
];

const wamSteps = [
  { id: "W1", icon: "📋", title: "WAM में WO प्रविष्टि", desc: "WAM में Work Order संख्या, कार्य नाम, ठेकेदार, अनुबंध राशि दर्ज।", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  { id: "W2", icon: "🔗", title: "ID लिंकेज", desc: "WO को AS/FS/TS/BOQ से IFMS में स्वचालित लिंक किया जाता है।", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
  { id: "W3", icon: "📦", title: "पैकेज ID लिंकेज", desc: "पैकेज में प्रत्येक कार्य की सभी IDs को अलग-अलग WO से लिंक करें।", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
];

const billFlow = [
  { id: "B1", icon: "📏", title: "माप पुस्तिका (MB)", desc: "अभियंता द्वारा कार्यस्थल पर माप लेकर MB में दर्ज।", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
  { id: "B2", icon: "🧾", title: "RAB/Final Bill", desc: "BOQ दरों के अनुसार माप के आधार पर बिल तैयार।", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  { id: "B3", icon: "🔎", title: "बिल जाँच एवं पास", desc: "SDO/EE स्तर पर तकनीकी-वित्तीय जाँच। IFMS में पास।", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  { id: "B4", icon: "💸", title: "DBT भुगतान", desc: "PFMS द्वारा सीधे Vendor के बैंक खाते में भुगतान।", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
];

const notes = [
  { icon: "🔑", text: "IFMS में AS, FS, TS, BOQ और WO की सभी IDs परस्पर स्वचालित रूप से लिंक होती हैं।" },
  { icon: "📦", text: "पैकेज बोली में सभी कार्यों की ID को Work Order से अलग-अलग लिंक करना अनिवार्य है।" },
  { icon: "👤", text: "प्रथम बिल से पूर्व विक्रेता का IFMS में पंजीकरण एवं बैंक सत्यापन आवश्यक है।" },
  { icon: "📋", text: "WAM में Work Order प्रविष्टि बिल प्रस्तुत करने से पहले अनिवार्य है।" },
  { icon: "💸", text: "भुगतान सदैव PFMS के माध्यम से DBT द्वारा सीधे बैंक खाते में होता है।" },
  { icon: "⚠️", text: "किसी भी चरण की ID गलत लिंक होने पर बिल/भुगतान अवरुद्ध हो सकता है।" },
];

const glossary = [
  { abbr: "IFMS", full: "Integrated Financial Management System" },
  { abbr: "AS", full: "Administrative Sanction — प्रशासनिक स्वीकृति" },
  { abbr: "FS", full: "Financial Sanction — वित्तीय स्वीकृति" },
  { abbr: "TS", full: "Technical Sanction — तकनीकी स्वीकृति" },
  { abbr: "BOQ", full: "Bill of Quantities — मात्रा की सूची" },
  { abbr: "WO", full: "Work Order — कार्यादेश" },
  { abbr: "WAM", full: "Work Accounting Module" },
  { abbr: "MB", full: "Measurement Book — माप पुस्तिका" },
  { abbr: "RAB", full: "Running Account Bill — चालू खाता बिल" },
  { abbr: "PFMS", full: "Public Financial Management System" },
  { abbr: "DBT", full: "Direct Benefit Transfer — प्रत्यक्ष लाभ अंतरण" },
  { abbr: "PAN", full: "Permanent Account Number" },
];
