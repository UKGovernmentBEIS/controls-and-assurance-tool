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


    constructor() {
        
    }


}


