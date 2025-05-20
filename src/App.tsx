import { useEffect } from 'react'
import { useTelegram } from './hooks/useTelegram'
import {Home, EventPage} from "./pages";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {EventsProvider} from "./EventContext/EventContext";

const App = () => {
    const { tg } = useTelegram()

    useEffect(() => {
        tg.ready()
        tg.expand()
    }, [])

    return (
        <EventsProvider>
            <BrowserRouter basename="/meet_app/">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/event/:id" element={<EventPage />} />
                </Routes>
            </BrowserRouter>
        </EventsProvider>
    )
}

export default App