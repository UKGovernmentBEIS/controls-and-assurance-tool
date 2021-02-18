import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IGIAAAuditReport, IGIAAAuditReportInfo } from '../types';



export class CLCaseService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/CLCases`);
    }

    public readAllWithFilters(): Promise<IEntity[]> {
        return this.readAll(`?caseType=BusinessCases`);
    }

    public readWithExpandDirectorates(ID: number): Promise<IGIAAAuditReport> {
        //const qry:string = `?$expand=GIAAActionOwners($expand=User)`;

        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("GIAAAuditReportDirectorates($expand=Directorate)");

        return this.read(ID, false, false, entitiesToExpand).then((e: IGIAAAuditReport): IGIAAAuditReport => {
            return e;
        });
    }

    public getCaseInfo(clCaseId:number): Promise<IGIAAAuditReportInfo> {
        return this.readEntity(`?clCaseId=${clCaseId}&getInfo=true`);
    }







}