import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, INAODefForm } from '../types';

export class NAODefFormService extends EntityService<INAODefForm> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/NAODefForms`);
    }

    public welcomeAccess(): Promise<string> {
        return super.readString(`?welcomeAccess=`).then((result:string): string => {
            return result;
        });
    }
}