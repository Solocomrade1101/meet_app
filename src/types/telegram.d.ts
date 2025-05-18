export {}

declare namespace Telegram {
    interface WebApp {
        shareTelegram?: (params: { message: string }) => void;
    }
}

declare global {
    interface Window {
        Telegram: {
            WebApp: TelegramWebApp
        }
    }

    interface TelegramWebAppUser {
        id: number
        first_name: string
        last_name?: string
        username?: string
        language_code?: string
        is_premium?: boolean
        photo_url?: string
    }

    interface TelegramWebAppInitData {
        user?: TelegramWebAppUser
        [key: string]: any
    }

    interface TelegramWebAppThemeParams {
        backgroundColor?: string
        textColor?: string
        hintColor?: string
        linkColor?: string
        buttonColor?: string
        buttonTextColor?: string
        secondaryBackgroundColor?: string
    }

    interface TelegramWebAppBackButton {
        show(): void
        hide(): void
        onClick(callback: () => void): void
        offClick(callback?: () => void): void
    }

    interface TelegramWebAppMainButton {
        text: string
        color: string
        textColor: string
        isVisible: boolean
        isProgressVisible: boolean
        isActive: boolean
        setText(text: string): void
        onClick(callback: () => void): void
        offClick(callback?: () => void): void
        show(): void
        hide(): void
        showProgress(leaveActive?: boolean): void
        hideProgress(): void
        enable(): void
        disable(): void
    }

    interface TelegramWebApp {
        initData: string
        initDataUnsafe: TelegramWebAppInitData
        version: string
        platform: string
        colorScheme: 'light' | 'dark'
        isExpanded: boolean
        themeParams: TelegramWebAppThemeParams

        close(): void
        expand(): void
        ready(): void

        BackButton: TelegramWebAppBackButton
        MainButton: TelegramWebAppMainButton
    }

    interface TelegramWebAppWithShare extends TelegramWebApp {
        shareTelegram?: (options: { message: string }) => void
    }
}
