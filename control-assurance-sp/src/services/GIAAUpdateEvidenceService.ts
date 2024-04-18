import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IGIAAUpdateEvidence } from '../types';

export class GIAAUpdateEvidenceService extends EntityService<IGIAAUpdateEvidence> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GIAAUpdateEvidences`);
    }

    public readAllByGIAAUpdate(giaaUpdateId:number): Promise<IEntity[]> {
        //ne null means not null, cause we only want to get completed uploaded files.
        return this.readAll(`?$orderby=ID&$expand=User&$filter=GIAAUpdateId eq ${giaaUpdateId} and Title ne null `);
    }
}