import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDirectorateStat } from '../types';



export class DirectorateStatService extends EntityService<IDirectorateStat> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/DirectorateStats`);
    }

    public readAllWithArgs(periodId: number, SPDirectorateStat2: boolean): Promise<IDirectorateStat[]> {
        if(SPDirectorateStat2 === true)
            return this.readAll(`?periodId=${periodId}&SPDirectorateStat2=`);
        else
            return this.readAll(`?periodId=${periodId}`);            
    }


}