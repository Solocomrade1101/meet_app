import React, { type FC, useEffect, useState } from "react";
import s from './Favorite.module.scss'
import { useEvents } from "../../EventContext/EventContext";
import { Footer } from "../../components";
import favoriteEmpty from './favoriteEmpty.png';
import { useNavigate } from "react-router-dom";
import { storage } from "../../utils";
import { formatDateParts } from "../utils";
import cn from "classnames";
import likeActive from "../../image/like_active.svg";
import like from "../../image/like.svg";

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
    useEffect(() => {
        const tg = window.Telegram.WebApp;
        tg.BackButton.show();
        tg.BackButton.onClick(() => navigate(-1));

        return () => {
            tg.BackButton.hide();
            tg.BackButton.offClick();
        };
    }, [navigate]);

    const favoriteEvents = events.filter(event => favoriteIds.includes(event.id));
    const handleToggleFavorite = async (event: React.MouseEvent<HTMLButtonElement>, eventId: string) => {
        event.stopPropagation()
        const isFavorite = favoriteIds.includes(eventId);

        if (isFavorite) {
            await storage.removeFavorite(eventId);
            setFavoriteIds(prev => prev.filter(id => id !== eventId));
        } else {
            await storage.addFavorite(eventId);
            setFavoriteIds(prev => [...prev, eventId]);
        }
    };

    useEffect(() => {
        const img = new Image();
        img.src = favoriteEmpty;
    }, []);


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
                        const { day, weekday } = formatDateParts(item.date);

                        return (
                            <div key={item.id} className={s.event} onClick={() => navigate(`/event/${item.id}`)}>
                                <div className={s.data}>
                                    <span className={s.day}>{day}</span>
                                    {weekday && <span className={s.weekday}>{`, ${weekday}`}</span>}
                                </div>
                                <div className={s.event_title_block}>
                                    <span className={s.event_title}>{item.title}</span>
                                    <button className={cn(s.like, favoriteIds.includes(item.id) && s.favorite)}
                                            onClick={(event) => handleToggleFavorite(event, item.id)}>
                                        <img
                                            src={favoriteIds.includes(item.id) ? likeActive : like}
                                            alt="Добавить в избранное"
                                            className={s.like_icon}
                                        />
                                    </button>
                                </div>

                                <div className={s.city_block}>
                                    {item.place.map(item => (
                                        <span key={item} className={s.city}>{item}</span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Footer/>
        </div>
    );
};