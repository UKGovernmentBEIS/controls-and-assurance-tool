import { IEntity } from "./Entity";

export interface IDirectorateGroupMember extends IEntity {
    UserID?: number;
    DirectorateGroupID?: number;
    IsAdmin: boolean;
    ViewOnly?: boolean;
}