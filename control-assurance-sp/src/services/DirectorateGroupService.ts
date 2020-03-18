import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDefForm, IDirectorateGroup } from '../types';



export class DirectorateGroupService extends EntityService<IDirectorateGroup> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/DirectorateGroups`);
    }

    public readAllExpandAll(): Promise<IDirectorateGroup[]> {
        return this.readAll(`?$orderby=User/Title&$expand=User,EntityStatusType`);
    }

    public readAllForUser(): Promise<IDirectorateGroup[]> {
        return this.readAll(`?currentUser=&$orderby=Title`);
    }

    public readAllForGoList(): Promise<IDirectorateGroup[]> {
        //reads all DG Areas for GoUpdates picklist
        return this.readAll(`?currentUser=&openDirectorateGroups=&goAppList&$orderby=Title`);
    }
}