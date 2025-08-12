import React, { useEffect, useState } from 'react'

export default function FaqBot({ title='FAQ op basis van website' }){
  const [q,setQ]=useState('')
  const [busy,setBusy]=useState(false)
  const [items,setItems]=useState([])
  const [status,setStatus]=useState('Website wordt voorbereid…')

  useEffect(()=>{
    let mounted = true
    const run = async () => {
      setBusy(true); setStatus('Website-inhoud laden…')
      try{
        const r = await fetch('/api/scrape')
        const js = await r.json()
        if(!mounted) return
        setStatus(`Geladen: ${js.pages||0} pagina's`)
      }catch(e){
        if(!mounted) return
        setStatus('Fout bij laden van website. Probeer je vraag te stellen; we doen een snelle fallback.')
      }finally{
        if(mounted) setBusy(false)
      }
    }
    run()
    return ()=>{ mounted=false }
  }, [])

  const ask = async () => {
    if(!q.trim()) return
    setBusy(true); setItems([]); setStatus('Zoeken in website…')
    try{
      const r = await fetch('/api/query?q='+encodeURIComponent(q))
      const js = await r.json()
      setItems(js.results||[])
      setStatus((js.results||[]).length ? 'Resultaten:' : 'Geen resultaat gevonden.')
    }catch(e){
      setStatus('Fout bij het zoeken.')
    }finally{
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="small" style={{marginBottom:8}}>{status}</div>
      <div className="nav">
        <input className="input" placeholder="Stel je vraag over de website…" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask()} />
        <button className="btn" onClick={ask} disabled={busy}>Zoek</button>
      </div>
      {items.length>0 && (
        <div style={{marginTop:12}}>
          {items.map((it,idx)=>(
            <div key={idx} style={{margin:'8px 0', padding:'10px', border:'1px solid rgba(148,163,184,.25)', borderRadius:10}}>
              <div className="small"><a href={it.url} target="_blank" rel="noreferrer">{it.title||it.url}</a></div>
              <div style={{marginTop:6, whiteSpace:'pre-wrap'}}>{it.snippet}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
