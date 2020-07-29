import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IAPAssignment } from '../types';
import { baseElementEvents } from 'office-ui-fabric-react/lib/Utilities';



export class IAPAssignmentService extends EntityService<IAPAssignment> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/IAPAssignments`);
    }

    public create(entity: IAPAssignment): Promise<IAPAssignment> {
        console.log('IAPAssignmentService.create', entity);
        return super.create(entity);
    }

}