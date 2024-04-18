import { IEntity } from "./Entity";

export interface IGoDefElement extends IEntity {

    Instructions?: string;
    FullInstructions?: string;
    RagRatingStyle?: number;
}