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

    public readWithExpandAssignments(ID: number): Promise<IIAPAction> {
        //const qry:string = `?$expand=IAPAssignments($expand=User)`;

        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("IAPAssignments($expand=User)");
        entitiesToExpand.push("IAPActionDirectorates($expand=Directorate)");

        return this.read(ID, false, false, entitiesToExpand).then((e: IIAPAction): IIAPAction => {
            return e;
        });
    }







}