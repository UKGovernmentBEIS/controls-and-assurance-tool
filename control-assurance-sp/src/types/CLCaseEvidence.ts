import { IEntity } from "./Entity";
import { User } from "./User";

export interface ICLCaseEvidence  extends IEntity {

    Details?: string;
    ParentId?: number; 
    DateUploaded?: Date;
    UploadedByUserId?: number;
    EvidenceType?:string;
    AttachmentType?:string;

    //User?: User;

}

export class CLCaseEvidence implements ICLCaseEvidence{ 
    public ID: number = 0;
    public Title: string = null;
    public Details?: string = "";
    public ParentId?: number = null;
    public DateUploaded?: Date = null;
    public UploadedByUserId?: number = null;
    public EvidenceType?: string = null;
    public AttachmentType?: string = null; // "None";


    constructor(parentId: number, evidenceType: string, attachmentType: string) {
        this.ParentId = parentId;
        this.EvidenceType = evidenceType;
        this.AttachmentType = attachmentType;
    }

    //public User?: User = null; 
}