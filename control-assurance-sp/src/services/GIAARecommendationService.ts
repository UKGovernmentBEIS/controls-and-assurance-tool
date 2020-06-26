import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity } from '../types';



export class GIAARecommendationService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GIAARecommendations`);
    }

    public readAllWithFilters(giaaAuditReportId: number | string, incompleteOnly: boolean, justMine: boolean): Promise<IEntity[]> {
        return this.readAll(`?giaaAuditReportId=${giaaAuditReportId}&incompleteOnly=${incompleteOnly}&justMine=${justMine}`);
    }





}