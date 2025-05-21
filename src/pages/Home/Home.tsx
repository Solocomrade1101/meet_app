import React, {useEffect, useState} from 'react'
import s from './Home.module.scss'
import {Sort} from "./components/Sort";
import { useNavigate } from 'react-router-dom'
import {formatDateParts} from "../utils";
import type {Filters} from "./Interfaces.ts";
import {useEvents} from "../../EventContext/EventContext";
import {Footer, Loader} from "../../components";
import {storage} from "../../utils";
import type {IEvent} from "../../types";
import {FutureEvent} from "./components/FutureEvent";


export const Home: React.FC = () => {
    const { events, loading, error } = useEvents()
    const [visiblePastEvents, setVisiblePastEvents] = useState(4)
    const navigate = useNavigate()
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

    const [filters, setFilters] = useState<Filters>({
        sortOrder: 'Сначала ближайшие',
        format: [],
        cities: []
    });
    const [isDelayOver, setIsDelayOver] = useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            setIsDelayOver(true);
        }, 1000);

        return () => clearTimeout(delay);
    }, []);

    useEffect(() => {
        const loadFavorites = async () => {
            const favorites = await storage.getFavorites();
            setFavoriteIds(favorites);
        };
        loadFavorites();
    }, []);


    if (loading || !isDelayOver) return <Loader />;
    if (error) return <div className={s.error}>Ошибка: {error}</div>

    const now = new Date();

    const sortedEvents = [...events].sort((a, b) => {
        const dateA = new Date(a.date[0]);
        const dateB = new Date(b.date[0]);
        return filters.sortOrder === 'Сначала ближайшие'
            ? +dateA - +dateB : +dateB - +dateA
    });

    const formatFilteredEvents = sortedEvents.filter(event => {
        if (filters.format.length === 0) return true;

        const isOnline = event.place.includes("Онлайн");

        if (filters.format.includes("Онлайн") && filters.format.includes("Оффлайн")) {
            return true;
        }

        if (filters.format.includes("Онлайн")) {
            return isOnline;
        }

        if (filters.format.includes("Оффлайн")) {
            return !isOnline;
        }

        return true;
    });

    const cityFilteredEvents = formatFilteredEvents.filter(event => {
        if (filters.cities.length === 0) return true;
        return event.place.some(city => filters.cities.includes(city));
    });

    const futureEvents = cityFilteredEvents.filter(event => new Date(event.date[0]) >= now);
    const pastEvents = cityFilteredEvents.filter(event => new Date(event.date[0]) < now);

    const handleToggleFavorite = async (eventId: string) => {
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
        <div className={s.wrapper}>
            <Sort filters={filters}
                  setFilters={setFilters}/>
            <div className={s.future_events}>
                {futureEvents.map((event: IEvent) => (
                    <FutureEvent event={event} key={event.id} isFavorite={favoriteIds.includes(event.id)} onToggleFavorite={() => handleToggleFavorite(event.id)}/>
                    )
                )}
            </div>
            <div className={s.separator}></div>
            <h2 className={s.last_title}>Прошедшие события</h2>
            <div className={s.last_events}>
                {pastEvents.slice(0, visiblePastEvents).map((event: IEvent) => {
                    const {day, weekday} = formatDateParts(event.date[0])
                    return (
                        <div className={s.last_event} key={event.id}>
                            <span className={s.date}>{day}</span>
                            <span className={s.title}>{event.title}</span>
                            <div className={s.city_block}>
                                {event.place.map(item => (
                                    <span key={item} className={s.city}>{item}</span>
                                ))}
                            </div>
                        </div>
                    )
                })}

            </div>
            {pastEvents.length > visiblePastEvents && (
                <button
                    className={s.button_load}
                    onClick={() => setVisiblePastEvents(prev => prev + 4)}
                >
                    Показать ещё
                </button>
            )}

            <Footer/>
        </div>
    )
}
