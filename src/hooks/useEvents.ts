import { useEffect, useState } from 'react'
import { supabase } from '../api/supabaseClient'
import type {IEvent} from "../types/events.ts";

export function useEvents() {
    const [events, setEvents] = useState<IEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase.from('events').select('*')

            if (error) {
                setError(error.message)
            } else {
                setEvents(data || [])
            }

            setLoading(false)
        }

        fetchEvents()
    }, [])

    return { events, loading, error }
}
