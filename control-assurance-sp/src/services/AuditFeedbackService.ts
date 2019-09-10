import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity } from '../types';



export class AuditFeedbackService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/AuditFeedbacks`);
    }

    public readAllExpandAll(): Promise<IEntity[]> {
        return this.readAll(`?$orderby=ID desc&$expand=User,Period,Team`);
    }





}