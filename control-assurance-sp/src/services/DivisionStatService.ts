import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDivisionStat } from '../types';



export class DivisionStatService extends EntityService<IDivisionStat> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/DivisionStats`);
    }

    public readAllWithArgs(periodId: number): Promise<IDivisionStat[]> {
        return this.readAll(`?periodId=${periodId}`);
    }
}