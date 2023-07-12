import { IEntity } from "./Entity";

export interface IPlatform extends IEntity {
    Module?: string;
    Link?: string;
}