import { IEntity } from "./Entity";


export interface IIAPActionUpdate  extends IEntity {

    UpdateType?: string;
    UpdateDetails?: string;
    RevisedDate?: Date;
    EvFileName?: string;
    EvIsLink?:boolean;
    IAPActionId?: number;
    IAPStatusTypeId?: number;
    UpdatedById?: number;
    UpdateDate?: Date;
    

}

export class IAPActionUpdate implements IIAPActionUpdate{ 
    public ID: number = 0;
    public Title: string = null;    

    public UpdateType?: string = null;
    public UpdateDetails?: string = null;
    public RevisedDate?: Date = null;
    public EvFileName?: string = null;
    public EvIsLink?:boolean = false;
    public IAPActionId?: number = null;
    public IAPStatusTypeId?: number = null;
    public UpdatedById?: number = null;
    public UpdateDate?: Date = null;

    constructor(iapActionId: number, updateType: string) {
        this.IAPActionId = iapActionId;
        this.UpdateType = updateType;
    }


}