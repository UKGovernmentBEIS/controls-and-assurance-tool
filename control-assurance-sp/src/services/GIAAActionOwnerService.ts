import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, GIAAActionOwner } from '../types';

export class GIAAActionOwnerService extends EntityService<GIAAActionOwner> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GIAAActionOwners`);
    }
}