import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  AiData: [],
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'AddData':
      console.log('add data ', rest.data)
      const updatedAiData = rest.data.vuln || []
      const fileName = rest.data.filename || 'Unknown Filename'
      return { AiData: updatedAiData, fileName: fileName }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
