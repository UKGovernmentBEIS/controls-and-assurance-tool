import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IGoElementEvidence } from '../types';

export class GoElementEvidenceService extends EntityService<IGoElementEvidence> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GoElementEvidences`);
    }

    public readAllByElement(goElementId:number): Promise<IEntity[]> {
        //ne null means not null, cause we only want to get completed uploaded files.
        return this.readAll(`?$orderby=ID&$expand=User&$filter=GoElementId eq ${goElementId} and Title ne null `);
    }
}