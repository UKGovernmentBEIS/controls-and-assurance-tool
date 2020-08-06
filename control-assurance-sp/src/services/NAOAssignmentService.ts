import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, NAOAssignment } from '../types';
import { baseElementEvents } from 'office-ui-fabric-react/lib/Utilities';



export class NAOAssignmentService extends EntityService<NAOAssignment> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/NAOAssignments`);
    }

    // public create(entity: IAPAssignment): Promise<IAPAssignment> {
    //     console.log('IAPAssignmentService.create', entity);
    //     return super.create(entity);
    // }

}