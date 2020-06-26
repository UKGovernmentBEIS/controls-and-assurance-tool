import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IGIAAUpdate } from '../types';



export class GIAAUpdateService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GIAAUpdates`);
    }

    public readByPeriodAndRec(giaaRecommendationId:number, giaaPeriodId:number): Promise<IGIAAUpdate> {
        return this.readEntity(`?giaaRecommendationId=${giaaRecommendationId}&giaaPeriodId=${giaaPeriodId}&findCreate=true`);
    }

    public getRecInfo(giaaUpdateId: number): Promise<IGIAAUpdate> {
        //const qry:string = `?$expand=GIAARecommendation,GIAAPeriod`;

        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("GIAARecommendation");
        entitiesToExpand.push("GIAAPeriod");

        return this.read(giaaUpdateId, false, false, entitiesToExpand).then((e: IGIAAUpdate): IGIAAUpdate => {
            return e;
        });
    }



    public readAllWithArgs(giaaRecommendationId:number): Promise<IGIAAUpdate[]> {
        //console.log('historic update - rec id', naoRecommendationId, 'period id', naoPeriodId);
        return this.readAll(`?$filter=GIAARecommendationId eq ${giaaRecommendationId} and GIAAPeriod/PeriodStatus eq 'Archived Period'&$expand=GIAAActionStatusType,GIAAPeriod`);
    }







}