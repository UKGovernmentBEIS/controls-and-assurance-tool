import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntityStatusType } from '../types';

export class EntityStatusTypeService extends EntityService<IEntityStatusType> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/EntityStatusTypes`);
    }
}