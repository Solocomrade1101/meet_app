import type {IEvent} from "../../../../types";

export interface IEventCardProps {
    event: IEvent;
    isFavorite: boolean
    onToggleFavorite: () => void;
}