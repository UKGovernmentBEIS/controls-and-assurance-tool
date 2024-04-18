import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, INAOUpdateEvidence } from '../types';

export class NAOUpdateEvidenceService extends EntityService<INAOUpdateEvidence> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/NAOUpdateEvidences`);
    }

    public readAllByNAOUpdate(naoUpdateId:number): Promise<IEntity[]> {
        //ne null means not null, cause we only want to get completed uploaded files.
        return this.readAll(`?$orderby=ID&$expand=User&$filter=NAOUpdateId eq ${naoUpdateId} and Title ne null `);
    }
}