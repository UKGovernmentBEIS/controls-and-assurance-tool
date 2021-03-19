import { IEntity } from "./Entity";
import { IIAPAction } from "./IAPAction";
import { IUser } from "./User";

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
