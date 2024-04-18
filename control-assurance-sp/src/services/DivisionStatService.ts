import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDivisionStat } from '../types';

export class DivisionStatService extends EntityService<IDivisionStat> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/DivisionStats`);
    }

    public readAllWithArgs(periodId: number, SPDivisionStat2: boolean): Promise<IDivisionStat[]> {
        if (SPDivisionStat2 === true)
            return this.readAll(`?periodId=${periodId}&SPDivisionStat2=`);
        else
            return this.readAll(`?periodId=${periodId}`);
    }
}