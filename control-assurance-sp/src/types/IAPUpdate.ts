import { IEntity } from "./Entity";


export interface IIAPUpdate  extends IEntity {

    Details?: string;
    IAPPriorityId?:number;
    IAPStatusTypeId?:number;
    IAPTypeId?:number;
    CreatedBy?:string;
    CreatedOn?:Date; 
    Attachment?:string;
    IsLink?:boolean;
}

export class IAPUpdate implements IIAPUpdate{ 
    public ID: number = 0;
    public Title: string = null;
    public Details?: string = null;
    public IAPPriorityId?:number = null;
    public IAPStatusTypeId?:number = null;
    public IAPTypeId?:number = null;
    public CreatedBy?:string = null;
    public CreatedOn?:Date = null;
    public Attachment?:string = null;
    public IsLink:boolean = null;


    constructor(IAPPriorityId: number, IAPStatusTypeId:number, IAPTypeId: number) {
        this.IAPPriorityId = IAPPriorityId;
        this.IAPStatusTypeId = IAPStatusTypeId;
        this.IAPTypeId = IAPTypeId;
    }

}