import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity } from '../types';

export class CLGenderService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];
    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/CLGenders`);
    }
}