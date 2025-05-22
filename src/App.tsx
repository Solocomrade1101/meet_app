import { useEffect } from 'react'
import { useTelegram } from './hooks/useTelegram'
import {Home, EventPage, Search, Favorite} from "./pages";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {EventsProvider} from "./EventContext/EventContext";

const App = () => {
    const { tg } = useTelegram()

    useEffect(() => {
        tg.ready()
        tg.expand()
    }, [])

    return (
            <BrowserRouter basename="/meet_app/">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/event/:id" element={<EventPage />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/favorite" element={<Favorite />} />

                </Routes>
            </BrowserRouter>
    )
}

export default App