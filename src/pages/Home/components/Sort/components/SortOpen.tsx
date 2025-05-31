import { FC, useEffect, useState } from "react";
import s from './SortOpen.module.scss';
import type { SortOpenProps } from "./interfaces";

export const SortOpen: FC<SortOpenProps> = ({
                                                title,
                                                mod,
                                                data,
                                                onClose,
                                                selected,
                                                onSelect,
                                            }) => {
    const [localSelected, setLocalSelected] = useState<string[]>([]);
    const [localRadio, setLocalRadio] = useState<string>("");

    useEffect(() => {
        if (mod === 'radio' && typeof selected === 'string') {
            setLocalRadio(selected);
        } else if (mod === 'checkbox' && Array.isArray(selected)) {
            setLocalSelected(selected);
        }
    }, [selected, mod]);

    const handleCheckboxChange = (value: string) => {
        setLocalSelected(prev =>
            prev.includes(value)
                ? prev.filter(item => item !== value)
                : [...prev, value]
        );
    };

    const handleRadioChange = (value: string) => {
        setLocalRadio(value);
    };

    const handleApply = () => {
        if (mod === 'radio') {
            onSelect(localRadio);
        } else {
            onSelect(localSelected);
        }
        onClose();
    };

    const handleReset = () => {
        if (mod === 'radio') {
            onSelect("Сначала ближайшие");
        } else {
            onSelect([]);
        }
        onClose();
    };

    return (
        <div className={s.overlay} onClick={(event) => {
            if (event.target === event.currentTarget) {
                onClose();
            }
        }}
        >
            <div className={s.container}>
                <div className={s.content}>
                    <div className={s.header}>
                        <span className={s.text}>{title}</span>
                        <button className={s.close} onClick={onClose}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M3.74644 3.69976C4.03739 3.40493 4.51225 3.40178 4.80708 3.69273L9.99487 8.81221L15.1827 3.69273C15.4775 3.40178 15.9524 3.40493 16.2433 3.69976C16.5342 3.99459 16.5311 4.46945 16.2363 4.7604L11.0626 9.86591L16.2363 14.9714C16.5311 15.2624 16.5342 15.7372 16.2433 16.0321C15.9524 16.3269 15.4775 16.33 15.1827 16.0391L9.99487 10.9196L4.80708 16.0391C4.51225 16.33 4.03739 16.3269 3.74644 16.0321C3.45549 15.7372 3.45864 15.2624 3.75347 14.9714L8.92711 9.86591L3.75347 4.7604C3.45864 4.46945 3.45549 3.99459 3.74644 3.69976Z"
                                      fill="#78818F"/>
                                <path
                                    d="M15.184 3.56212C15.5196 3.2923 16.0117 3.31537 16.3207 3.62853L16.3783 3.69298C16.6306 4.00631 16.6279 4.45623 16.3715 4.76622L16.3129 4.83068L11.2103 9.86486L16.3129 14.899L16.3715 14.9635C16.6275 15.2734 16.6303 15.7226 16.3783 16.0358L16.3207 16.1012C16.0116 16.4143 15.5196 16.4366 15.184 16.1666L15.1186 16.109L10.0004 11.0592L4.8832 16.109C4.56991 16.4179 4.07747 16.4343 3.74551 16.1598L3.68105 16.1012C3.35142 15.767 3.35574 15.2287 3.68984 14.899L8.79043 9.86486L3.68984 4.83068C3.35584 4.50107 3.35173 3.9627 3.68105 3.62853L3.74551 3.56896C4.0774 3.29467 4.56996 3.31104 4.8832 3.61974L10.0004 8.66954L15.1186 3.61974L15.184 3.56212ZM16.2494 3.69884C15.9585 3.40406 15.4837 3.40023 15.1889 3.69103L10.0014 8.81114L4.81289 3.69103C4.51803 3.40047 4.04316 3.40414 3.75234 3.69884C3.46179 3.9937 3.46546 4.46857 3.76015 4.75939L8.93301 9.86486L3.76015 14.9703C3.46536 15.2612 3.46149 15.736 3.75234 16.0309C4.04322 16.3256 4.51805 16.3284 4.81289 16.0377L10.0014 10.9186L15.1889 16.0377C15.4836 16.3286 15.9585 16.3256 16.2494 16.0309C16.5403 15.7361 16.5372 15.2613 16.2426 14.9703L11.0687 9.86486L16.2426 4.75939C16.5374 4.46849 16.5402 3.99368 16.2494 3.69884Z"
                                    fill="#78818F"/>
                            </svg>
                        </button>
                    </div>

                    <div className={s.items_block}>
                        {data.map(item => {
                            const isChecked =
                                mod === 'radio'
                                    ? localRadio === item
                                    : localSelected.includes(item);

                            return (
                                <label key={item} className={s.checkbox_block}>
                                    {mod === 'radio' ? (
                                        <div className={s.customRadio}>
                                            <input
                                                type="radio"
                                                name={`radio-group-${title}`}
                                                checked={isChecked}
                                                onTouchStart={() => handleRadioChange(item)}
                                                onChange={() => handleRadioChange(item)}
                                            />
                                            <span className={s.radioMark}></span>
                                        </div>
                                    ) : (
                                        <div className={s.customCheckbox}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleCheckboxChange(item)}
                                            />
                                            <span className={s.checkboxMark}>
                                                <svg
                                                    className="checkIcon"
                                                    width="12"
                                                    height="8"
                                                    viewBox="0 0 12 8"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{ display: isChecked ? 'block' : 'none' }}
                                                >
                                                    <path
                                                        d="M9.51309 0.32431C9.88627 -0.082794 10.5191 -0.110363 10.9262 0.262787C11.3333 0.635966 11.3608 1.26875 10.9877 1.67587L5.4877 7.67587C5.1269 8.06947 4.51995 8.11047 4.10977 7.76865L1.10977 5.26865L1.03457 5.19931C0.679962 4.83715 0.650368 4.25723 0.981839 3.85947C1.31332 3.46179 1.88886 3.38655 2.30899 3.67001L2.39102 3.73154L4.65762 5.62021L9.51309 0.32431Z"
                                                        fill="#15171A"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    )}
                                    <span className={s.item_title}>{item}</span>
                                </label>
                            );
                        })}
                    </div>

                    <div className={s.buttons_block}>
                        {mod !== 'radio' && localSelected.length > 0 && (
                            <button className={s.reset} onClick={handleReset}>Сбросить</button>
                        )}

                        <button className={s.submit} onClick={handleApply}>
                            Применить
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
