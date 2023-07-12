import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IPlatform } from '../types';



export class PlatformService extends EntityService<IPlatform> {

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/Platforms`);
    }





}