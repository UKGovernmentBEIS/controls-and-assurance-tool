import { IEntity, Entity } from "./Entity";
import { IUserPermission } from "./UserPermission";
import { IDirectorate } from "./Directorate";
import { IDirectorateMember } from "./DirectorateMember";
import { IDirectorateGroup } from "./DirectorateGroup";
import { IDirectorateGroupMember } from "./DirectorateGroupMember";
import { ITeam } from "./Team";
import { ITeamMember } from "./TeamMember";

export interface IUser extends IEntity {
    Username: string;
    UserPermissions?: IUserPermission[];
    DirectorateGroups?: IDirectorateGroup[];
    DirectorateGroupMembers?: IDirectorateGroupMember[];
    Directorates?: IDirectorate[];
    DirectorateMembers?: IDirectorateMember[];
    Teams?: ITeam[];
    TeamMembers?: ITeamMember[];
}

export class User extends Entity implements IUser {
    public Username = null;
}