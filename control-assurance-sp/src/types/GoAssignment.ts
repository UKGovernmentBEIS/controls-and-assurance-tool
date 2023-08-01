import { IEntity } from "./Entity";
import { IGoElement } from "./GoElement";
import { IUser } from "./User";

export interface IGoAssignment extends IEntity {
    GoElementId?: number;
    UserId?: number;
    GoElement?: IGoElement;
    User?: IUser;
}

export class GoAssignment implements IGoAssignment {
    public ID = 0;
    public Title = null;
    public GoElementId = null;
    public UserId = null;
}
