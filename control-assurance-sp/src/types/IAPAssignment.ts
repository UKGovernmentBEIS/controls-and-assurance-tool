import { IEntity } from "./Entity";
import { IIAPAction } from "./IAPAction";
import { IUser } from "./User";

export interface IIAPAssignment extends IEntity {
    IAPActionId?: number;
    UserId?: number;
    //IAPAction?: IGoElement;
    //User?: IUser;

}

export class IAPAssignment implements IIAPAssignment {
    public ID = 0;
    public Title = null;
    public IAPActionId = null;
    public UserId = null;
}
