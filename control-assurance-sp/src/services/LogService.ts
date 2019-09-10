import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, ILog } from '../types';



export class LogService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/Logs`);
    }

    public readAllExpandAll(querystring?: string): Promise<ILog[]> {
        let fullQryString: string;
        if(querystring)
            fullQryString = `${querystring}&$orderby=ID desc&$expand=User,Team,Period`;
        else
            fullQryString = `?$orderby=ID desc&$expand=User,Team,Period`;
        return this.readAll(fullQryString);
    }





}