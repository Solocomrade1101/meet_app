import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "./App";
import './styles.scss'
import {EventsProvider} from "./EventContext/EventContext";
import {AppStateProvider} from "./EventContext/AppStateContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AppStateProvider>
          <EventsProvider>
              <App />
          </EventsProvider>
      </AppStateProvider>
  </StrictMode>,
)
