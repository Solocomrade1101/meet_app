export type FormatType = 'Онлайн' | 'Оффлайн'
export type SortOrderType = 'Сначала ближайшие' | 'Сначала поздние'

export interface Filters {
    sortOrder: SortOrderType;
    format: FormatType[];
    cities: string[];
}