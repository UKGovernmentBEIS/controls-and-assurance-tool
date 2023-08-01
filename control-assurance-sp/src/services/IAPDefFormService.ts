import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IIAPDefForm } from '../types';

export class IAPDefFormService extends EntityService<IIAPDefForm> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/IAPDefForms`);
    }

    public welcomeAccess(): Promise<string> {
        return super.readString(`?welcomeAccess=`).then((result:string): string => {
            return result;
        });
    }
}