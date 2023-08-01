import { IEntity } from "./Entity";

export interface IGIAARecommendation extends IEntity {
    RecommendationDetails?: string;
    TargetDate?: Date;
    RevisedDate?: Date;
    GIAAActionPriorityId?: number;
    GIAAActionStatusTypeId?: number;
    GIAAAuditReportId?: number;
    DisplayedImportedActionOwners?: string;
    UpdateStatus?: string;
}

export class GIAARecommendation implements IGIAARecommendation {
    public ID: number = 0;
    public Title: string = null;
    public RecommendationDetails?: string = null;
    public TargetDate = null;
    public RevisedDate = null;
    public GIAAActionPriorityId = null;
    public GIAAActionStatusTypeId = null;
    public GIAAAuditReportId = null;
    public DisplayedImportedActionOwners = null;
    public UpdateStatus?: string = 'Blank';

}