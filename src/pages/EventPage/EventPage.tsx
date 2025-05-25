import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import s from './EventPage.module.scss'
import {formatDateParts} from "../utils";
import {useEvents} from "../../EventContext/EventContext";
import cn from "classnames";
import likeActive from "../../image/like_active.svg";
import like from "../../image/like.svg";
import {storage} from "../../utils";
import type {IEvent} from "../../types";

export const EventPage: React.FC = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { events } = useEvents()
    useEffect(() => {
        const tg = window.Telegram.WebApp;
        tg.BackButton.show();
        tg.BackButton.onClick(() => navigate(-1));

        return () => {
            tg.BackButton.hide();
            tg.BackButton.offClick();
        };
    }, [navigate]);
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            const ids = await storage.getFavorites(); // предполагается, что возвращает массив id
            setFavoriteIds(ids);
        };
        fetchFavorites();
    }, []);


    const event = events.find(e => e.id === id)

    if (!event) return <div className={s.error}>Событие не найдено</div>

    const {day, weekday} = formatDateParts(event.date)

    const formatShareText = (event: IEvent): string => {
        const date = new Date(`${event.date[0]}T${event.time}`);

        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        };

        const formattedDate = date.toLocaleString('ru-RU', options);

        const isOnline = event.place.includes("Онлайн");
        const location = event.place.filter(p => p.toLowerCase() !== 'онлайн').join(', ') || 'Онлайн';

        const eventBotUrl = `https://t.me/Meet_tg_app_bot?start=${event.id}`;
        const subscribeUrl = `https://t.me/Meet_tg_app_bot?start=subscribe_all`;

        const message = `
${event.title}
${eventBotUrl}

📍 ${location}
⏰ ${formattedDate}
${isOnline ? '📺 Онлайн' : ''}

${event.description?.trim() || ''}

Подписывайся на события в боте @Meet_tg_app_bot
${subscribeUrl}

#мероприятие #ивент ${isOnline ? '#онлайн' : '#офлайн'}
`.trim();

        return message;
    };



    const handleShare = () => {
        const text = formatShareText(event);
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(`https://t.me/Meet_tg_app_bot?start=${event.id}`)}&text=${encodeURIComponent(text)}`;

        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: text,
                url: `https://t.me/Meet_tg_app_bot?start=${event.id}`
            }).catch(console.error);
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                window.open(shareUrl, '_blank');
            });
        } else {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            window.open(shareUrl, '_blank');
        }
    };


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

    const createGoogleCalendarLink = (event: IEvent) => {
        const dateStr = event.date[0];
        const timeStr = event.time || '00:00:00';

        const [year, month, day] = dateStr.split('-').map(Number);
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);

        const start = new Date(year, month - 1, day, hours, minutes, seconds);

        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

        const pad = (n: number) => n.toString().padStart(2, '0');
        const formatForCalendar = (d: Date) =>
            `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;

        const details = {
            text: event.title,
            dates: `${formatForCalendar(start)}/${formatForCalendar(end)}`,
            details: event.description || '',
            location: event.place.join(', '),
        };

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: details.text,
            dates: details.dates,
            details: details.details,
            location: details.location,
        });

        return `https://www.google.com/calendar/render?${params.toString()}`;
    };


    return (
        <div className={s.container}>
            {!imageLoaded && <div className={s.image_skeleton} />}

            <img
                src={event.image}
                alt={event.title}
                className={cn(s.image, { [s.hidden]: !imageLoaded })}
                onLoad={() => setImageLoaded(true)}
            />

            <div className={s.info_block}>
                <div className={s.info}>
                    <span className={s.title}>{event.title}</span>
                    <button className={cn(s.like)} onClick={(e) => handleToggleFavorite(e, event.id)}>
                        <img
                            src={favoriteIds.includes(event.id) ? likeActive : like}
                            alt="Добавить в избранное"
                            className={s.like_icon}
                        />
                    </button>
                </div>

                <div className={s.data_block}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.9553 2.58984V5.55207M7.0309 2.58984V5.55207M3.32812 8.51429H16.6581M4.80924 4.07095H15.177C15.995 4.07095 16.6581 4.73407 16.6581 5.55207V15.9198C16.6581 16.7378 15.995 17.401 15.177 17.401H4.80924C3.99124 17.401 3.32812 16.7378 3.32812 15.9198V5.55207C3.32812 4.73407 3.99124 4.07095 4.80924 4.07095Z"
                            stroke="#F1F4F8" strokeWidth="1.49997" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className={s.data}>
                        <span className={s.day}>{day}</span>
                        {weekday && <span className={s.weekday}>{`, ${weekday}`}</span>}
                    </div>
                </div>

                <div className={s.data_block}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.0026 5.99967V9.99967L12.6693 11.333M16.6693 9.99967C16.6693 13.6816 13.6845 16.6663 10.0026 16.6663C6.32071 16.6663 3.33594 13.6816 3.33594 9.99967C3.33594 6.31778 6.32071 3.33301 10.0026 3.33301C13.6845 3.33301 16.6693 6.31778 16.6693 9.99967Z"
                            stroke="#F1F4F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className={s.time}>{event.time.slice(0,5)}</span>
                </div>

                <div className={s.data_block}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M16.6693 8.48517C16.6693 13.7882 10.0026 18.3337 10.0026 18.3337C10.0026 18.3337 3.33594 13.7882 3.33594 8.48517C3.33594 6.67688 4.03832 4.94265 5.28856 3.66399C6.5388 2.38533 8.23449 1.66699 10.0026 1.66699C11.7707 1.66699 13.4664 2.38533 14.7166 3.66399C15.9669 4.94265 16.6693 6.67688 16.6693 8.48517Z"
                            stroke="#F1F4F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path
                            d="M10.0026 10.7579C11.2299 10.7579 12.2248 9.74037 12.2248 8.48517C12.2248 7.22998 11.2299 6.21245 10.0026 6.21245C8.7753 6.21245 7.78038 7.22998 7.78038 8.48517C7.78038 9.74037 8.7753 10.7579 10.0026 10.7579Z"
                            stroke="#F1F4F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className={s.place}>{event.place.join(', ')}</span>
                </div>
            </div>

            <a
                href={createGoogleCalendarLink(event)}
                target="_blank"
                rel="noopener noreferrer"
                className={s.add_calendar}
            >Добавить в календарь</a>

            <div className={s.description_block}>
                <span className={s.title}>О мероприятии</span>
                <p className={s.description}>{event.description}</p>
            </div>

            <footer className={s.footer}>
                <button onClick={handleShare} className={s.left}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M11.8857 4.22949C11.8857 3.04761 13.3133 2.45504 14.1484 3.29102L21.5723 10.7246L21.6963 10.8613C22.2349 11.5226 22.2349 12.4774 21.6963 13.1387L21.5723 13.2754L14.1484 20.709C13.3132 21.5449 11.8857 20.9524 11.8857 19.7705V16.6445C10.3993 16.6444 9.24309 16.6584 8.10547 16.9814L7.87305 17.0518C6.72685 17.4215 5.52089 18.1492 4.03418 19.6572L3.73242 19.9697C3.42899 20.2908 2.98413 20.3663 2.6123 20.2412C2.28447 20.1308 2.00958 19.8632 1.93359 19.4697L1.91406 19.293C1.76134 15.2596 2.90843 12.253 4.86426 10.2539L5.22754 9.90332C7.05749 8.22926 9.43657 7.42585 11.8857 7.36133V4.22949ZM13.4473 8.13867C13.447 8.56987 13.0981 8.91969 12.667 8.91992H12.208C9.96688 8.91997 7.8615 9.61472 6.28711 11.0508L5.97949 11.3477C4.56466 12.7938 3.58091 14.9684 3.47363 18.0225C4.86139 16.7242 6.11443 15.9763 7.39453 15.5635L7.67578 15.4785C9.08248 15.0792 10.4747 15.0804 11.9629 15.0811H12.667C13.0982 15.0813 13.4473 15.4319 13.4473 15.8633V19.1992L20.4678 12.1699L20.499 12.1328C20.5519 12.0526 20.5519 11.9473 20.499 11.8672L20.4678 11.8301L13.4473 4.7998V8.13867Z"
                            fill="#F1F4F8" stroke="#F1F4F8" strokeWidth="0.2"/>
                    </svg>
                </button>
                <a href={event.link_event} target={"_blank"} className={s.right}>
                    <span className={s.text}>Открыть событие</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9.53809 3.875C9.94694 3.875 10.2792 4.2064 10.2793 4.61523C10.2793 5.02413 9.94699 5.35547 9.53809 5.35547H7.4873C6.31016 5.35547 5.35547 6.31016 5.35547 7.4873V16.5127C5.35547 17.6899 6.31016 18.6445 7.4873 18.6445H16.5127C17.6899 18.6445 18.6445 17.6899 18.6445 16.5127V14.4619C18.6445 14.053 18.9759 13.7207 19.3848 13.7207C19.7936 13.7208 20.125 14.0531 20.125 14.4619V16.5127C20.125 18.5076 18.5076 20.125 16.5127 20.125H7.4873C5.49235 20.125 3.875 18.5076 3.875 16.5127V7.4873C3.875 5.49235 5.49235 3.875 7.4873 3.875H9.53809ZM18.9746 3.875C19.6099 3.87513 20.1249 4.39011 20.125 5.02539V10.3594C20.1248 10.768 19.7935 11.0995 19.3848 11.0996C18.976 11.0996 18.6447 10.7681 18.6445 10.3594V6.40234L12.1133 12.9336C11.8421 13.2048 11.4129 13.2219 11.1221 12.9844L11.0664 12.9336C10.7773 12.6444 10.7773 12.1759 11.0664 11.8867L17.5977 5.35547H13.6406C13.2319 5.35525 12.9004 5.024 12.9004 4.61523C12.9005 4.20654 13.232 3.87522 13.6406 3.875H18.9746Z"
                            fill="#15171A" stroke="#15171A" strokeWidth="0.25"/>
                    </svg>

                </a>
            </footer>
        </div>
    )
}
