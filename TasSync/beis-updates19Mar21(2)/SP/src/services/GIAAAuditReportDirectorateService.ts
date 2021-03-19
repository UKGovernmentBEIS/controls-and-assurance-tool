import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IGIAAAuditReportDirectorate } from '../types';
import { baseElementEvents } from 'office-ui-fabric-react/lib/Utilities';



export class GIAAAuditReportDirectorateService extends EntityService<IGIAAAuditReportDirectorate> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GIAAAuditReportDirectorates`);
    }



}