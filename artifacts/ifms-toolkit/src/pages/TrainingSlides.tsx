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
  const selected = slideMeta[selectedSerial];
  const selectedIndex = serials.indexOf(selectedSerial);
  const color = groupColors[selected.group] ?? "#1d4ed8";

  function move(delta: number) {
    const nextIndex = Math.min(serials.length - 1, Math.max(0, selectedIndex + delta));
    setSelectedSerial(serials[nextIndex]);
  }

  return (
    <div style={{ padding: "10px 10px" }}>
      <div style={{ background: "linear-gradient(135deg,#172554,#1d4ed8 58%,#0891b2)", color: "#fff", borderRadius: 18, padding: "8px 10px", marginBottom: 8, boxShadow: "0 10px 30px rgba(29,78,216,0.22)" }}>
        <div style={{ fontSize: 11, letterSpacing: 1.4, opacity: 0.75, fontWeight: 800 }}>FDPAID ID SEGMENT · SCREENSHOT WALKTHROUGH</div>
        <h2 style={{ margin: "4px 0 3px", fontSize: 19, fontWeight: 900 }}>FDPAID ID की slides — क्रम से सीखें</h2>
        <p style={{ margin: 0, maxWidth: 720, color: "rgba(255,255,255,0.78)", fontSize: 12, lineHeight: 1.5 }}>
          यह पूरा अलग section केवल FDPAID ID process के लिए है। Attached screenshots को उनके serial के क्रम में रखा गया है और हर screen के नीचे सरल Hindi निर्देश दिया गया है।
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          <span style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.24)", borderRadius: 999, padding: "4px 9px", fontSize: 11, fontWeight: 700 }}>57 screens</span>
          <span style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.24)", borderRadius: 999, padding: "5px 11px", fontSize: 11, fontWeight: 700 }}>Serial 3 → 59</span>
          <span style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.24)", borderRadius: 999, padding: "5px 11px", fontSize: 11, fontWeight: 700 }}>केवल FDPAID ID segment</span>
        </div>
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
            <img src={slidePath(selectedSerial)} alt={`IFMS training screenshot ${selectedSerial}`} style={{ display: "block", width: "100%", height: "min(78vh, 900px)", objectFit: "contain", borderRadius: 10, border: "1px solid #cbd5e1", background: "#fff" }} />
          </div>
          <div style={{ padding: "9px 12px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: `${color}0d`, border: `1px solid ${color}35`, borderRadius: 11, padding: "12px 14px" }}>
              <span style={{ fontSize: 20 }}>💡</span>
              <div>
                <div style={{ fontSize: 11, color, fontWeight: 900, marginBottom: 3 }}>इस screen पर क्या करना है?</div>
                <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.5 }}>{selected.instruction}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 14 }}>
              <button onClick={() => move(-1)} disabled={selectedIndex === 0} style={{ flex: 1, padding: "8px 10px", borderRadius: 9, border: "1px solid #cbd5e1", background: selectedIndex === 0 ? "#f8fafc" : "#fff", color: selectedIndex === 0 ? "#94a3b8" : "#1e40af", fontWeight: 800, cursor: selectedIndex === 0 ? "not-allowed" : "pointer", fontFamily: "inherit" }}>← पिछली slide</button>
              <button onClick={() => move(1)} disabled={selectedIndex === serials.length - 1} style={{ flex: 1, padding: "10px 14px", borderRadius: 9, border: "none", background: selectedIndex === serials.length - 1 ? "#cbd5e1" : "linear-gradient(135deg,#1d4ed8,#4f46e5)", color: "#fff", fontWeight: 800, cursor: selectedIndex === serials.length - 1 ? "not-allowed" : "pointer", fontFamily: "inherit" }}>अगली slide →</button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}