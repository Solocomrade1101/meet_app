import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import type { IEvent } from '../types';
import { supabase } from '../api/supabaseClient';

interface EventsContextType {
    events: IEvent[];
    loading: boolean;
    error: string | null;
}

const EventsContext = createContext<EventsContextType>({
    events: [],
    loading: true,
    error: null,
});

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const hasLoadedOnce = useRef(false);

    useEffect(() => {
        if (hasLoadedOnce.current) {
            setLoading(false);
            return;
        }

        const fetchEvents = async () => {
            const { data, error } = await supabase.from('events').select('*');

            if (error) {
                setError(error.message);
            } else {
                setEvents(data || []);
                hasLoadedOnce.current = true;
            }

            setLoading(false);
        };

        fetchEvents();
    }, []);

    return (
        <EventsContext.Provider value={{ events, loading, error }}>
            {children}
        </EventsContext.Provider>
    );
};

export const useEvents = () => useContext(EventsContext);
