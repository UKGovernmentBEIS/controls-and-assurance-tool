import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDefForm } from '../types';

export class DefFormService extends EntityService<IDefForm> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/DefForms`);
    }
    public readAllWithArgs(periodId: number): Promise<IDefForm[]> {
        return this.readAll(`?$filter=PeriodId eq ${periodId}`);
    }
}