import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { ICLCase, IDataAPI, IEntity, IClCaseInfo, ICLWorker } from '../types';

export class CLCaseService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/CLCases`);
    }

    public readAllWithFilters(caseType: string): Promise<IEntity[]> {
        return this.readAll(`?caseType=${caseType}`);
    }

    public readWithExpand(ID: number): Promise<ICLCase> {
        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("CLHiringMembers");

        return this.read(ID, false, false, entitiesToExpand).then((e: ICLCase): ICLCase => {
            return e;
        });
    }

    public getCaseInfo(clCaseId: number, clWorkerId): Promise<IClCaseInfo> {
        return this.readEntity(`?clCaseId=${clCaseId}&clWorkerId=${clWorkerId}&getInfo=true`);
    }

    public getCaseCounts(): Promise<IEntity> {
        return this.readEntity(`?getCaseCounts=true`);
    }

    public createExtension(existingWorkerId: number): Promise<IEntity> {
        return this.readEntity(`?existingWorkerId=${existingWorkerId}&createExtension=true`);
    }

}