import { IEntity } from "./Entity";


export interface INAORecommendation  extends IEntity {

    RecommendationDetails?: string;
    Conclusion?: string;
    OriginalTargetDate?: string;
    //TargetDate?: string;
    NAOPublicationId?: number;
    //NAORecStatusTypeId?: number;
    NAOUpdateStatusTypeId?: number;    
}

export class NAORecommendation implements INAORecommendation{ 
    public ID: number = 0;
    public Title: string = null;
    public RecommendationDetails?: string = null;
    public Conclusion?: string = null;
    public OriginalTargetDate?: string = null;
    //public TargetDate = null;
    public NAOPublicationId = null;
    //public NAORecStatusTypeId = null;
    public NAOUpdateStatusTypeId = null;



    // constructor(goElementId: number) {
    //     this.GoElementId = goElementId;
    // }


}