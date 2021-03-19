import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity } from '../types';



export class GoDefElementService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GoDefElements`);
    }

    public readAllWithFilters(goFormId: number | string, incompleteOnly: boolean, justMine: boolean): Promise<IEntity[]> {
        return this.readAll(`?goFormId=${goFormId}&incompleteOnly=${incompleteOnly}&justMine=${justMine}`);
    }

}