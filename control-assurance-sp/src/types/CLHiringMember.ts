import { IEntity } from "./Entity";

export interface ICLHiringMember extends IEntity {
    CLCaseId?: number;
    UserId?: number;
}

export class CLHiringMember implements ICLHiringMember {
    public ID = 0;
    public Title = null;
    public CLCaseId = null;
    public UserId = null;
}
