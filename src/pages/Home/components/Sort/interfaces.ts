export type SortOrder = 'Сначала ближайшие' | 'Сначала поздние';
export type Format = 'Онлайн' | 'Оффлайн';

export interface Filters {
    sortOrder: SortOrder;
    format: Format[];
    cities: string[];
}

export interface ISortProps {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}