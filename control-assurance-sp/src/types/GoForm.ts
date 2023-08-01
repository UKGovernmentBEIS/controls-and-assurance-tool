import { IEntity } from "./Entity";
import { User } from "./User";

export interface IGoForm  extends IEntity {
    PeriodId?: number;
    DirectorateGroupId?: number;
    SummaryRagRating?: string;
    SummaryEvidenceStatement?: string;
    SummaryCompletionStatus?: string;
    SummaryMarkReadyForApproval?: boolean;
    SpecificAreasCompletionStatus?: string;
    DGSignOffStatus?: string;
    DGSignOffUserId?: number;
    DGSignOffDate?: Date;
}

export class GoForm implements IGoForm{ 
    public ID: number = 0;
    public Title: string = null;
    public PeriodId?: number = null;
    public DirectorateGroupId?: number = null;
    public SummaryRagRating?: string = null;
    public SummaryEvidenceStatement?: string = null;
    public SummaryCompletionStatus?: string = null;
    public SummaryMarkReadyForApproval?: boolean = null;
    public SpecificAreasCompletionStatus?: string = null;
    public DGSignOffStatus?: string = null;
    public DGSignOffUserId?: number = null;
    public DGSignOffDate?: Date = null;

    constructor(periodId: number, directorateGroupId: number) {
        this.PeriodId = periodId;
        this.DirectorateGroupId = directorateGroupId;
    }
}

export enum SectionStatus {
    InProgress = "InProgress",
    Completed = "Completed",    
}