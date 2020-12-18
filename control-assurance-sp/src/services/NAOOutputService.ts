import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IGoForm, IEntity } from '../types';



export class NAOOutputService extends EntityService<IGoForm> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/NAOOutputs`);
    }



    public readAllReport1(): Promise<IEntity[]> {
        return this.readAll(`?report1=`);
    }

    public createPDF(outputId: number, spSiteUrl): Promise<string> {
        
        return super.readString(`?key=${outputId}&createPdf=&spSiteUrl=${spSiteUrl}`).then((result:string): string => {
            return result;
        });
    }

    public deletePDFInfo(outputId: number): Promise<string> {
        
        return super.readString(`?key=${outputId}&deletePdfInfo=true`).then((result:string): string => {
            return result;
        });
    }


}