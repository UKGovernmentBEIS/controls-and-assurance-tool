import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, INAOPublicationDirectorate } from '../types';
import { baseElementEvents } from 'office-ui-fabric-react/lib/Utilities';



export class IAPActionDirectorateService extends EntityService<INAOPublicationDirectorate> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/IAPActionDirectorates`);
    }



}