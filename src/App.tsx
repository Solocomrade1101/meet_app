import { useEffect } from 'react'
import {Home, EventPage, Search, Favorite} from "./pages";
import { Route, Routes } from "react-router-dom";

const App = () => {

    useEffect(() => {
        let tg = window.Telegram.WebApp;
        tg.requestFullscreen();
    }, []);

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/event/:id" element={<EventPage />} />
                <Route path="/search" element={<Search />} />
                <Route path="/favorite" element={<Favorite />} />
            </Routes>
        </>
    );
};

export default App;

