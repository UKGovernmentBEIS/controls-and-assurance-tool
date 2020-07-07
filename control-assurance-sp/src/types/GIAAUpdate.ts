import { IEntity } from "./Entity";


export interface IGIAAUpdate  extends IEntity {

    TargetDate?: Date;
    ProgressUpdateDetails?: string;
    GIAAComments?: string;
    Link?: string;
    GIAARecommendationId?: number;
    GIAAPeriodId?: number;
    GIAAActionStatusTypeId?: number;
    GIAAActionPriorityId?: number;
    GIAAUpdateStatusId?: number;
    UpdateChangeLog?: string;

}

export class GIAAUpdate implements IGIAAUpdate{ 
    public ID: number = 0;
    public Title: string = null;    
    public TargetDate = null;
    public ProgressUpdateDetails = null;
    public GIAAComments = null;
    public Link = null;
    public GIAARecommendationId = null;
    public GIAAPeriodId = null;
    public GIAAActionStatusTypeId = null;
    public GIAAActionPriorityId = 1;
    public GIAAUpdateStatusId = null;
    public UpdateChangeLog = null;

    constructor(giaaPeriodId: number, giaaRecommendationId: number) {
        this.GIAAPeriodId = giaaPeriodId;
        this.GIAARecommendationId = giaaRecommendationId;
    }


}