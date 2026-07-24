import { useState, useCallback } from "react";
import { saveAttempt } from "@/hooks/useProgress";

interface Question {
  id: number;
  category: "workflow" | "ids" | "wam" | "payment";
  difficulty: "easy" | "medium" | "hard";
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  // ── WORKFLOW ──
  { id: 1, category: "workflow", difficulty: "easy",
    q: "नए कार्य की प्रक्रिया में सबसे पहला चरण कौन सा होता है?",
    options: ["तकनीकी स्वीकृति (TS)", "नए काम की कल्पना / प्रस्ताव", "बोली आमंत्रण", "कार्यादेश जारी करना"],
    answer: 1, explanation: "सबसे पहले अभियंता / राजनीतिक नेता / जनता की माँग से नए कार्य का प्रस्ताव (Work Conception) उत्पन्न होता है।" },

  { id: 2, category: "workflow", difficulty: "easy",
    q: "प्रशासनिक स्वीकृति (AS) से पहले कौन सा चरण होता है?",
    options: ["तकनीकी स्वीकृति", "विस्तृत आकलन", "प्रारंभिक आकलन", "बोली आमंत्रण"],
    answer: 2, explanation: "AS से पहले अभियंता प्रारंभिक आकलन (Preliminary Estimate) तैयार करता है। इसी के आधार पर प्रशासनिक स्वीकृति मिलती है।" },

  { id: 3, category: "workflow", difficulty: "medium",
    q: "निम्नलिखित में से सही क्रम कौन सा है?",
    options: [
      "AS → FS → BOQ → TS → Tender → WO",
      "AS → FS → TS → BOQ → Tender → WO",
      "FS → AS → TS → BOQ → WO → Tender",
      "Tender → AS → FS → TS → BOQ → WO",
    ],
    answer: 0, explanation: "सही क्रम है: प्रशासनिक स्वीकृति (AS) → वित्तीय स्वीकृति (FS) → विस्तृत आकलन + BOQ → तकनीकी स्वीकृति (TS) → बोली (Tender) → कार्यादेश (WO)।" },

  { id: 4, category: "workflow", difficulty: "easy",
    q: "कार्यादेश (Work Order) किसे जारी किया जाता है?",
    options: ["विभाग के अभियंता को", "वित्त विभाग को", "चयनित ठेकेदार को", "जिला कलेक्टर को"],
    answer: 2, explanation: "बोली स्वीकृति के बाद चुने गए ठेकेदार (Contractor) को Work Order जारी किया जाता है।" },

  { id: 5, category: "workflow", difficulty: "medium",
    q: "बोली (Tender) आमंत्रित करने से पहले क्या अनिवार्य रूप से तैयार होना चाहिए?",
    options: ["केवल प्रारंभिक आकलन", "AS और FS दोनों", "AS, FS, TS और BOQ — सभी", "केवल तकनीकी स्वीकृति"],
    answer: 2, explanation: "बोली BOQ के आधार पर आमंत्रित की जाती है। BOQ तैयार होने के लिए TS आवश्यक है, TS के लिए AS और FS का होना अनिवार्य है। अतः सभी चार — AS, FS, TS, BOQ — बोली से पहले होने चाहिए।" },

  // ── IDs ──
  { id: 6, category: "ids", difficulty: "easy",
    q: "IFMS में AS ID कब उत्पन्न होती है?",
    options: ["तकनीकी स्वीकृति के समय", "प्रशासनिक स्वीकृति के समय", "कार्यादेश जारी होने पर", "बोली स्वीकृति के समय"],
    answer: 1, explanation: "AS ID — Administrative Sanction (प्रशासनिक स्वीकृति) के समय IFMS में उत्पन्न होती है। यह प्रक्रिया की तीसरे चरण की ID है।" },

  { id: 7, category: "ids", difficulty: "easy",
    q: "WO ID का पूरा नाम क्या है?",
    options: ["Work Output ID", "Work Order ID", "Work Office ID", "Work Operation ID"],
    answer: 1, explanation: "WO = Work Order (कार्यादेश)। जब ठेकेदार को कार्यादेश जारी होता है तो IFMS में WO ID बनती है।" },

  { id: 8, category: "ids", difficulty: "medium",
    q: "IFMS में ID उत्पन्न होने का सही क्रम क्या है?",
    options: [
      "WO → AS → FS → TS → BOQ → Vendor → Bill",
      "AS → FS → BOQ → TS → WO → Vendor → Bill",
      "AS → FS → TS → BOQ → WO → Vendor → Bill",
      "FS → AS → BOQ → TS → WO → Bill → Vendor",
    ],
    answer: 2, explanation: "AS → FS → TS → BOQ → WO → Vendor ID → Bill ID — यही सही क्रम है। Vendor ID बिल से पहले बनाई जाती है, Bill सबसे अंत में।" },

  { id: 9, category: "ids", difficulty: "hard",
    q: "यदि एक पैकेज बोली में 3 अलग-अलग कार्य हैं तो IFMS में Work Order कितने होंगे?",
    options: ["3 — प्रत्येक कार्य का अलग WO", "6 — हर कार्य के 2 WO", "1 — तीनों कार्यों का एक साझा WO", "कोई WO नहीं"],
    answer: 2, explanation: "पैकेज बोली में एक ही साझा Work Order जारी होता है, परन्तु उस WO से तीनों कार्यों की AS, FS, TS और BOQ IDs को अलग-अलग लिंक किया जाता है।" },

  { id: 10, category: "ids", difficulty: "medium",
    q: "IFMS में ID लिंकेज का क्या अर्थ है?",
    options: [
      "अलग-अलग विभागों की IDs को email से शेयर करना",
      "किसी कार्य की सभी IDs (AS, FS, TS, BOQ, WO) का IFMS में परस्पर स्वचालित रूप से जुड़ना",
      "Excel में IDs की सूची बनाना",
      "ठेकेदार को ID की फोटोकॉपी देना",
    ],
    answer: 1, explanation: "IFMS में ID Linkage का अर्थ है — किसी एक कार्य की AS, FS, TS, BOQ और WO IDs IFMS में परस्पर स्वचालित रूप से जुड़ी रहती हैं, जिससे ट्रैकिंग आसान होती है।" },

  // ── WAM ──
  { id: 11, category: "wam", difficulty: "easy",
    q: "WAM का पूरा नाम क्या है?",
    options: ["Work Audit Module", "Work Accounting Module", "Work Authorization Manual", "Wage Approval Mechanism"],
    answer: 1, explanation: "WAM = Work Accounting Module। IFMS का यह मॉड्यूल कार्यों की वित्तीय प्रविष्टि एवं Work Order प्रबंधन के लिए उपयोग होता है।" },

  { id: 12, category: "wam", difficulty: "medium",
    q: "WAM में Work Order प्रविष्टि कब करनी होती है?",
    options: ["AS मिलने के बाद तुरंत", "बोली आमंत्रण से पहले", "Work Order जारी होने के बाद, बिल प्रस्तुत करने से पहले", "भुगतान के बाद"],
    answer: 2, explanation: "WAM में WO की प्रविष्टि Work Order जारी होने के बाद की जाती है। यह प्रविष्टि बिल प्रस्तुत करने से पहले अनिवार्य है।" },

  { id: 13, category: "wam", difficulty: "easy",
    q: "नए विक्रेता का IFMS में पंजीकरण कब करना होता है?",
    options: ["AS मिलने पर", "Work Order जारी होने पर", "प्रथम बिल प्रस्तुत करने से पहले", "भुगतान के बाद"],
    answer: 2, explanation: "यदि विक्रेता IFMS में नहीं है, तो प्रथम बिल प्रस्तुत करने से पहले उसका पंजीकरण अनिवार्य है। बिना Vendor ID के बिल पास नहीं होगा।" },

  { id: 14, category: "wam", difficulty: "hard",
    q: "पैकेज बोली में WAM के अंतर्गत ID लिंकेज के संबंध में निम्नलिखित में से क्या सही है?",
    options: [
      "एक WO ID से सभी कार्यों की IDs एक साथ batch में लिंक होती हैं",
      "प्रत्येक कार्य की AS, FS, TS, BOQ ID को उस साझा WO ID से अलग-अलग लिंक करना होता है",
      "पैकेज में ID लिंकेज की आवश्यकता नहीं होती",
      "केवल WO ID और Vendor ID लिंक करना पर्याप्त है",
    ],
    answer: 1, explanation: "पैकेज बोली में साझा WO ID होती है, परन्तु प्रत्येक कार्य की AS, FS, TS और BOQ IDs को उस WO ID से अलग-अलग लिंक करना अनिवार्य है। एक साथ batch लिंकेज की व्यवस्था नहीं है।" },

  // ── PAYMENT ──
  { id: 15, category: "payment", difficulty: "easy",
    q: "PFMS का पूरा नाम क्या है?",
    options: [
      "Public Finance Management System",
      "Public Financial Management System",
      "Project Fund Management System",
      "Payment and Finance Management Software",
    ],
    answer: 1, explanation: "PFMS = Public Financial Management System। भारत सरकार की यह प्रणाली IFMS के साथ मिलकर ठेकेदार के बैंक खाते में DBT भुगतान करती है।" },

  { id: 16, category: "payment", difficulty: "easy",
    q: "DBT का अर्थ क्या है?",
    options: ["Department Billing Transfer", "Direct Benefit Transfer", "Digital Bank Transaction", "Debit Before Transfer"],
    answer: 1, explanation: "DBT = Direct Benefit Transfer (प्रत्यक्ष लाभ अंतरण)। PFMS के माध्यम से भुगतान सीधे विक्रेता के बैंक खाते में DBT से होता है।" },

  { id: 17, category: "payment", difficulty: "medium",
    q: "बिल प्रस्तुत करने से पहले कौन से दस्तावेज़ / प्रविष्टियाँ अनिवार्य हैं?",
    options: [
      "केवल माप पुस्तिका (MB)",
      "MB + Vendor पंजीकरण + WAM में WO प्रविष्टि",
      "केवल WAM में WO प्रविष्टि",
      "केवल Vendor पंजीकरण",
    ],
    answer: 1, explanation: "बिल से पहले तीनों अनिवार्य हैं: (1) माप पुस्तिका (MB) में माप, (2) IFMS में Vendor पंजीकरण, और (3) WAM में Work Order की प्रविष्टि। किसी भी एक के अभाव में बिल पास नहीं होगा।" },

  { id: 18, category: "payment", difficulty: "medium",
    q: "माप पुस्तिका (Measurement Book) का क्या उद्देश्य है?",
    options: [
      "ठेकेदार की कंपनी का विवरण रखना",
      "कार्य की दरें दर्ज करना",
      "कार्यस्थल पर किए गए कार्य का वास्तविक माप दर्ज करना जो बिल का आधार बनता है",
      "विभाग के अधिकारियों की उपस्थिति दर्ज करना",
    ],
    answer: 2, explanation: "MB में अभियंता कार्यस्थल पर जाकर किए गए वास्तविक कार्य का माप दर्ज करते हैं। यही माप RAB / Final Bill का आधार होता है।" },

  { id: 19, category: "payment", difficulty: "hard",
    q: "Running Account Bill (RAB) और Final Bill में क्या मुख्य अंतर है?",
    options: [
      "RAB केवल सामग्री के लिए होता है, Final Bill श्रम के लिए",
      "RAB कार्य प्रगति के दौरान जारी होता है, Final Bill कार्य पूर्ण होने पर सम्पूर्ण हिसाब-किताब के साथ",
      "RAB ठेकेदार तैयार करता है, Final Bill अभियंता",
      "RAB PFMS से जारी होता है, Final Bill IFMS से",
    ],
    answer: 1, explanation: "RAB (Running Account Bill) कार्य की प्रगति के दौरान समय-समय पर जारी होता है जबकि Final Bill कार्य पूर्ण होने पर तैयार होता है और सभी पूर्व बिलों का समायोजन करता है।" },

  { id: 20, category: "payment", difficulty: "hard",
    q: "विक्रेता IFMS में बैंक खाता सत्यापन क्यों आवश्यक है?",
    options: [
      "केवल GST जाँच के लिए",
      "PFMS द्वारा DBT भुगतान सही बैंक खाते में जाए और कोई गड़बड़ी न हो इसलिए",
      "ठेकेदार की आयकर जाँच के लिए",
      "विभाग द्वारा लोन देने के लिए",
    ],
    answer: 1, explanation: "बैंक खाता सत्यापन PFMS आवश्यक है ताकि DBT भुगतान बिना किसी त्रुटि के सही ठेकेदार के खाते में जाए। गलत खाते से धन का दुरुपयोग हो सकता है।" },
];

const CATEGORY_LABELS: Record<Question["category"], { label: string; color: string; bg: string; icon: string }> = {
  workflow: { label: "कार्यप्रवाह",   color: "#6366f1", bg: "#eef2ff", icon: "📌" },
  ids:      { label: "ID लिंकेज",     color: "#0ea5e9", bg: "#f0f9ff", icon: "🔗" },
  wam:      { label: "WAM / विक्रेता", color: "#10b981", bg: "#ecfdf5", icon: "📋" },
  payment:  { label: "बिल / भुगतान",  color: "#f59e0b", bg: "#fffbeb", icon: "💸" },
};

const DIFF_LABELS: Record<Question["difficulty"], { label: string; color: string; stars: number }> = {
  easy:   { label: "आसान",   color: "#22c55e", stars: 1 },
  medium: { label: "मध्यम",  color: "#f59e0b", stars: 2 },
  hard:   { label: "कठिन",   color: "#ef4444", stars: 3 },
};

type Filter = "all" | Question["category"];
type Mode = "menu" | "quiz" | "review";

export default function Quiz() {
  const [mode, setMode] = useState<Mode>("menu");
  const [filter, setFilter] = useState<Filter>("all");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showReview, setShowReview] = useState(false);

  const startQuiz = useCallback((f: Filter) => {
    setFilter(f);
    const pool = f === "all" ? QUESTIONS : QUESTIONS.filter(q => q.category === f);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setAnswers(new Array(shuffled.length).fill(null));
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setShowReview(false);
    setMode("quiz");
  }, []);

  const confirmAnswer = () => {
    if (selected === null) return;
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    setConfirmed(true);
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      // Build category breakdown from this quiz's answers
      const categoryBreakdown: Record<string, { correct: number; total: number }> = {};
      for (const cat of ["workflow", "ids", "wam", "payment"] as Question["category"][]) {
        const catQs = questions.filter(q => q.category === cat);
        if (catQs.length > 0) {
          const correct = catQs.filter(q => answers[questions.indexOf(q)] === q.answer).length;
          categoryBreakdown[cat] = { correct, total: catQs.length };
        }
      }
      const finalScore = answers.filter((a, i) => a !== null && a === questions[i]?.answer).length;
      saveAttempt({
        category: filter,
        score: finalScore,
        total: questions.length,
        pct: Math.round((finalScore / questions.length) * 100),
        categoryBreakdown,
      });
      setMode("review");
    }
  };

  const score = answers.filter((a, i) => a === questions[i]?.answer).length;
  const q = questions[current];
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;

  // ── MENU ──
  if (mode === "menu") {
    return (
      <div style={{ padding: "24px 20px" }}>
        <div style={{ textAlign: "center", padding: "24px 0 20px" }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🎓</div>
          <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 900, color: "#1e293b" }}>IFMS स्व-परीक्षण क्विज़</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>IFMS Rajasthan — Self Assessment Quiz</p>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "#94a3b8" }}>20 प्रश्न · 4 श्रेणियाँ · 3 स्तर (आसान / मध्यम / कठिन)</p>
        </div>

        <div style={{ fontSize: 13, fontWeight: 800, color: "#64748b", marginBottom: 12 }}>📚 श्रेणी चुनें</div>

        <div onClick={() => startQuiz("all")} style={{ background: "linear-gradient(135deg,#1e3a8a,#4f46e5)", borderRadius: 14, padding: "18px 20px", marginBottom: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 6px 24px rgba(79,70,229,0.25)" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>📚</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>सभी श्रेणियाँ — All Categories</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>20 प्रश्न · सम्पूर्ण IFMS प्रक्रिया</div>
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 20 }}>→</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {(Object.entries(CATEGORY_LABELS) as [Question["category"], typeof CATEGORY_LABELS[Question["category"]]][]).map(([key, cat]) => {
            const count = QUESTIONS.filter(q => q.category === key).length;
            return (
              <div key={key} onClick={() => startQuiz(key)}
                style={{ background: "#fff", border: `2px solid ${cat.bg === "#eef2ff" ? "#c7d2fe" : cat.bg === "#f0f9ff" ? "#bae6fd" : cat.bg === "#ecfdf5" ? "#a7f3d0" : "#fde68a"}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = cat.bg; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{cat.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: cat.color }}>{cat.label}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{count} प्रश्न</div>
              </div>
            );
          })}
        </div>

        {/* Stats overview */}
        <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", border: "1.5px solid #e2e8f0" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#64748b", marginBottom: 10 }}>📊 प्रश्नों का वितरण</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "space-around" }}>
            {(["easy","medium","hard"] as Question["difficulty"][]).map(d => {
              const dl = DIFF_LABELS[d]; const cnt = QUESTIONS.filter(q => q.difficulty === d).length;
              return (
                <div key={d} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: 18, marginBottom: 2 }}>{"⭐".repeat(dl.stars)}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: dl.color }}>{cnt}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>{dl.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── REVIEW ──
  if (mode === "review") {
    const grade = pct >= 90 ? { label: "उत्कृष्ट! 🏆", color: "#15803d", bg: "#dcfce7" } : pct >= 70 ? { label: "बहुत अच्छा! 🎉", color: "#1d4ed8", bg: "#dbeafe" } : pct >= 50 ? { label: "ठीक है, और अभ्यास करें 📖", color: "#92400e", bg: "#fef3c7" } : { label: "फिर से पढ़ें और दोहराएँ 💪", color: "#991b1b", bg: "#fee2e2" };
    return (
      <div style={{ padding: "24px 20px" }}>
        <div style={{ textAlign: "center", background: grade.bg, borderRadius: 16, padding: "24px 20px", marginBottom: 20, border: `2px solid ${grade.color}44` }}>
          <div style={{ fontSize: 48, marginBottom: 6 }}>{pct >= 90 ? "🏆" : pct >= 70 ? "🎉" : pct >= 50 ? "📖" : "💪"}</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: grade.color }}>{grade.label}</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: grade.color, margin: "10px 0 4px" }}>{score}/{questions.length}</div>
          <div style={{ fontSize: 14, color: "#475569" }}>{pct}% सही उत्तर</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
            <button onClick={() => startQuiz(filter)} style={{ padding: "10px 20px", background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🔄 फिर से खेलें</button>
            <button onClick={() => setMode("menu")} style={{ padding: "10px 20px", background: "#fff", color: "#1d4ed8", border: "2px solid #1d4ed8", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🏠 मेनू पर जाएँ</button>
          </div>
        </div>

        {/* Per-category breakdown */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#475569", marginBottom: 10 }}>📊 श्रेणीवार प्रदर्शन</div>
          {(Object.entries(CATEGORY_LABELS) as [Question["category"], typeof CATEGORY_LABELS[Question["category"]]][]).map(([cat, cfg]) => {
            const catQs = questions.filter(q => q.category === cat);
            if (catQs.length === 0) return null;
            const correct = catQs.filter(q => answers[questions.indexOf(q)] === q.answer).length;
            const catPct = Math.round((correct / catQs.length) * 100);
            return (
              <div key={cat} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "11px 14px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{cfg.icon} {cfg.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: catPct >= 70 ? "#15803d" : "#dc2626" }}>{correct}/{catQs.length} ({catPct}%)</span>
                </div>
                <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${catPct}%`, background: catPct >= 70 ? "#22c55e" : catPct >= 50 ? "#f59e0b" : "#ef4444", borderRadius: 4, transition: "width 1s" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Answer review */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#475569", marginBottom: 10 }}>📝 सभी प्रश्नों की समीक्षा</div>
          {questions.map((q, i) => {
            const isCorrect = answers[i] === q.answer;
            const cat = CATEGORY_LABELS[q.category];
            const diff = DIFF_LABELS[q.difficulty];
            return (
              <div key={q.id} style={{ background: "#fff", border: `1.5px solid ${isCorrect ? "#a7f3d0" : "#fecaca"}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{isCorrect ? "✅" : "❌"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 5, marginBottom: 5, flexWrap: "wrap" }}>
                      <span style={{ background: cat.bg, color: cat.color, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 6px" }}>{cat.icon} {cat.label}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: diff.color, borderRadius: 4, padding: "1px 6px", background: "#f8fafc" }}>{"⭐".repeat(diff.stars)} {diff.label}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>प्र. {i + 1}: {q.q}</div>
                  </div>
                </div>
                {!isCorrect && answers[i] !== null && (
                  <div style={{ background: "#fef2f2", borderRadius: 8, padding: "7px 10px", marginBottom: 6, fontSize: 12, color: "#991b1b" }}>
                    ❌ आपका उत्तर: {q.options[answers[i]!]}
                  </div>
                )}
                <div style={{ background: "#ecfdf5", borderRadius: 8, padding: "7px 10px", marginBottom: 6, fontSize: 12, color: "#14532d" }}>
                  ✅ सही उत्तर: {q.options[q.answer]}
                </div>
                <div style={{ background: "#f0f9ff", borderRadius: 8, padding: "8px 10px", fontSize: 11, color: "#0c4a6e", lineHeight: 1.7 }}>
                  💡 {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── QUIZ ──
  if (!q) return null;
  const cat = CATEGORY_LABELS[q.category];
  const diff = DIFF_LABELS[q.difficulty];
  const isCorrect = confirmed && selected === q.answer;
  const isWrong   = confirmed && selected !== q.answer;
  const progress  = ((current + 1) / questions.length) * 100;
  const runningScore = answers.filter((a, i) => a !== null && a === questions[i]?.answer).length;

  return (
    <div style={{ padding: "0 0 24px" }}>
      {/* Progress bar header */}
      <div style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", padding: "14px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <button onClick={() => setMode("menu")} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 7, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>← वापस</button>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 10px" }}>{cat.icon} {cat.label}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>प्र. {current + 1}/{questions.length}</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 10px" }}>✅ {runningScore}</div>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "#fff", borderRadius: 3, transition: "width 0.4s" }} />
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {/* Question card */}
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "18px 18px 14px", marginBottom: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ background: cat.bg, color: cat.color, fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 8px" }}>{cat.icon} {cat.label}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: diff.color, borderRadius: 5, padding: "2px 8px", background: "#f8fafc" }}>{"⭐".repeat(diff.stars)} {diff.label}</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1e293b", lineHeight: 1.6 }}>{q.q}</div>
        </div>

        {/* Options */}
        <div style={{ marginBottom: 14 }}>
          {q.options.map((opt, i) => {
            let bg = "#fff", border = "#e2e8f0", textColor = "#1e293b", prefix = String.fromCharCode(65 + i);
            if (confirmed) {
              if (i === q.answer) { bg = "#ecfdf5"; border = "#22c55e"; textColor = "#14532d"; prefix = "✅"; }
              else if (i === selected && isWrong) { bg = "#fef2f2"; border = "#ef4444"; textColor = "#991b1b"; prefix = "❌"; }
              else { bg = "#f8fafc"; textColor = "#94a3b8"; }
            } else if (selected === i) {
              bg = cat.bg; border = cat.color; textColor = cat.color;
            }
            return (
              <div key={i} onClick={() => !confirmed && setSelected(i)}
                style={{ display: "flex", gap: 10, alignItems: "flex-start", background: bg, border: `2px solid ${border}`, borderRadius: 11, padding: "12px 14px", marginBottom: 8, cursor: confirmed ? "default" : "pointer", transition: "all 0.15s" }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: border === "#e2e8f0" ? "#f1f5f9" : border + "22", border: `1.5px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: border === "#e2e8f0" ? "#94a3b8" : textColor, flexShrink: 0 }}>{prefix}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: textColor, lineHeight: 1.5 }}>{opt}</span>
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {confirmed && (
          <div style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: 12, padding: "13px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0c4a6e", marginBottom: 5 }}>💡 व्याख्या / Explanation</div>
            <div style={{ fontSize: 13, color: "#0c4a6e", lineHeight: 1.7 }}>{q.explanation}</div>
          </div>
        )}

        {/* Result Banner */}
        {confirmed && (
          <div style={{ background: isCorrect ? "#ecfdf5" : "#fef2f2", border: `2px solid ${isCorrect ? "#22c55e" : "#ef4444"}`, borderRadius: 10, padding: "10px 14px", textAlign: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: isCorrect ? "#15803d" : "#991b1b" }}>
              {isCorrect ? "✅ बिल्कुल सही! शाबाश!" : "❌ गलत — सही उत्तर देखें ऊपर"}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        {!confirmed ? (
          <button onClick={confirmAnswer} disabled={selected === null}
            style={{ width: "100%", padding: "13px", background: selected === null ? "#94a3b8" : "linear-gradient(135deg,#1e40af,#4f46e5)", color: "#fff", border: "none", borderRadius: 11, fontSize: 14, fontWeight: 800, cursor: selected === null ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
            {selected === null ? "विकल्प चुनें" : "उत्तर दर्ज करें →"}
          </button>
        ) : (
          <button onClick={next}
            style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#1e40af,#4f46e5)", color: "#fff", border: "none", borderRadius: 11, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
            {current < questions.length - 1 ? "अगला प्रश्न →" : "परिणाम देखें 🏆"}
          </button>
        )}
      </div>
    </div>
  );
}
