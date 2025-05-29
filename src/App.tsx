import { useEffect } from 'react'
import { useTelegram } from './hooks/useTelegram'
import {Home, EventPage, Search, Favorite} from "./pages";
import { Route, Routes } from "react-router-dom";

import {init, isTMA, viewport} from "@telegram-apps/sdk";

const App = () => {
    const { tg } = useTelegram();

    useEffect(() => {
        tg.ready();
        tg.expand();

    }, []);

    // useEffect(() => {
    //     async function initTg() {
    //         if (await isTMA()) {
    //             init();
    //
    //             if (viewport.mount.isAvailable()) {
    //                 await viewport.mount();
    //                 viewport.expand();
    //             }
    //
    //             if (viewport.requestFullscreen.isAvailable()) {
    //                 await viewport.requestFullscreen();
    //             }
    //         }
    //     }
    //     initTg();
    //
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

