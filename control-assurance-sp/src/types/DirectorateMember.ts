import { IEntity } from "./Entity";

export interface IDirectorateMember extends IEntity {
    UserID?: number;
    DirectorateID?: number;
    IsAdmin: boolean;
    CanSignOff: boolean;
}