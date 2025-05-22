import React, { type FC, useEffect, useState } from "react";
import s from './Favorite.module.scss'
import { useEvents } from "../../EventContext/EventContext";
import { Footer } from "../../components";
import favoriteEmpty from './favoriteEmpty.png';
import { useNavigate } from "react-router-dom";
import { storage } from "../../utils";
import { formatDateParts } from "../utils";
import cn from "classnames";

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
                            <div key={item.id} className={s.event} onClick={() => navigate(`/event/${item.id}`)}>
                                <span className={s.date}>{day}, {weekday}</span>
                                <div className={s.event_title_block}>
                                    <span className={s.event_title}>{item.title}</span>
                                    <button className={cn(s.like, favoriteIds.includes(item.id) && s.favorite)}
                                            onClick={(event) => handleToggleFavorite(event, item.id)}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                  d="M11.9962 4.39359C11.1438 3.5952 9.98817 2.95561 8.71945 2.72258C7.20946 2.44524 5.53972 2.74747 4.089 4.02863C3.12224 4.88239 2.51747 6.22556 2.31707 7.67701C2.11498 9.14069 2.31177 10.7874 3.03178 12.3134C3.55268 13.4174 4.79277 14.8062 6.08138 16.0846C7.39828 17.3911 8.86456 18.6763 9.93759 19.5846C11.1306 20.5945 12.8619 20.5945 14.0549 19.5846C15.1279 18.6763 16.5942 17.3911 17.9111 16.0846C19.1997 14.8062 20.4398 13.4174 20.9607 12.3134C21.6807 10.7874 21.8775 9.1407 21.6754 7.67702C21.475 6.22557 20.8702 4.8824 19.9035 4.02864C18.4527 2.74749 16.783 2.44525 15.273 2.72259C14.0043 2.95562 12.8486 3.5952 11.9962 4.39359ZM8.44072 4.24005C7.34896 4.03952 6.1713 4.24808 5.11028 5.18508C4.49352 5.72975 4.01056 6.69202 3.84543 7.88803C3.68198 9.07181 3.84185 10.4146 4.42712 11.655C4.81688 12.4811 5.86402 13.6957 7.168 14.9893C8.44368 16.2549 9.87536 17.5105 10.9344 18.407C11.5521 18.9299 12.4404 18.9299 13.058 18.407C14.1171 17.5105 15.5488 16.2549 16.8245 14.9893C18.1284 13.6957 19.1756 12.4811 19.5653 11.655C20.1506 10.4146 20.3105 9.07182 20.147 7.88804C19.9819 6.69204 19.4989 5.72976 18.8822 5.1851C17.8212 4.24809 16.6435 4.03953 15.5517 4.24006C14.4337 4.44541 13.4067 5.0834 12.7478 5.83159C12.3497 6.28365 11.6427 6.28365 11.2446 5.83159C10.5858 5.0834 9.55875 4.4454 8.44072 4.24005Z"
                                            />
                                        </svg>
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