import React, {useMemo,useState} from 'react'
const FLOW=[
  {key:'branche',label:'In welke branche is je bedrijf actief?',type:'text'},
  {key:'bedrijfsnaam',label:'Wat is je bedrijfsnaam?',type:'text'},
  {key:'locatie',label:'Wat is de locatie van de opdracht?',type:'text'},
  {key:'omschrijving',label:'Wat is de opdrachtomschrijving?',type:'textarea'},
  {key:'musthaves',label:'Wat zijn de technische must-haves?',type:'textarea'},
  {key:'nicetohaves',label:'Wat zijn de technische nice-to-haves?',type:'textarea'},
  {key:'startdatum',label:'Wat is de gewenste startdatum?',type:'date'},
  {key:'uren',label:'Voor hoeveel uur per week is de opdracht?',type:'number',min:1,max:40},
  {key:'duur',label:'Wat is de verwachte duur van de opdracht?',type:'text'},
  {key:'tarief',label:'Zijn er tariefkaders waar wij rekening mee kunnen houden?',type:'text'},
  {key:'werkvorm',label:'Is de opdracht remote, hybride of op kantoor? En in welke verdeling?',type:'select',options:['Remote','Hybride','Op kantoor']},
  {key:'teamsamenstelling',label:'Hoe ziet de teamsamenstelling eruit?',type:'textarea'},
  {key:'os',label:'Werken jullie met Mac of Windows?',type:'select',options:['Mac','Windows','Beide']},
  {key:'hardware',label:'Gebruikt de specialist eigen hardware of wordt er een laptop verstrekt?',type:'select',options:['Eigen hardware','Laptop wordt verstrekt']},
  {key:'taal',label:'Is Nederlands vereist of mag de kandidaat ook Engelstalig zijn?',type:'select',options:['Nederlands','Engels','Beide']},
  {key:'interviews',label:'Kunnen we op korte termijn interviews plannen?',type:'select',options:['Ja','Nee']},
  {key:'rondes',label:'Volgt er één gesprek of meerdere rondes?',type:'select',options:['Eén gesprek','Meerdere rondes']},
]
function Field({cfg,value,setValue}){
  const p={value:value??'',onChange:e=>setValue(e.target.value)}
  if(cfg.type==='textarea')return <textarea rows={4} {...p}/>
  if(cfg.type==='text')return <input type='text' {...p}/>
  if(cfg.type==='date')return <input type='date' {...p}/>
  if(cfg.type==='number')return <input type='number' min={cfg.min} max={cfg.max} {...p}/>
  if(cfg.type==='select')return <select {...p}><option value=''>Maak een keuze… (optioneel)</option>{cfg.options.map(o=><option key={o} value={o}>{o}</option>)}</select>
  return null
}
export default function CapacityForm({onDone}){
  const [step,setStep]=useState(0),[data,setData]=useState({})
  const total=FLOW.length,cfg=FLOW[step],value=data[cfg?.key]??''
  const answered=useMemo(()=>Object.values(data).filter(v=>String(v||'').trim()).length,[data])
  const progress=Math.round(answered/total*100)
  const setValue=v=>setData(d=>({...d,[cfg.key]:v}))
  const next=()=>setStep(s=>Math.min(s+1,total)),back=()=>setStep(s=>Math.max(s-1,0)),jump=i=>setStep(i)
  if(step>=total) return <div><h2>Bedankt!</h2><p>We nemen snel contact met je op.</p><button onClick={()=>onDone?.()}>Terug naar menu</button></div>
  return <div style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:16}}>
    <aside style={{border:'1px solid #334155',borderRadius:12,padding:12}}>
      <div style={{background:'#0b1220',border:'1px solid #334155',height:8,borderRadius:999,overflow:'hidden',marginBottom:10}}>
        <div style={{height:'100%',width:progress+'%',background:'#4f46e5'}}/>
      </div>
      <div style={{fontSize:12,opacity:.8,marginBottom:8}}>Voortgang: {answered}/{total} ({progress}%)</div>
      {FLOW.map((q,i)=>{
        const done=(data[q.key]??'').toString().trim().length>0
        const active=i===step
        return <div key={q.key} onClick={()=>jump(i)} style={{cursor:'pointer',padding:6,margin:'6px 0',borderRadius:8,border:active?'1px solid #4f46e5':'1px solid transparent',background:active?'rgba(79,70,229,.08)':'transparent'}}>
          <span>{done?'✅':'⬜️'}</span> <span style={{fontSize:13}}>{q.label}</span>
        </div>
      })}
    </aside>
    <section>
      <p style={{opacity:.85}}>{cfg.label}</p>
      <Field cfg={cfg} value={value} setValue={setValue}/>
      <div style={{marginTop:12}}>
        <button onClick={back} disabled={step===0}>Terug</button>{' '}
        <button onClick={next}>Volgende</button>
      </div>
      <div style={{fontSize:12,opacity:.7,marginTop:8}}>Alles is optioneel. Vul in wat je wilt, of sla over.</div>
    </section>
  </div>
}