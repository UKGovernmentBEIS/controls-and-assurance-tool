import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IGIAAAuditReportInfo } from '../types';



export class GIAAAuditReportService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GIAAAuditReports`);
    }

    public readAllWithFilters(dgAreaId: number | string, incompleteOnly: boolean, justMine: boolean, isArchive:boolean): Promise<IEntity[]> {
        return this.readAll(`?dgAreaId=${dgAreaId}&incompleteOnly=${incompleteOnly}&justMine=${justMine}&isArchive=${isArchive}`);
    }

    public getAuditReportInfo(giaaAuditReportId:number): Promise<IGIAAAuditReportInfo> {
        return this.readEntity(`?giaaAuditReportId=${giaaAuditReportId}&getInfo=true`);
    }





}