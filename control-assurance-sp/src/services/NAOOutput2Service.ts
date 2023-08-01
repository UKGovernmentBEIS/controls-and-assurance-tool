import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity } from '../types';

export class NAOOutput2Service extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/NAOOutput2`);
    }

    public createPDF(publicationIds: string, spSiteUrl): Promise<string> {
        
        return super.readString(`?publicationIds=${publicationIds}&createPdf=&spSiteUrl=${spSiteUrl}`).then((result:string): string => {
            return result;
        });
    }

    public getPDFStatus(): Promise<string> {
        
        return super.readString(`?getPDFStatus=`).then((result:string): string => {
            return result;
        });
    }

    public deletePDFInfo(): Promise<string> {
        
        return super.readString(`?deletePdfInfo=true`).then((result:string): string => {
            return result;
        });
    }
}