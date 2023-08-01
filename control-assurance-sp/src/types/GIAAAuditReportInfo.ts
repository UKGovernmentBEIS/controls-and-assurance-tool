import { IEntity } from "./Entity";


export interface IGIAAAuditReportInfo  extends IEntity {

    NumberStr?: string;
    Directorate?: string;
    Year?: string;
    DG?: string;
    IssueDate?: string;
    Director?: string;
    Stats?: string;
    Assurance?: string;
    Link?: string;
}