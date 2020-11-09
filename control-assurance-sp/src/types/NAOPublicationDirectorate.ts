import { IEntity } from "./Entity";
import { IUser } from "./User";

export interface INAOPublicationDirectorate extends IEntity {
    NAOPublicationId?: number;
    DirectorateId?: number;

}

export class NAOPublicationDirectorate implements INAOPublicationDirectorate {
    public ID = 0;
    public Title = null;
    public NAOPublicationId = null;
    public DirectorateId = null;
}
