import { type FC } from "react";
import s from './Sort.module.scss';
import cn from 'classnames';
import { SortOpen } from "./components";
import type { Format, ISortProps, SortOrder } from "./interfaces";
import {useNavigate} from "react-router-dom";

type FilterType = 'sortOrder' | 'format' | 'cities';

export const Sort: FC<ISortProps> = ({ filters, setFilters, activeFilter, setActiveFilter }) => {
    const navigate = useNavigate()

    const handleOpen = (type: FilterType) => {
        setActiveFilter(type);
    };

    const handleClose = () => {
        setActiveFilter(null);
    };

    const handleSelect = (value: string | string[]) => {
        setFilters(prev => {
            if (activeFilter === 'sortOrder') {
                return {
                    ...prev,
                    sortOrder: value as SortOrder,
                };
            }

            if (activeFilter === 'format') {
                // Для чекбоксов value будет массивом
                const values = Array.isArray(value) ? value : [value];
                return {
                    ...prev,
                    format: values as Format[],
                };
            }

            if (activeFilter === 'cities') {
                // Для чекбоксов value будет массивом
                const values = Array.isArray(value) ? value : [value];
                return {
                    ...prev,
                    cities: values,
                };
            }

            return prev;
        });
    };

    const filterData = {
        sortOrder: {
            title: 'Сортировка',
            options: ['Сначала ближайшие', 'Сначала поздние'],
            mod: 'radio' as const,
        },
        format: {
            title: 'Формат',
            options: ['Онлайн', 'Оффлайн'],
            mod: 'checkbox' as const,
        },
        cities: {
            title: 'Город',
            options: ['Москва', 'Санкт-Петербург','Нижний Новгород', 'Екатеринбург','Казань', 'Волгоград','Ростов-на-Дону', 'Сочи','Чебоксары', 'Саратов','Ульяновск', 'Тюмень',],
            mod: 'checkbox' as const,
        },
    };

    return (
        <div className={s.container}>
            {activeFilter && (
                <SortOpen
                    title={filterData[activeFilter].title}
                    data={filterData[activeFilter].options}
                    mod={filterData[activeFilter].mod}
                    onClose={handleClose}
                    onSelect={handleSelect}
                    selected={
                        activeFilter === 'sortOrder'
                            ? filters.sortOrder
                            : activeFilter === 'format'
                                ? filters.format
                                : filters.cities
                    }
                />
            )}

            <div className={s.buttons_block}>
                <button className={cn(s.button, s.only_icon)} onClick={() => navigate(`/search`)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17 17L13.6164 13.6167M15.4455 9.22209C15.4455 12.6585 12.6595 15.4442 9.22276 15.4442C5.78603 15.4442 3 12.6585 3 9.22209C3 5.78572 5.78603 3 9.22276 3C12.6595 3 15.4455 5.78572 15.4455 9.22209Z"
                            stroke="#F1F4F8" strokeWidth="1.6" strokeLinecap="round"
                            strokeLinejoin="round" />
                    </svg>
                </button>

                <button onClick={() => handleOpen("sortOrder")} className={s.button}>
                    <span className={s.text}>{filters.sortOrder.includes("ближайшие") ? "Ближайшие" : "Поздние"}</span>
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 8L8 12L12 8" stroke="#F1F4F8" strokeWidth="1.6"
                              strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <button onClick={() => handleOpen("format")} className={cn(s.button, {
                    [s.active]: filters.format.length > 0,
                })}>
                    <span className={s.text}>Формат</span>
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 8L8 12L12 8" stroke="#F1F4F8" strokeWidth="1.6"
                              strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <button onClick={() => handleOpen("cities")} className={cn(s.button, {
                    [s.active]: filters.cities.length > 0,
                })}>
                    <span className={s.text}>Город</span>
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 8L8 12L12 8" stroke="#F1F4F8" strokeWidth="1.6"
                              strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
