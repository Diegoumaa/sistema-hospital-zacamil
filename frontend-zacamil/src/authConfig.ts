import type { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "50f7a195-a890-42ed-87a2-f3b448d2aadf", // ID de Zacamil-Frontend
    authority: "https://login.microsoftonline.com/a9a9a395-9ee3-4b10-b45d-53bfd77c7d72", // Tu Tenant ID
    redirectUri: "http://localhost:5173", // Tu puerto local de Vite
  },
  cache: {
    cacheLocation: "sessionStorage",
  }
};

// Pedimos el permiso al Backend que configuramos en Azure
export const loginRequest = {
  scopes: ["api://32157fa3-8fb6-4872-9309-d04ebfeee376/Zacamil.Access"]
};