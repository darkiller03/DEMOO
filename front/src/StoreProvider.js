/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'
import { Provider } from 'react-redux'
import store from './store'
function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>
}

export default StoreProvider
