import { IEntity } from "./Entity";


export interface INAOUpdate  extends IEntity {

    TargetDate?: string;
    ActionsTaken?: string;
    NAOComments?: string;
    FurtherLinks?: string;
    NAORecommendationId?: number;
    NAOPeriodId?: number;
    NAORecStatusTypeId?: number;
    NAOUpdateStatusTypeId?: number;

}

export class NAOUpdate implements INAOUpdate{ 
    public ID: number = 0;
    public Title: string = null;    
    public TargetDate = null;
    public ActionsTaken = null;
    public NAOComments = null;
    public FurtherLinks = null;
    public NAORecommendationId = null;
    public NAOPeriodId = null;
    public NAORecStatusTypeId = null;
    public NAOUpdateStatusTypeId = null;

    constructor(naoPeriodId: number, naoRecommendationId: number) {
        this.NAOPeriodId = naoPeriodId;
        this.NAORecommendationId = naoRecommendationId;
    }


}