import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, ICLWorker } from '../types';



export class CLWorkerService extends EntityService<ICLWorker> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/CLWorkers`);
    }

    public createSDSPDF(clWorkerId: number, spSiteUrl): Promise<string> {
        
        return super.readString(`?clWorkerId=${clWorkerId}&createPdf=&spSiteUrl=${spSiteUrl}`).then((result:string): string => {
            return result;
        });
    }




}