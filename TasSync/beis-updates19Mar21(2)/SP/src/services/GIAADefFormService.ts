import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IGIAADefForm } from '../types';



export class GIAADefFormService extends EntityService<IGIAADefForm> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GIAADefForms`);
    }

    public welcomeAccess(): Promise<string> {
        return super.readString(`?welcomeAccess=`).then((result:string): string => {
            return result;
        });
    }

    public getTestDateTime(): Promise<IEntity> {
        return this.readEntity(`?getTestDateTime=&p2=`);
    }

}