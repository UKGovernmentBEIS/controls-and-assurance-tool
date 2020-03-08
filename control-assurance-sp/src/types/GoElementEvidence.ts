import { IEntity } from "./Entity";
import { User } from "./User";

export interface IGoElementEvidence  extends IEntity {
    IsLink?:boolean;
    Details?: string;
    Controls?: string;
    Team?: string;
    InfoHolder?: string;
    AdditionalNotes?: string;
    GoElementId?: number; 
    DateUploaded?: Date;
    UploadedByUserId?: number;
    //User?: User;

}

export class GoElementEvidence implements IGoElementEvidence{ 
    public ID: number = 0;
    public Title: string = null;
    public Details?: string = "";
    public Controls?: string = "";
    public Team?: string = "";
    public InfoHolder?: string = "";
    public AdditionalNotes?: string = "";
    public GoElementId?: number = null;
    public DateUploaded?: Date = null;
    public UploadedByUserId?: number = null;

    constructor(goElementId: number) {
        this.GoElementId = goElementId;
    }

    //public User?: User = null; 
}