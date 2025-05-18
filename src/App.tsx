import { useEffect } from 'react'
import { useTelegram } from './hooks/useTelegram'
import {Home, EventPage} from "./pages";
import {BrowserRouter, Route, Routes} from "react-router-dom";

const App = () => {
    const { tg } = useTelegram()

    useEffect(() => {
        tg.ready()
        tg.expand()
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/event/:id" element={<EventPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App