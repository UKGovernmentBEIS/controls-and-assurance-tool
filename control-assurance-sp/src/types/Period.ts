import { IEntity } from "./Entity";

export interface IPeriod extends IEntity {
    PeriodStatus?: string;
    PeriodStartDate?: Date;
    PeriodEndDate?: Date;
}
export class Period implements IPeriod{
    public ID: number = null;
    public Title: string = null;
    public PeriodStatus = null;
    public PeriodStartDate = null;
    public PeriodEndDate = null;
  }