import { IEntity, Entity } from "./Entity";
import { IUserPermission } from "./UserPermission";
import { IDirectorate } from "./Directorate";
import { IDirectorateMember } from "./DirectorateMember";
import { IDirectorateGroup } from "./DirectorateGroup";
import { IDirectorateGroupMember } from "./DirectorateGroupMember";
import { ITeam } from "./Team";
import { ITeamMember } from "./TeamMember";
//import { IUserRole } from "./UserRole";
//import { IUserGroup } from "./UserGroup";
//import { IUserDirectorate } from "./UserDirectorate";
//import { IUserProject } from "./UserProject";
//import { IDirectorate } from "./Directorate";
//import { IProject } from "./Project";
//import { IRisk } from "./Risk";

export interface IUser extends IEntity {
    Username: string;
    UserPermissions?: IUserPermission[];
    DirectorateGroups?: IDirectorateGroup[];
    DirectorateGroupMembers?: IDirectorateGroupMember[];
    Directorates?: IDirectorate[];
    DirectorateMembers?: IDirectorateMember[];
    Teams?: ITeam[];
    TeamMembers?: ITeamMember[];
    //UserRoles?: IUserRole[];
    //UserGroups?: IUserGroup[];
    //UserDirectorates?: IUserDirectorate[];
    //UserProjects?: IUserProject[];
    //Directorates?: IDirectorate[];
    //SeniorResponsibleOwnerProjects?: IProject[];
    //Risks?: IRisk[];
    //DirectoratesReportApprover?: IDirectorate[];
    //ProjectsReportApprover?: IProject[];
}

export class User extends Entity implements IUser {
    public Username = null;
}