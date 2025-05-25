import React, {type FC, useEffect, useMemo, useRef, useState} from "react";
import s from './Search.module.scss'
import {useEvents} from "../../EventContext/EventContext";
import {useNavigate} from "react-router-dom";
import {formatDateParts} from "../utils";

export const Search:FC = () => {
    const [value, setValue] = useState('')
    const { events } = useEvents()
    const navigate = useNavigate()
    const filteredEvents = useMemo(() => {
        return events.filter(event => event.title.toLowerCase().includes(value.toLowerCase()) || event.description.toLowerCase().includes(value.toLowerCase()))
    }, [events, value])

    useEffect(() => {
        const tg = window.Telegram.WebApp;
        tg.BackButton.show();
        tg.BackButton.onClick(() => navigate(-1));

        return () => {
            tg.BackButton.hide();
            tg.BackButton.offClick();
        };
    }, [navigate]);

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus();
    }, []);


    return (
        <div className={s.container}>
            <div className={s.header}>
                <div className={s.block}>
                    <svg className={s.icon} width="20" height="20" viewBox="0 0 20 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M14.6455 9.22168C14.6453 6.22741 12.2175 3.7998 9.22266 3.7998C6.22785 3.79986 3.80002 6.22745 3.7998 9.22168C3.7998 12.2161 6.22771 14.6445 9.22266 14.6445C10.687 14.6445 12.0145 14.0624 12.9902 13.1191C13.0089 13.0957 13.0291 13.0725 13.0508 13.0508C13.0736 13.028 13.0974 13.0068 13.1221 12.9873C14.0644 12.0119 14.6455 10.6849 14.6455 9.22168ZM16.2451 9.22168C16.2451 10.8729 15.6737 12.3899 14.7197 13.5889L17.5654 16.4346L17.6201 16.4951C17.8766 16.8093 17.8584 17.2725 17.5654 17.5654C17.2726 17.8582 16.8093 17.8772 16.4951 17.6211L16.4346 17.5654L13.5879 14.7197C12.3891 15.6727 10.8731 16.2441 9.22266 16.2441C5.34422 16.2441 2.2002 13.0999 2.2002 9.22168C2.20042 5.34363 5.34436 2.20025 9.22266 2.2002C13.101 2.2002 16.2449 5.34359 16.2451 9.22168Z"
                            fill="#F1F4F8"/>
                    </svg>
                    <input ref={inputRef} type="text" className={s.input} value={value}
                           onChange={(event) => setValue(event.target.value)} placeholder={"Поиск мероприятий"}/>
                    {value && (
                        <div className={s.clean} onClick={() => setValue('')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M4.28229 4.30026C4.54821 4.02767 4.98223 4.02476 5.25171 4.29377L9.99333 9.02712L14.735 4.29377C15.0044 4.02476 15.4385 4.02767 15.7044 4.30026C15.9703 4.57286 15.9674 5.0119 15.698 5.28091L10.9693 10.0013L15.698 14.7218C15.9674 14.9908 15.9703 15.4298 15.7044 15.7024C15.4385 15.975 15.0044 15.9779 14.735 15.7089L9.99333 10.9756L5.25171 15.7089C4.98223 15.9779 4.54821 15.975 4.28229 15.7024C4.01636 15.4298 4.01924 14.9908 4.28871 14.7218L9.0174 10.0013L4.28871 5.28091C4.01924 5.0119 4.01636 4.57286 4.28229 4.30026Z"
                                      fill="#F1F4F8"/>
                                <path
                                    d="M14.7362 4.17301C15.0429 3.92353 15.4927 3.94486 15.7751 4.23441L15.8278 4.294C16.0584 4.5837 16.0559 4.99968 15.8215 5.28629L15.768 5.34589L11.1043 10.0004L15.768 14.6549L15.8215 14.7145C16.0555 15.001 16.0581 15.4163 15.8278 15.7058L15.7751 15.7663C15.4926 16.0558 15.0429 16.0764 14.7362 15.8268L14.6764 15.7736L9.99838 11.1046L5.32128 15.7736C5.03494 16.0592 4.58485 16.0743 4.28143 15.8205L4.22252 15.7663C3.92124 15.4574 3.92519 14.9597 4.23056 14.6549L8.89248 10.0004L4.23056 5.34589C3.92528 5.04114 3.92152 4.54337 4.22252 4.23441L4.28143 4.17933C4.58479 3.92572 5.03498 3.94086 5.32128 4.22628L9.99838 8.89522L14.6764 4.22628L14.7362 4.17301ZM15.71 4.29942C15.4441 4.02687 15.0101 4.02333 14.7406 4.29219L9.99927 9.02614L5.25702 4.29219C4.98752 4.02355 4.55349 4.02695 4.28768 4.29942C4.02212 4.57203 4.02547 5.01109 4.29482 5.27997L9.02279 10.0004L4.29482 14.7208C4.02538 14.9897 4.02184 15.4287 4.28768 15.7013C4.55354 15.9739 4.98753 15.9765 5.25702 15.7077L9.99927 10.9746L14.7406 15.7077C15.0101 15.9766 15.444 15.9738 15.71 15.7013C15.9758 15.4288 15.973 14.9898 15.7037 14.7208L10.9749 10.0004L15.7037 5.27997C15.9731 5.01102 15.9757 4.57202 15.71 4.29942Z"
                                    fill="#F1F4F8"/>
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {filteredEvents.length !== 0  ? (
                <div className={s.events}>
                    {filteredEvents.map(item => {
                        const {day, weekday} = formatDateParts(item.date)
                        return (
                            <div className={s.event} key={item.id} onClick={() => navigate('/event/' + item.id)}>
                                <span className={s.date}>{day}</span>
                                <span className={s.title}>{item.title}</span>
                                <div className={s.city_block}>
                                    {item.place.map(item => (
                                        <span className={s.city}>{item}</span>
                                    ))}

                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className={s.empty}>Ничего не найдено</div>
            )}

        </div>
    )
}