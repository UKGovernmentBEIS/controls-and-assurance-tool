import { IUserPermission } from "./UserPermissions";
import { IDirectorate } from "./Directorate";
import { IDirectorateMember } from "./DirectorateMember";
import { IDirectorateGroup } from "./DirectorateGroup";
import { IDirectorateGroupMember } from "./DirectorateGroupMember";
import { ITeam } from "./Team";
import { ITeamMember } from "./TeamMember";
import { IUser } from "./User";

export interface IWebPartComponentState {
	Error: string;
	FirstAPICallError: string;
	Loading: boolean;
}

export interface IUserContextWebPartState extends IWebPartComponentState {
	User: IUser;
	UserPermissions: IUserPermission[];
	DirectorateGroups: IDirectorateGroup[];
	DirectorateGroupMembers: IDirectorateGroupMember[];
	Directorates: IDirectorate[];
	DirectorateMembers: IDirectorateMember[];
	Teams: ITeam[];
	TeamMembers: ITeamMember[];
}

export class WebPartComponentState implements IWebPartComponentState {
	public Error = null;
	public FirstAPICallError = null;
	public Loading = false;
}

export class UserContextWebPartState extends WebPartComponentState implements IUserContextWebPartState {
	public User: IUser = null;
	public UserPermissions = [];
	public DirectorateGroups = [];
	public DirectorateGroupMembers = [];
	public Directorates = [];
	public DirectorateMembers = [];
	public Teams = [];
	public TeamMembers = [];
}