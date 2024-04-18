import { IEntity } from "./Entity";

export interface INAOUpdateEvidence  extends IEntity {
    IsLink?:boolean;
    Details?: string;
    AdditionalNotes?: string;
    NAOUpdateId?: number; 
    DateUploaded?: Date;
    UploadedByUserId?: number;
}

export class NAOUpdateEvidence implements INAOUpdateEvidence{ 
    public ID: number = 0;
    public Title: string = null;
    public Details?: string = "";
    public AdditionalNotes?: string = "";
    public NAOUpdateId?: number = null;
    public DateUploaded?: Date = null;
    public UploadedByUserId?: number = null;

    constructor(naoUpdateId: number) {
        this.NAOUpdateId = naoUpdateId;
    }
}