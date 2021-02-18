import { IEntity } from "./Entity";
import { User } from "./User";

export interface ICLCaseEvidence  extends IEntity {
    IsLink?:boolean;
    Details?: string;
    AdditionalNotes?: string;
    ParentId?: number; 
    DateUploaded?: Date;
    UploadedByUserId?: number;
    EvidenceType?:string;
    //User?: User;

}

export class CLCaseEvidence implements ICLCaseEvidence{ 
    public ID: number = 0;
    public Title: string = null;
    public Details?: string = "";
    public AdditionalNotes?: string = "";
    public ParentId?: number = null;
    public DateUploaded?: Date = null;
    public UploadedByUserId?: number = null;
    public EvidenceType?: string = null;

    constructor(parentId: number, evidenceType: string) {
        this.ParentId = parentId;
        this.EvidenceType = evidenceType;
    }

    //public User?: User = null; 
}