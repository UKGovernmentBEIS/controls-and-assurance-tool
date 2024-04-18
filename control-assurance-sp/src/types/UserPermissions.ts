import { IEntity } from ".";

export interface IUserPermission extends IEntity {
    UserId: number;
    PermissionTypeId: number;
}