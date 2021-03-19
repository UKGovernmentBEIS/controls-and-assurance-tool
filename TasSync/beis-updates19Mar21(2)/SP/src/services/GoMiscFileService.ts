import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IGoMiscFile } from '../types';



export class GoMiscFileService extends EntityService<IGoMiscFile> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GoMiscFiles`);
    }

    public readAllExpandAll(): Promise<IGoMiscFile[]> {
        //ne null means not null, cause we only want to get completed uploaded files.
        return this.readAll(`?$orderby=ID&$expand=User&$filter=Title ne null`);
    }

}