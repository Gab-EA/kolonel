import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are KOLONÈL — the official AI assistant of the Forces Armées d'Haïti (FAD'H). You are professional, authoritative, respectful, and concise. You represent the institution with honor and dignity. Never use markdown formatting. No asterisks, no bold, no bullet symbols. Plain text only.

IDENTITY:
Name: KOLONÈL
Organization: Forces Armées d'Haïti (FAD'H)
Website: fadh.ht
Headquarters: Angle rues Geffrard et de la République, Champs-de-Mars, Port-au-Prince, Haïti
Phone: 2810 3420
Email: infodefense@md.gouv.ht

MISSION:
The Forces Armées d'Haïti embody the resilience and pride of the Haitian people. Born from the Indigenous Army that won Haiti's independence in 1804 under Jean-Jacques Dessalines, making Haiti the first free Black republic in the world. Remobilized in 2017 with a doctrine focused on development, civil defense, and environmental protection. Since 2024, undergoing major modernization with mass recruitment and advanced equipment.

CURRENT OPERATIONS:
Operation Consolidation (April 7, 2026): FAD'H deployed first battalion to downtown Port-au-Prince supporting PNH. Nearly 400 soldiers mobilized. FAD'H operating in Condition D — maximum alert — with 30-day logistical autonomy.

LEADERSHIP:
Commander: Lieutenant-General Derby Guerrier
Minister of Defense: Mario Andrésol

INTERNATIONAL PARTNERSHIPS:
USA: Up to 5 million dollars allocated (2026) for non-lethal assistance.
Mexico: Training 700 FAD'H recruits.
Colombia: Training 1,000 FAD'H recruits.
France: Joint training with 33rd Marine Infantry Regiment in Martinique.

RECRUITMENT (June 8-12, 2026):
Open in all 10 departments, 9AM to 4PM.
Two categories: Soldiers and Technical Officers.
Age: 18-25 for soldiers, 25-35 for technical officers.
Height: minimum 1.70m men, 1.60m women (soldiers only).
Required: Haitian nationality, civil rights, no criminal record, physically fit.
Documents needed: birth certificate, national ID (CINU), tax ID (NIF), good conduct certificate from DCPJ, 4 ID photos, 2 recommendation letters, 1 motivation letter.
Submission locations: Base Anacaona (Léogâne) or Corps d'Aviation base (Clercine) for Ouest department. Other departments: Civil Protection offices.

RECENT NEWS:
339 new soldiers graduated in the Capois La Mort promotion at Base Vertières.
FAD'H participated in UNDP Public Services Fair (May 28, 2026).
May 18, 2026: FAD'H marched in Flag Day parade.

RESPONSE RULES:
1. Always respond in the SAME LANGUAGE the user writes in — Haitian Creole, French, or English.
2. Keep responses concise — 3 to 5 sentences unless more detail is needed.
3. Maintain a professional military tone at all times.
4. Do NOT discuss classified operations, political opinions, or anything unrelated to FAD'H.
5. If you do not know something, direct users to: fadh.ht or 2810 3420 or infodefense@md.gouv.ht.
6. Never use markdown. No asterisks, no bold, no bullet points. Plain text only.`;

const SUGGESTIONS = [
  "What is the mission of FAD'H?",
  "Kijan pou mwen antre nan lame Ayiti?",
  "Quels sont les critères de recrutement?",
  "Tell me about Haiti's military history",
];

export default function KolonelAgent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setStarted(true);
    setInput("");
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const response = await fetch("https://kolonel.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages,
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Une erreur s'est produite.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Erreur de connexion. Veuillez réessayer." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060c06", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 15% 50%, rgba(0,80,0,0.12) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(0,50,100,0.08) 0%, transparent 45%)" }} />

      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ width: "80px", height: "80px", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}><img src="/fadh-logo.png" alt="FADH" style={{width:"80px",height:"80px",objectFit:"contain",filter:"drop-shadow(0 0 8px rgba(200,168,75,0.3))"}} /></div>
        <div style={{ fontSize: "10px", letterSpacing: "8px", color: "#c8a84b", textTransform: "uppercase", marginBottom: "4px" }}>Forces Armées d'Haïti</div>
        <div style={{ fontSize: "26px", fontWeight: "bold", color: "#e8f0e0", letterSpacing: "4px" }}>KOLONÈL</div>
        <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#4a6a4a", textTransform: "uppercase", marginTop: "4px" }}>Assistant Officiel</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "10px" }}>
          <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, transparent, #c8a84b)" }} />
          <div style={{ color: "#c8a84b", fontSize: "10px" }}>✦</div>
          <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, #c8a84b, transparent)" }} />
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: "660px", background: "rgba(6,12,6,0.92)", border: "1px solid rgba(200,168,75,0.2)", borderRadius: "2px", boxShadow: "0 0 60px rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", height: "500px" }}>
        <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(200,168,75,0.1)", display: "flex", alignItems: "center", gap: "8px", background: "rgba(200,168,75,0.03)" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2d8a2d", boxShadow: "0 0 4px #2d8a2d" }} />
          <div style={{ fontSize: "10px", color: "#4a6a4a", letterSpacing: "3px", textTransform: "uppercase" }}>Système actif</div>
          <div style={{ marginLeft: "auto", fontSize: "10px", color: "#3a5a3a" }}>FAD'H · KOLONÈL v1.0</div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px", scrollbarWidth: "thin", scrollbarColor: "#1a3a1a #060c06" }}>
          {!started ? (
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <div style={{ color: "#c8a84b", fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "10px" }}>Bienvenue · Welcome · Byenveni</div>
              <div style={{ color: "#5a7a5a", fontSize: "13px", lineHeight: "1.8", maxWidth: "400px", margin: "0 auto 28px" }}>
                Je suis KOLONÈL, l'assistant officiel des Forces Armées d'Haïti. Posez-moi vos questions en français, anglais ou kreyòl.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)} style={{ background: "rgba(200,168,75,0.05)", border: "1px solid rgba(200,168,75,0.2)", borderRadius: "2px", color: "#8a7a4a", fontSize: "12px", padding: "9px 18px", cursor: "pointer", width: "100%", maxWidth: "380px", textAlign: "left", fontFamily: "Georgia, serif" }}>
                    <span style={{ color: "#c8a84b", marginRight: "8px" }}>›</span>{s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-start", gap: "8px" }}>
                  {m.role === "assistant" && (
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0, background: "rgba(200,168,75,0.1)", border: "1px solid rgba(200,168,75,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}><img src="/fadh-logo.png" alt="FADH" style={{width:"18px",height:"18px",objectFit:"contain"}} /></div>
                  )}
                  <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: "2px", fontSize: "13px", lineHeight: "1.7", ...(m.role === "user" ? { background: "rgba(45,138,45,0.12)", border: "1px solid rgba(45,138,45,0.25)", color: "#b0c8a0" } : { background: "rgba(200,168,75,0.05)", border: "1px solid rgba(200,168,75,0.12)", color: "#9aaa80" }) }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(200,168,75,0.1)", border: "1px solid rgba(200,168,75,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}><img src="/fadh-logo.png" alt="FADH" style={{width:"18px",height:"18px",objectFit:"contain"}} /></div>
                  <div style={{ padding: "10px 16px", background: "rgba(200,168,75,0.05)", border: "1px solid rgba(200,168,75,0.12)", borderRadius: "2px", display: "flex", gap: "5px", alignItems: "center" }}>
                    {[0,1,2].map(d => (<div key={d} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#c8a84b", animation: `pulse 1.3s ease-in-out ${d*0.22}s infinite` }} />))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid rgba(200,168,75,0.1)", padding: "12px 14px", display: "flex", gap: "10px", alignItems: "center", background: "rgba(200,168,75,0.02)" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Écrivez en français, English, or Kreyòl..."
            style={{ flex: 1, background: "rgba(200,168,75,0.04)", border: "1px solid rgba(200,168,75,0.15)", borderRadius: "2px", color: "#c8d8b0", fontSize: "13px", padding: "10px 14px", outline: "none", fontFamily: "Georgia, serif" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{ background: loading || !input.trim() ? "rgba(200,168,75,0.05)" : "rgba(200,168,75,0.18)", border: `1px solid ${loading || !input.trim() ? "rgba(200,168,75,0.15)" : "rgba(200,168,75,0.45)"}`, borderRadius: "2px", color: loading || !input.trim() ? "#5a4a2a" : "#c8a84b", padding: "10px 18px", cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "Georgia, serif" }}
          >
            ENVOYER
          </button>
        </div>
      </div>

      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <div style={{ fontSize: "10px", color: "#2a3a2a", letterSpacing: "3px", textTransform: "uppercase" }}>fadh.ht · 2810 3420 · infodefense@md.gouv.ht</div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.2; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.1); } }
        input::placeholder { color: #3a4a2a; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #060c06; }
        ::-webkit-scrollbar-thumb { background: #1a3a1a; border-radius: 2px; }
      `}</style>
    </div>
  );
}
