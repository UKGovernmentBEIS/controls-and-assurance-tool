import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IAutomationOption } from '../types';



export class AutomationOptionService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/AutomationOptions`);
    }

    public processAsAutoFunction(): Promise<string> {
        return super.readString(`?processAsAutoFunction=`).then((result:string): string => {
            return result;
        });
    }

    public processAsAutoFunctionFromOutbox(): Promise<string> {
        return super.readString(`?processAsAutoFunctionFromOutbox=&sendFromOutbox=`).then((result:string): string => {
            return result;
        });
    }



}