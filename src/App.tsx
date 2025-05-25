import { useEffect } from 'react'
import { useTelegram } from './hooks/useTelegram'
import {Home, EventPage, Search, Favorite} from "./pages";
import { Route, Routes } from "react-router-dom";
import {NavigateFromTelegram} from "./components/components/NavigateFromTelegram";

const App = () => {
    const { tg } = useTelegram();

    useEffect(() => {
        tg.ready();
        tg.expand();
    }, []);

    return (
        <>
            <NavigateFromTelegram />
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
