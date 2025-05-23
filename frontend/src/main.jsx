
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Provider} from "react-redux"
import { persistor,store } from "./redux/store.js"
import { PersistGate } from 'redux-persist/integration/react'
import ThemeProvider from './contexts/theme.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
  <ThemeProvider>
     <App />
  </ThemeProvider>
  

  </PersistGate>
    
  </Provider>,
)
