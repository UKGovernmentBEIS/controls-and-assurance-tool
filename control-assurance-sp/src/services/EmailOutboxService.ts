import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, INAOPublication, INAOPublicationInfo } from '../types';

export class EmailOutboxService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/EmailOutboxes`);
    }

    public deleteItems(itemIds: string): Promise<string> {

        return super.readString(`?itemIds=${itemIds}`).then((result: string): string => {
            return result;
        });
    }
}