import React, {useState} from 'react'
import s from './Home.module.scss'
import {useEvents} from "../../hooks";
import {Sort} from "./components/Sort";
import type {IEvent} from "../../types/events.ts";
import { useNavigate } from 'react-router-dom'
import {formatDateParts} from "../utils";

export const Home: React.FC = () => {
    const { events, loading, error } = useEvents()
    const [visiblePastEvents, setVisiblePastEvents] = useState(4)
    const navigate = useNavigate()

    if (loading) return <div className={s.loader}>Загрузка...</div>
    if (error) return <div className={s.error}>Ошибка: {error}</div>

    const now = new Date()

    const futureEvents = events.filter((event: IEvent) => {
        const eventDate = new Date(event.date)
        return eventDate >= now
    })

    const pastEvents = events.filter((event: IEvent) => {
        const eventDate = new Date(event.date)
        return eventDate < now
    })


    return (
        <div className={s.wrapper}>
            <Sort/>
            <div className={s.future_events}>
                {futureEvents.map((event: IEvent) => {
                    const {day, weekday} = formatDateParts(event.date)
                    return (
                        <div key={event.id} className={s.event} onClick={() => navigate(`/event/${event.id}`)}>
                            <div className={s.data}>
                                <span className={s.day}>{day}, </span>
                                <span className={s.weekday}>{weekday}</span>
                            </div>
                            <img src={event.image} alt={event.title} className={s.image}/>
                            <div className={s.info}>
                                <span className={s.title}>{event.title}</span>
                                <svg className={s.like} width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M11.9962 4.39359C11.1438 3.5952 9.98817 2.95561 8.71945 2.72258C7.20946 2.44524 5.53972 2.74747 4.089 4.02863C3.12224 4.88239 2.51747 6.22556 2.31707 7.67701C2.11498 9.14069 2.31177 10.7874 3.03178 12.3134C3.55268 13.4174 4.79277 14.8062 6.08138 16.0846C7.39828 17.3911 8.86456 18.6763 9.93759 19.5846C11.1306 20.5945 12.8619 20.5945 14.0549 19.5846C15.1279 18.6763 16.5942 17.3911 17.9111 16.0846C19.1997 14.8062 20.4398 13.4174 20.9607 12.3134C21.6807 10.7874 21.8775 9.1407 21.6754 7.67702C21.475 6.22557 20.8702 4.8824 19.9035 4.02864C18.4527 2.74749 16.783 2.44525 15.273 2.72259C14.0043 2.95562 12.8486 3.5952 11.9962 4.39359ZM8.44072 4.24005C7.34896 4.03952 6.1713 4.24808 5.11028 5.18508C4.49352 5.72975 4.01056 6.69202 3.84543 7.88803C3.68198 9.07181 3.84185 10.4146 4.42712 11.655C4.81688 12.4811 5.86402 13.6957 7.168 14.9893C8.44368 16.2549 9.87536 17.5105 10.9344 18.407C11.5521 18.9299 12.4404 18.9299 13.058 18.407C14.1171 17.5105 15.5488 16.2549 16.8245 14.9893C18.1284 13.6957 19.1756 12.4811 19.5653 11.655C20.1506 10.4146 20.3105 9.07182 20.147 7.88804C19.9819 6.69204 19.4989 5.72976 18.8822 5.1851C17.8212 4.24809 16.6435 4.03953 15.5517 4.24006C14.4337 4.44541 13.4067 5.0834 12.7478 5.83159C12.3497 6.28365 11.6427 6.28365 11.2446 5.83159C10.5858 5.0834 9.55875 4.4454 8.44072 4.24005Z"
                                          fill="#78818F"/>
                                </svg>
                            </div>
                            <div className={s.city_block}>
                                {event.place.map(item => (
                                    <span className={s.city}>{item}</span>
                                ))}

                            </div>

                        </div>
                    )

                    }
                )}
            </div>
            <div className={s.separator}></div>
            <h2 className={s.last_title}>Прошедшие события</h2>
            <div className={s.last_events}>
                {pastEvents.slice(0, visiblePastEvents).map((event: IEvent) => {
                    const {day, weekday} = formatDateParts(event.date)
                    return (
                        <div className={s.last_event} key={event.id}>
                            <span className={s.date}>{day}</span>
                            <span className={s.title}>{event.title}</span>
                            <div className={s.city_block}>
                                {event.place.map(item => (
                                    <span className={s.city}>{item}</span>
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


        </div>
    )
}
