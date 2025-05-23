const monthGenitive: Record<number, string> = {
    0: 'января',
    1: 'февраля',
    2: 'марта',
    3: 'апреля',
    4: 'мая',
    5: 'июня',
    6: 'июля',
    7: 'августа',
    8: 'сентября',
    9: 'октября',
    10: 'ноября',
    11: 'декабря',
};

export const formatDateParts = (dateStrings: string[]) => {
    if (dateStrings.length === 1) {
        const date = new Date(dateStrings[0]);

        const day = `${date.getDate()} ${monthGenitive[date.getMonth()]}`;
        const weekday = date.toLocaleDateString('ru-RU', {
            weekday: 'long',
        });

        return { day, weekday };
    }

    const start = new Date(dateStrings[0]);
    const end = new Date(dateStrings[1]);

    const sameMonth = start.getMonth() === end.getMonth();

    const day = sameMonth
        ? `${start.getDate()}–${end.getDate()} ${monthGenitive[start.getMonth()]}`
        : `${start.getDate()} ${monthGenitive[start.getMonth()]} – ${end.getDate()} ${monthGenitive[end.getMonth()]}`;

    return { day, weekday: null };
};
