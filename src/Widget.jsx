import React, { useState } from 'react'
import CapacityForm from './CapacityForm.jsx'
import FaqChat from './FaqChat.jsx'

const VIEWS = { ROOT:'ROOT', CAPACITY_MENU:'CAPACITY_MENU', ASSIGNMENTS_MENU:'ASSIGNMENTS_MENU', CAPACITY_FORM:'CAPACITY_FORM', FAQ:'FAQ' }

export default function Widget(){
  const [open,setOpen]=useState(false)
  const [full,setFull]=useState(false)
  const [view,setView]=useState(VIEWS.ROOT)

  const Panel = (
    <div className={full?'widget-fullscreen':''}>
      <div className={'widget-panel ' + (full?'widget-shell':'' )}>
        <div className="widget-header">
          <strong>Conclusion Assistant</strong>
          <div className="widget-actions">
            <button className="btn ghost" onClick={()=>setFull(!full)}>{full?'⤢ Verlaat volledig scherm':'⤢ Volledig scherm'}</button>
            <button className="btn secondary" onClick={()=>setOpen(false)}>✕</button>
          </div>
        </div>
        <div className="widget-body">
          {view===VIEWS.ROOT && (
            <div>
              <p style={{marginTop:0}}><strong>Hoi! Hoe kan ik je vandaag helpen?</strong></p>
              <p className="small">Ben je op zoek naar opdrachten als zzp’er of zoek je als bedrijf naar capaciteit?</p>
              <div className="menu">
                <button className="btn" onClick={()=>setView(VIEWS.CAPACITY_MENU)}>Capaciteit</button>
                <button className="btn" onClick={()=>setView(VIEWS.ASSIGNMENTS_MENU)}>Opdrachten</button>
              </div>
            </div>
          )}

          {view===VIEWS.CAPACITY_MENU && (
            <div>
              <p className="label">Kies een optie:</p>
              <div className="menu">
                <button className="btn" onClick={()=>setView(VIEWS.CAPACITY_FORM)}>Capaciteit aanvragen</button>
                <button className="btn" onClick={()=>setView(VIEWS.FAQ)}>FAQ's</button>
                <button className="btn" onClick={()=>window.location.href='https://www.conclusionstaffing.nl/contact'}>Contact</button>
              </div>
              <div className="nav">
                <button className="btn secondary" onClick={()=>setView(VIEWS.ROOT)}>Terug</button>
              </div>
            </div>
          )}

          {view===VIEWS.ASSIGNMENTS_MENU && (
            <div>
              <p className="label">Kies een optie:</p>
              <div className="menu">
                <button className="btn" onClick={()=>window.location.href='https://www.conclusionstaffing.nl/voor-opdrachtnemers'}>Direct inschrijven</button>
                <button className="btn" onClick={()=>setView(VIEWS.FAQ)}>Onze werkwijze / FAQ</button>
                <button className="btn" onClick={()=>window.location.href='https://www.conclusionstaffing.nl/contact'}>Contact</button>
              </div>
              <div className="nav">
                <button className="btn secondary" onClick={()=>setView(VIEWS.ROOT)}>Terug</button>
              </div>
            </div>
          )}

          {view===VIEWS.CAPACITY_FORM && (
            <CapacityForm onBackToMenu={()=>setView(VIEWS.CAPACITY_MENU)} onDone={()=>setView(VIEWS.CAPACITY_MENU)} />
          )}

          {view===VIEWS.FAQ && (
            <FaqChat />
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {open && Panel}
      {!open && <button className="widget-launcher" onClick={()=>setOpen(true)}>💬</button>}
    </>
  )
}
