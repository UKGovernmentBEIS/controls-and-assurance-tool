import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity } from '../types';



export class NAOUpdateFeedbackService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/NAOUpdateFeedbacks`);
    }

    public readAllWithArgs(naoUpdateId: number): Promise<IEntity[]> {
        return this.readAll(`?$filter=NAOUpdateId eq ${naoUpdateId}&$expand=User,NAOUpdateFeedbackType`);
    }


}