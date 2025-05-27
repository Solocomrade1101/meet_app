import React, {useEffect, useState} from 'react'
import s from './Home.module.scss'
import {Sort} from "./components/Sort";
import {formatDateParts} from "../utils";
import type {Filters} from "./Interfaces.ts";
import {useEvents} from "../../EventContext/EventContext";
import {Footer, Loader} from "../../components";
import {storage} from "../../utils";
import type {IEvent} from "../../types";
import {FutureEvent} from "./components/FutureEvent";
import {useAppState} from "../../EventContext/AppStateContext";
import {useNavigate} from "react-router-dom";
import {ErrorPage} from "./components/ErrorPage";


export const Home: React.FC = () => {
    const navigate = useNavigate();
    const { events, loading, error } = useEvents()
    const { isDelayOver } = useAppState()
    const [visiblePastEvents, setVisiblePastEvents] = useState(4)
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [showScrollTop, setShowScrollTop] = useState(false)

    const [filters, setFilters] = useState<Filters>({
        sortOrder: 'Сначала ближайшие',
        format: [],
        cities: []
    });

    useEffect(() => {
        const loadFavorites = async () => {
            const favorites = await storage.getFavorites();
            setFavoriteIds(favorites);
        };
        loadFavorites();
    }, []);

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



    useEffect(() => {
        const onScroll = () => {
            setShowScrollTop(window.scrollY > 150)
        }

        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleScrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    if (loading || !isDelayOver) return <Loader />;
    if (error) return <ErrorPage/>

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

    const stripTime = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day); // месяц с 0
    };

    const today = new Date();
    const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const futureEvents = cityFilteredEvents.filter(event =>
        event.date.some(date => stripTime(date) >= currentDate)
    );

    const pastEvents = cityFilteredEvents.filter(event =>
        event.date.every(date => stripTime(date) < currentDate)
    );




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
            {!!futureEvents.length && !!pastEvents.length && (
                <div className={s.separator}></div>
            )}
            {!!futureEvents.length && !!pastEvents.length && (
                <h2 className={s.last_title}>Прошедшие события</h2>
            )}
            {!futureEvents.length && !pastEvents.length && (
                <h2 className={s.empty_events}>Ничего не найдено</h2>
            )}
            <div className={s.last_events}>
                {pastEvents.slice(0, visiblePastEvents).map((event: IEvent) => {
                    const {day, weekday} = formatDateParts(event.date)
                    return (
                        <div className={s.last_event} key={event.id} onClick={() => navigate(`/event/${event.id}`)}>
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

            {showScrollTop && (
                <button className={s.scroll} onClick={handleScrollTop}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18.7686 10.8428C18.4411 11.1848 17.8876 11.2067 17.5322 10.8916L12.875 6.76278L12.875 19.1579C12.875 19.623 12.4832 20 12 20C11.5168 20 11.125 19.623 11.125 19.1579L11.125 6.76278L6.46784 10.8916C6.11241 11.2067 5.55886 11.1848 5.23144 10.8428C4.90403 10.5007 4.92674 9.96797 5.28217 9.65287L11.4072 4.22274C11.7422 3.92575 12.2578 3.92575 12.5928 4.22274L18.7178 9.65287C19.0733 9.96797 19.096 10.5007 18.7686 10.8428Z"
                            fill="#F1F4F8"
                        />
                    </svg>
                </button>
            )}
        </div>
    )
}
