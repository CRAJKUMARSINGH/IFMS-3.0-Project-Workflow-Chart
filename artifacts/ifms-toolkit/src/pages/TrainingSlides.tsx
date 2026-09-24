import { useState } from "react";

type SlideMeta = {
  title: string;
  instruction: string;
  group: string;
  action?: string;
};

const slideMeta: Record<number, SlideMeta> = {
  3: { group: "आरम्भिक कार्य", title: "WAM Dashboard खोलें", instruction: "Dashboard पर अपने कार्य, BOQ और sanction की वर्तमान स्थिति देखें।", action: "Dashboard" },
  4: { group: "आरम्भिक कार्य", title: "Create FDSID / A&T चुनें", instruction: "Initiate Tasks में जाकर नया कार्य शुरू करने वाला विकल्प चुनें।", action: "Initiate Tasks" },
  5: { group: "आरम्भिक कार्य", title: "कार्य का विवरण भरें", instruction: "कार्य का नाम, कार्यालय और आवश्यक प्रारम्भिक विवरण सही-सही भरें।", action: "Create FDSID / A&T" },
  6: { group: "आरम्भिक कार्य", title: "Maker से Checker को भेजें", instruction: "Maker द्वारा जाँच पूरी होने पर आवेदन Checker के लिए forward करें।", action: "Forward" },
  7: { group: "आरम्भिक कार्य", title: "Checker का Inbox देखें", instruction: "Forward किया गया आवेदन Checker के Inbox में दिखाई देगा।", action: "Inbox" },
  8: { group: "आरम्भिक कार्य", title: "Checker को फिर forward करें", instruction: "Checker विवरण देखकर आवेदन को अगले अधिकारी की ओर forward करें।", action: "Forward" },
  9: { group: "आरम्भिक कार्य", title: "OTP से forward पूरा करें", instruction: "Raghvendra, PWD Jaipur को भेजते समय OTP दर्ज करके प्रक्रिया पूरी करें।", action: "OTP" },
  10: { group: "आपत्ति प्रक्रिया", title: "आवेदन की स्थिति देखें", instruction: "Forward के बाद आवेदन Inbox और Timeline में किस स्थिति में है, यह देखें।", action: "Timeline" },
  11: { group: "आपत्ति प्रक्रिया", title: "एक महीने की आपत्ति अवधि", instruction: "आपत्तियों की प्रक्रिया लगभग एक महीने तक चल सकती है। इस दौरान Timeline देखते रहें।", action: "Objection period" },
  12: { group: "आपत्ति प्रक्रिया", title: "Outbox Timeline पढ़ें", instruction: "Timeline से पता चलता है कि Head Office ने आवेदन पर क्या कार्रवाई की है।", action: "Outbox" },
  13: { group: "आपत्ति प्रक्रिया", title: "आपत्ति Inbox में मिलेगी", instruction: "किसी भी objection पर वही कार्य Inbox में वापस दिखाई देगा।", action: "Inbox" },
  14: { group: "आपत्ति प्रक्रिया", title: "आपत्ति का कारण पहचानें", instruction: "Timeline में देखें कि कौन-सा दस्तावेज़ या कौन-सी जानकारी अधूरी है।", action: "Timeline" },
  15: { group: "आपत्ति प्रक्रिया", title: "दस्तावेज़ संलग्न करें", instruction: "माँगा गया paper या supporting document जोड़ें; जो काम दूसरे कार्यालय का है उसे अलग पहचानें।", action: "Documents" },
  16: { group: "आपत्ति प्रक्रिया", title: "आवश्यक विवरण पूरा करें", instruction: "2026-27 और 2027-28 का खर्च, demography details और अन्य जरूरी जानकारी भरें।", action: "Details" },
  17: { group: "आपत्ति प्रक्रिया", title: "उचित reply दर्ज करें", instruction: "आपत्ति का स्पष्ट और तथ्यात्मक उत्तर दें, फिर save करें।", action: "Reply" },
  18: { group: "आपत्ति प्रक्रिया", title: "OTP से reply forward करें", instruction: "Reply को Raghvendra, PWD Jaipur को OTP के साथ forward करें।", action: "OTP" },
  19: { group: "आपत्ति प्रक्रिया", title: "निराकरण की पुष्टि करें", instruction: "आपत्ति का निराकरण होने तक Inbox और Timeline में status जाँचते रहें।", action: "Status" },
  20: { group: "Work Assigned", title: "Work Assigned में कार्य देखें", instruction: "आपत्ति दूर होने के बाद कार्य का नाम Work Assigned में दिखाई देगा।", action: "Work Assigned" },
  21: { group: "Work Assigned", title: "AE को manage करने के लिए mark करें", instruction: "कार्य दिखने पर उसे Concerned AE को manage करने के लिए mark करें।", action: "Manage" },
  22: { group: "Work Assigned", title: "कार्य का विवरण खोलें", instruction: "कार्य की details खोलकर assignment और estimate की अगली कार्रवाई देखें।", action: "Details" },
  23: { group: "Work Assigned", title: "Assigned work की जाँच", instruction: "हर गुरुवार Work Assigned देखें और नया कार्य मिलने पर समय पर कार्रवाई करें।", action: "Weekly check" },
  24: { group: "Work Assigned", title: "AS / FS proposal form", instruction: "Documents, terms और constituency details जाँचकर आवेदन को approval के लिए आगे भेजें।", action: "Approve & Forward" },
  25: { group: "Estimate", title: "Works menu खोलें", instruction: "Works के अंतर्गत Approved AS/FS और Technical Sanction के विकल्प दिखाई देते हैं।", action: "Works" },
  26: { group: "Estimate", title: "Technical Sanction चुनें", instruction: "Concerned AE के लिए detailed estimate तैयार करने की प्रक्रिया यहीं से शुरू करें।", action: "Technical Sanction" },
  27: { group: "Estimate", title: "Estimate list देखें", instruction: "पहले से बने estimate और उनकी current status की सूची देखें।", action: "Estimate list" },
  28: { group: "Estimate", title: "नया detailed estimate बनाएँ", instruction: "Create New Detail Estimate चुनकर नया estimate बनाना शुरू करें।", action: "Create" },
  29: { group: "Estimate", title: "कार्य चुनें", instruction: "सही project estimate और assignment को चुनकर आगे बढ़ें।", action: "Select" },
  30: { group: "Estimate", title: "Estimate का विवरण भरें", instruction: "कार्य का नाम, लागत और तकनीकी विवरण भरने के बाद save करें।", action: "Save" },
  31: { group: "Estimate", title: "AE assignment जाँचें", instruction: "Estimate सही Concerned AE को assigned है या नहीं, यह जाँच लें।", action: "Assignment" },
  32: { group: "Estimate", title: "Detailed estimate तैयार करें", instruction: "मदवार quantity, rate और राशि भरकर detailed estimate पूरा करें।", action: "Detail estimate" },
  33: { group: "Estimate", title: "Estimate submit करें", instruction: "AE द्वारा estimate पूरा करने के बाद उसे EE को submission के लिए भेजें।", action: "Submit" },
  34: { group: "Estimate", title: "Assignment चुनकर save करें", instruction: "Details Estimate Name और assignment चुनें; सही maker दिखाई देने पर Save करें।", action: "Save" },
  35: { group: "Approval", title: "Submission Inbox देखें", instruction: "Create Estimate के रूप में आया task Inbox में खोलें।", action: "Inbox" },
  36: { group: "Approval", title: "Estimate task खोलें", instruction: "Inbox में task चुनकर estimate की entries और संलग्न दस्तावेज़ जाँचें।", action: "Open task" },
  37: { group: "Approval", title: "E-sign करके approve करें", instruction: "जाँच पूरी होने पर estimate को e-sign करके approval दें।", action: "E-sign" },
  38: { group: "Approval", title: "Serial number भरें", instruction: "उदाहरण format में serial दर्ज करें: TS/7542/230926/01/KACHRULAL।", action: "Serial" },
  39: { group: "Technical Sanction", title: "Approved Technical Sanction देखें", instruction: "Approval के बाद Technical Sanction सूची में record दिखाई देगा।", action: "Approved TS" },
  40: { group: "Technical Sanction", title: "TS ID नोट करें", instruction: "Technical Sanction की ID सुरक्षित लिख लें; आगे BOQ और bid में यही काम आएगी।", action: "TS ID" },
  41: { group: "BOQ", title: "Generate BOQ शुरू करें", instruction: "Initiate Tasks में Generate BOQ चुनें और संबंधित कार्य खोलें।", action: "Generate BOQ" },
  42: { group: "BOQ", title: "Create BOQ चुनें", instruction: "Works → BOQ → Create BOQ के क्रम में जाएँ।", action: "Create BOQ" },
  43: { group: "BOQ", title: "कार्य और items चुनें", instruction: "सही Technical Sanction और work items select करके BOQ बनाएँ।", action: "Select" },
  44: { group: "BOQ", title: "Approved BOQ देखें", instruction: "BOQ approve होने के बाद Approved BOQ सूची में record दिखाई देगा।", action: "Approved BOQ" },
  45: { group: "BOQ", title: "BOQ ID नोट करें", instruction: "BOQ ID लिखकर रखें; Bid Details और आगे की entries में यही ID चाहिए।", action: "BOQ ID" },
  46: { group: "Bid", title: "Bid Details खोलें", instruction: "Initiate Tasks → Initiate Bid Details पर जाएँ।", action: "Bid Details" },
  47: { group: "Bid", title: "BOQ ID से record fetch करें", instruction: "BOQ ID भरें और Fetch दबाकर संबंधित BOQ record लाएँ।", action: "Fetch" },
  48: { group: "Bid", title: "BOQ record में Edit खोलें", instruction: "BOQ की आखिरी Action column में Edit पर क्लिक करें।", action: "Edit" },
  49: { group: "Bid", title: "eProc ID भरें", instruction: "eProc ID दर्ज करें और Save दबाएँ।", action: "Save" },
  50: { group: "Bid", title: "Tender bid शुरू करें", instruction: "Initiate Bid Details में BOQ ID भरकर tender की जानकारी दर्ज करें।", action: "Initiate" },
  51: { group: "Bid", title: "Vendor ID और premium भरें", instruction: "Vendor ID डालें; कम दर हो तो premium में minus sign लगाएँ, जैसे -8.99।", action: "Vendor ID" },
  52: { group: "Bid", title: "Work Order amount जाँचें", instruction: "नई amount नीचे दिखाई देगी; यही Work Order amount होगी।", action: "Amount" },
  53: { group: "Bid", title: "प्रतिशत वाली राशियाँ भरें", instruction: "Work Order amount के अनुसार 1%, 1.5% और 0.13325 गुणा वाली राशि भरें।", action: "Calculations" },
  54: { group: "Bid", title: "Bid save और e-sign करें", instruction: "Entry save करें; task Inbox में आने पर उसे e-sign करें।", action: "E-sign" },
  55: { group: "Sanction Letter", title: "Sanction Letter शुरू करें", instruction: "Initiate Tasks → Initiate Sanction Letter चुनें।", action: "Sanction Letter" },
  56: { group: "Sanction Letter", title: "BOQ ID fetch करें", instruction: "BOQ ID भरकर Fetch करें और demographic details दर्ज करें।", action: "Fetch" },
  57: { group: "Sanction Letter", title: "Demography details पूरा करें", instruction: "सभी demographic fields जाँचकर Save करें।", action: "Save" },
  58: { group: "Work Order", title: "Work Order बनाएँ", instruction: "Initiate Work Order में BOQ ID fetch करें, agreement number और dates भरें।", action: "Work Order" },
  59: { group: "Bill / MB", title: "Approved Abstract से bill देखें", instruction: "MB और abstract approve होने के बाद Approved Abstract list में bill record देखें।", action: "Approved Abstract" },
};

const serials = Array.from({ length: 57 }, (_, index) => index + 3);
const groupColors: Record<string, string> = {
  "आरम्भिक कार्य": "#2563eb",
  "आपत्ति प्रक्रिया": "#d97706",
  "Work Assigned": "#7c3aed",
  "Estimate": "#0891b2",
  Approval: "#0f766e",
  "Technical Sanction": "#dc2626",
  BOQ: "#ca8a04",
  Bid: "#4f46e5",
  "Sanction Letter": "#be185d",
  "Work Order": "#0369a1",
  "Bill / MB": "#15803d",
};

function slidePath(serial: number) {
  return `/training-slides/slide-${String(serial).padStart(2, "0")}.png`;
}

export default function TrainingSlides() {
  const [selectedSerial, setSelectedSerial] = useState(3);
  const [showBudgetModule, setShowBudgetModule] = useState(false);
  const selected = slideMeta[selectedSerial];
  const selectedIndex = serials.indexOf(selectedSerial);
  const color = groupColors[selected.group] ?? "#1d4ed8";

  function move(delta: number) {
    const nextIndex = Math.min(serials.length - 1, Math.max(0, selectedIndex + delta));
    setSelectedSerial(serials[nextIndex]);
  }

  if (showBudgetModule) return <BudgetPlanningModule onBack={() => setShowBudgetModule(false)} />;

  return (
    <div style={{ padding: "10px 10px" }}>
      <div style={{ background: "linear-gradient(135deg,#172554,#1d4ed8 58%,#0891b2)", color: "#fff", borderRadius: 18, padding: "12px 14px", marginBottom: 8, boxShadow: "0 10px 30px rgba(29,78,216,0.22)" }}>
        <div style={{ fontSize: 11, letterSpacing: 1.4, opacity: 0.75, fontWeight: 800 }}>FDPAID ID SEGMENT · SCREENSHOT WALKTHROUGH</div>
        <h2 style={{ margin: "4px 0 3px", fontSize: 19, fontWeight: 900 }}>FDPAID ID की slides — क्रम से सीखें</h2>
        <p style={{ margin: 0, maxWidth: 720, color: "rgba(255,255,255,0.78)", fontSize: 12, lineHeight: 1.5 }}>
          यह पूरा अलग section केवल FDPAID ID process के लिए है। Attached screenshots को उनके serial के क्रम में रखा गया है और हर screen के नीचे सरल Hindi निर्देश दिया गया है।
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          <span style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.24)", borderRadius: 999, padding: "4px 9px", fontSize: 11, fontWeight: 700 }}>57 screens</span>
          <span style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.24)", borderRadius: 999, padding: "4px 9px", fontSize: 11, fontWeight: 700 }}>Serial 3 → 59</span>
          <span style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.24)", borderRadius: 999, padding: "4px 9px", fontSize: 11, fontWeight: 700 }}>केवल FDPAID ID segment</span>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, margin: "0 0 10px", padding: "12px 14px", borderRadius: 14, border: "1px solid #bfdbfe", background: "linear-gradient(110deg,#eff6ff,#f0fdfa)" }}>
        <div><div style={{ color: "#1d4ed8", fontSize: 11, fontWeight: 900 }}>नया सीखने वाला submodule</div><div style={{ color: "#334155", fontSize: 13, marginTop: 3 }}>Budget Head, समय-सीमा और financial bifurcation को उदाहरणों के साथ समझें।</div></div>
        <button onClick={() => setShowBudgetModule(true)} style={{ border: 0, borderRadius: 9, padding: "9px 13px", background: "linear-gradient(135deg,#1d4ed8,#0f766e)", color: "#fff", fontWeight: 800, fontFamily: "inherit", cursor: "pointer" }}>Budget & Planning खोलें →</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 10, alignItems: "start" }}>
        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 18px rgba(15,23,42,0.06)" }}>
          <div style={{ padding: "9px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", borderBottom: "1px solid #e2e8f0" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: color, color: "#fff", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 800 }}>स्लाइड {selectedSerial}</span>
                <span style={{ color, fontSize: 12, fontWeight: 800 }}>{selected.group}</span>
              </div>
              <h3 style={{ margin: "5px 0 0", fontSize: 18, color: "#1e293b" }}>{selected.title}</h3>
            </div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>{selectedIndex + 1} / {serials.length}</div>
          </div>
          <div style={{ background: "#eef2f7", padding: 6 }}>
            <img src={slidePath(selectedSerial)} alt={`IFMS training screenshot ${selectedSerial}`} style={{ display: "block", width: "100%", height: "auto", maxHeight: "min(78vh, 900px)", objectFit: "contain", borderRadius: 10, border: "1px solid #cbd5e1", background: "#fff" }} />
          </div>
          <div style={{ padding: "9px 12px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: `${color}0d`, border: `1px solid ${color}35`, borderRadius: 11, padding: "8px 10px" }}>
              <span style={{ fontSize: 20 }}>💡</span>
              <div>
                <div style={{ fontSize: 11, color, fontWeight: 900, marginBottom: 3 }}>इस screen पर क्या करना है?</div>
                <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.5 }}>{selected.instruction}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 8 }}>
              <button onClick={() => move(-1)} disabled={selectedIndex === 0} style={{ flex: 1, padding: "8px 10px", borderRadius: 9, border: "1px solid #cbd5e1", background: selectedIndex === 0 ? "#f8fafc" : "#fff", color: selectedIndex === 0 ? "#94a3b8" : "#1e40af", fontWeight: 800, cursor: selectedIndex === 0 ? "not-allowed" : "pointer", fontFamily: "inherit" }}>← पिछली slide</button>
              <button onClick={() => move(1)} disabled={selectedIndex === serials.length - 1} style={{ flex: 1, padding: "8px 10px", borderRadius: 9, border: "none", background: selectedIndex === serials.length - 1 ? "#cbd5e1" : "linear-gradient(135deg,#1d4ed8,#4f46e5)", color: "#fff", fontWeight: 800, cursor: selectedIndex === serials.length - 1 ? "not-allowed" : "pointer", fontFamily: "inherit" }}>अगली slide →</button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

type BudgetPlanningModuleProps = { onBack: () => void };
function recommendedWorkMonths(amountLakhs: number) { return amountLakhs <= 50 ? 6 : amountLakhs <= 100 ? 9 : amountLakhs <= 150 ? 12 : 15; }
function addCalendarMonths(date: Date, months: number) { const result = new Date(date); const day = result.getDate(); result.setDate(1); result.setMonth(result.getMonth() + months); const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate(); result.setDate(Math.min(day, lastDay)); return result; }
function fyText(year: number) { return String(year) + "–" + String((year + 1) % 100).padStart(2, "0"); }

function BudgetPlanningModule({ onBack }: BudgetPlanningModuleProps) {
  const [amountLakhs, setAmountLakhs] = useState(80);
  const [startDate, setStartDate] = useState("2026-06-01");
  const [workMonths, setWorkMonths] = useState(9);
  const [fyYear, setFyYear] = useState(2026);
  const [crossYearShare, setCrossYearShare] = useState(40);
  const recommendedMonths = recommendedWorkMonths(amountLakhs);
  const start = startDate ? new Date(startDate + "T00:00:00") : null;
  const completion = start && !Number.isNaN(start.getTime()) ? addCalendarMonths(start, workMonths) : null;
  const fyStart = new Date(fyYear, 3, 1);
  const fyEnd = new Date(fyYear + 1, 2, 31, 23, 59, 59, 999);
  const startsInFY = Boolean(start && start >= fyStart && start <= fyEnd);
  const finishesInFY = Boolean(startsInFY && completion && completion <= fyEnd);
  const statusText = startsInFY ? (finishesInFY ? "चुने FY के भीतर" : "FY boundary पार / जाँच आवश्यक") : "start date चुने FY के बाहर—share verify करें";
  const firstPercent = finishesInFY ? 100 : Math.max(0, Math.min(100, crossYearShare));
  const total = Math.max(0, Math.round(amountLakhs * 100000));
  const fyAmount = Math.round(total * firstPercent / 100);
  const nextAmount = total - fyAmount;
  const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const dateLabel = (d: Date | null) => d ? d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "तारीख चुनें";
  const examples = [
    { title: "आपका example 1", amount: "राशि brief में नहीं दी गई", schedule: "काम जून 2026 तक शुरू · 8 महीने · समाप्ति फरवरी 2027", split: "भुगतान भी FY में हो तो 2026–27: 100%" },
    { title: "आपका example 2", amount: "राशि brief में नहीं दी गई", schedule: "Brief में समाप्ति मई 2027 दी गई है", split: "2026–27: 70% · 2027–28: 30%", note: "तारीख जाँचें: यदि tender award दिसंबर 2026 में हो और उसके बाद पूरे 8 महीने काम चले, तो समाप्ति लगभग अगस्त 2027 होगी—मई नहीं। 70/30 को वास्तविक schedule से सत्यापित करें।" },
    { title: "अतिरिक्त example 1 · ₹45 लाख", amount: "₹50 लाख तक → 6 महीने", schedule: "काम जून 2026 में शुरू · दिसंबर 2026 में पूरा", split: "यदि भुगतान उसी FY में पूरा हो: 2026–27 में 100%" },
    { title: "अतिरिक्त example 2 · ₹80 लाख", amount: "₹50 लाख–₹1 करोड़ → 9 महीने", schedule: "काम सितंबर 2026 में शुरू · जून 2027 में पूरा", split: "FY पार होगा; 40/60 brief का baseline है, actual cash-flow से तय करें" },
    { title: "अतिरिक्त example 3 · ₹1.2 करोड़", amount: "₹1–1.5 करोड़ → 12 महीने", schedule: "काम अप्रैल 2026 में शुरू · अप्रैल 2027 में पूरा", split: "FY पार होगा; actual schedule के अनुसार राशि बाँटें" },
    { title: "अतिरिक्त example 4 · ₹1.8 करोड़", amount: "₹1.5 करोड़ से अधिक → 15 महीने", schedule: "काम अप्रैल 2026 में शुरू · जुलाई 2027 में पूरा", split: "FY पार होगा; actual schedule के अनुसार राशि बाँटें" },
  ];
  const card = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 15 };
  return <div style={{ padding: "12px 10px 24px", maxWidth: 1100, margin: "0 auto" }}>
    <button onClick={onBack} style={{ border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", color: "#1e40af", padding: "8px 11px", fontWeight: 800, fontFamily: "inherit", cursor: "pointer", marginBottom: 12 }}>← वापस screenshot slides पर</button>
    <header style={{ padding: "18px 20px", borderRadius: 18, color: "#fff", background: "linear-gradient(135deg,#172554,#1d4ed8 55%,#0f766e)", marginBottom: 14 }}><div style={{ fontSize: 11, letterSpacing: 1.2, fontWeight: 800, opacity: 0.8 }}>TRAINING SUBMODULE · DECISION GUIDE</div><h2 style={{ margin: "5px 0", fontSize: 24, fontWeight: 900 }}>Budget Head → समय → Financial Bifurcation</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.84)", fontSize: 13, lineHeight: 1.6 }}>पहले sanction letter से सही head जाँचें, फिर duration और tender schedule से FY-wise अनुमान बनाएँ।</p></header>
    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12, marginBottom: 12 }}>
      <article style={card}><div style={{ color: "#1d4ed8", fontSize: 11, fontWeight: 900 }}>1 · BUDGET HEAD</div><h3 style={{ margin: "6px 0 8px", fontSize: 18 }}>Sanction letter से head तय करें</h3><p style={{ margin: "0 0 10px", color: "#475569", fontSize: 13, lineHeight: 1.55 }}>Head और Centre/State share sanction letter से मिलाएँ; समान दिखने वाले काम से अनुमान न लगाएँ।</p><div style={{ background: "#eff6ff", borderRadius: 10, padding: 11, color: "#1e3a8a", fontSize: 13, lineHeight: 1.6 }}><strong>दिया गया sample:</strong> 4059 — Centre 60% · 4049 — State 40%. केवल उदाहरण; वास्तविक share अपने sanction letter से verify करें।</div></article>
      <article style={card}><div style={{ color: "#0f766e", fontSize: 11, fontWeight: 900 }}>2 · काम का प्रकार</div><h3 style={{ margin: "6px 0 8px", fontSize: 18 }}>फिर सही category चुनें</h3><ul style={{ margin: 0, paddingLeft: 19, color: "#475569", fontSize: 13, lineHeight: 1.75 }}><li>Road maintenance: brief के अनुसार non-scheme head.</li><li>Building work: अलग head.</li><li>AS head तभी चुनें जब work category और sanction-letter entry मेल खाएँ।</li></ul><div style={{ marginTop: 10, background: "#f0fdfa", borderRadius: 10, padding: 10, color: "#115e59", fontSize: 12, lineHeight: 1.55 }}>Trial-and-error के बजाय letter में head/code, scheme status और share जाँचें।</div></article>
    </section>
    <section style={{ ...card, marginBottom: 12 }}><div style={{ color: "#7c3aed", fontSize: 11, fontWeight: 900 }}>3 · TIME BAND</div><h3 style={{ margin: "6px 0 12px", fontSize: 18 }}>राशि से प्रारम्भिक work duration चुनें</h3><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 9 }}>{[["₹50 लाख तक", "6 महीने"], ["₹50 लाख से अधिक–₹1 करोड़ तक", "9 महीने"], ["₹1 करोड़ से अधिक–₹1.5 करोड़ तक", "12 महीने"], ["₹1.5 करोड़ से अधिक", "15 महीने"]].map(([band, months]) => <div key={band} style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 10, padding: 12 }}><div style={{ color: "#5b21b6", fontSize: 12, fontWeight: 800 }}>{band}</div><div style={{ fontSize: 20, fontWeight: 900, marginTop: 4 }}>{months}</div></div>)}</div><p style={{ margin: "10px 0 0", color: "#64748b", fontSize: 12 }}>Brief के planning bands; अवधि approved estimate, tender और work order से मिलाएँ।</p></section>
    <section style={{ ...card, marginBottom: 12 }}><div style={{ color: "#c2410c", fontSize: 11, fontWeight: 900 }}>4 · FINANCIAL BIFURCATION</div><h3 style={{ margin: "6px 0 8px", fontSize: 18 }}>Tender position से FY-wise खर्च समझें</h3><ol style={{ margin: 0, paddingLeft: 20, color: "#334155", fontSize: 13, lineHeight: 1.75 }}><li>Tender/award की वास्तविक तारीख लिखें।</li><li>Work duration जोड़कर completion date निकालें।</li><li>31 March से तुलना करें; उसी FY में पूरा होने का example 100% है।</li><li>FY पार हो तो expected bills/progress से split करें; brief का 40/60 baseline या example-specific 70/30 तभी लगाएँ जब schedule support करे।</li></ol><p style={{ margin: "10px 0 0", color: "#9a3412", background: "#ffedd5", borderRadius: 9, padding: 10, fontSize: 12 }}>सिर्फ completion date से 40/60 या 70/30 तय नहीं होता। Approved cash-flow और payment schedule verify करें।</p></section>
    <section style={{ ...card, background: "#f8fafc", marginBottom: 14 }}><div style={{ color: "#1d4ed8", fontSize: 11, fontWeight: 900 }}>INTERACTIVE ESTIMATE</div><h3 style={{ margin: "6px 0 4px", fontSize: 18 }}>Completion date और FY share का अभ्यास करें</h3><p style={{ margin: "0 0 12px", color: "#64748b", fontSize: 12 }}>Cross-year case में 40% शुरुआती मान है; schedule देखकर इसे बदलें, जैसे दूसरे example में 70%।</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 10 }}>
        <label style={{ display: "grid", gap: 5, fontSize: 12, fontWeight: 700 }}>Project amount (लाख में)<input type="number" min="0" value={amountLakhs} onChange={e => setAmountLakhs(Math.max(0, Number(e.target.value) || 0))} style={{ padding: 9, border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit" }} /><span style={{ color: "#64748b", fontSize: 11 }}>Suggested duration: {recommendedMonths} महीने</span></label>
        <label style={{ display: "grid", gap: 5, fontSize: 12, fontWeight: 700 }}>Estimated start / award date<input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: 9, border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit" }} /></label>
        <label style={{ display: "grid", gap: 5, fontSize: 12, fontWeight: 700 }}>Planned work duration (महीने)<input type="number" min="1" max="60" value={workMonths} onChange={e => setWorkMonths(Math.max(1, Number(e.target.value) || 1))} style={{ padding: 9, border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit" }} /><button type="button" onClick={() => setWorkMonths(recommendedMonths)} style={{ border: 0, padding: 0, background: "transparent", color: "#1d4ed8", textAlign: "left", font: "inherit", fontSize: 11, cursor: "pointer" }}>Suggested अवधि लागू करें</button></label>
        <label style={{ display: "grid", gap: 5, fontSize: 12, fontWeight: 700 }}>Financial year<select value={fyYear} onChange={e => setFyYear(Number(e.target.value))} style={{ padding: 9, border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit" }}>{[2025, 2026, 2027, 2028, 2029].map(year => <option key={year} value={year}>{fyText(year)}</option>)}</select></label>
        {!finishesInFY && <label style={{ display: "grid", gap: 5, fontSize: 12, fontWeight: 700 }}>पहले FY में अनुमानित खर्च (%)<input type="number" min="0" max="100" value={crossYearShare} onChange={e => setCrossYearShare(Math.max(0, Math.min(100, Number(e.target.value) || 0)))} style={{ padding: 9, border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit" }} /><span style={{ color: "#64748b", fontSize: 11 }}>Brief baseline 40%; schedule के अनुसार बदलें।</span></label>}
      </div>
      <div style={{ marginTop: 12, padding: 13, borderRadius: 11, background: finishesInFY ? "#ecfdf5" : "#fff7ed", border: "1px solid " + (finishesInFY ? "#a7f3d0" : "#fed7aa") }}><div style={{ fontSize: 13, fontWeight: 900 }}>अनुमानित completion: {dateLabel(completion)} · {statusText}</div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 8, marginTop: 9, fontSize: 13 }}><div>FY {fyText(fyYear)} · {firstPercent}% · <strong>{money(fyAmount)}</strong></div><div>FY {fyText(fyYear + 1)} · {100 - firstPercent}% · <strong>{money(nextAmount)}</strong></div></div>{!finishesInFY && <div style={{ marginTop: 8, fontSize: 11 }}>गणना आपके डाले प्रतिशत से है—यह स्वतः स्वीकृत allocation नहीं है।</div>}</div>
    </section>
    <section style={{ marginBottom: 14 }}><h3 style={{ margin: "0 0 9px", fontSize: 18 }}>Worked examples · निर्णय का क्रम</h3><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 10 }}>{examples.map(example => <article key={example.title} style={card}><h4 style={{ margin: "0 0 6px", color: "#1e3a8a", fontSize: 14 }}>{example.title}</h4><div style={{ color: "#475569", fontSize: 12, lineHeight: 1.55 }}><strong>{example.amount}</strong><br />{example.schedule}<br /><strong>{example.split}</strong></div>{"note" in example && <div style={{ marginTop: 8, padding: 9, background: "#fff7ed", color: "#9a3412", borderRadius: 8, fontSize: 11, lineHeight: 1.5 }}>{example.note}</div>}</article>)}</div></section>
    <p style={{ margin: 0, padding: 11, borderRadius: 10, background: "#f1f5f9", color: "#64748b", fontSize: 11, lineHeight: 1.55 }}>Learning aid. Sanction letter, tender/work order, approved duration और actual cash-flow schedule अंतिम आधार हैं; sample head/percentages दूसरे काम पर स्वतः लागू न करें।</p>
  </div>;
}
