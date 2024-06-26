import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IAutomationOption } from '../types';

export class AutoFunctionLastRunService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/AutoFunctionLastRuns`);
    }

    public getLastRunMsg(stage: string): Promise<string> {
        return super.readString(`?getLastRunMsg=${stage}`).then((result: string): string => {
            return result;
        });
    }
}