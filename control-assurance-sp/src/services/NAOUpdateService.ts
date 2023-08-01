import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, INAOUpdate } from '../types';

export class NAOUpdateService extends EntityService<INAOUpdate> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/NAOUpdates`);
    }

    public readByPeriodAndRec(naoRecommendationId:number, naoPeriodId:number): Promise<INAOUpdate> {
        return this.readEntity(`?naoRecommendationId=${naoRecommendationId}&naoPeriodId=${naoPeriodId}&findCreate=true`);
    }
    public getLastPeriodActionsTaken(naoRecommendationId:number, naoPeriodId:number): Promise<string> {
        return super.readString(`?naoRecommendationId=${naoRecommendationId}&naoPeriodId=${naoPeriodId}&getLastPeriodActionsTaken=`).then((result:string): string => {
            return result;
        });
    }

    public getRecInfo(naoUpdateId: number): Promise<INAOUpdate> {
        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("NAORecommendation");
        entitiesToExpand.push("NAOPeriod");

        return this.read(naoUpdateId, false, false, entitiesToExpand).then((e: INAOUpdate): INAOUpdate => {
            return e;
        });
    }

    public readAllWithArgs(naoRecommendationId:number, naoPeriodId:number): Promise<INAOUpdate[]> {
        console.log('historic update - rec id', naoRecommendationId, 'period id', naoPeriodId);
        return this.readAll(`?$filter=NAORecommendationId eq ${naoRecommendationId} and NAOPeriodId ne ${naoPeriodId}&$expand=NAORecStatusType,NAOPeriod`);
    }
}