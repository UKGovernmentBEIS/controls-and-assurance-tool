import { IEntity } from "./Entity";

export interface ILog extends IEntity {
    Module?: string;
    Details?: string;
    UserId?: number;
    TeamId?: number;
    PeriodId?: number;
    LogDate?: Date;
}