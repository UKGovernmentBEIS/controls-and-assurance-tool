import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IIAPUpdate } from '../types';



export class IAPUpdateService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/IAPUpdates`);
    }

    public readAllWithFilters(userIds: string): Promise<IEntity[]> {
        return this.readAll(`?userIds=${userIds}`);
    }

    public readWithExpandAssignments(ID: number): Promise<IIAPUpdate> {
        //const qry:string = `?$expand=IAPAssignments($expand=User)`;

        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("IAPAssignments($expand=User)");

        return this.read(ID, false, false, entitiesToExpand).then((e: IIAPUpdate): IIAPUpdate => {
            return e;
        });
    }







}