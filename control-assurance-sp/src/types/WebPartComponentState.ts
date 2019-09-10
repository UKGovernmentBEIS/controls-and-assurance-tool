import { IUserPermission/*, UserPermissions*/ } from "./UserPermissions";
import { IDirectorate } from "./Directorate";
import { IDirectorateMember } from "./DirectorateMember";
import { IDirectorateGroup } from "./DirectorateGroup";
import { IDirectorateGroupMember } from "./DirectorateGroupMember";
import { ITeam } from "./Team";
import { ITeamMember } from "./TeamMember";

export interface IWebPartComponentState {
	Error: string;
	Loading: boolean;
}

export interface IUserContextWebPartState extends IWebPartComponentState {
	 UserPermissions: IUserPermission[];
	 DirectorateGroups: IDirectorateGroup[];
	 DirectorateGroupMembers: IDirectorateGroupMember[];
	 Directorates: IDirectorate[];
	 DirectorateMembers: IDirectorateMember[];
	 Teams: ITeam[];
	 TeamMembers: ITeamMember[];
	// DirectorOf: IDirectorate[];
	// ApproverOfDirectorates: IDirectorate[];
	// SROOf: IProject[];
	// ApproverOfProjects: IProject[];
	// RiskOwnerOf: IRisk[];
}

export class WebPartComponentState implements IWebPartComponentState {
	public Error = null;
	public Loading = false;
}

export class UserContextWebPartState extends WebPartComponentState implements IUserContextWebPartState {
	 public UserPermissions = [];
	 public DirectorateGroups = [];
	 public DirectorateGroupMembers = [];
	 public Directorates = [];
	 public DirectorateMembers = [];
	 public Teams = [];
	 public TeamMembers = [];
	// public DirectorOf = [];
	// public ApproverOfDirectorates = [];
	// public SROOf = [];
	// public ApproverOfProjects = [];
	// public RiskOwnerOf = [];
}