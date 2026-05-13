import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PublicClientApplication, EventType } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './authConfig'

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize().then(() => {
  
  // RASTREADOR 1: Verificamos si regresamos de un Redirect
  msalInstance.handleRedirectPromise()
    .then((response) => {
      if (response) {
        console.log("✅ MSAL: Respuesta recibida de Microsoft:", response.account?.username);
        msalInstance.setActiveAccount(response.account);
      } else {
        console.log("ℹ️ MSAL: Carga normal (sin redirect pendiente).");
      }
    })
    .catch((error) => {
      console.error("❌ MSAL: Error crítico en la redirección:", error);
    });

  // RASTREADOR 2: Eventos secundarios
  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as any;
      msalInstance.setActiveAccount(payload.account);
    }
  });

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </StrictMode>,
  )
});