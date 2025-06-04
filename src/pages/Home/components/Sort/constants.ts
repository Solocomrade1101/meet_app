export const DEFAULT_STATE = [
    {
        type: "data",
        title: "Сортировать",
        isOpen: false,
        mod: "radio",
        data: ['Сначала ближайшие', 'Сначала поздние']
    },
    {
        type: "format",
        title: "Формат",
        isOpen: false,
        mod: "checkbox",
        data: ['Онлайн', 'Оффлайн']
    },
    {
        type: "city",
        title: "Город",
        isOpen: false,
        mod: "checkbox",
        data: ['Москва', 'Санкт-Петербург','Нижний Новгород', 'Екатеринбург','Казань', 'Волгоград','Ростов-на-Дону', 'Сочи','Чебоксары', 'Саратов','Ульяновск', 'Тюмень',]
    },
]