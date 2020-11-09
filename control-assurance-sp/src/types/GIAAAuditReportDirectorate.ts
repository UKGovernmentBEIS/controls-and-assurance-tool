import { IEntity } from "./Entity";
import { IUser } from "./User";

export interface IGIAAAuditReportDirectorate extends IEntity {
    GIAAAuditReportId?: number;
    DirectorateId?: number;

}

export class GIAAAuditReportDirectorate implements IGIAAAuditReportDirectorate {
    public ID = 0;
    public Title = null;
    public GIAAAuditReportId = null;
    public DirectorateId = null;
}
