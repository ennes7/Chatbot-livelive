import React from 'react'
import Widget from './Widget.jsx'

export default function App(){
  return (
    <>
      <div className="container">
        <div className="card">
          <div className="header">
            <span className="badge">Conclusion Staffing</span>
            <h1>Chatbot demo</h1>
          </div>
          <div className="content">
            <p>De chatbot staat rechtsonder. Klik op de 💬-knop om te starten. Je kunt hem uitbreiden naar volledig scherm.</p>
          </div>
        </div>
      </div>
      <Widget />
    </>
  )
}
