import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, theme } from '@chakra-ui/react'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
