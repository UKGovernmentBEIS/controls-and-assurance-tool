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

    public readAllForList(giaaRecommendationId: number): Promise<IGIAAUpdate[]> {
        return this.readAll(`?giaaRecommendationId=${giaaRecommendationId}&dataForUpdatesList=`);
    }
}