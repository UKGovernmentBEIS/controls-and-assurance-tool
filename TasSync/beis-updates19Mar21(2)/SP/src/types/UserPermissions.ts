import { IEntity } from ".";

//import { IUserDirectorate } from "./UserDirectorate";
//import { IUserProject } from "./UserProject";
//import { IUserGroup } from "./UserGroup";
//import { IUserRole } from "./UserRole";

export interface IUserPermission extends IEntity {
    UserId: number;
    PermissionTypeId: number;
    //PermissionsTimestamp: number; // Timestamp for when permissions were loaded from server
    //UserRoles: IUserRole[];
    //UserGroups: IUserGroup[];
    //UserDirectorates: IUserDirectorate[];
    //UserProjects: IUserProject[];
}

// export class UserPermissions implements IUserPermissions {
//     //public PermissionsTimestamp = 0;
//     //public UserRoles = [];
//     //public UserGroups = [];
//     //public UserDirectorates = [];
//     //public UserProjects = [];
// }