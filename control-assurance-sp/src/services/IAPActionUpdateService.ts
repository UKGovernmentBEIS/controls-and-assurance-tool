import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IIAPActionUpdate } from '../types';

export class IAPActionUpdateService extends EntityService<IIAPActionUpdate> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/IAPActionUpdates`);
    }

    public readAllForList(iapUpdateId:number): Promise<IEntity[]> {
        return this.readAll(`?iapUpdateId=${iapUpdateId}&dataForUpdatesList=`);
    }
}