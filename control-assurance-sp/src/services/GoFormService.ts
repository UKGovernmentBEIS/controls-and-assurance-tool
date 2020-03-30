import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IGoForm, IEntity } from '../types';



export class GoFormService extends EntityService<IGoForm> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GoForms`);
    }

    public readGoForm(periodId: number, directorateGroupId: number): Promise<IGoForm[]> {
        return this.readAll(`?$filter=PeriodId eq ${periodId} and DirectorateGroupId eq ${directorateGroupId}`);
    }

    public signOffForm(goFormId: number): Promise<string> {
        return super.readString(`?key=${goFormId}&singOffOrUnSignRequest=true&signOffAction=SignOff`).then((result:string): string => {
            return result;
        });
    }
    public unSignForm(goFormId: number): Promise<string> {
        return super.readString(`?key=${goFormId}&singOffOrUnSignRequest=true&signOffAction=UnSign`).then((result:string): string => {
            return result;
        });
    }

    public readAllReport1(periodId: number | string): Promise<IEntity[]> {
        return this.readAll(`?periodId=${periodId}&goFormReport1=`);
    }

    public createPDF(goFormId: number, spSiteUrl): Promise<string> {
        
        return super.readString(`?key=${goFormId}&createPdf=&spSiteUrl=${spSiteUrl}`).then((result:string): string => {
            return result;
        });
    }


}