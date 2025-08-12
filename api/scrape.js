import { XMLParser } from 'fast-xml-parser'
import * as cheerio from 'cheerio'
export const config = { runtime: 'nodejs' }

const MAX_PAGES=40, MAX_CHARS=80000
function chunkText(txt,size=900){const out=[];let i=0;while(i<txt.length&&out.length<400){out.push(txt.slice(i,i+size));i+=size}return out}

export default async function handler(req,res){
  try{
    const sitemapUrl=(process.env.SCRAPE_SITEMAP_URL||'').trim()||'https://www.conclusionstaffing.nl/sitemap.xml'
    const resp=await fetch(sitemapUrl); if(!resp.ok) throw new Error('Kon sitemap niet ophalen: '+resp.status)
    const xml=await resp.text(); const parser=new XMLParser(); const parsed=parser.parse(xml)
    const locs=(parsed.urlset?.url||[]).map(u=>u.loc).filter(Boolean)
    const base=new URL(sitemapUrl).origin
    const urls=locs.filter(u=>u.startsWith(base)).slice(0,MAX_PAGES)
    const docs=[]
    for(const url of urls){
      const r=await fetch(url); if(!r.ok) continue
      const html=await r.text()
      const $=cheerio.load(html); $('script,style,noscript,header,footer,nav').remove()
      const title=$('title').first().text().trim()
      const text=$('body').text().replace(/\s+/g,' ').trim().slice(0,MAX_CHARS)
      if(!text) continue
      const chunks=chunkText(text,1000)
      chunks.forEach(ch=>docs.push({url,title,text:ch}))
    }
    // store globally for this instance
    globalThis.__DOCS__=docs
    res.status(200).json({ok:true,pages:urls.length,chunks:docs.length,origin:base})
  }catch(e){res.status(500).json({ok:false,error:String(e)})}
}