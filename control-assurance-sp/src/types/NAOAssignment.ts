import { IEntity } from "./Entity";

export interface INAOAssignment extends IEntity {
    NAORecommendationId?: number;
    UserId?: number;
}

export class NAOAssignment implements INAOAssignment {
    public ID = 0;
    public Title = null;
    public NAORecommendationId = null;
    public UserId = null;
}
