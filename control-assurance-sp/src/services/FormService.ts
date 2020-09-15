import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity } from '../types';



export class FormService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/Forms`);
    }

    public readFormUpdateStatus(periodId: number, formId:number): Promise<string> {
        return super.readString(`?getFormUpdateStatus=true&periodId=${periodId}&formId=${formId}`).then((result:string): string => {
            return result;
        });
    }



}