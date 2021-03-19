import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity } from '../types';



export class AvailableExportService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/AvailableExports`);
    }



    public readAllByModule(moduleName: string): Promise<IEntity[]> {
        return this.readAll(`?$filter=Module eq '${moduleName}'`);
    }

    // public createPDF(outputId: number, spSiteUrl): Promise<string> {
        
    //     return super.readString(`?key=${outputId}&createPdf=&spSiteUrl=${spSiteUrl}`).then((result:string): string => {
    //         return result;
    //     });
    // }

    // public deletePDFInfo(outputId: number): Promise<string> {
        
    //     return super.readString(`?key=${outputId}&deletePdfInfo=true`).then((result:string): string => {
    //         return result;
    //     });
    // }


}