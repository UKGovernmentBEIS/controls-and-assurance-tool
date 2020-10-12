import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity } from '../types';



export class ExportDefinationService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/ExportDefinations`);
    }



    public readAllByModule(moduleName: string): Promise<IEntity[]> {
        return this.readAll(`?$filter=Module eq '${moduleName}'`);
    }

    public createExport(outputId: number, periodId:number, dgAreaId:number, periodTitle:string, dgAreaTitle:string, spSiteUrl): Promise<string> {
        
        return super.readString(`?key=${outputId}&periodId=${periodId}&dgAreaId=${dgAreaId}&periodTitle=${periodTitle}&dgAreaTitle=${dgAreaTitle}&createExport=&spSiteUrl=${spSiteUrl}`).then((result:string): string => {
            return result;
        });
    }

    // public deletePDFInfo(outputId: number): Promise<string> {
        
    //     return super.readString(`?key=${outputId}&deletePdfInfo=true`).then((result:string): string => {
    //         return result;
    //     });
    // }


}