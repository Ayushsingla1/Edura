import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Web3Provider } from './Components/WalletProvider.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import {dark} from "@clerk/themes";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')!).render(
  <ClerkProvider appearance={{baseTheme : dark}} publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <Web3Provider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Web3Provider>
  </ClerkProvider>
)
