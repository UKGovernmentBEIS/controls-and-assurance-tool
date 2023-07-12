import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IPlateform } from '../types';



export class PlateformService extends EntityService<IPlateform> {

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/Plateforms`);
    }





}