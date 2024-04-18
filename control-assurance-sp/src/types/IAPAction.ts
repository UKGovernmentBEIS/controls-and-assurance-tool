import { IIAPActionDirectorate } from ".";
import { IEntity } from "./Entity";

export interface IIAPAction  extends IEntity {

    Details?: string;
    IAPPriorityId?:number;
    IAPStatusTypeId?:number;
    IAPTypeId?:number;
    CreatedById?:number;
    CreatedOn?:Date; 
    Attachment?:string;
    IsLink?:boolean;
    CompletionDate?:Date;
    OriginalCompletionDate?:Date;
    MonthlyUpdateRequired?:boolean;
    MonthlyUpdateRequiredIfNotCompleted?:boolean;
    ActionLinks?: string;
    IsArchive?:boolean;
    IAPActionDirectorates?: IIAPActionDirectorate[];
}

export class IAPAction implements IIAPAction{ 
    public ID: number = 0;
    public Title: string = null;
    public Details?: string = null;
    public IAPPriorityId?:number = null;
    public IAPStatusTypeId?:number = null;
    public IAPTypeId?:number = null;
    public CreatedById?:number = null;
    public CreatedOn?:Date = null;
    public Attachment?:string = null;
    public IsLink:boolean = null;
    public CompletionDate = null;
    public OriginalCompletionDate = null;
    public MonthlyUpdateRequired = false;
    public MonthlyUpdateRequiredIfNotCompleted = false;
    public ActionLinks = null;
    public IsArchive?:boolean = false;
    public IAPActionDirectorates = [];

    constructor(IAPPriorityId: number, IAPStatusTypeId:number, IAPTypeId: number) {
        this.IAPPriorityId = IAPPriorityId;
        this.IAPStatusTypeId = IAPStatusTypeId;
        this.IAPTypeId = IAPTypeId;
    }
}