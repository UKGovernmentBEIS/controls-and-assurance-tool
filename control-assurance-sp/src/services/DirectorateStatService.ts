import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDirectorateStat } from '../types';



export class DirectorateStatService extends EntityService<IDirectorateStat> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/DirectorateStats`);
    }

    public readAllWithArgs(periodId: number): Promise<IDirectorateStat[]> {
        return this.readAll(`?periodId=${periodId}`);
    }
}