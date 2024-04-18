import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IGIAAImportInfo, IEntity } from '../types';

export class GIAAImportService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GIAAImports`);
    }

    public getImportInfo(): Promise<IGIAAImportInfo> {
        return this.readEntity(`?getInfo=true`);
    }

}