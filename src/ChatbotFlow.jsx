import React, { useState } from "react";

const steps = [
  { id: 0, text: "Welkom! Wat wil je doen?", options: ["Offerte aanvragen", "Plan een demo"] },
  { id: 1, text: "Top! Wat is je naam?" },
  { id: 2, text: "Bedankt! Wat is je e-mailadres?" },
  { id: 3, text: "Je aanvraag is ontvangen. We nemen snel contact met je op!" },
];

export default function ChatbotFlow() {
  const [messages, setMessages] = useState([{ from: "bot", text: steps[0].text, options: steps[0].options }]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");

  const handleOptionClick = (option) => {
    setMessages(prev => [...prev, { from: "user", text: option }]);
    nextStep();
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: "user", text: input }]);
    setInput("");
    nextStep();
  };

  const nextStep = () => {
    const next = step + 1;
    setStep(next);
    if (steps[next]) {
      setMessages(prev => [...prev, { from: "bot", text: steps[next].text, options: steps[next].options }]);
    }
  };

  return (
    <div className="chat-window">
      {messages.map((msg, i) => (
        <div key={i} className="chat-message"><strong>{msg.from}:</strong> {msg.text}
          {msg.options && (
            <div>
              {msg.options.map((opt, idx) => (
                <button key={idx} onClick={() => handleOptionClick(opt)}>{opt}</button>
              ))}
            </div>
          )}
        </div>
      ))}
      {!steps[step]?.options && step < steps.length - 1 && (
        <div className="chat-input">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Typ hier..." />
          <button onClick={handleSend}>Verstuur</button>
        </div>
      )}
    </div>
  );
}
