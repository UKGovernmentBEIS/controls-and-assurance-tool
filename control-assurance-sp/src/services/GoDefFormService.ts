import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IGoDefForm } from '../types';



export class GoDefFormService extends EntityService<IGoDefForm> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        
        super(spfxContext, api, `/GoDefForms`);
        let date: Date = new Date();
        console.log(date + " GoDefFormService - Constructor - After super");
    }

}