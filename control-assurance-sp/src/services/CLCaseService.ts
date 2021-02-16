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







}