import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IElement } from '../types';



export class ElementService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/Elements`);
    }

    public readElement(formId: number, defElementId: number): Promise<IElement[]> {
        return this.readAll(`?$filter=FormId eq ${formId} and DefElementId eq ${defElementId}`);
    }

    public readLastPeriodElement(periodId: number, teamId: number, formId:number, defElementId:number, defElementTitle: string): Promise<IElement> {
        return this.readEntity(`?periodId=${periodId}&teamId=${teamId}&formId=${formId}&defElementId=${defElementId}&defElementTitle=${defElementTitle}&getFromLastPeriod=`);


    }




}