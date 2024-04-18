import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IAPAssignment } from '../types';

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

    public readAllAssignmentsForParentAction(parentIAPActionId: number): Promise<IAPAssignment[]> {
        return this.readAll(`?parentIAPActionId=${parentIAPActionId}&getAllAssignmentsForParentAction=`);
    }
}