import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDGAreaStat } from '../types';

export class DGAreaStatService extends EntityService<IDGAreaStat> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/DGAreaStats`);
    }

    public readAllWithArgs(periodId: number, SPDGAreaStat2:boolean): Promise<IDGAreaStat[]> {
        if(SPDGAreaStat2 === true)
            return this.readAll(`?periodId=${periodId}&SPDGAreaStat2=`);
        else
            return this.readAll(`?periodId=${periodId}`);
    }

}