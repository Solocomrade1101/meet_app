import { FC, useState } from "react";
import s from './SortOpen.module.scss';
import type { ISortOpenProps } from "./interfaces.ts";

export const SortOpen: FC<ISortOpenProps> = ({ title, mod, data, onClose }) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [selectedRadio, setSelectedRadio] = useState<string>("");

    const handleCheckboxChange = (value: string) => {
        setSelected(prev =>
            prev.includes(value)
                ? prev.filter(item => item !== value)
                : [...prev, value]
        );
    };

    const handleRadioChange = (value: string) => {
        setSelectedRadio(value);
    };

    return (
        <div className={s.overlay}>
            <div className={s.container}>
                <div className={s.content}>
                    <div className={s.header}>
                        <span className={s.text}>{title}</span>
                        <button className={s.close} onClick={onClose}>✕</button>
                    </div>
                    <div className={s.items_block}>
                        {data.map(item => {
                            const isChecked =
                                mod === "radio"
                                    ? selectedRadio === item
                                    : selected.includes(item);

                            return (
                                <label key={item} className={s.checkbox_block}>
                                    {mod === 'radio' ? (
                                        <div className={s.customRadio}>
                                            <input
                                                type="radio"
                                                name="radio"
                                                checked={isChecked}
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
                    <button className={s.submit} onClick={() => {
                        console.log("Выбрано:");
                        console.log(mod === 'radio' ? selectedRadio : selected);
                        onClose()
                    }}>
                        Применить
                    </button>
                </div>
            </div>
        </div>
    );
};
