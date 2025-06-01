import { useEffect } from 'react'
import {Home, EventPage, Search, Favorite} from "./pages";
import { Route, Routes } from "react-router-dom";

const App = () => {

    // useEffect(() => {
    //     const tg = window.Telegram.WebApp;
    //     tg.requestFullscreen();
    // }, []);
    //
    // useEffect(() => {
    //     const root = document.documentElement;
    //
    //     const tg = window.Telegram.WebApp;
    //
    //     if (tg.platform === "ios") {
    //         root.style.setProperty('--custom-safe-top', 'env(safe-area-inset-top)');
    //         root.style.setProperty('--custom-safe-bottom', 'env(safe-area-inset-bottom)');
    //     } else {
    //         root.style.setProperty('--custom-safe-top', '40px');
    //         root.style.setProperty('--custom-safe-bottom', '32px');
    //     }
    // }, []);

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

