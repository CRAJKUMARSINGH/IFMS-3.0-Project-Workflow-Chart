import { useBookmarks } from "@/context/BookmarkContext";

const mainFlow = [
  { id: 1, icon: "💡", title: "नए काम की कल्पना", subtitle: "Work Conception", desc: "अभियंता/राजनीतिक नेता/जनता की माँग से नए कार्य का प्रस्ताव।", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", tag: null },
  { id: 2, icon: "📐", title: "प्रारंभिक आकलन", subtitle: "Preliminary Estimate", desc: "अभियंता द्वारा कार्य की प्रारंभिक लागत का अनुमान।", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", tag: null },
  { id: 3, icon: "🏛️", title: "प्रशासनिक स्वीकृति", subtitle: "Administrative Sanction", desc: "सरकार/सक्षम प्राधिकारी द्वारा प्रशासनिक मंजूरी।", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd", tag: "AS ID उत्पन्न" },
  { id: 4, icon: "💰", title: "वित्तीय स्वीकृति", subtitle: "Financial Sanction", desc: "बजट से धनराशि आवंटन एवं वित्तीय स्वीकृति।", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", tag: "FS ID उत्पन्न" },
  { id: 5, icon: "📋", title: "विस्तृत आकलन + BOQ", subtitle: "Detail Estimate & BOQ", desc: "विस्तृत इंजीनियरिंग आकलन एवं Bill of Quantities तैयार।", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", tag: "BOQ ID उत्पन्न" },
  { id: 6, icon: "✅", title: "तकनीकी स्वीकृति", subtitle: "Technical Sanction", desc: "विस्तृत आकलन की तकनीकी जाँच एवं स्वीकृति।", color: "#ef4444", bg: "#fef2f2", border: "#fecaca", tag: "TS ID उत्पन्न" },
  { id: 7, icon: "📢", title: "बोली आमंत्रण", subtitle: "Bid Invitation", desc: "BOQ के आधार पर ठेकेदारों से बोलियाँ आमंत्रित।", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", tag: null },
  { id: 8, icon: "📊", title: "बोली स्वीकृति", subtitle: "Bid Acceptance", desc: "उचित बोली का मूल्यांकन एवं स्वीकृति।", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", tag: null },
  { id: 9, icon: "📄", title: "कार्यादेश जारी (WO)", subtitle: "Work Order Issued", desc: "ठेकेदार को कार्यादेश — AS, FS, TS, BOQ से स्वतः जुड़ता है।", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd", tag: "WO ID उत्पन्न" },
];

const vendorSteps = [
  { id: "V1", icon: "📝", title: "विक्रेता विवरण भरें", desc: "नाम, पता, PAN, GST, बैंक खाता भरे जाते हैं।", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  { id: "V2", icon: "🏦", title: "बैंक खाता सत्यापन", desc: "PFMS/बैंक के माध्यम से खाते की जाँच।", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  { id: "V3", icon: "✅", title: "Vendor ID उत्पन्न", desc: "सत्यापन के बाद IFMS में अद्वितीय Vendor ID प्रदान।", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
];

const wamSteps = [
  { id: "W1", icon: "📋", title: "WAM में WO प्रविष्टि", desc: "WO संख्या, कार्य नाम, ठेकेदार, राशि दर्ज।", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  { id: "W2", icon: "🔗", title: "ID लिंकेज", desc: "WO को AS/FS/TS/BOQ से स्वचालित लिंक।", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
  { id: "W3", icon: "📦", title: "पैकेज ID लिंकेज", desc: "पैकेज में प्रत्येक कार्य की IDs अलग-अलग WO से लिंक।", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
];

const billFlow = [
  { id: "B1", icon: "📏", title: "माप पुस्तिका (MB)", desc: "कार्यस्थल पर माप → MB में दर्ज।", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
  { id: "B2", icon: "🧾", title: "RAB/Final Bill", desc: "BOQ दरों के अनुसार बिल तैयार।", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  { id: "B3", icon: "🔎", title: "बिल जाँच एवं पास", desc: "SDO/EE द्वारा जाँच, IFMS में पास।", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  { id: "B4", icon: "💸", title: "DBT भुगतान", desc: "PFMS द्वारा बैंक में सीधे भुगतान।", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
];

const notes = [
  { icon: "🔑", text: "AS, FS, TS, BOQ और WO की IDs IFMS में स्वतः लिंक होती हैं।" },
  { icon: "📦", text: "पैकेज बोली में सभी कार्यों की ID को WO से लिंक करना अनिवार्य है।" },
  { icon: "👤", text: "प्रथम बिल से पूर्व विक्रेता का IFMS में पंजीकरण आवश्यक है।" },
  { icon: "📋", text: "बिल प्रस्तुत करने से पहले WAM में WO प्रविष्टि अनिवार्य है।" },
  { icon: "💸", text: "भुगतान PFMS के माध्यम से DBT द्वारा सीधे बैंक खाते में होता है।" },
  { icon: "⚠️", text: "गलत ID लिंकेज से बिल/भुगतान अवरुद्ध हो सकता है।" },
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
  { abbr: "RAB", full: "Running Account Bill" },
  { abbr: "PFMS", full: "Public Financial Management System" },
  { abbr: "DBT", full: "Direct Benefit Transfer — प्रत्यक्ष लाभ अंतरण" },
  { abbr: "PAN", full: "Permanent Account Number" },
];

function BmBtn({ itemKey, icon, title, subtitle, color }: { itemKey: string; icon: string; title: string; subtitle: string; color: string }) {
  const { isBookmarked, toggle } = useBookmarks();
  const saved = isBookmarked(itemKey);
  return (
    <button
      className="no-print"
      onClick={e => { e.stopPropagation(); toggle({ source: "print", itemKey, icon, title, subtitle, color }); }}
      title={saved ? "Bookmark हटाएँ" : "Bookmark करें"}
      style={{
        position: "absolute", top: 5, right: 5,
        background: saved ? color + "30" : "rgba(255,255,255,0.85)",
        border: `1.5px solid ${saved ? color : "#e2e8f0"}`,
        borderRadius: 6, width: 22, height: 22,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, cursor: "pointer", transition: "all 0.15s",
        opacity: saved ? 1 : 0.6,
        padding: 0, lineHeight: 1,
        backdropFilter: "blur(4px)",
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={e => (e.currentTarget.style.opacity = saved ? "1" : "0.6")}
    >
      🔖
    </button>
  );
}

export default function PrintGuide() {
  return (
    <div style={{ padding: "24px 20px" }}>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 18 }}>
        <button onClick={() => window.print()} className="no-print" style={{ padding: "11px 32px", background: "linear-gradient(135deg,#1e40af,#4f46e5)", color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(79,70,229,0.35)", fontFamily: "inherit", letterSpacing: 0.3 }}>
          🖨️ प्रिंट करें / Print
        </button>
      </div>
      <p className="no-print" style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "-10px 0 14px" }}>किसी भी card के ऊपर माउस ले जाएँ — 🔖 से उसे Bookmark कर सकते हैं</p>

      <div id="print-page" style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 50%,#4f46e5 100%)", padding: "24px 32px 18px", color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.7, marginBottom: 4 }}>राजस्थान सरकार · लोक निर्माण विभाग</div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>IFMS कार्यप्रवाह — सम्पूर्ण मार्गदर्शिका</h1>
              <p style={{ margin: "5px 0 0", fontSize: 12, opacity: 0.75 }}>Integrated Financial Management System · नए मंत्रालयी स्टाफ हेतु</p>
            </div>
            <div style={{ fontSize: 32 }}>🏗️</div>
          </div>
          <div style={{ display: "flex", gap: 7, marginTop: 14, flexWrap: "wrap" }}>
            {[{l:"चरण 1-6 · अनुमोदन",c:"#60a5fa"},{l:"चरण 7-9 · निविदा/WO",c:"#a78bfa"},{l:"WAM प्रविष्टि",c:"#34d399"},{l:"बिल/भुगतान",c:"#fbbf24"}].map(p => (
              <span key={p.l} style={{ background: "rgba(255,255,255,0.15)", color: p.c, fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "3px 11px", border: `1px solid ${p.c}55` }}>{p.l}</span>
            ))}
          </div>
        </div>

        <div style={{ padding: "22px 28px 28px" }}>
          {/* Part A */}
          <div style={{ borderLeft: "4px solid #1d4ed8", paddingLeft: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#1d4ed8" }}>📌 भाग क — नए कार्य से कार्यादेश तक</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>From Work Conception to Work Order</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
            {mainFlow.map(step => (
              <div key={step.id} style={{ position: "relative", background: step.bg, border: `1.5px solid ${step.border}`, borderRadius: 9, padding: "10px 12px" }}>
                <BmBtn itemKey={`print-main-${step.id}`} icon={step.icon} title={step.title} subtitle={step.subtitle} color={step.color} />
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: step.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{step.icon}</div>
                  <div style={{ flex: 1, paddingRight: 18 }}>
                    <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
                      <span style={{ background: step.color, color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 5px" }}>चरण {step.id}</span>
                      {step.tag && <span style={{ background: step.color + "20", color: step.color, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 5px", border: `1px solid ${step.color}44` }}>🔑 {step.tag}</span>}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#1e293b" }}>{step.title}</div>
                    <div style={{ fontSize: 10, color: "#64748b", fontStyle: "italic" }}>{step.subtitle}</div>
                    <div style={{ fontSize: 10, color: "#374151", marginTop: 3, lineHeight: 1.5 }}>{step.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ID Sequence */}
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", marginBottom: 18, border: "1.5px solid #e2e8f0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>📍 IFMS ID उत्पन्न होने का क्रम</div>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
              {[{id:"AS ID",color:"#0ea5e9",step:"चरण 3"},{id:"FS ID",color:"#10b981",step:"चरण 4"},{id:"BOQ ID",color:"#f59e0b",step:"चरण 5"},{id:"TS ID",color:"#ef4444",step:"चरण 6"},{id:"WO ID",color:"#6366f1",step:"चरण 9"},{id:"Vendor ID",color:"#8b5cf6",step:"चरण 10"},{id:"Bill ID",color:"#0ea5e9",step:"चरण 11"}].map((item,i,arr) => (
                <span key={item.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ background: item.color + "18", color: item.color, border: `1.5px solid ${item.color}`, borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 700, textAlign: "center" }}>
                    <div>{item.id}</div><div style={{ fontSize: 8, opacity: 0.7 }}>{item.step}</div>
                  </span>
                  {i < arr.length - 1 && <span style={{ color: "#94a3b8", fontSize: 14 }}>→</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Part B: Vendor + WAM */}
          <div style={{ borderLeft: "4px solid #7c3aed", paddingLeft: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#7c3aed" }}>👤 भाग ख — विक्रेता पंजीकरण एवं WAM प्रविष्टि</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Vendor Registration & Work Order Entry in WAM</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#ef4444", marginBottom: 6, background: "#fef2f2", borderRadius: 6, padding: "4px 8px", border: "1px solid #fecaca" }}>🔴 नया विक्रेता</div>
              {vendorSteps.map(s => (
                <div key={s.id} style={{ position: "relative", display: "flex", gap: 7, alignItems: "flex-start", padding: "7px 9px", background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 7, marginBottom: 5 }}>
                  <BmBtn itemKey={`print-vendor-${s.id}`} icon={s.icon} title={s.title} subtitle={s.id} color={s.color} />
                  <span style={{ fontSize: 14 }}>{s.icon}</span>
                  <div style={{ paddingRight: 20 }}>
                    <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 2 }}>
                      <span style={{ background: s.color, color: "#fff", fontSize: 8, fontWeight: 700, borderRadius: 3, padding: "1px 4px" }}>{s.id}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>{s.title}</span>
                    </div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#0ea5e9", marginBottom: 6, background: "#f0f9ff", borderRadius: 6, padding: "4px 8px", border: "1px solid #bae6fd" }}>📋 WAM में Work Order</div>
              {wamSteps.map(s => (
                <div key={s.id} style={{ position: "relative", display: "flex", gap: 7, alignItems: "flex-start", padding: "7px 9px", background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 7, marginBottom: 5 }}>
                  <BmBtn itemKey={`print-wam-${s.id}`} icon={s.icon} title={s.title} subtitle={s.id} color={s.color} />
                  <span style={{ fontSize: 14 }}>{s.icon}</span>
                  <div style={{ paddingRight: 20 }}>
                    <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 2 }}>
                      <span style={{ background: s.color, color: "#fff", fontSize: 8, fontWeight: 700, borderRadius: 3, padding: "1px 4px" }}>{s.id}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>{s.title}</span>
                    </div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package */}
          <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)", borderRadius: 10, padding: "14px 16px", marginBottom: 18, color: "#fff" }}>
            <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 9 }}>📦 पैकेज बोली — एकाधिक कार्यों की ID लिंकेज</div>
            <div style={{ display: "flex", gap: 7 }}>
              {["कार्य 1","कार्य 2","कार्य 3","कार्य 4"].map((w,i) => (
                <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: 7, padding: "8px", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10 }}>
                  <div style={{ fontWeight: 700, color: "#7dd3fc", marginBottom: 4 }}>{w}</div>
                  {["AS ID","FS ID","TS ID","BOQ ID"].map(id => <div key={id} style={{ color: "#94a3b8", padding: "1px 0" }}>↳ {id}</div>)}
                  <div style={{ color: "#fbbf24", fontWeight: 600, marginTop: 4 }}>↓ WO ID (साझा)</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: "#64748b" }}>⚠️ एक साझा Work Order — परन्तु सभी कार्यों की IDs अलग-अलग लिंक।</div>
          </div>

          {/* Part C: Bill */}
          <div style={{ borderLeft: "4px solid #0ea5e9", paddingLeft: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#0ea5e9" }}>💳 भाग ग — बिल एवं भुगतान</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Bill Preparation & Payment via PFMS</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7, marginBottom: 18 }}>
            {billFlow.map(b => (
              <div key={b.id} style={{ position: "relative", background: b.bg, border: `1.5px solid ${b.border}`, borderRadius: 9, padding: "10px 8px", textAlign: "center" }}>
                <BmBtn itemKey={`print-bill-${b.id}`} icon={b.icon} title={b.title} subtitle={b.id} color={b.color} />
                <div style={{ fontSize: 20 }}>{b.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: b.color, margin: "4px 0 2px" }}>{b.title}</div>
                <div style={{ fontSize: 9, color: "#64748b", lineHeight: 1.5 }}>{b.desc}</div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div style={{ background: "#fffbeb", border: "2px solid #fde68a", borderRadius: 10, padding: "12px 16px", marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#92400e", marginBottom: 8 }}>⚠️ महत्वपूर्ण बिंदु</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {notes.map((n,i) => (
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 12 }}>{n.icon}</span>
                  <span style={{ fontSize: 10, color: "#78350f", lineHeight: 1.5 }}>{n.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Glossary */}
          <div style={{ borderLeft: "4px solid #475569", paddingLeft: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#475569" }}>📖 शब्द-कोश / Glossary</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 5, marginBottom: 16 }}>
            {glossary.map(g => (
              <div key={g.abbr} style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 7, padding: "6px 10px" }}>
                <span style={{ fontWeight: 800, color: "#1e40af", fontSize: 11 }}>{g.abbr}</span>
                <span style={{ color: "#94a3b8", fontSize: 9, margin: "0 3px" }}>·</span>
                <span style={{ fontSize: 10, color: "#374151" }}>{g.full}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "2px solid #e2e8f0", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>IFMS Rajasthan · मंत्रालयी स्टाफ प्रशिक्षण सामग्री</div>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>सभी IDs IFMS में परस्पर स्वतः लिंक होती हैं</div>
          </div>
        </div>
      </div>

      <style>{`@media print { .no-print { display: none !important; } #print-page { box-shadow: none !important; } }`}</style>
    </div>
  );
}
