export const config = { runtime: 'nodejs' }

function rank(q, text){
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
  const hay = text.toLowerCase()
  let s = 0
  for(const t of terms){ s += hay.split(t).length - 1 }
  return s
}

function summarize(q, text){
  // Heuristic "paraphrase": pick top sentences, trim, avoid bullet jargon
  const sentences = text.split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean)
  const scored = sentences.map(s=>({s,score:rank(q,s)})).sort((a,b)=>b.score-a.score).slice(0,4).map(x=>x.s)
  const stitched = scored.join(' ')
  // Light rewrite rules
  let out = stitched
    .replace(/\s+/g,' ')
    .replace(/(Lees meer|Meer informatie|Klik hier).*$/i,'')
  // Add friendly opener/closer
  return `Kort samengevat: ${out}`.trim()
}

export default async function handler(req, res){
  try{
    const q = (req.query?.q || '').toString()
    if(!q) return res.status(400).json({ ok:false, error:'q ontbreekt' })
    const docs = globalThis.__DOCS__ || []
    if(!docs.length){
      return res.status(200).json({ ok:true, answer: 'Ik heb nog geen context geladen. Probeer het nog eens over een paar seconden.' })
    }
    // rank chunks by keyword overlap, then merge best few
    const ranked = docs.map(d=>({ ...d, score: rank(q, d.text) })).sort((a,b)=>b.score-a.score).slice(0,6)
    const merged = ranked.map(r=>r.text).join(' ')
    const answer = summarize(q, merged)
    res.status(200).json({ ok:true, answer })
  }catch(e){
    res.status(500).json({ ok:false, error: String(e) })
  }
}
