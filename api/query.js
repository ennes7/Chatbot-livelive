import * as cheerio from 'cheerio'
export const config = { runtime: 'nodejs' }

function score(q,text){const terms=q.toLowerCase().split(/\s+/).filter(Boolean);const hay=text.toLowerCase();let s=0;for(const t of terms){s+=hay.split(t).length-1}return s}

export default async function handler(req,res){
  try{
    const q=(req.query?.q||'').toString(); if(!q) return res.status(400).json({ok:false,error:'q ontbreekt'})
    let docs=globalThis.__DOCS__||[]
    if(!docs.length){
      // minimal fallback: scrape homepage + contact
      const urls=['https://www.conclusionstaffing.nl/','https://www.conclusionstaffing.nl/contact']
      for(const url of urls){
        const r=await fetch(url); if(!r.ok) continue
        const html=await r.text(); const $=cheerio.load(html); $('script,style,noscript,header,footer,nav').remove()
        const title=$('title').first().text().trim()
        const text=$('body').text().replace(/\s+/g,' ').trim().slice(0,8000)
        docs.push({url,title,text})
      }
      globalThis.__DOCS__=docs
    }
    const ranked=docs.map(d=>({...d,s:score(q,d.text)})).sort((a,b)=>b.s-a.s).slice(0,3)
    const results=ranked.filter(r=>r.s>0).map(r=>({url:r.url,title:r.title,snippet:r.text.slice(0,600)}))
    res.status(200).json({ok:true,results})
  }catch(e){res.status(500).json({ok:false,error:String(e)})}
}