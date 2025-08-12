import React, { useMemo, useState } from 'react'

export const FLOW = [
  { key: 'branche', label: 'In welke branche is je bedrijf actief?', type: 'text' },
  { key: 'bedrijfsnaam', label: 'Wat is je bedrijfsnaam?', type: 'text' },
  { key: 'locatie', label: 'Wat is de locatie van de opdracht?', type: 'text' },
  { key: 'omschrijving', label: 'Wat is de opdrachtomschrijving?', type: 'textarea' },
  { key: 'musthaves', label: 'Wat zijn de technische must-haves?', type: 'textarea' },
  { key: 'nicetohaves', label: 'Wat zijn de technische nice-to-haves?', type: 'textarea' },
  { key: 'startdatum', label: 'Wat is de gewenste startdatum?', type: 'date' },
  { key: 'uren', label: 'Voor hoeveel uur per week is de opdracht?', type: 'number', min: 1, max: 40 },
  { key: 'duur', label: 'Wat is de verwachte duur van de opdracht?', type: 'text' },
  { key: 'tarief', label: 'Zijn er tariefkaders waar wij rekening mee kunnen houden?', type: 'text' },
  { key: 'werkvorm', label: 'Is de opdracht remote, hybride of op kantoor? En in welke verdeling?', type: 'select', options: ['Remote', 'Hybride', 'Op kantoor'] },
  { key: 'teamsamenstelling', label: 'Hoe ziet de teamsamenstelling eruit?', type: 'textarea' },
  { key: 'os', label: 'Werken jullie met Mac of Windows?', type: 'select', options: ['Mac', 'Windows', 'Beide'] },
  { key: 'hardware', label: 'Gebruikt de specialist eigen hardware of wordt er een laptop verstrekt?', type: 'select', options: ['Eigen hardware', 'Laptop wordt verstrekt'] },
  { key: 'taal', label: 'Is Nederlands vereist of mag de kandidaat ook Engelstalig zijn?', type: 'select', options: ['Nederlands', 'Engels', 'Beide'] },
  { key: 'interviews', label: 'Kunnen we op korte termijn interviews plannen?', type: 'select', options: ['Ja', 'Nee'] },
  { key: 'rondes', label: 'Volgt er één gesprek of meerdere rondes?', type: 'select', options: ['Eén gesprek', 'Meerdere rondes'] }
]

function Field({ cfg, value, setValue }) {
  const common = { className: cfg.type === 'textarea' ? 'textarea' : (cfg.type === 'select' ? 'select' : 'input'),
                   value: value ?? '',
                   onChange: (e) => setValue(e.target.value) }
  if (cfg.type === 'textarea') return <textarea rows={4} {...common} />
  if (cfg.type === 'text') return <input type="text" {...common} />
  if (cfg.type === 'number') return <input type="number" min={cfg.min} max={cfg.max} {...common} />
  if (cfg.type === 'date') return <input type="date" {...common} />
  if (cfg.type === 'select') return (
    <select {...common}>
      <option value="">Maak een keuze… (optioneel)</option>
      {cfg.options?.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
  return null
}

export default function CapacityForm({ onDone }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({})
  const total = FLOW.length
  const cfg = FLOW[step]
  const value = data[cfg?.key] ?? ''

  const answeredCount = useMemo(() => Object.values(data).filter(v => String(v||'').trim().length>0).length, [data])
  const progressPct = Math.round((answeredCount / total) * 100)

  const canNext = true // alles optioneel
  const setValue = (v) => setData(d => ({ ...d, [cfg.key]: v }))

  const next = () => setStep(s => Math.min(s + 1, total))
  const back = () => setStep(s => Math.max(s - 1, 0))
  const jumpTo = (i) => setStep(i)

  if (step >= total) {
    return (
      <div>
        <h2>Bedankt!</h2>
        <p className="small">Je aanvraag is ontvangen. We nemen spoedig contact met je op.</p>
        <div className="nav">
          <button className="btn" onClick={() => onDone?.()}>Terug naar menu</button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid">
      <aside className="sidebar">
        <h3>Vragenoverzicht</h3>
        <div className="progressbar"><div className="progressfill" style={{width: progressPct + '%'}}/></div>
        <div className="small" style={{marginBottom:8}}>Voortgang: {answeredCount}/{total} ({progressPct}%)</div>
        {FLOW.map((q, i) => {
          const done = (data[q.key] ?? '').toString().trim().length > 0
          const active = i === step
          return (
            <div key={q.key} className={'step ' + (active ? 'active ' : '') + (done ? 'done' : '')} onClick={()=>jumpTo(i)} style={{cursor:'pointer'}}>
              <span>{done ? '✅' : '⬜️'}</span>
              <span style={{fontSize:13}}>{q.label}</span>
            </div>
          )
        })}
      </aside>

      <section>
        <p className="label">{cfg.label}</p>
        <Field cfg={cfg} value={value} setValue={setValue} />
        <div className="nav">
          <button className="btn secondary" onClick={back} disabled={step===0}>Terug</button>
          <button className="btn" onClick={next}>Volgende</button>
        </div>
        <p className="small" style={{marginTop:10}}>Alles is optioneel. Vul in wat je wilt, sla anders over.</p>
      </section>
    </div>
  )
}
