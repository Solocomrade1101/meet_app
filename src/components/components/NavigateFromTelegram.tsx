import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export const NavigateFromTelegram = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Ждем полной инициализации Telegram WebApp
        const interval = setInterval(() => {
            const tg = (window as any).Telegram?.WebApp;
            if (tg && tg.initDataUnsafe) {
                clearInterval(interval);

                // Получаем параметр из start или startapp
                const startParam = tg.initDataUnsafe.start_param ||
                    new URLSearchParams(tg.initDataUnsafe.start).get('startapp');

                console.log('[TG] Навигация по параметру:', startParam);

                if (startParam) {
                    navigate(`/event/${startParam}`);
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, [navigate]);

    return null;
};