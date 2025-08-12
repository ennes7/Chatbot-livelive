import React, { useEffect, useState } from 'react'

export default function FaqChat(){
  const [q,setQ]=useState('')
  const [busy,setBusy]=useState(false)
  const [messages,setMessages]=useState([{from:'bot',text:'Hoi! Stel je vraag, ik help je graag verder.'}])

  useEffect(()=>{
    // Auto-initialize website index
    fetch('/api/scrape').catch(()=>{})
  }, [])

  const send = async () => {
    const text = q.trim()
    if(!text) return
    setQ('')
    setMessages(m=>[...m,{from:'user',text}])
    setBusy(true)
    try{
      const r = await fetch('/api/answer?q='+encodeURIComponent(text))
      const js = await r.json()
      const answer = js.answer || 'Ik kan hier nu geen mooi antwoord op geven.'
      setMessages(m=>[...m,{from:'bot',text:answer}])
    }catch(e){
      setMessages(m=>[...m,{from:'bot',text:'Er ging iets mis. Probeer het later nog eens.'}])
    }finally{
      setBusy(false)
    }
  }

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{flex:1,overflow:'auto'}}>
        {messages.map((m,i)=>(
          <div key={i} className={'chat-bubble '+(m.from==='bot'?'chat-bot':'chat-user')}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="widget-footer" style={{display:'flex',gap:8}}>
        <input className="input" placeholder="Typ je vraag…" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}/>
        <button className="btn" onClick={send} disabled={busy}>Stuur</button>
      </div>
    </div>
  )
}
