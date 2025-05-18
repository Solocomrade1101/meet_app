import {type FC, useState} from "react";
import s from './Sort.module.scss'
import cn from 'classnames';
import {DEFAULT_STATE} from "./constants";
import {SortOpen} from "./components";

export const Sort:FC = () => {
    const [filters, setFilters] = useState(DEFAULT_STATE);

    const handleToggle = (type: string) => {
        setFilters(prev =>
            prev.map(f =>
                f.type === type ? { ...f, isOpen: true } : { ...f, isOpen: false }
            )
        );
    };

    const handleClose = () => {
        setFilters(prev => prev.map(f => ({ ...f, isOpen: false })));
    };

    const activeFilter = filters.find(f => f.isOpen);
    return (
        <div className={s.container}>
            {activeFilter && (
                <SortOpen
                    title={activeFilter.title}
                    data={activeFilter.data}
                    mod={activeFilter.mod}
                    onClose={handleClose}
                />
            )}
            <div className={s.buttons_block}>
                <button className={cn(s.button, s.only_icon)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17 17L13.6164 13.6167M15.4455 9.22209C15.4455 12.6585 12.6595 15.4442 9.22276 15.4442C5.78603 15.4442 3 12.6585 3 9.22209C3 5.78572 5.78603 3 9.22276 3C12.6595 3 15.4455 5.78572 15.4455 9.22209Z"
                            stroke="#F1F4F8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <button onClick={() => handleToggle("data")} className={s.button}>
                    <span className={s.text}>Ближайшие</span>
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 8L8 12L12 8" stroke="#F1F4F8" strokeWidth="1.6" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                </button>
                <button onClick={() => handleToggle("format")} className={s.button}>
                    <span className={s.text}>Формат</span>
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 8L8 12L12 8" stroke="#F1F4F8" strokeWidth="1.6" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                </button>
                <button onClick={() => handleToggle("city")} className={s.button}>
                    <span className={s.text}>Город</span>
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 8L8 12L12 8" stroke="#F1F4F8" strokeWidth="1.6" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}