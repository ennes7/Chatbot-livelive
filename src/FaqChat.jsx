import React from 'react'
export default function FaqChat({onBack}){
  return <div>
    <button onClick={onBack}>← Terug</button>
    <h3>FAQ Chat</h3>
    <p>Stel je vraag...</p>
    {/* FAQ logic hier */}
  </div>
}
