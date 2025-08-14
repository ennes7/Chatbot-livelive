import React, { useState } from 'react'
import CapacityForm from './CapacityForm.jsx'
import FaqChat from './FaqChat.jsx'

const VIEWS = { ROOT:'ROOT', CAPACITY_MENU:'CAPACITY_MENU', ASSIGNMENTS_MENU:'ASSIGNMENTS_MENU', CAPACITY_FORM:'CAPACITY_FORM', FAQ:'FAQ' }

export default function Widget(){
  const [open,setOpen] = useState(true)
  const [full,setFull] = useState(false)
  const [view,setView] = useState(VIEWS.ROOT)
  const [prevViewForFAQ,setPrevViewForFAQ] = useState(null)

  const PanelView = () => {
    switch(view){
      case VIEWS.CAPACITY_MENU:
        return <div>
          <h2>Capaciteit</h2>
          <button onClick={() => {setFull(true); setView(VIEWS.CAPACITY_FORM)}}>Capaciteit aanvragen</button>
          <button onClick={() => {setPrevViewForFAQ(VIEWS.CAPACITY_MENU); setView(VIEWS.FAQ)}}>FAQ's</button>
        </div>
      case VIEWS.ASSIGNMENTS_MENU:
        return <div>
          <h2>Opdrachten</h2>
          <a href="https://www.conclusionstaffing.nl/voor-opdrachtnemers" target="_blank">Direct inschrijven</a>
          <button onClick={() => {setPrevViewForFAQ(VIEWS.ASSIGNMENTS_MENU); setView(VIEWS.FAQ)}}>Onze werkwijze/FAQ</button>
        </div>
      case VIEWS.CAPACITY_FORM:
        return <CapacityForm onBack={() => setView(VIEWS.CAPACITY_MENU)} />
      case VIEWS.FAQ:
        return <FaqChat onBack={() => setView(prevViewForFAQ || VIEWS.ROOT)} />
      default:
        return <div>
          <h2>Welkom</h2>
          <button onClick={() => setView(VIEWS.CAPACITY_MENU)}>Capaciteit</button>
          <button onClick={() => setView(VIEWS.ASSIGNMENTS_MENU)}>Opdrachten</button>
        </div>
    }
  }

  if(!open) return <button onClick={()=>setOpen(true)}>💬</button>

  return (
    <div className="widget-panel" style={full ? {width:'100vw', height:'100vh'} : {}}>
      <div className="widget-header">
        <span>{view}</span>
        <div>
          {view === VIEWS.FAQ && <button onClick={() => setView(prevViewForFAQ || VIEWS.ROOT)}>← Terug</button>}
          <button onClick={()=>setFull(!full)}>{full?'⤢ Verlaat volledig scherm':'⤢ Volledig scherm'}</button>
          <button onClick={()=>setOpen(false)}>✕</button>
        </div>
      </div>
      <div className="widget-body">
        <PanelView/>
      </div>
    </div>
  )
}
