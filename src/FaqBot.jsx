import React, { useState } from 'react'

const SAMPLE_FAQS = [
  { q: 'Hoe werkt jullie werkwijze?', a: 'We starten met een intake, bepalen scope en matchen specialisten. Binnen 48 uur heb je de eerste profielen.' },
  { q: 'Werken jullie met uurtarieven?', a: 'Ja. Tarieven variëren per expertise en senioriteit. Geef je bandbreedte door in de aanvraag.' },
  { q: 'Kunnen jullie ook hybride werken?', a: 'Zeker. We leveren specialisten voor remote, hybride en on-site opdrachten.' },
]

export default function FaqBot({ title = 'FAQ Bot (demo)' }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { from: 'bot', text: `Welkom bij ${title}. Stel je vraag of kies een voorbeeld:` }
  ])

  const ask = (text) => {
    const lower = text.toLowerCase()
    const hit = SAMPLE_FAQS.find(f => lower.includes(f.q.toLowerCase().split(' ')[0]))
    const answer = hit ? hit.a : 'Ik heb hier geen direct antwoord op in de demo. Wil je dat ik deze bot koppel aan jullie echte FAQ-documenten?'
    setMessages(m => [...m, { from: 'user', text }, { from: 'bot', text: answer }])
  }

  return (
    <div>
      <div className="small" style={{marginBottom:12}}>Dit is een demo-FAQ. We kunnen dit koppelen aan echte documenten (RAG / vector search).</div>
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:12}}>
        {SAMPLE_FAQS.map((f,i)=>(
          <button key={i} className="btn secondary" onClick={()=>ask(f.q)}>{f.q}</button>
        ))}
      </div>
      <div style={{background:'#0b1220', border:'1px solid rgba(148,163,184,.15)', borderRadius:10, padding:12, maxHeight:260, overflow:'auto', marginBottom:12}}>
        {messages.map((m,i)=>(
          <div key={i} style={{margin:'6px 0'}}><strong>{m.from==='bot'?'🤖':'🧑‍💼'} </strong>{m.text}</div>
        ))}
      </div>
      <div style={{display:'flex', gap:8}}>
        <input className="input" placeholder="Typ je vraag..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&input.trim()&&ask(input)} />
        <button className="btn" onClick={()=>input.trim()&&ask(input)}>Stuur</button>
      </div>
    </div>
  )
}
