import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import HomePage from './components/HomePage.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<App />} />
        </Routes>
      </Router>
    </ChakraProvider>
  </StrictMode>,
)
