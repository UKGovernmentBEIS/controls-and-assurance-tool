import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDefForm, IPermissionType } from '../types';



export class PermissionTypeService extends EntityService<IPermissionType> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/PermissionTypes`);
    }

    public readAllForUser(): Promise<IPermissionType[]> {
        return this.readAll(`?currentUser=&$orderby=Title`);
    }
}