import { IEntity } from "./Entity";

export interface IGIAAActionOwner extends IEntity {
    GIAARecommendationId?: number;
    UserId?: number;
}

export class GIAAActionOwner implements IGIAAActionOwner {
    public ID = 0;
    public Title = null;
    public GIAARecommendationId = null;
    public UserId = null;
}
