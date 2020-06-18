import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity } from '../types';



export class NAORecommendationService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/NAORecommendations`);
    }

    public readAllWithFilters(naoPublicationId: number | string, incompleteOnly: boolean, justMine: boolean): Promise<IEntity[]> {
        return this.readAll(`?naoPublicationId=${naoPublicationId}&incompleteOnly=${incompleteOnly}&justMine=${justMine}`);
    }





}