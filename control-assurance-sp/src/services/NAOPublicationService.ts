import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, INAOPublicationInfo } from '../types';



export class NAOPublicationService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/NAOPublications`);
    }

    public readAllWithFilters(naoPeriodId: number | string, dgAreaId: number | string, incompleteOnly: boolean, justMine: boolean): Promise<IEntity[]> {
        return this.readAll(`?naoPeriodId=${naoPeriodId}&dgAreaId=${dgAreaId}&incompleteOnly=${incompleteOnly}&justMine=${justMine}`);
    }

    public getPublicationInfo(naoPublicationId:number): Promise<INAOPublicationInfo> {
        return this.readEntity(`?naoPublicationId=${naoPublicationId}&getInfo=true`);
    }





}