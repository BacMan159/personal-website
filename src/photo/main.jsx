import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import PhotoGallery from './PhotoGallery.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PhotoGallery />
  </StrictMode>,
)
