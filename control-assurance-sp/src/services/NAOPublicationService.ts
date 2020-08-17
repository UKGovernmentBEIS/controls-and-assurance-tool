import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, INAOPublication, INAOPublicationInfo } from '../types';



export class NAOPublicationService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/NAOPublications`);
    }

    public readWithExpandDirectorates(ID: number): Promise<INAOPublication> {
        //const qry:string = `?$expand=GIAAActionOwners($expand=User)`;

        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("NAOPublicationDirectorates($expand=Directorate)");

        return this.read(ID, false, false, entitiesToExpand).then((e: INAOPublication): INAOPublication => {
            return e;
        });
    }

    public readAllWithFilters(naoPeriodId: number | string, dgAreaId: number | string, incompleteOnly: boolean, justMine: boolean, isArchive: boolean): Promise<IEntity[]> {
        return this.readAll(`?naoPeriodId=${naoPeriodId}&dgAreaId=${dgAreaId}&incompleteOnly=${incompleteOnly}&justMine=${justMine}&isArchive=${isArchive}`);
    }

    public getPublicationInfo(naoPublicationId: number): Promise<INAOPublicationInfo> {
        return this.readEntity(`?naoPublicationId=${naoPublicationId}&getInfo=true`);
    }

    public readOverAllUpdateStatus(isArchive:boolean, dgAreaId: number, naoPeriodId:number): Promise<string> {
        return super.readString(`?getOverallUpdateStatus=true&dgAreaId=${dgAreaId}&naoPeriodId=${naoPeriodId}&archived=${isArchive}`).then((result:string): string => {
            return result;
        });
    }





}