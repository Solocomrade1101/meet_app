import React, { createContext, useContext, useEffect, useState } from "react";

const AppStateContext = createContext({ isDelayOver: false });

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDelayOver, setIsDelayOver] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsDelayOver(true), 1000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <AppStateContext.Provider value={{ isDelayOver }}>
            {children}
        </AppStateContext.Provider>
    );
};

export const useAppState = () => useContext(AppStateContext);
