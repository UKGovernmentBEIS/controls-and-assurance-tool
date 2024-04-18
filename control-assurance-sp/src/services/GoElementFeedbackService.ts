import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity } from '../types';

export class GoElementFeedbackService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GoElementFeedbacks`);
    }

    public readAllWithArgs(goElementId: number): Promise<IEntity[]> {
        return this.readAll(`?$filter=GoElementId eq ${goElementId}&$expand=User`);
    }
}