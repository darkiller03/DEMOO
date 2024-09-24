/* eslint-disable prettier/prettier */
import React from 'react'
import { createRoot } from 'react-dom/client'
import 'core-js'
import App from './App'
import StoreProvider from './StoreProvider'

createRoot(document.getElementById('root')).render(
  <StoreProvider>
    <App />
  </StoreProvider>,
)
