import { GIAAUpdateTypes } from "./AppGlobals";
import { IEntity } from "./Entity";


export interface IGIAAUpdate  extends IEntity {

    UpdateType?: string;
    UpdateDetails?: string;
    RevisedDate?: Date;
    Link?: string;
    EvFileName?: string;
    EvIsLink?:boolean;
    EvAdditionalNotes?: string;
    GIAARecommendationId?: number;
    GIAAActionStatusTypeId?: number;
    UpdatedById?: number;
    UpdateDate?: Date;
    UpdateChangeLog?: string;
    RequestClose?:boolean;
    RequestDateChange?:boolean;
    RequestDateChangeTo?: Date;
    MarkAllReqClosed?:boolean;
    

}

export class GIAAUpdate implements IGIAAUpdate{ 
    public ID: number = 0;
    public Title: string = null;    

    public UpdateType?: string = null;
    public UpdateDetails?: string = null;
    public RevisedDate?: Date = null;
    public Link?: string = null;
    public EvFileName?: string = null;
    public EvIsLink?:boolean = false;
    public EvAdditionalNotes?: string = null;
    public GIAARecommendationId?: number = null;
    public GIAAActionStatusTypeId?: number = null;
    public UpdatedById?: number = null;
    public UpdateDate?: Date = null;
    public UpdateChangeLog?: string = null;
    public RequestClose?:boolean = false;
    public RequestDateChange?:boolean = false;
    public RequestDateChangeTo?: Date = null;
    public MarkAllReqClosed?:boolean = null;

    constructor(giaaRecommendationId: number, updateType: string) {
        this.GIAARecommendationId = giaaRecommendationId;
        this.UpdateType = updateType;

        if(updateType === GIAAUpdateTypes.Status_DateUpdate){
            this.MarkAllReqClosed = true; //default checked
        }
    }


}