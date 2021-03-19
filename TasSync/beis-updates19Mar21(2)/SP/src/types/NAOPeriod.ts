import { IEntity } from "./Entity";

export interface INAOPeriod extends IEntity {
    PeriodStatus?: string;
    PeriodStartDate?: Date;
    PeriodEndDate?: Date;
    NAOPublicationId?: number;
}
export class NAOPeriod implements INAOPeriod{
    public ID: number = null;
    public Title: string = null;
    public PeriodStatus = null;
    public PeriodStartDate = null;
    public PeriodEndDate = null;
    public NAOPublicationId = null;
  }