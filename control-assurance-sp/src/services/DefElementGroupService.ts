import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDefElementGroup } from '../types';



export class DefElementGroupService extends EntityService<IDefElementGroup> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/DefElementGroups`);
    }

    public readAllDefElementGroups(defFormId: number): Promise<IDefElementGroup[]> {
        return this.readAll(`?$filter=DefFormId eq ${defFormId}&$orderby=Sequence`);
    }

    public readAllExpandAll(): Promise<IDefElementGroup[]> {
        return this.readAll(`?$orderby=DefForm/Title&$expand=DefForm`);
    }
    public readAllWithArgs(periodId: number): Promise<IDefElementGroup[]> {
        return this.readAll(`?$filter=PeriodId eq ${periodId}`);
    }



}