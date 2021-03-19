import { IEntity } from "./Entity";

export interface ITeamMember extends IEntity {
    UserId?: number;
    TeamId?: number;
    IsAdmin: boolean;
    CanSignOff: boolean;
}