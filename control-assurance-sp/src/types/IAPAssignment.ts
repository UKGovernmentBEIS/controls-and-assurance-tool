import { IEntity } from "./Entity";

export interface IIAPAssignment extends IEntity {
    IAPActionId?: number;
    UserId?: number;
    GroupNum?: number;
}

export class IAPAssignment implements IIAPAssignment {
    public ID = 0;
    public Title = null;
    public IAPActionId = null;
    public UserId = null;
    public GroupNum = null;
}
