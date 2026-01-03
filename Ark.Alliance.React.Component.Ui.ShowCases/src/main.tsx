import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// Import library styles
import 'ark-alliance-react-ui/styles'
import '@fortawesome/fontawesome-svg-core/styles.css';

import { ThemeProvider } from './presentation/context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
