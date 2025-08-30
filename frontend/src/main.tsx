import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import { Toaster } from "sonner";
import Store from "./Store/Store.ts";
import Loading from './Layout/Loading.tsx';
import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';

const persistor = persistStore(Store);
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={Store}>
      <PersistGate  persistor={persistor} loading={<Loading/>} >
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </PersistGate>
      <Toaster position="top-center" richColors closeButton />
    </Provider>
  </StrictMode>,
)
