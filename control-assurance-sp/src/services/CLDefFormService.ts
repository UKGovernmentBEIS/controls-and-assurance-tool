import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, ICLDefForm } from '../types';



export class CLDefFormService extends EntityService<ICLDefForm> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/CLDefForms`);
    }

    public welcomeAccess(): Promise<string> {
        return super.readString(`?welcomeAccess=`).then((result:string): string => {
            return result;
        });
    }

    public readDefForm(): Promise<ICLDefForm> {
        //const qry:string = `?$select=EngagedStageFormText`;

        return this.read(1, false, false).then((e: ICLDefForm): ICLDefForm => {
            return e;
        });
    }



}