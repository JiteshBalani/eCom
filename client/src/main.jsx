import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import {store, persistor} from './app/store.js'
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ClerkProvider afterSignOutUrl="/" publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
        frontendApi={import.meta.env.VITE_CLERK_FRONTEND_API}
        signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL}
        signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL}>
        <App />
      </ClerkProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
