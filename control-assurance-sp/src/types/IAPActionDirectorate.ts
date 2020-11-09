import { IEntity } from "./Entity";
import { IIAPAction } from "./IAPAction";
import { IUser } from "./User";

export interface IIAPActionDirectorate extends IEntity {
    IAPUpdateId?: number;
    DirectorateId?: number;

}

export class IAPActionDirectorate implements IIAPActionDirectorate {
    public ID = 0;
    public Title = null;
    public IAPActionId = null;
    public DirectorateId = null;
}
