import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setApiBase } from './api/quizApi.js'

// Automatically set API base to the current origin for the SPA viewer
setApiBase(window.location.origin);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
