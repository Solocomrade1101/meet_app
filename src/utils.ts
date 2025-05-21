interface StorageInterface {
    setBrowserFavorite(eventId: string): void;
    removeBrowserFavorite(eventId: string): void;
    getBrowserFavorites(): string[];

    setTgFavorite(eventId: string): Promise<void>;
    removeTgFavorite(eventId: string): Promise<void>;
    getTgFavorites(): Promise<string[]>;

    toggleFavorite(eventId: string): Promise<void>;
    getFavorites(): Promise<string[]>;
    addFavorite(eventId: string): Promise<void>;
    removeFavorite(eventId: string): Promise<void>;
}

function isTgCloudStorageAvailable(): boolean {
    try {
        const platform = window.Telegram?.WebApp?.platform;
        return (
            typeof window.Telegram?.WebApp?.CloudStorage?.getItem === 'function' &&
            platform !== 'unknown'
        );
    } catch {
        return false;
    }
}

export const storage: StorageInterface = {
    setBrowserFavorite: (eventId: string) => {
        const favorites = storage.getBrowserFavorites();
        if (!favorites.includes(eventId)) {
            localStorage.setItem('favorites', JSON.stringify([...favorites, eventId]));
        }
    },

    removeBrowserFavorite: (eventId: string) => {
        const favorites = storage.getBrowserFavorites();
        localStorage.setItem(
            'favorites',
            JSON.stringify(favorites.filter(id => id !== eventId))
        );
    },

    getBrowserFavorites: (): string[] => {
        try {
            const data = localStorage.getItem('favorites');
            return data ? JSON.parse(data) : [];
        } catch (err) {
            console.warn('getBrowserFavorites error:', err);
            return [];
        }
    },

    setTgFavorite: async (eventId: string) => {
        const favorites = await storage.getTgFavorites();
        if (!favorites.includes(eventId)) {
            await window.Telegram?.WebApp?.CloudStorage?.setItem?.(
                'favorites',
                JSON.stringify([...favorites, eventId])
            );
        }
    },

    removeTgFavorite: async (eventId: string) => {
        const favorites = await storage.getTgFavorites();
        await window.Telegram?.WebApp?.CloudStorage?.setItem?.(
            'favorites',
            JSON.stringify(favorites.filter(id => id !== eventId))
        );
    },

    getTgFavorites: async (): Promise<string[]> => {
        try {
            const data = await window.Telegram?.WebApp?.CloudStorage?.getItem?.('favorites');
            return data ? JSON.parse(data) : [];
        } catch (err) {
            console.warn('getTgFavorites error:', err);
            return [];
        }
    },

    toggleFavorite: async (eventId: string) => {
        const favorites = await storage.getFavorites();
        if (favorites.includes(eventId)) {
            await storage.removeFavorite(eventId);
        } else {
            await storage.addFavorite(eventId);
        }
    },

    getFavorites: async (): Promise<string[]> => {
        if (isTgCloudStorageAvailable()) {
            return await storage.getTgFavorites();
        }
        return storage.getBrowserFavorites();
    },

    addFavorite: async (eventId: string) => {
        const favorites = await storage.getFavorites();
        if (favorites.includes(eventId)) return;

        if (isTgCloudStorageAvailable()) {
            await storage.setTgFavorite(eventId);
        } else {
            storage.setBrowserFavorite(eventId);
        }
    },

    removeFavorite: async (eventId: string) => {
        if (isTgCloudStorageAvailable()) {
            await storage.removeTgFavorite(eventId);
        } else {
            storage.removeBrowserFavorite(eventId);
        }
    }
};
