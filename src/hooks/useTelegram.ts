export function useTelegram() {
    const tg = window.Telegram.WebApp
    const initDataUnsafe = tg?.initDataUnsafe
    const user = initDataUnsafe?.user

    const close = () => tg.close()

    return {
        tg,
        user,
        close
    }
}
