import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IIAPAction } from '../types';

export class IAPActionService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/IAPActions`);
    }

    public readAllWithFilters(userIds: string, isArchive:boolean): Promise<IEntity[]> {
        return this.readAll(`?userIds=${userIds}&isArchive=${isArchive}`);
    }

    public readAllGroups(parentActionId:number): Promise<IEntity[]> {
        return this.readAll(`?parentActionId=${parentActionId}&getGroups=`);
    }

    public readWithExpandAssignments(ID: number): Promise<IIAPAction> {

        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("IAPAssignments");
        entitiesToExpand.push("IAPActionDirectorates");

        return this.read(ID, false, false, entitiesToExpand).then((e: IIAPAction): IIAPAction => {
            return e;
        });
    }

    public countUpdatesForAction(actionId: number): Promise<string> {
        return super.readString(`?actionId=${actionId}&countUpdatesForAction=&extraP=`).then((result:string): string => {
            return result;
        });
    }
}