import React, { useState } from 'react'
import CapacityForm from './CapacityForm.jsx'
import FaqBot from './FaqBot.jsx'

const VIEWS = {
  WELCOME: 'WELCOME',
  CAPACITY_MENU: 'CAPACITY_MENU',
  ASSIGNMENTS_MENU: 'ASSIGNMENTS_MENU',
  CAPACITY_FORM: 'CAPACITY_FORM',
  FAQ: 'FAQ',
}

export default function App() {
  const [view, setView] = useState(VIEWS.WELCOME)
  const go = (v) => setView(v)
  const openLink = (url) => { window.location.href = url }

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <span className="badge">Conclusion Staffing</span>
          <h1>Chatbot</h1>
        </div>

        <div className="content">
          {view === VIEWS.WELCOME && (
            <div>
              <p style={{fontSize:16, marginTop:0}}><strong>Hoi! Hoe kan ik je vandaag helpen?</strong></p>
              <p className="small">Ben je op zoek naar opdrachten als zzp’er of zoek je als bedrijf naar capaciteit?</p>
              <div className="menu">
                <button className="btn" onClick={()=>go(VIEWS.CAPACITY_MENU)}>Capaciteit</button>
                <button className="btn" onClick={()=>go(VIEWS.ASSIGNMENTS_MENU)}>Opdrachten</button>
              </div>
            </div>
          )}

          {view === VIEWS.CAPACITY_MENU && (
            <div>
              <p className="label">Kies een optie:</p>
              <div className="menu">
                <button className="btn" onClick={()=>go(VIEWS.CAPACITY_FORM)}>Capaciteit aanvragen</button>
                <button className="btn" onClick={()=>go(VIEWS.FAQ)}>FAQ's</button>
                <button className="btn" onClick={()=>openLink('https://www.conclusionstaffing.nl/contact')}>Contact</button>
              </div>
              <div className="nav">
                <button className="btn secondary" onClick={()=>go(VIEWS.WELCOME)}>Terug</button>
              </div>
            </div>
          )}

          {view === VIEWS.ASSIGNMENTS_MENU && (
            <div>
              <p className="label">Kies een optie:</p>
              <div className="menu">
                <button className="btn" onClick={()=>openLink('https://www.conclusionstaffing.nl/voor-opdrachtnemers')}>Direct inschrijven</button>
                <button className="btn" onClick={()=>go(VIEWS.FAQ)}>Onze werkwijze / FAQ</button>
                <button className="btn" onClick={()=>openLink('https://www.conclusionstaffing.nl/contact')}>Contact</button>
              </div>
              <div className="nav">
                <button className="btn secondary" onClick={()=>go(VIEWS.WELCOME)}>Terug</button>
              </div>
            </div>
          )}

          {view === VIEWS.CAPACITY_FORM && (
            <CapacityForm onDone={()=>go(VIEWS.CAPACITY_MENU)} />
          )}

          {view === VIEWS.FAQ && (
            <div>
              <FaqBot title="Conclusion FAQ (website)" />
              <div className="nav">
                <button className="btn secondary" onClick={()=>go(VIEWS.WELCOME)}>Terug naar start</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
