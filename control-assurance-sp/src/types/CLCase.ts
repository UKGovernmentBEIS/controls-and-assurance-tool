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
    FinApproachAgreeingRate?: string;
    FinSummaryIR35Just?: string;
    OtherComments?: string;
    BHUserId?: number;
    FBPUserId?: number;
    HRBPUserId?: number;
    CBPUserId?: number;
    BHApprovalDecision?: string;
    BHApprovalComments?: string;
    FBPApprovalDecision?: string;
    FBPApprovalComments?: string;
    HRBPApprovalDecision?: string;
    HRBPApprovalComments?: string;
    CLApprovalDecision?: string;
    CBPApprovalDecision?: string;
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
    public FinApproachAgreeingRate?: string = null;
    public FinSummaryIR35Just?: string = null;
    public OtherComments?: string = null;
    public BHUserId?: number = null;
    public FBPUserId?: number = null;
    public HRBPUserId?: number = null;
    public CBPUserId?: number = null;
    public BHApprovalDecision?: string = null;
    public BHApprovalComments?: string = null;
    public FBPApprovalDecision?: string = null;
    public FBPApprovalComments?: string = null;
    public HRBPApprovalDecision?: string = null;
    public HRBPApprovalComments?: string = null;
    public CLApprovalDecision?: string = null;
    public CBPApprovalDecision?: string = null;
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

    ApplHMUser?: string;
    ApplHMembers?: string;
    ReqGrade?: string;
    Directorate?: string;
    ReqEstStartDate?: string;
    ReqEstEndDate?: string;
    ReqProfessionalCat?: string;
    ReqWorkLocation?: string;
    ComFramework?: string;
    ComPSRAccount?: string;
    FinIR35Scope?: string;
    BHUser?: string;
    FBPUser?: string;
    HRBPUser?: string;
    BHDecisionByAndDate?: string;
    FBPDecisionByAndDate?: string;
    HRBPDecisionByAndDate?: string;
    CBPDecisionByAndDate?: string;
    CLDecisionByAndDate?: string;

    OnbContractorGender?: string;
    OnbContractorTitle?: string;
    OnbContractorDobStr?: string;
    OnbStartDateStr?: string;
    OnbEndDateStr?: string;
    OnbSecurityClearance?: string;
    WorkDays?: string;
    OnbDecConflict?: string;
    OnbLineManagerUser?: string;
    OnbLineManagerGrade?: string;
    OnbWorkOrderNumber?: string;
    OnbRecruitersEmail?: string;

    BPSSCheckedBy?: string;
    BPSSCheckedOn?: string;
    POCheckedBy?: string;
    POCheckedOn?: string;
    ITCheckedBy?: string;
    ITCheckedOn?: string;
    UKSBSCheckedBy?: string;
    UKSBSCheckedOn?: string;
    PassCheckedBy?: string;
    PassCheckedOn?: string;
    ContractCheckedBy?: string;
    ContractCheckedOn?: string;
    EngPONumber?:string;
    EngPONote?:string;
    SDSCheckedBy?:string;
    SDSCheckedOn?:string;
    SDSNotes?:string;


    LeEndDateStr?: string;
    LeContractorDetailsCheckedBy?: string;
    LeContractorDetailsCheckedOn?: string;
    LeITCheckedBy?: string;
    LeITCheckedOn?: string;
    LeUKSBSCheckedBy?: string;
    LeUKSBSCheckedOn?: string;
    LePassCheckedBy?: string;
    LePassCheckedOn?: string;

    ExtensionHistory?: string;

}
export class ClCaseInfo  implements IClCaseInfo {

    public ID: number = 0;
    public Title: string = "";
    public Stage?: string = "";
    public CreatedBy?: string = "";
    public CreatedOn?: string = "";
    public CaseRef?: string = "";

    public ApplHMUser?: string = "";
    public ReqGrade?: string = "";
    public Directorate?: string = "";
    public ReqEstStartDate?: string = "";
    public ReqEstEndDate?: string = "";
    public ReqProfessionalCat?: string = "";
    public ReqWorkLocation?: string = "";
    public ComFramework?: string = "";
    public ComPSRAccount?: string = "";
    public FinIR35Scope?: string = "";
    public BHUser?: string = "";
    public FBPUser?: string = "";
    public HRBPUser?: string = "";

    public BHDecisionByAndDate?: string = "";
    public FBPDecisionByAndDate?: string = "";
    public HRBPDecisionByAndDate?: string = "";

    public OnbContractorTitle?: string = "";
    public OnbContractorGender?: string = "";
    public OnbContractorDobStr?: string = "";
    public OnbStartDateStr?: string = "";
    public OnbEndDateStr?: string = "";
    public OnbSecurityClearance?: string = "";
    public WorkDays?: string = "";
    public OnbDecConflict?: string = "";
    public OnbLineManagerUser?: string = "";
    public OnbLineManagerGrade?: string = "";

    public BPSSCheckedBy?: string = "";
    public BPSSCheckedOn?: string = "";
    public POCheckedBy?: string = "";
    public POCheckedOn?: string = "";
    public ITCheckedBy?: string = "";
    public ITCheckedOn?: string = "";
    public UKSBSCheckedBy?: string = "";
    public UKSBSCheckedOn?: string = "";
    public PassCheckedBy?: string = "";
    public PassCheckedOn?: string = "";
    public ContractCheckedBy?: string = "";
    public ContractCheckedOn?: string = "";
    public SDSCheckedBy?:string = "";
    public SDSCheckedOn?:string = "";
    public SDSNotes?:string = "";

    public LeStartDateStr?: string = "";
    public LeContractorDetailsCheckedBy?: string = "";
    public LeContractorDetailsCheckedOn?: string = "";
    public LeITCheckedBy?: string = "";
    public LeITCheckedOn?: string = "";
    public LeUKSBSCheckedBy?: string = "";
    public LeUKSBSCheckedOn?: string = "";
    public LePassCheckedBy?: string = "";
    public LePassCheckedOn?: string = "";

    public ExtensionHistory = "";

}

export interface IClCaseCounts extends IEntity{
    TotalBusinessCases?: number;
    TotalEngagedCases?: number;
    TotalArchivedCases?: number;
}