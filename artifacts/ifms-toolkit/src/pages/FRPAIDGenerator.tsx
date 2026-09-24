import { useMemo, useState } from "react";

type IdType = "TS" | "WO" | "FDPAID";

function compactDate(value: string) {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}${month}${year.slice(-2)}` : "000000";
}

function cleanPart(value: string, fallback: string) {
  const cleaned = value.trim().toUpperCase().replace(/[^A-Z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}

export default function FRPAIDGenerator() {
  const today = new Date().toISOString().slice(0, 10);
  const [idType, setIdType] = useState<IdType>("FDPAID");
  const [division, setDivision] = useState("7542");
  const [date, setDate] = useState(today);
  const [serial, setSerial] = useState("01");
  const [workCode, setWorkCode] = useState("KACHRULAL");
  const [workName, setWorkName] = useState("नाली निर्माण एवं सुदृढ़ीकरण कार्य");
  const [amount, setAmount] = useState("500000");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const preview = useMemo(() => {
    return `${idType}/${cleanPart(division, "0000")}/${compactDate(date)}/${cleanPart(serial, "01").padStart(2, "0")}/${cleanPart(workCode, "WORK")}`;
  }, [idType, division, date, serial, workCode]);

  function generate() {
    setGenerated(preview);
    setCopied(false);
  }

  async function copyId() {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div style={{ padding: "22px 20px" }}>
      <div style={{ background: "linear-gradient(135deg,#312e81,#4f46e5 56%,#7c3aed)", color: "#fff", borderRadius: 18, padding: "22px 24px", marginBottom: 16, boxShadow: "0 10px 30px rgba(79,70,229,0.23)" }}>
        <div style={{ fontSize: 11, letterSpacing: 1.4, opacity: 0.75, fontWeight: 800 }}>IFMS ID MODULE · TRAINING DEMO</div>
        <h2 style={{ margin: "6px 0 5px", fontSize: 23, fontWeight: 900 }}>TS / WO / FDPAID ID बनाएं</h2>
        <p style={{ margin: 0, maxWidth: 720, color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.65 }}>
          एक ही जगह से TS, WO या FDPAID का training/demo ID format तैयार करें। Official portal की वास्तविक ID को ही final record में मानें।
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)", gap: 16, alignItems: "start" }}>
        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 18, boxShadow: "0 4px 18px rgba(15,23,42,0.06)" }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#1e293b", marginBottom: 4 }}>ID का भाग और विवरण भरें</div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>उदाहरण: <code style={{ color: "#4f46e5" }}>FDPAID/7542/240926/01/KACHRULAL</code></div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 5, fontSize: 11, fontWeight: 800, color: "#475569" }}>
              ID का प्रकार
              <select value={idType} onChange={e => setIdType(e.target.value as IdType)} style={{ width: "100%", padding: "10px 11px", border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit", fontSize: 13, color: "#1e293b", background: "#fff" }}>
                <option value="TS">TS — Technical Sanction</option>
                <option value="WO">WO — Work Order</option>
                <option value="FDPAID">FDPAID — FDPAID ID</option>
              </select>
            </label>
            <label style={{ display: "grid", gap: 5, fontSize: 11, fontWeight: 800, color: "#475569" }}>
              Division / Office code
              <input value={division} onChange={e => setDivision(e.target.value)} placeholder="7542" style={{ width: "100%", boxSizing: "border-box", padding: "10px 11px", border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit", fontSize: 13 }} />
            </label>
            <label style={{ display: "grid", gap: 5, fontSize: 11, fontWeight: 800, color: "#475569" }}>
              Date
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "10px 11px", border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit", fontSize: 13 }} />
            </label>
            <label style={{ display: "grid", gap: 5, fontSize: 11, fontWeight: 800, color: "#475569" }}>
              Serial
              <input value={serial} onChange={e => setSerial(e.target.value)} placeholder="01" inputMode="numeric" style={{ width: "100%", boxSizing: "border-box", padding: "10px 11px", border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit", fontSize: 13 }} />
            </label>
            <label style={{ display: "grid", gap: 5, fontSize: 11, fontWeight: 800, color: "#475569", gridColumn: "1 / -1" }}>
              Work code / short name
              <input value={workCode} onChange={e => setWorkCode(e.target.value)} placeholder="KACHRULAL" style={{ width: "100%", boxSizing: "border-box", padding: "10px 11px", border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit", fontSize: 13 }} />
            </label>
            <label style={{ display: "grid", gap: 5, fontSize: 11, fontWeight: 800, color: "#475569", gridColumn: "1 / -1" }}>
              Work name
              <input value={workName} onChange={e => setWorkName(e.target.value)} placeholder="कार्य का नाम" style={{ width: "100%", boxSizing: "border-box", padding: "10px 11px", border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit", fontSize: 13 }} />
            </label>
            <label style={{ display: "grid", gap: 5, fontSize: 11, fontWeight: 800, color: "#475569", gridColumn: "1 / -1" }}>
              Work Order amount (₹)
              <input value={amount} onChange={e => setAmount(e.target.value)} type="number" min="0" placeholder="500000" style={{ width: "100%", boxSizing: "border-box", padding: "10px 11px", border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit", fontSize: 13 }} />
            </label>
          </div>

          <div style={{ marginTop: 16, padding: "12px 14px", background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 10 }}>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: 800, marginBottom: 4 }}>LIVE PREVIEW</div>
            <code style={{ fontSize: 15, fontWeight: 900, color: "#4338ca", overflowWrap: "anywhere" }}>{preview}</code>
          </div>
          <button onClick={generate} style={{ width: "100%", marginTop: 14, padding: "11px 16px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#4338ca,#7c3aed)", color: "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(67,56,202,0.25)" }}>🔑 {idType} ID Generate करें</button>
        </section>

        <aside style={{ display: "grid", gap: 12 }}>
          <div style={{ background: generated ? "#eef2ff" : "#f8fafc", border: `1.5px solid ${generated ? "#a5b4fc" : "#e2e8f0"}`, borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#475569", marginBottom: 8 }}>Generated ID</div>
            {generated ? (
              <>
                <code style={{ display: "block", background: "#fff", border: "1px solid #c7d2fe", borderRadius: 9, padding: "13px 12px", color: "#312e81", fontSize: 15, fontWeight: 900, overflowWrap: "anywhere", lineHeight: 1.5 }}>{generated}</code>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={copyId} style={{ flex: 1, padding: "9px 10px", borderRadius: 8, border: "1px solid #818cf8", background: "#fff", color: "#4338ca", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>{copied ? "✓ Copied" : "📋 Copy ID"}</button>
                  <button onClick={() => window.print()} style={{ flex: 1, padding: "9px 10px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", color: "#475569", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🖨️ Print</button>
                </div>
              </>
            ) : (
              <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>ऊपर details भरकर Generate दबाएँ। ID यहाँ दिखाई देगी।</div>
            )}
          </div>

          <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 16, padding: 16 }}>
            <div style={{ color: "#92400e", fontSize: 12, fontWeight: 900, marginBottom: 6 }}>⚠️ जरूरी सावधानी</div>
            <div style={{ color: "#78350f", fontSize: 12, lineHeight: 1.65 }}>
              यह training/demo generator है। वास्तविक IFMS में official portal द्वारा बनने वाली TS, WO या FDPAID ID को ही record में नोट करें।
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#334155", marginBottom: 10 }}>तीनों ID parts</div>
            {[
              ["TS", "Technical Sanction"],
              ["WO", "Work Order"],
              ["FDPAID", "FDPAID process ID"],
            ].map(([part, meaning]) => (
              <div key={part} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "7px 0", borderBottom: "1px solid #f1f5f9", fontSize: 11 }}>
                <code style={{ color: "#4f46e5", fontWeight: 800 }}>{part}</code>
                <span style={{ color: "#64748b", textAlign: "right" }}>{meaning}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}