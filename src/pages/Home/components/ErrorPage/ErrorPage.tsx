import type {FC} from "react";
import s from './ErrorPage.module.scss'
import errorImage from './errorImage.png'

export const ErrorPage:FC = () => {
    return (
        <div className={s.container}>
            <img src={errorImage} alt="error"/>
            <span className={s.text}>Что-то пошло не так — попробуйте обновить страницу</span>
            <button onClick={() => window.location.reload()} className={s.button}>Обновить</button>
        </div>
    )
}