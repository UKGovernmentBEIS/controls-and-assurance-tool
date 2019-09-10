import { IEntity } from "./Entity";

export interface IUserPermission extends IEntity {
    UserId: number;
    PermissionTypeId: number;
}