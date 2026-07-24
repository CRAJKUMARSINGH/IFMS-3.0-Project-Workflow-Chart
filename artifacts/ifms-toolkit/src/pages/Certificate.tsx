import { useRef } from "react";

interface CertProps {
  name: string;
  dept: string;
  score: number;
  total: number;
  date: string;
  onClose: () => void;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function gradeLabel(pct: number) {
  if (pct >= 90) return "Distinction / उत्कृष्ट";
  if (pct >= 80) return "First Class / प्रथम श्रेणी";
  return "Second Class / द्वितीय श्रेणी";
}

export default function Certificate({ name, dept, score, total, date, onClose }: CertProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const pct = Math.round((score / total) * 100);

  function handlePrint() {
    window.print();
  }

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className="cert-backdrop"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px", overflowY: "auto",
        }}
      >
        <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 720 }}>

          {/* Action bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>🖨️ Print या Ctrl+P से PDF save करें</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handlePrint}
                style={{ padding: "8px 20px", background: "linear-gradient(135deg,#1e40af,#4f46e5)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
              >
                🖨️ Print / Save PDF
              </button>
              <button
                onClick={onClose}
                style={{ padding: "8px 16px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
              >
                ✕ बंद करें
              </button>
            </div>
          </div>

          {/* Certificate */}
          <div
            ref={certRef}
            id="training-certificate"
            style={{
              background: "#fff",
              fontFamily: "'Segoe UI','Noto Sans Devanagari',Georgia,serif",
              position: "relative",
              padding: "48px 52px",
              borderRadius: 4,
              boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
            }}
          >
            {/* Outer decorative border */}
            <div style={{
              position: "absolute", inset: 12,
              border: "3px solid #1e3a8a",
              borderRadius: 2, pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", inset: 18,
              border: "1px solid #93c5fd",
              borderRadius: 1, pointerEvents: "none",
            }} />

            {/* Corner ornaments */}
            {[
              { top: 22, left: 22 },
              { top: 22, right: 22 },
              { bottom: 22, left: 22 },
              { bottom: 22, right: 22 },
            ].map((style, i) => (
              <div key={i} style={{
                position: "absolute", ...style,
                width: 28, height: 28,
                border: "2px solid #1e3a8a",
                background: "#dbeafe",
                transform: "rotate(45deg)",
              }} />
            ))}

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginBottom: 10 }}>
                <div style={{ fontSize: 44, lineHeight: 1 }}>🏛️</div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#475569", fontWeight: 700, textTransform: "uppercase" }}>Government of Rajasthan</div>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: "#64748b", textTransform: "uppercase" }}>Public Works Department</div>
                </div>
                <div style={{ fontSize: 44, lineHeight: 1 }}>🏗️</div>
              </div>
              <div style={{ width: "60%", height: 1.5, background: "linear-gradient(to right, transparent, #1e3a8a, transparent)", margin: "0 auto 12px" }} />
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#1e3a8a", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
                Integrated Financial Management System
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#1e3a8a", letterSpacing: 1 }}>
                Certificate of Training Completion
              </div>
              <div style={{ fontSize: 14, color: "#374151", fontWeight: 600, marginTop: 4 }}>
                IFMS प्रशिक्षण पूर्णता प्रमाण-पत्र
              </div>
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              <span style={{ fontSize: 18, color: "#1e3a8a" }}>✦</span>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>

            {/* Body text */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10, letterSpacing: 0.5 }}>
                This is to certify that / यह प्रमाणित किया जाता है कि
              </div>

              <div style={{
                fontSize: 30, fontWeight: 900, color: "#1e3a8a",
                borderBottom: "2px solid #93c5fd", display: "inline-block",
                padding: "4px 32px 6px", marginBottom: 12, letterSpacing: 0.5,
              }}>
                {name}
              </div>

              {dept && (
                <div style={{ fontSize: 14, color: "#374151", marginBottom: 12, fontWeight: 600 }}>
                  {dept}
                </div>
              )}

              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.9, maxWidth: 480, margin: "0 auto" }}>
                has successfully completed the mandatory training on the{" "}
                <strong style={{ color: "#1e3a8a" }}>Integrated Financial Management System (IFMS), Rajasthan</strong>
                {" "}covering complete workflow from work conception to bill payment,
                WAM &amp; vendor registration, ID linkage, and payment processing procedures.
              </div>
            </div>

            {/* Score band */}
            <div style={{
              background: "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#4f46e5 100%)",
              borderRadius: 10, padding: "16px 28px", marginBottom: 28,
              display: "flex", justifyContent: "space-around", alignItems: "center", gap: 16,
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 1, marginBottom: 2 }}>SCORE / अंक</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{score}/{total}</div>
              </div>
              <div style={{ width: 1, height: 44, background: "rgba(255,255,255,0.2)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 1, marginBottom: 2 }}>PERCENTAGE / प्रतिशत</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#fde68a" }}>{pct}%</div>
              </div>
              <div style={{ width: 1, height: 44, background: "rgba(255,255,255,0.2)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 1, marginBottom: 2 }}>GRADE / दर्जा</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#86efac" }}>{gradeLabel(pct)}</div>
              </div>
            </div>

            {/* Date + Signatures */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#1e293b", marginBottom: 2 }}>दिनांक / Date</div>
                <div style={{ fontSize: 14, color: "#1d4ed8", fontWeight: 700, borderBottom: "1.5px solid #93c5fd", paddingBottom: 4 }}>
                  {fmtDate(date)}
                </div>
                <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>Date of Completion</div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 2 }}>🏆</div>
                <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: 1 }}>IFMS RAJASTHAN</div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ height: 36, borderBottom: "1.5px solid #1e3a8a", width: 160, marginBottom: 4 }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>Authorised Signatory</div>
                <div style={{ fontSize: 9, color: "#94a3b8" }}>Training Coordinator</div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 8, color: "#94a3b8", letterSpacing: 0.5 }}>
                This certificate is generated digitally. Verify at ifms.rajasthan.gov.in
              </div>
              <div style={{ fontSize: 8, color: "#94a3b8" }}>
                Cert ID: IFMS-{new Date(date).getFullYear()}-{Math.abs(name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 7).toString(16).toUpperCase().slice(0, 8)}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media print {
          body > * { display: none !important; }
          .cert-backdrop { display: block !important; position: static !important; background: none !important; padding: 0 !important; }
          #training-certificate { box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>
    </>
  );
}
