import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IAutomationOption } from '../types';



export class AutomationOptionService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/AutomationOptions`);
    }



}