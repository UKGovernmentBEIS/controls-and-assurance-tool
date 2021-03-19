import { IEntity } from "./Entity";


export interface INAOUpdate  extends IEntity {

    ProvideUpdate?: string;
    TargetDate?: string;
    ActionsTaken?: string;
    NAOComments?: string;
    FurtherLinks?: string;
    NAORecommendationId?: number;
    NAOPeriodId?: number;
    NAORecStatusTypeId?: number;
    NAOUpdateStatusTypeId?: number;
    UpdateChangeLog?: string;
    LastSavedInfo?: string;
    ApprovedById?: number;
    ApprovedByPosition?: string;


}

export class NAOUpdate implements INAOUpdate{ 
    public ID: number = 0;
    public Title: string = null;    
    public ProvideUpdate = null;
    public TargetDate = null;
    public ActionsTaken = null;
    public NAOComments = null;
    public FurtherLinks = null;
    public NAORecommendationId = null;
    public NAOPeriodId = null;
    public NAORecStatusTypeId = null;
    public NAOUpdateStatusTypeId = null;
    public UpdateChangeLog = null;
    public LastSavedInfo = null;
    public ApprovedById = null;
    public ApprovedByPosition = 'Blank'; //default value

    constructor(naoPeriodId: number, naoRecommendationId: number) {
        this.NAOPeriodId = naoPeriodId;
        this.NAORecommendationId = naoRecommendationId;
    }


}