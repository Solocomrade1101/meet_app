import React, {type FC, useEffect, useState} from "react";
import s from './Favorite.module.scss'
import {useEvents} from "../../EventContext/EventContext";
import {Footer} from "../../components";
import favoriteEmpty from './favoriteEmpty.png';
import {useNavigate} from "react-router-dom";
import {storage} from "../../utils";
import {formatDateParts} from "../utils";

export const Favorite: FC = () => {
    const { events } = useEvents();
    const navigate = useNavigate();

    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

    useEffect(() => {
        const loadFavorites = async () => {
            const favorites = await storage.getFavorites();
            setFavoriteIds(favorites);
        };
        loadFavorites();
    }, []);

    const favoriteEvents = events.filter(event =>
        favoriteIds.includes(event.id)
    );

    return (
        <div className={s.container}>
            <span className={s.title}>Избранное</span>

            {favoriteEvents.length === 0 ? (
                <>
                    <div className={s.empty_block}>
                        <img className={s.img} src={favoriteEmpty} alt={"Нет избранных событий"} />
                        <span className={s.text}>
                            Здесь будут появляться события, которые вы отметите
                        </span>
                    </div>
                    <button className={s.button} onClick={() => navigate('/')}>
                        Смотреть события
                    </button>
                </>
            ) : (
                <div className={s.events}>
                    {favoriteEvents.map(item => {
                        const { day, weekday } = formatDateParts(item.date[0]);

                        return (
                            <div key={item.id} className={s.event}>
                                <span className={s.date}>{day}</span>
                                <div className={s.title_block}>
                                    <span className={s.title}>{item.title}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Footer />
        </div>
    );
};