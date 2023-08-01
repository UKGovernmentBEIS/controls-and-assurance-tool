import { IEntity } from "./Entity";

export interface ICLCaseEvidence extends IEntity {

    Details?: string;
    ParentId?: number;
    DateUploaded?: Date;
    UploadedByUserId?: number;
    EvidenceType?: string;
    AttachmentType?: string;
    CLWorkerId?: number;
}

export class CLCaseEvidence implements ICLCaseEvidence {
    public ID: number = 0;
    public Title: string = null;
    public Details?: string = "";
    public ParentId?: number = null;
    public DateUploaded?: Date = null;
    public UploadedByUserId?: number = null;
    public EvidenceType?: string = null;
    public AttachmentType?: string = null; // "None";
    public CLWorkerId?: number = null;

    constructor(parentId: number, evidenceType: string, attachmentType: string, workerId?: number) {
        this.ParentId = parentId;
        this.CLWorkerId = workerId;
        this.EvidenceType = evidenceType;
        this.AttachmentType = attachmentType;
    }
}