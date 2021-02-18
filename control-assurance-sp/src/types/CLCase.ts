import { IEntity } from "./Entity";


export interface ICLCase  extends IEntity {

    CaseType?: string;
    CreatedById?: number;
    CreatedOn?: Date;
    ApplHMUserId?: number;
    ReqCostCentre?: string;
    ReqDirectorateId?: number;
    ReqVacancyTitle?: string;
    ReqGradeId?: number;
    ReqWorkPurpose?: string;
    ReqProfessionalCatId?: number;
    ReqEstStartDate?: Date;
    ReqEstEndDate?: Date;
    ReqWorkLocationId?: number;
    ReqNumPositions?: number;
    ComFrameworkId?: number;
    ComJustification?: string;
    ComPSRAccountId?: string;
    JustAltOptions?: string;
    JustSuccessionPlanning?: string;
    FinMaxRate?: number;
    FinEstCost?: number;
    FinIR35ScopeId?: number;
    FinIR35AssessmentId?: number;
    OtherComments?: string;
    BHUserId?: number;
    FBPUserId?: number;
    HRBPUserId?: number;
    BHApprovalDecision?: string;
    BHApprovalComments?: string;
    FBPApprovalDecision?: string;
    FBPApprovalComments?: string;
    HRBPApprovalDecision?: string;
    HRBPApprovalComments?: string;
    CaseChangeLog?: string;


}

export class CLCase implements ICLCase{ 
    public ID: number = 0;
    public Title: string = null;
    public CaseType?: string = null;
    public CreatedById?: number = null;
    public CreatedOn?: Date = null;
    public ApplHMUserId?: number = null;
    public ReqCostCentre?: string = null;
    public ReqDirectorateId?: number = null;
    public ReqVacancyTitle?: string = null;
    public ReqGradeId?: number = null;
    public ReqWorkPurpose?: string = null;
    public ReqProfessionalCatId?: number = null;
    public ReqEstStartDate?: Date = null;
    public ReqEstEndDate?: Date = null;
    public ReqWorkLocationId?: number = null;
    public ReqNumPositions?: number = 1;
    public ComFrameworkId?: number = null;
    public ComJustification?: string = null;
    public ComPSRAccountId?: string = null;
    public JustAltOptions?: string = null;
    public JustSuccessionPlanning?: string = null;
    public FinMaxRate?: number = null;
    public FinEstCost?: number = null;
    public FinIR35ScopeId?: number = null;
    public FinIR35AssessmentId?: number = null;
    public OtherComments?: string = null;
    public BHUserId?: number = null;
    public FBPUserId?: number = null;
    public HRBPUserId?: number = null;
    public BHApprovalDecision?: string = null;
    public BHApprovalComments?: string = null;
    public FBPApprovalDecision?: string = null;
    public FBPApprovalComments?: string = null;
    public HRBPApprovalDecision?: string = null;
    public HRBPApprovalComments?: string = null;
    public CaseChangeLog?: string = null;

    constructor(caseType: string) {
        this.CaseType = caseType;

    }


}

export interface IClCaseInfo  extends IEntity {
    Stage?: string;
    CreatedBy?: string;
    CreatedOn?: string;
    CaseRef?: string;    
}
export class ClCaseInfo  implements IClCaseInfo {
    public ID: number = 0;
    public Title: string = "";
    public Stage?: string = "";
    public CreatedBy?: string = "";
    public CreatedOn?: string = "";
    public CaseRef?: string = "";
}