import { IEntity } from "./Entity";

export interface IDirectorate extends IEntity {
    DirectorateGroupID?: number;
    DirectorUserID?: number;
    EntityStatusID?: number;
}