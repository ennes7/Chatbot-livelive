import React, { useState } from 'react'
import CapacityForm from './CapacityForm.jsx'
import FaqBot from './FaqBot.jsx'

const VIEWS = {WELCOME:'WELCOME',CAPACITY_MENU:'CAPACITY_MENU',ASSIGNMENTS_MENU:'ASSIGNMENTS_MENU',CAPACITY_FORM:'CAPACITY_FORM',FAQ:'FAQ'}

export default function App(){
  const [view,setView]=useState(VIEWS.WELCOME)
  const go=(v)=>setView(v)
  const openLink=(u)=>window.location.href=u
  return <div style={{maxWidth:900,margin:'40px auto',padding:16}}>
    <h1>Conclusion Chatbot</h1>
    {view===VIEWS.WELCOME && <div>
      <p><strong>Hoi! Hoe kan ik je vandaag helpen?</strong></p>
      <p style={{opacity:.8}}>Ben je op zoek naar opdrachten als zzp’er of zoek je als bedrijf naar capaciteit?</p>
      <button onClick={()=>go(VIEWS.CAPACITY_MENU)}>Capaciteit</button> <button onClick={()=>go(VIEWS.ASSIGNMENTS_MENU)}>Opdrachten</button>
    </div>}
    {view===VIEWS.CAPACITY_MENU && <div>
      <p>Kies een optie:</p>
      <button onClick={()=>go(VIEWS.CAPACITY_FORM)}>Capaciteit aanvragen</button>{' '}
      <button onClick={()=>go(VIEWS.FAQ)}>FAQ's</button>{' '}
      <button onClick={()=>openLink('https://www.conclusionstaffing.nl/contact')}>Contact</button>
      <div><button onClick={()=>go(VIEWS.WELCOME)}>Terug</button></div>
    </div>}
    {view===VIEWS.ASSIGNMENTS_MENU && <div>
      <p>Kies een optie:</p>
      <button onClick={()=>openLink('https://www.conclusionstaffing.nl/voor-opdrachtnemers')}>Direct inschrijven</button>{' '}
      <button onClick={()=>go(VIEWS.FAQ)}>Onze werkwijze / FAQ</button>{' '}
      <button onClick={()=>openLink('https://www.conclusionstaffing.nl/contact')}>Contact</button>
      <div><button onClick={()=>go(VIEWS.WELCOME)}>Terug</button></div>
    </div>}
    {view===VIEWS.CAPACITY_FORM && <CapacityForm onDone={()=>go(VIEWS.CAPACITY_MENU)}/>}
    {view===VIEWS.FAQ && <div><FaqBot/><div><button onClick={()=>go(VIEWS.WELCOME)}>Terug naar start</button></div></div>}
  </div>
}