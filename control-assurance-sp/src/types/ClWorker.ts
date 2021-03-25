import { IEntity } from "./Entity";


export interface ICLWorker  extends IEntity {

    CLCaseId?: number;
    Stage?: string;
    WorkerChangeLog?: string;
    WorkerNumber?: number;
    OnbContractorFirstname?: string;
    OnbContractorSurname?: string;
    OnbStartDate?: Date;
    OnbEndDate?: Date;
    OnbDayRate?: number;
    OnbContractorHomeAddress?: string;
    OnbContractorEmail?: string;
    OnbContractorPhone?: string;
    PurchaseOrderNum?: string;
    OnbSecurityClearanceId?: number;

    OnbContractorTitleId?: number;
    OnbContractorGender?: string;
    OnbContractorDob?: Date;
    OnbContractorNINum?: string;
    OnbContractorPostCode?: string;
    OnbWorkingDayMon?: boolean;
    OnbWorkingDayTue?: boolean;
    OnbWorkingDayWed?: boolean;
    OnbWorkingDayThu?: boolean;
    OnbWorkingDayFri?: boolean;
    OnbWorkingDaySat?: boolean;
    OnbWorkingDaySun?: boolean;
    OnbDecConflictId?: number;
    OnbLineManagerUserId?: number;
    OnbLineManagerGradeId?: number;
    OnbLineManagerEmployeeNum?: string;
    OnbLineManagerPhone?: string;
    OnbWorkOrderNumber?: string;
    OnbRecruitersEmail?: string;


    BPSSCheckedById?: number;
    BPSSCheckedOn?: Date;
    POCheckedById?: number;
    POCheckedOn?: Date;
    ITCheckedById?: number;
    ITCheckedOn?: Date;
    UKSBSCheckedById?: number;
    UKSBSCheckedOn?: Date;
    PassCheckedById?: number;
    PassCheckedOn?: Date;
    ContractCheckedById?: number;
    ContractCheckedOn?: Date;
    EngagedChecksDone: boolean;

    ITSystemRef?:string;
    ITSystemNotes?:string;
    UKSBSRef?:string;
    UKSBSNotes?:string;

    EngPONumber?:string;
    EngPONote?:string;

    LeEndDate?: Date;
    LeContractorPhone?: string;
    LeContractorEmail?: string;
    LeContractorHomeAddress?: string;
    LeContractorPostCode?: string;
    LeContractorDetailsCheckedById?: number;
    LeContractorDetailsCheckedOn?: Date;
    LeITCheckedById?: number;
    LeITCheckedOn?: Date;
    LeUKSBSCheckedById?: number;
    LeUKSBSCheckedOn?: Date;
    LePassCheckedById?: number;
    LePassCheckedOn?: Date;

    SDSPdfStatus?: string;
    SDSPdfDate?: Date;
    SDSPdfName?: string;
    SDSPdfLastActionUser?: string;


}

export class CLWorker implements ICLWorker{ 
    public ID: number = 0;
    public Title: string = null;
    public CLCaseId?: number = null;
    public Stage?: string = null;
    public WorkerChangeLog?: string = null;
    public WorkerNumber?: number = null;
    public OnbContractorFirstname?: string = null;
    public OnbContractorSurname?: string = null;
    public OnbStartDate?: Date = null;
    public OnbEndDate?: Date = null;
    public OnbDayRate?: number = null;
    public OnbContractorHomeAddress?: string = null;
    public OnbContractorEmail?: string = null;
    public OnbContractorPhone?: string = null;
    public PurchaseOrderNum?: string = null;
    public OnbSecurityClearanceId?: number = null;

    public OnbContractorTitleId?: number = null;
    public OnbContractorGender?: string = null;
    public OnbContractorDob?: Date = null;
    public OnbContractorNINum?: string = null;
    public OnbContractorPostCode?: string = null;
    public OnbWorkingDayMon?: boolean = null;
    public OnbWorkingDayTue?: boolean = null;
    public OnbWorkingDayWed?: boolean = null;
    public OnbWorkingDayThu?: boolean = null;
    public OnbWorkingDayFri?: boolean = null;
    public OnbWorkingDaySat?: boolean = null;
    public OnbWorkingDaySun?: boolean = null;
    public OnbDecConflictId?: number = null;
    public OnbLineManagerUserId?: number = null;
    public OnbLineManagerGradeId?: number = null;
    public OnbLineManagerEmployeeNum?: string = null;
    public OnbLineManagerPhone?: string = null;

    public BPSSCheckedById?: number = null;
    public BPSSCheckedOn?: Date = null;
    public POCheckedById?: number = null;
    public POCheckedOn?: Date = null;
    public ITCheckedById?: number = null;
    public ITCheckedOn?: Date = null;
    public UKSBSCheckedById?: number = null;
    public UKSBSCheckedOn?: Date = null;
    public PassCheckedById?: number = null;
    public PassCheckedOn?: Date = null;
    public ContractCheckedById?: number = null;
    public ContractCheckedOn?: Date = null;
    public EngagedChecksDone: boolean = null;

    public ITSystemRef?:string = "";
    public ITSystemNotes?:string = "";
    public UKSBSRef?:string = "";
    public UKSBSNotes?:string = "";

    public LeEndDate?: Date = null;
    public LeContractorPhone?: string = null;
    public LeContractorEmail?: string = null;
    public LeContractorHomeAddress?: string = null;
    public LeContractorPostCode?: string = null;
    public LeContractorDetailsCheckedById?: number = null;
    public LeContractorDetailsCheckedOn = null;
    public LeITCheckedById?: number = null;
    public LeITCheckedOn?: Date = null;
    public LeUKSBSCheckedById?: number = null;
    public LeUKSBSCheckedOn?: Date = null;
    public LePassCheckedById?: number = null;
    public LePassCheckedOn?: Date = null;

    public SDSPdfStatus?: string = null;
    public SDSPdfDate?: Date = null;
    public SDSPdfName?: string = null;
    public SDSPdfLastActionUser?: string = null;


    constructor() {
        
    }


}


