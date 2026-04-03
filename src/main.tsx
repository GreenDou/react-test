import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './custom-elements/reaction-meter'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
