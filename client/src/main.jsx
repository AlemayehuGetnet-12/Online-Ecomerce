import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './i18n.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '8px', fontSize: '14px', fontWeight: '500' },
          success: { style: { background: '#16a34a', color: '#fff' } },
          error:   { style: { background: '#dc2626', color: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
