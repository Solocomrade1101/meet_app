import { createRoot } from 'react-dom/client'
import App from "./App";
import './styles.scss'
import {EventsProvider} from "./EventContext/EventContext";
import {AppStateProvider} from "./EventContext/AppStateContext";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
      <AppStateProvider>
          <EventsProvider>
              <BrowserRouter basename="/meet_app/">
                  {/*<div className={"header"}></div>*/}
                  <App/>

              </BrowserRouter>
          </EventsProvider>
      </AppStateProvider>
)
