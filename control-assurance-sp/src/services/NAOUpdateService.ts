import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, INAOUpdate } from '../types';



export class NAOUpdateService extends EntityService<INAOUpdate> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/NAOUpdates`);
    }

    // public readAllByPeriodAndRec(naoRecommendationId:number, naoPeriodId:number): Promise<INAOUpdate[]> {
         
    //     return this.readAll(`?$filter=NAORecommendationId eq ${naoRecommendationId} and NAOPeriodId eq ${naoPeriodId}`);
    // }

    public readByPeriodAndRec(naoRecommendationId:number, naoPeriodId:number): Promise<INAOUpdate> {
        return this.readEntity(`?naoRecommendationId=${naoRecommendationId}&naoPeriodId=${naoPeriodId}&findCreate=true`);
    }

    public getRecInfo(naoUpdateId: number): Promise<INAOUpdate> {
        //const qry:string = `?$expand=NAORecommendation,NAOPeriod`;

        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("NAORecommendation");
        entitiesToExpand.push("NAOPeriod");

        return this.read(naoUpdateId, false, false, entitiesToExpand).then((e: INAOUpdate): INAOUpdate => {
            return e;
        });
    }

    // public readAllWithArgs(naoRecommendationId:number, naoPeriodId:number): Promise<INAOUpdate[]> {
    //     console.log('historic update - rec id', naoRecommendationId, 'period id', naoPeriodId);
    //     return this.readAll(`?$filter=NAORecommendationId eq ${naoRecommendationId} and NAOPeriodId lt ${naoPeriodId}&$expand=NAORecStatusType,NAOPeriod`);
    // }

    public readAllWithArgs(naoRecommendationId:number): Promise<INAOUpdate[]> {
        //console.log('historic update - rec id', naoRecommendationId, 'period id', naoPeriodId);
        return this.readAll(`?$filter=NAORecommendationId eq ${naoRecommendationId} and NAOPeriod/PeriodStatus eq 'Archived Period'&$expand=NAORecStatusType,NAOPeriod`);
    }





}