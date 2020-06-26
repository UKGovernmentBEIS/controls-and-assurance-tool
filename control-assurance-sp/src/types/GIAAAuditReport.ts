import { IEntity } from "./Entity";


export interface IGIAAAuditReport  extends IEntity {

    NumberStr?: string;
    IssueDate?: Date;
    AuditYear?: string;
    Link?: string;
    DirectorateId?: number;
    GIAAAssuranceId?: number;
    
}

export class GIAAAuditReport implements IGIAAAuditReport{ 
    public ID: number = 0;
    public Title: string = null;
    public NumberStr = null;
    public IssueDate = null;
    public AuditYear = null;
    public Link = null;
    public DirectorateId = null;
    public GIAAAssuranceId = null;



    // constructor(goElementId: number) {
    //     this.GoElementId = goElementId;
    // }


}