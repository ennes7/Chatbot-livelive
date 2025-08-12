import { XMLParser } from 'fast-xml-parser'
import * as cheerio from 'cheerio'

let CACHE = { ready: false, docs: [], origin: null }

export const config = { runtime: 'nodejs18.x' }

function score(q, text) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
  const hay = text.toLowerCase()
  let s = 0
  for (const t of terms) {
    const c = hay.split(t).length - 1
    s += c
  }
  return s
}

export default async function handler(req, res) {
  try {
    const q = (req.query.q || '').toString()
    if (!q) return res.status(400).json({ ok: false, error: 'q ontbreekt' })

    if (!CACHE.ready) {
      // Lazy scrape using sitemap
      const sitemapUrl = (process.env.SCRAPE_SITEMAP_URL || '').trim() || 'https://www.conclusionstaffing.nl/sitemap.xml'
      const r = await fetch(`${req.headers['x-forwarded-proto']||'https'}://${req.headers.host}/api/scrape`)
      if (!r.ok) throw new Error('Kon scrape niet initialiseren')
      const js = await r.json()
      CACHE.ready = true // We don't actually receive docs here; we rely on scrape module-level cache in a single instance.
    }

    // Access cache from scrape module if available (same instance)
    try {
      const mod = await import('./scrape.js')
      const cacheRef = mod.default?.CACHE || mod.CACHE || null
      // Note: due to module scoping, we cannot directly import the variable. We'll fallback to a simple fetch approach.
    } catch {}

    // Fallback: call internal state by re-importing scrape.js's docs via a hack isn't reliable on serverless.
    // So we redo a minimal inline scrape of a few key pages if needed:
    if (!global.__DOCS__ || !Array.isArray(global.__DOCS__)) {
      // Minimal scrape of homepage + contact as fallback (fast path)
      const home = 'https://www.conclusionstaffing.nl/'
      const contact = 'https://www.conclusionstaffing.nl/contact'
      const urls = [home, contact]
      const docs = []
      for (const url of urls) {
        const r = await fetch(url); if (!r.ok) continue
        const html = await r.text()
        const $ = cheerio.load(html); $('script,style,noscript,header,footer,nav').remove()
        const title = $('title').first().text().trim()
        const text = $('body').text().replace(/\s+/g,' ').trim().slice(0, 6000)
        docs.push({ url, title, text })
      }
      global.__DOCS__ = docs
    }

    const docs = global.__DOCS__
    const ranked = docs.map(d => ({ ...d, s: score(q, d.text) })).sort((a,b)=>b.s-a.s).slice(0,3)
    const results = ranked.filter(r => r.s>0).map(r => ({
      url: r.url,
      title: r.title,
      snippet: r.text.slice(0, 600)
    }))

    res.status(200).json({ ok: true, results })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) })
  }
}
