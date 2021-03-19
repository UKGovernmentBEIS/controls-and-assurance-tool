import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IGIAAUpdate } from '../types';



export class GIAAUpdateService extends EntityService<IGIAAUpdate> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GIAAUpdates`);
    }


    public readAllByRec(giaaRecommendationId: number): Promise<IEntity[]> {
        return this.readAll(`?giaaRecommendationId=${giaaRecommendationId}&dataForUpdatesList=`);
    }

    // public getRecInfo(giaaUpdateId: number): Promise<IGIAAUpdate> {
    //     //const qry:string = `?$expand=GIAARecommendation,GIAAPeriod`;

    //     let entitiesToExpand: string[] = [];
    //     entitiesToExpand.push("GIAARecommendation");
    //     entitiesToExpand.push("GIAAPeriod");

    //     return this.read(giaaUpdateId, false, false, entitiesToExpand).then((e: IGIAAUpdate): IGIAAUpdate => {
    //         return e;
    //     });
    // }



    //for historic updates
    // public readAllWithArgs(giaaRecommendationId:number): Promise<IGIAAUpdate[]> {
    //     //console.log('historic update - rec id', naoRecommendationId, 'period id', naoPeriodId);
    //     return this.readAll(`?$filter=GIAARecommendationId eq ${giaaRecommendationId} and GIAAPeriod/PeriodStatus eq 'Archived Period'&$expand=GIAAActionStatusType,GIAAPeriod`);
    // }

    public readAllForList(giaaRecommendationId:number): Promise<IGIAAUpdate[]> {
        //console.log('historic update - rec id', naoRecommendationId, 'period id', naoPeriodId);
        //?giaaRecommendationId=1&dataForUpdatesList=
        return this.readAll(`?giaaRecommendationId=${giaaRecommendationId}&dataForUpdatesList=`);
    }







}