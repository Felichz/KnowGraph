import React, { useState } from "react";

export function StudyStageLearn({ node, onIntegrateIntoDraft }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `¡Hola! Soy tu mentor socrático para "${node?.label}". ¿Qué aspectos de los trade-offs o mecanismos internos te gustaría profundizar?` },
  ]);
  const [inputText, setInputText] = useState("");

  const promptChips = [
    "¿Por qué falla el enfoque ingenuo?",
    "¿Podrías explicarlo con una analogía?",
    "¿Cómo diagnostico este error en producción?",
  ];

  const handleSend = (textToSend = inputText) => {
    const text = textToSend.trim();
    if (!text) return;
    const userMsg = { role: "user", content: text };
    let reply = "";
    if (text.includes("ingenuo")) {
      reply = "El enfoque ingenuo falla principalmente porque asume sincronía y retención de memoria ilimitada sin contemplar la concurrencia ni las transiciones interrumpibles del runtime.";
    } else if (text.includes("analogía")) {
      reply = "Pensalo como una cocina de restaurante: el enfoque ingenuo cocina plato por plato bloqueando la entrega. El enfoque senior usa comandas asíncronas y prioriza según la mesa.";
    } else if (text.includes("producción")) {
      reply = "En producción se diagnostica midiendo métricas de interacción como INP, monitoreando el heap en DevTools Memory y revisando los logs de advertencias de concurrencia.";
    } else {
      reply = `Excelente pregunta sobre "${text}". La clave a nivel senior es entender el balance entre sobrecarga de memoria, latencia de render y experiencia de usuario.`;
    }
    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: reply }]);
    setInputText("");
  };

  const handleIntegrate = () => {
    const thoughts = messages.filter((m) => m.role === "assistant").slice(1).map((m) => m.content).join("\n\n");
    const textToAppend = thoughts || `${node?.label}: solución basada en desacoplar render síncrono y tolerar prioridades concurrentes.`;
    onIntegrateIntoDraft?.(textToAppend);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Espacio Socrático con el Tutor</h4>
        <button onClick={handleIntegrate} style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, background: "rgba(94, 234, 212, 0.12)", color: "var(--color-brand-primary, #5EEAD4)", border: "1px solid rgba(94, 234, 212, 0.3)", cursor: "pointer" }}>
          ✨ Integrar chat en mi respuesta
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {promptChips.map((chip) => (
          <button key={chip} onClick={() => handleSend(chip)} style={{ padding: "4px 10px", borderRadius: "16px", fontSize: "11px", background: "rgba(255, 255, 255, 0.04)", color: "var(--text-secondary)", border: "1px solid var(--border-line-subtle)", cursor: "pointer" }}>
            {chip}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: "200px", maxHeight: "320px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", padding: "12px", background: "rgba(13, 17, 24, 0.7)", borderRadius: "8px", border: "1px solid var(--border-line-subtle)" }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", padding: "8px 12px", borderRadius: "8px", fontSize: "13px", lineHeight: 1.45,
            background: m.role === "user" ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.05)",
            color: m.role === "user" ? "#F8FAFC" : "var(--text-primary)",
            border: m.role === "user" ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid var(--border-line-subtle)",
          }}>
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: "flex", gap: "8px" }}>
        <input
          type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
          placeholder="Preguntale al tutor sobre este concepto…"
          style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--border-line)", color: "var(--text-primary)", fontSize: "13px", outline: "none" }}
        />
        <button type="submit" style={{ padding: "8px 16px", borderRadius: "6px", background: "var(--color-brand-primary, #5EEAD4)", color: "#0B0D13", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}>
          Enviar ↑
        </button>
      </form>
    </div>
  );
}
