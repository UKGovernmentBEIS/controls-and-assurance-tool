import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IGoElement } from '../types';

export class GoElementService extends EntityService<IGoElement> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GoElements`);
    }

    public readWithExpandDefElement(ID: number): Promise<IGoElement> {

        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("GoDefElement");

        return this.read(ID, false, false, entitiesToExpand).then((e: IGoElement): IGoElement => {
            return e;
        });
    }

    public readWithExpandDefElementAndAssignments(ID: number): Promise<IGoElement> {

        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("GoDefElement");
        entitiesToExpand.push("GoAssignments($expand=User)");

        return this.read(ID, false, false, entitiesToExpand).then((e: IGoElement): IGoElement => {
            return e;
        });
    }

}