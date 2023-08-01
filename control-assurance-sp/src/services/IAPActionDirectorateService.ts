import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, INAOPublicationDirectorate } from '../types';

export class IAPActionDirectorateService extends EntityService<INAOPublicationDirectorate> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/IAPActionDirectorates`);
    }
}