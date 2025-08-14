import React from 'react'
export default function CapacityForm({onBack}){
  return <div>
    <button onClick={onBack}>← Terug</button>
    <h3>Capaciteit aanvragen</h3>
    <form className="grid">
      <textarea placeholder="In welke branche is je bedrijf actief?" rows="3" />
      <textarea placeholder="Bedrijfsnaam" rows="3" />
      <textarea placeholder="Wat is de locatie van de opdracht?" rows="3" />
      {/* ... rest van vragen */}
    </form>
  </div>
}
