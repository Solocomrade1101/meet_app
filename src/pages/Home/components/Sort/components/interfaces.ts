export interface SortOpenProps {
    title: string;
    data: string[];
    mod: 'radio' | 'checkbox';
    onClose: () => void;
    onSelect: (value: string | string[]) => void;
    selected: string | string[];
}
