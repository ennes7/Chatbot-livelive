import React, {useState} from 'react'
export default function FaqBot(){
  const [q,setQ]=useState(''),[busy,setBusy]=useState(false),[items,setItems]=useState([]),[status,setStatus]=useState('Nog geen data. Klik op “Website laden”.')
  const scrape=async()=>{setBusy(true);setStatus('Website wordt geladen…');try{const r=await fetch('/api/scrape');const j=await r.json();setStatus('Geladen: '+(j.pages||0)+' pagina\'s')}catch(e){setStatus('Fout bij laden')}finally{setBusy(false)}}
  const ask=async()=>{if(!q.trim())return;setBusy(true);setStatus('Zoeken…');try{const r=await fetch('/api/query?q='+encodeURIComponent(q));const j=await r.json();setItems(j.results||[]);setStatus((j.results||[]).length?'Resultaten:':'Geen resultaten')}catch(e){setStatus('Fout bij zoeken')}finally{setBusy(false)}}
  return <div>
    <div style={{fontSize:12,opacity:.8,marginBottom:8}}>{status}</div>
    <button onClick={scrape} disabled={busy}>Website laden</button>
    <div style={{marginTop:8}}>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Stel je vraag…" onKeyDown={e=>e.key==='Enter'&&ask()}/>
      <button onClick={ask} disabled={busy}>Zoek</button>
    </div>
    {items.map((it,i)=><div key={i} style={{padding:8,border:'1px solid #334155',borderRadius:8,marginTop:8}}>
      <div style={{fontSize:12}}><a href={it.url} target="_blank" rel="noreferrer">{it.title||it.url}</a></div>
      <div style={{marginTop:6,whiteSpace:'pre-wrap'}}>{it.snippet}</div>
    </div>)}
  </div>
}