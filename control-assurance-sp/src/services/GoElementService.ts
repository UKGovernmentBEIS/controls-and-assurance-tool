import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IGoElement } from '../types';



export class GoElementService extends EntityService<IGoElement> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GoElements`);
    }

    public readWithExpandDefElement(ID: number): Promise<IGoElement> {
        //const qry:string = `?$expand=GoDefElement`;

        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("GoDefElement");

        return this.read(ID, false, false, entitiesToExpand).then((e: IGoElement): IGoElement => {
            return e;
        });
    }



}