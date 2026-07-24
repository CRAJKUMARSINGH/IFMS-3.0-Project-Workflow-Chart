import { useState, useRef } from "react";

/* ── Types ─────────────────────────────────────────────────── */
type IdKind = "AS" | "FS" | "TS" | "BOQ" | "WO" | "Vendor" | "Bill";
type Status = "active" | "completed" | "pending" | "on-hold";

interface LinkedId {
  kind: IdKind;
  value: string;
  label: string;
}

interface Record {
  id: string;
  kind: IdKind;
  title: string;
  workName: string;
  department: string;
  district: string;
  amount: string;
  date: string;
  status: Status;
  linkedIds: LinkedId[];
  details: { label: string; value: string }[];
}

/* ── Mock Data ─────────────────────────────────────────────── */
const DB: Record[] = [
  {
    id: "AS/2024/PWD/0312",
    kind: "AS",
    title: "प्रशासनिक स्वीकृति",
    workName: "जयपुर-अजमेर मार्ग पर पुल निर्माण कार्य",
    department: "लोक निर्माण विभाग",
    district: "जयपुर",
    amount: "₹ 4,85,00,000",
    date: "12 मार्च 2024",
    status: "completed",
    linkedIds: [
      { kind: "FS", value: "FS/2024/PWD/0312", label: "वित्तीय स्वीकृति" },
      { kind: "TS", value: "TS/2024/PWD/0312", label: "तकनीकी स्वीकृति" },
      { kind: "BOQ", value: "BOQ/2024/PWD/0312", label: "BOQ" },
      { kind: "WO", value: "WO/2024/PWD/0312", label: "कार्यादेश" },
    ],
    details: [
      { label: "स्वीकृत अधिकारी", value: "प्रमुख शासन सचिव, PWD" },
      { label: "कार्य की श्रेणी", value: "पुल निर्माण (Major Bridge)" },
      { label: "अनुमानित अवधि", value: "24 माह" },
      { label: "वित्त वर्ष", value: "2024-25" },
    ],
  },
  {
    id: "FS/2024/PWD/0312",
    kind: "FS",
    title: "वित्तीय स्वीकृति",
    workName: "जयपुर-अजमेर मार्ग पर पुल निर्माण कार्य",
    department: "लोक निर्माण विभाग",
    district: "जयपुर",
    amount: "₹ 4,85,00,000",
    date: "28 मार्च 2024",
    status: "completed",
    linkedIds: [
      { kind: "AS", value: "AS/2024/PWD/0312", label: "प्रशासनिक स्वीकृति" },
      { kind: "TS", value: "TS/2024/PWD/0312", label: "तकनीकी स्वीकृति" },
      { kind: "BOQ", value: "BOQ/2024/PWD/0312", label: "BOQ" },
      { kind: "WO", value: "WO/2024/PWD/0312", label: "कार्यादेश" },
    ],
    details: [
      { label: "बजट शीर्ष", value: "2059-00-337-01" },
      { label: "धनराशि का स्रोत", value: "राज्य योजना" },
      { label: "स्वीकृत अधिकारी", value: "वित्त विभाग, राजस्थान" },
      { label: "वित्त वर्ष", value: "2024-25" },
    ],
  },
  {
    id: "TS/2024/PWD/0312",
    kind: "TS",
    title: "तकनीकी स्वीकृति",
    workName: "जयपुर-अजमेर मार्ग पर पुल निर्माण कार्य",
    department: "लोक निर्माण विभाग",
    district: "जयपुर",
    amount: "₹ 4,72,50,000",
    date: "15 अप्रैल 2024",
    status: "completed",
    linkedIds: [
      { kind: "AS", value: "AS/2024/PWD/0312", label: "प्रशासनिक स्वीकृति" },
      { kind: "FS", value: "FS/2024/PWD/0312", label: "वित्तीय स्वीकृति" },
      { kind: "BOQ", value: "BOQ/2024/PWD/0312", label: "BOQ" },
      { kind: "WO", value: "WO/2024/PWD/0312", label: "कार्यादेश" },
    ],
    details: [
      { label: "स्वीकृत अधिकारी", value: "अधीक्षण अभियंता, जयपुर Circle" },
      { label: "तकनीकी श्रेणी", value: "Category-A Bridge" },
      { label: "अभिकल्प आधार", value: "IRC:6-2017, IRC:112-2020" },
      { label: "जाँच दल", value: "SE/EE/AE, PWD Jaipur" },
    ],
  },
  {
    id: "BOQ/2024/PWD/0312",
    kind: "BOQ",
    title: "Bill of Quantities",
    workName: "जयपुर-अजमेर मार्ग पर पुल निर्माण कार्य",
    department: "लोक निर्माण विभाग",
    district: "जयपुर",
    amount: "₹ 4,72,50,000",
    date: "15 अप्रैल 2024",
    status: "completed",
    linkedIds: [
      { kind: "AS", value: "AS/2024/PWD/0312", label: "प्रशासनिक स्वीकृति" },
      { kind: "FS", value: "FS/2024/PWD/0312", label: "वित्तीय स्वीकृति" },
      { kind: "TS", value: "TS/2024/PWD/0312", label: "तकनीकी स्वीकृति" },
      { kind: "WO", value: "WO/2024/PWD/0312", label: "कार्यादेश" },
    ],
    details: [
      { label: "मदों की कुल संख्या", value: "47 Items" },
      { label: "प्रमुख सामग्री", value: "सीमेंट, स्टील, बजरी" },
      { label: "दर अनुसूची", value: "SSR 2024-25" },
      { label: "बोली का प्रकार", value: "e-Tender (Open)" },
    ],
  },
  {
    id: "WO/2024/PWD/0312",
    kind: "WO",
    title: "कार्यादेश",
    workName: "जयपुर-अजमेर मार्ग पर पुल निर्माण कार्य",
    department: "लोक निर्माण विभाग",
    district: "जयपुर",
    amount: "₹ 4,61,38,500",
    date: "20 जून 2024",
    status: "active",
    linkedIds: [
      { kind: "AS", value: "AS/2024/PWD/0312", label: "प्रशासनिक स्वीकृति" },
      { kind: "FS", value: "FS/2024/PWD/0312", label: "वित्तीय स्वीकृति" },
      { kind: "TS", value: "TS/2024/PWD/0312", label: "तकनीकी स्वीकृति" },
      { kind: "BOQ", value: "BOQ/2024/PWD/0312", label: "BOQ" },
      { kind: "Vendor", value: "VEN/2024/RAJ/00847", label: "विक्रेता" },
      { kind: "Bill", value: "BILL/2024/PWD/0312/01", label: "प्रथम बिल" },
    ],
    details: [
      { label: "ठेकेदार", value: "मेसर्स राजपूत कंस्ट्रक्शन प्रा.लि." },
      { label: "बोली राशि", value: "₹ 4,61,38,500 (97.7% of TS)" },
      { label: "कार्य पूर्ण की तिथि", value: "19 जून 2026" },
      { label: "कार्य की वर्तमान स्थिति", value: "35% पूर्ण" },
    ],
  },
  {
    id: "VEN/2024/RAJ/00847",
    kind: "Vendor",
    title: "विक्रेता",
    workName: "मेसर्स राजपूत कंस्ट्रक्शन प्रा.लि.",
    department: "लोक निर्माण विभाग",
    district: "जयपुर",
    amount: "—",
    date: "10 जून 2024",
    status: "active",
    linkedIds: [
      { kind: "WO", value: "WO/2024/PWD/0312", label: "कार्यादेश" },
      { kind: "Bill", value: "BILL/2024/PWD/0312/01", label: "प्रथम बिल" },
    ],
    details: [
      { label: "PAN", value: "AAACR1234C" },
      { label: "GST", value: "08AAACR1234C1Z5" },
      { label: "बैंक", value: "SBI, MI Road, Jaipur" },
      { label: "IFSC", value: "SBIN0001234" },
    ],
  },
  {
    id: "BILL/2024/PWD/0312/01",
    kind: "Bill",
    title: "प्रथम बिल (RAB-1)",
    workName: "जयपुर-अजमेर मार्ग पर पुल निर्माण कार्य",
    department: "लोक निर्माण विभाग",
    district: "जयपुर",
    amount: "₹ 58,42,000",
    date: "18 नवंबर 2024",
    status: "completed",
    linkedIds: [
      { kind: "WO", value: "WO/2024/PWD/0312", label: "कार्यादेश" },
      { kind: "Vendor", value: "VEN/2024/RAJ/00847", label: "विक्रेता" },
      { kind: "AS", value: "AS/2024/PWD/0312", label: "प्रशासनिक स्वीकृति" },
      { kind: "FS", value: "FS/2024/PWD/0312", label: "वित्तीय स्वीकृति" },
    ],
    details: [
      { label: "माप अधिकारी", value: "AEN राकेश शर्मा" },
      { label: "पास अधिकारी", value: "EE अनिल वर्मा" },
      { label: "भुगतान दिनांक", value: "25 नवंबर 2024" },
      { label: "भुगतान माध्यम", value: "PFMS / DBT" },
    ],
  },
  // Second project
  {
    id: "AS/2024/PWD/0189",
    kind: "AS",
    title: "प्रशासनिक स्वीकृति",
    workName: "उदयपुर जिले में ग्रामीण सड़क सुदृढ़ीकरण (पैकेज-3)",
    department: "लोक निर्माण विभाग",
    district: "उदयपुर",
    amount: "₹ 2,12,00,000",
    date: "5 जनवरी 2024",
    status: "completed",
    linkedIds: [
      { kind: "FS", value: "FS/2024/PWD/0189", label: "वित्तीय स्वीकृति" },
      { kind: "TS", value: "TS/2024/PWD/0189A", label: "TS — कार्य A" },
      { kind: "TS", value: "TS/2024/PWD/0189B", label: "TS — कार्य B" },
      { kind: "WO", value: "WO/2024/PWD/0189", label: "कार्यादेश (पैकेज)" },
    ],
    details: [
      { label: "पैकेज में कार्यों की संख्या", value: "2 (कार्य A + कार्य B)" },
      { label: "स्वीकृत अधिकारी", value: "प्रमुख शासन सचिव, PWD" },
      { label: "योजना", value: "PMGSY Phase-III" },
      { label: "वित्त वर्ष", value: "2024-25" },
    ],
  },
  {
    id: "WO/2024/PWD/0189",
    kind: "WO",
    title: "कार्यादेश (पैकेज बोली)",
    workName: "उदयपुर जिले में ग्रामीण सड़क सुदृढ़ीकरण (पैकेज-3)",
    department: "लोक निर्माण विभाग",
    district: "उदयपुर",
    amount: "₹ 2,05,60,000",
    date: "10 मार्च 2024",
    status: "on-hold",
    linkedIds: [
      { kind: "AS", value: "AS/2024/PWD/0189", label: "प्रशासनिक स्वीकृति" },
      { kind: "FS", value: "FS/2024/PWD/0189", label: "वित्तीय स्वीकृति" },
      { kind: "TS", value: "TS/2024/PWD/0189A", label: "TS — कार्य A" },
      { kind: "TS", value: "TS/2024/PWD/0189B", label: "TS — कार्य B" },
      { kind: "Vendor", value: "VEN/2024/RAJ/00412", label: "विक्रेता" },
    ],
    details: [
      { label: "ठेकेदार", value: "मेसर्स श्री निर्माण कंपनी" },
      { label: "नोट", value: "⚠️ भूमि अधिग्रहण विवाद — कार्य रोका गया" },
      { label: "पैकेज कार्य A", value: "TS ID: TS/2024/PWD/0189A" },
      { label: "पैकेज कार्य B", value: "TS ID: TS/2024/PWD/0189B" },
    ],
  },
];

const suggestions = [
  "AS/2024/PWD/0312",
  "FS/2024/PWD/0312",
  "TS/2024/PWD/0312",
  "BOQ/2024/PWD/0312",
  "WO/2024/PWD/0312",
  "VEN/2024/RAJ/00847",
  "BILL/2024/PWD/0312/01",
  "AS/2024/PWD/0189",
  "WO/2024/PWD/0189",
];

/* ── Config ────────────────────────────────────────────────── */
const KIND_CONFIG: Record<IdKind, { color: string; bg: string; border: string; icon: string }> = {
  AS:     { color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd", icon: "🏛️" },
  FS:     { color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", icon: "💰" },
  TS:     { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: "✅" },
  BOQ:    { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", icon: "📋" },
  WO:     { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", icon: "📄" },
  Vendor: { color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", icon: "👤" },
  Bill:   { color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd", icon: "🧾" },
};

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; dot: string }> = {
  active:    { label: "सक्रिय",   color: "#15803d", bg: "#dcfce7", dot: "#22c55e" },
  completed: { label: "पूर्ण",    color: "#1d4ed8", bg: "#dbeafe", dot: "#3b82f6" },
  pending:   { label: "लंबित",    color: "#92400e", bg: "#fef3c7", dot: "#f59e0b" },
  "on-hold": { label: "रोका गया", color: "#991b1b", bg: "#fee2e2", dot: "#ef4444" },
};

/* ── Main Component ────────────────────────────────────────── */
export default function IFMSLookup() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Record | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function search(q: string) {
    const trimmed = q.trim().toUpperCase();
    setShowSuggestions(false);
    if (!trimmed) return;
    const found = DB.find((r) => r.id.toUpperCase() === trimmed);
    if (found) { setResult(found); setNotFound(false); }
    else       { setResult(null); setNotFound(true); }
  }

  function handleSuggestion(id: string) {
    setQuery(id);
    search(id);
  }

  function handleLinkedClick(id: string) {
    setQuery(id);
    search(id);
    inputRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const filtered = query
    ? suggestions.filter((s) => s.toUpperCase().includes(query.toUpperCase()))
    : suggestions;

  const cfg = result ? KIND_CONFIG[result.kind] : null;
  const sts = result ? STATUS_CONFIG[result.status] : null;

  return (
    <div style={{ fontFamily: "'Segoe UI','Noto Sans Devanagari',sans-serif", background: "#f1f5f9", minHeight: "100vh", padding: "0" }}>

      {/* ── Top Bar ── */}
      <div style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 55%,#4f46e5 100%)", padding: "20px 28px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 26 }}>🔍</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#fff" }}>IFMS ID खोज</h1>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
              AS / FS / TS / BOQ / WO / Vendor / Bill ID खोजें — सभी लिंक्ड ID तुरंत दिखाई देंगी
            </p>
          </div>
        </div>

        {/* Search box */}
        <div style={{ display: "flex", gap: 8, position: "relative" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); setNotFound(false); }}
              onKeyDown={(e) => e.key === "Enter" && search(query)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="जैसे: AS/2024/PWD/0312 या WO/2024/PWD/0312"
              style={{
                width: "100%", padding: "12px 16px", fontSize: 14, borderRadius: 10,
                border: "none", outline: "none", boxSizing: "border-box",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)", fontFamily: "inherit",
              }}
            />
            {showSuggestions && filtered.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                zIndex: 100, overflow: "hidden",
              }}>
                {filtered.map((s) => {
                  const kind = s.split("/")[0] as IdKind;
                  const k = KIND_CONFIG[kind] ?? KIND_CONFIG.AS;
                  return (
                    <div
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f1f5f9", background: "#fff" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                    >
                      <span style={{ fontSize: 14 }}>{KIND_CONFIG[kind]?.icon}</span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{s}</span>
                      <span style={{ background: k.bg, color: k.color, fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 7px", border: `1px solid ${k.border}` }}>{kind}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <button
            onClick={() => search(query)}
            style={{ padding: "12px 22px", background: "#fff", color: "#1d4ed8", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}
          >
            खोजें
          </button>
        </div>

        {/* Quick chips */}
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          {(["AS", "FS", "TS", "BOQ", "WO", "Vendor", "Bill"] as IdKind[]).map((k) => (
            <span
              key={k}
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)" }}
              onClick={() => { setQuery(k + "/"); setShowSuggestions(true); inputRef.current?.focus(); }}
            >
              {KIND_CONFIG[k].icon} {k}
            </span>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "20px 28px", maxWidth: 1000, margin: "0 auto" }} onClick={() => setShowSuggestions(false)}>

        {/* Not Found */}
        {notFound && (
          <div style={{ background: "#fef2f2", border: "2px solid #fecaca", borderRadius: 12, padding: "20px 24px", textAlign: "center", color: "#991b1b" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔎</div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>ID नहीं मिली</div>
            <div style={{ fontSize: 13, marginTop: 4, opacity: 0.8 }}>कृपया सही ID दर्ज करें। नीचे उदाहरण ID देखें।</div>
          </div>
        )}

        {/* Result */}
        {result && cfg && sts && (
          <div>
            {/* Result Header */}
            <div style={{ background: cfg.bg, border: `2px solid ${cfg.border}`, borderRadius: 16, padding: "18px 22px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 5, flexWrap: "wrap" }}>
                      <span style={{ background: cfg.color, color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 10px" }}>{result.kind}</span>
                      <span style={{ background: sts.bg, color: sts.color, fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: sts.dot, display: "inline-block" }} />
                        {sts.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#1e293b" }}>{result.title}</div>
                    <div style={{ fontSize: 13, color: "#374151", marginTop: 3 }}>{result.workName}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{result.department} · {result.district}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: cfg.color }}>{result.amount}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>दिनांक: {result.date}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 12, color: "#475569", marginTop: 4, background: "#fff", borderRadius: 6, padding: "3px 8px", border: `1px solid ${cfg.border}` }}>{result.id}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {/* Linked IDs */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                  <span>🔗</span> लिंक्ड ID ({result.linkedIds.length})
                </div>
                {result.linkedIds.map((l) => {
                  const lc = KIND_CONFIG[l.kind];
                  return (
                    <div
                      key={l.value}
                      onClick={() => handleLinkedClick(l.value)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#fff", border: `1.5px solid ${lc.border}`, borderRadius: 10, marginBottom: 7, cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = lc.bg; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
                    >
                      <span style={{ fontSize: 18 }}>{lc.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{l.label}</div>
                        <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: lc.color }}>{l.value}</div>
                      </div>
                      <span style={{ background: lc.bg, color: lc.color, fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 7px", border: `1px solid ${lc.border}` }}>{l.kind}</span>
                      <span style={{ color: lc.color, fontSize: 14 }}>→</span>
                    </div>
                  );
                })}
              </div>

              {/* Details */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                  <span>📋</span> विवरण
                </div>
                <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
                  {result.details.map((d, i) => (
                    <div key={i} style={{ display: "flex", padding: "10px 14px", borderBottom: i < result.details.length - 1 ? "1px solid #f1f5f9" : "none", gap: 12 }}>
                      <span style={{ fontSize: 11, color: "#94a3b8", minWidth: 130, flexShrink: 0 }}>{d.label}</span>
                      <span style={{ fontSize: 12, color: "#1e293b", fontWeight: 600 }}>{d.value}</span>
                    </div>
                  ))}
                </div>

                {/* Timeline indicator */}
                <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 8 }}>📍 IFMS चरण स्थिति</div>
                  {(["AS", "FS", "TS", "BOQ", "WO", "Vendor", "Bill"] as IdKind[]).map((k) => {
                    const linked = result.linkedIds.some((l) => l.kind === k) || result.kind === k;
                    const isCurrent = result.kind === k;
                    const kc = KIND_CONFIG[k];
                    return (
                      <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: isCurrent ? kc.color : linked ? kc.color + "88" : "#e2e8f0", flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: isCurrent ? kc.color : linked ? "#374151" : "#cbd5e1", fontWeight: isCurrent ? 800 : 400 }}>
                          {kc.icon} {k}
                          {isCurrent && <span style={{ marginLeft: 4, fontSize: 9, background: kc.color, color: "#fff", borderRadius: 4, padding: "1px 5px" }}>← यह ID</span>}
                        </span>
                        {linked && !isCurrent && <span style={{ fontSize: 9, color: "#94a3b8" }}>✓ लिंक्ड</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !notFound && (
          <div>
            <div style={{ textAlign: "center", padding: "30px 0 20px", color: "#64748b" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🔎</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>कोई भी IFMS ID खोजें</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>ऊपर ID दर्ज करें या नीचे उदाहरण पर क्लिक करें</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#64748b", marginBottom: 10 }}>📌 उदाहरण ID — क्लिक करके देखें</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {DB.map((r) => {
                const rc = KIND_CONFIG[r.kind];
                const rs = STATUS_CONFIG[r.status];
                return (
                  <div
                    key={r.id}
                    onClick={() => handleSuggestion(r.id)}
                    style={{ display: "flex", gap: 10, padding: "12px 14px", background: "#fff", border: `1.5px solid ${rc.border}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = rc.bg; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
                  >
                    <span style={{ fontSize: 20 }}>{rc.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: 5, marginBottom: 3, flexWrap: "wrap" }}>
                        <span style={{ background: rc.color, color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 6px" }}>{r.kind}</span>
                        <span style={{ background: rs.bg, color: rs.color, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 6px" }}>{rs.label}</span>
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: rc.color }}>{r.id}</div>
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.workName}</div>
                    </div>
                    <span style={{ color: rc.color, fontSize: 14, alignSelf: "center" }}>→</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
