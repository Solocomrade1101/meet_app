import {useState} from "react";
import type {FilterType} from "../../Interfaces.ts";

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
    activeFilter: FilterType | null
    setActiveFilter: React.Dispatch<React.SetStateAction<FilterType | null>>;
}