import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity } from '../types';

export class GoElementActionService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GoElementActions`);
    }

    public readAllWithArgs(goElementId: number): Promise<IEntity[]> {
        return this.readAll(`?$orderby=EntityPriorityId&$expand=EntityPriority&$filter=GoElementId eq ${goElementId}`);
    }
}