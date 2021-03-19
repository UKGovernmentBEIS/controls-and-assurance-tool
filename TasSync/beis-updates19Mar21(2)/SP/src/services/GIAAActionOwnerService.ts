import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, GIAAActionOwner } from '../types';
import { baseElementEvents } from 'office-ui-fabric-react/lib/Utilities';



export class GIAAActionOwnerService extends EntityService<GIAAActionOwner> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GIAAActionOwners`);
    }

    // public create(entity: IAPAssignment): Promise<IAPAssignment> {
    //     console.log('IAPAssignmentService.create', entity);
    //     return super.create(entity);
    // }

}