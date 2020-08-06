import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, INAOPublicationDirectorate } from '../types';
import { baseElementEvents } from 'office-ui-fabric-react/lib/Utilities';



export class NAOPublicationDirectorateService extends EntityService<INAOPublicationDirectorate> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/NAOPublicationDirectorates`);
    }

    // public create(entity: IAPAssignment): Promise<IAPAssignment> {
    //     console.log('IAPAssignmentService.create', entity);
    //     return super.create(entity);
    // }

}