import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IUserPermission, IDataAPI } from '../types';




export class UserPermissionService extends EntityService<IUserPermission> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/UserPermissions`);
    }

    public readAllExpandAll(): Promise<IUserPermission[]> {
        return this.readAll(`?$orderby=User/Title&$expand=User,PermissionType`);
    }
}