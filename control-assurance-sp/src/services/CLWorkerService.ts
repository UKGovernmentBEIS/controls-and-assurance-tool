import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, ICLWorker } from '../types';

export class CLWorkerService extends EntityService<ICLWorker> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/CLWorkers`);
    }

    public createSDSPDF(clWorkerId: number, spSiteUrl): Promise<string> {

        return super.readString(`?clWorkerId=${clWorkerId}&createPdf=SDSPdf&spSiteUrl=${spSiteUrl}`).then((result: string): string => {
            return result;
        });
    }

    public createCasePDF(clWorkerId: number, spSiteUrl): Promise<string> {

        return super.readString(`?clWorkerId=${clWorkerId}&createPdf=CasePdf&spSiteUrl=${spSiteUrl}`).then((result: string): string => {
            return result;
        });
    }

    public archive(clWorkerId: number): Promise<string> {

        return super.readString(`?clWorkerId=${clWorkerId}&archive=true`).then((result: string): string => {
            return result;
        });
    }

}