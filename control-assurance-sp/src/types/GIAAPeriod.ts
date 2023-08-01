import { IEntity } from "./Entity";

export interface IGIAAPeriod extends IEntity {
    PeriodStatus?: string;
    PeriodStartDate?: Date;
    PeriodEndDate?: Date;
}
export class GIAAPeriod implements IGIAAPeriod {
    public ID: number = null;
    public Title: string = null;
    public PeriodStatus = null;
    public PeriodStartDate = null;
    public PeriodEndDate = null;
}