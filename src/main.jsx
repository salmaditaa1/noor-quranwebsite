import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 🔥 CSS (urutannya penting biar ga ketimpa)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'
import './arabic.css'   // 👉 taruh paling bawah biar font kepakai

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)