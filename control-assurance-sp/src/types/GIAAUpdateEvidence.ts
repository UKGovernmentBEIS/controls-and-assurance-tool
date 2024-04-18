import { IEntity } from "./Entity";

export interface IGIAAUpdateEvidence  extends IEntity {
    IsLink?:boolean;
    Details?: string;
    AdditionalNotes?: string;
    GIAAUpdateId?: number; 
    DateUploaded?: Date;
    UploadedByUserId?: number;
}

export class GIAAUpdateEvidence implements IGIAAUpdateEvidence{ 
    public ID: number = 0;
    public Title: string = null;
    public Details?: string = "";
    public AdditionalNotes?: string = "";
    public GIAAUpdateId?: number = null;
    public DateUploaded?: Date = null;
    public UploadedByUserId?: number = null;

    constructor(giaaUpdateId: number) {
        this.GIAAUpdateId = giaaUpdateId;
    } 
}