import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'

document.documentElement.classList.add('photo-theme')
import AdminConsole from './AdminConsole.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminConsole />
  </StrictMode>,
)
