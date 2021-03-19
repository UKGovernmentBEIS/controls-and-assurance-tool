import { IEntity } from "./Entity";

export interface ITeam extends IEntity {
    DirectorateId?: number;
    DeputyDirectorUserId?: number;
    EntityStatusId?: number;
}