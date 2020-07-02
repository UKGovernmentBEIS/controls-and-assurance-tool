import { IEntity } from "./Entity";
import { IIAPUpdate } from "./IAPUpdate";
import { IUser } from "./User";

export interface IIAPAssignment extends IEntity {
    IAPUpdateId?: number;
    UserId?: number;
    //IAPUpdate?: IGoElement;
    //User?: IUser;

}

export class IAPAssignment implements IIAPAssignment {
    public ID = 0;
    public Title = null;
    public IAPUpdateId = null;
    public UserId = null;
}
