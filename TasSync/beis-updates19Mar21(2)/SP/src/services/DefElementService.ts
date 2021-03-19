import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDefElement, IEntity } from '../types';



export class DefElementService extends EntityService<IDefElement> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/DefElements`);
    }

    public readAllDefElement(defElementGroupId: number): Promise<IDefElement[]> {
        return this.readAll(`?$filter=DefElementGroupId eq ${defElementGroupId}`);
    }

    public readAllWithArgs(periodId: number): Promise<IDefElement[]> {
        return this.readAll(`?$filter=PeriodId eq ${periodId}`);
    }

    public readAllForList(periodId: number | string, formId: number): Promise<IEntity[]> {
        return this.readAll(`?periodId=${periodId}&formId=${formId}`);
    }



}