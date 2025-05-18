export const formatDateParts = (dateString: string) => {
    const date = new Date(dateString)

    const day = date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
    })

    const weekday = date.toLocaleDateString('ru-RU', {
        weekday: 'long',
    })

    return { day, weekday }
}