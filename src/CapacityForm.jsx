import React, { useMemo, useState } from 'react'

const FLOW = [
  { key: 'branche', label: 'In welke branche is je bedrijf actief?', type: 'text', required: true },
  { key: 'bedrijfsnaam', label: 'Wat is je bedrijfsnaam?', type: 'text', required: true },
  { key: 'locatie', label: 'Wat is de locatie van de opdracht?', type: 'text', required: true },
  { key: 'omschrijving', label: 'Wat is de opdrachtomschrijving?', type: 'textarea', required: true },
  { key: 'musthaves', label: 'Wat zijn de technische must-haves?', type: 'textarea', required: true },
  { key: 'nicetohaves', label: 'Wat zijn de technische nice-to-haves?', type: 'textarea' },
  { key: 'startdatum', label: 'Wat is de gewenste startdatum?', type: 'date', required: true },
  { key: 'uren', label: 'Voor hoeveel uur per week is de opdracht?', type: 'number', min: 1, max: 40, required: true },
  { key: 'duur', label: 'Wat is de verwachte duur van de opdracht?', type: 'text', required: true },
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
  const common = {
    className: cfg.type === 'textarea' ? 'textarea' : (cfg.type === 'select' ? 'select' : 'input'),
    value: value ?? '',
    onChange: (e) => setValue(e.target.value)
  }
  if (cfg.type === 'textarea') return <textarea rows={4} {...common} />
  if (cfg.type === 'text') return <input type="text" {...common} />
  if (cfg.type === 'number') return <input type="number" min={cfg.min} max={cfg.max} {...common} />
  if (cfg.type === 'date') return <input type="date" {...common} />
  if (cfg.type === 'select') return (
    <select {...common}>
      <option value="">Maak een keuze…</option>
      {cfg.options.map(o => <option key={o} value={o}>{o}</option>)}
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

  const canNext = useMemo(() => {
    if (!cfg) return false
    if (!cfg.required) return true
    return String(value).trim().length > 0
  }, [cfg, value])

  const setValue = (v) => setData(d => ({ ...d, [cfg.key]: v }))
  const next = () => { if (canNext) setStep(s => Math.min(s + 1, total)) }
  const back = () => setStep(s => Math.max(s - 1, 0))

  if (step >= total) {
    // After finishing, show thank-you (no answers shown)
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
    <div>
      <p className="label">{cfg.label}</p>
      <Field cfg={cfg} value={value} setValue={setValue} />
      <div className="nav">
        <button className="btn secondary" onClick={back} disabled={step===0}>Terug</button>
        <button className="btn" onClick={next} disabled={!canNext}>Volgende</button>
      </div>
      <p className="small" style={{marginTop:10}}>Je invoer wordt lokaal bewaard (niet verstuurd).</p>
    </div>
  )
}
