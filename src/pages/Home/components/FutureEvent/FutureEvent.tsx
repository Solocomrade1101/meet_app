import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import type {IEventCardProps} from "./interfaces.ts";
import {formatDateParts} from "../../../utils";
import s from './FutureEvent.module.scss'
import cn from "classnames";
import like from '../../../../image/like.svg'
import likeActive from '../../../../image/like_active.svg'

export const FutureEvent: React.FC<IEventCardProps> = ({ event, isFavorite, onToggleFavorite }) => {
    const navigate = useNavigate();

    const handleClickFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite();
    };

    const [imageLoaded, setImageLoaded] = useState(false);


    const { day, weekday } = formatDateParts(event.date);

    return (
        <div className={s.event} onClick={() => navigate(`/event/${event.id}`)}>

            {!imageLoaded && <div className={s.image_skeleton}/>}

            <img
                src={event.image}
                alt={event.title}
                className={cn(s.image, {[s.hidden]: !imageLoaded})}
                onLoad={() => setImageLoaded(true)}
            />
            <div className={s.data}>
                <span className={s.day}>{day}</span>
                {weekday && <span className={s.weekday}>{`, ${weekday}`}</span>}
            </div>
            <div className={s.info}>
                <span className={s.title}>{event.title}</span>
                <button className={cn(s.like)} onClick={handleClickFavorite}>
                    <img
                        src={isFavorite ? likeActive : like}
                        alt="Добавить в избранное"
                        className={s.like_icon}
                    />
                </button>
            </div>
            <div className={s.city_block}>
                {event.place.map(item => (
                    <span key={item} className={s.city}>{item}</span>
                ))}
            </div>
        </div>
    );
};