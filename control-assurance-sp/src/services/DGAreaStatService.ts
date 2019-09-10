import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDGAreaStat } from '../types';



export class DGAreaStatService extends EntityService<IDGAreaStat> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/DGAreaStats`);
    }

    public readAllWithArgs(periodId: number): Promise<IDGAreaStat[]> {
        return this.readAll(`?periodId=${periodId}`);
    }
}