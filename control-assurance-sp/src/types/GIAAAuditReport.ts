import { IEntity } from "./Entity";
import { IGIAAAuditReportDirectorate } from "./GIAAAuditReportDirectorate";

export interface IGIAAAuditReport  extends IEntity {

    NumberStr?: string;
    IssueDate?: Date;
    AuditYear?: string;
    Link?: string;
    GIAAAssuranceId?: number;
    IsArchive?:boolean;
    GIAAAuditReportDirectorates?: IGIAAAuditReportDirectorate[];
}

export class GIAAAuditReport implements IGIAAAuditReport{ 
    public ID: number = 0;
    public Title: string = null;
    public NumberStr = null;
    public IssueDate = null;
    public AuditYear = null;
    public Link = null;
    public GIAAAssuranceId = null;
    public IsArchive = false;
    public GIAAAuditReportDirectorates = [];

}