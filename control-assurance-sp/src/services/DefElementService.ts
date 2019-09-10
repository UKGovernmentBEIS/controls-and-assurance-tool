import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDefElement } from '../types';



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



}