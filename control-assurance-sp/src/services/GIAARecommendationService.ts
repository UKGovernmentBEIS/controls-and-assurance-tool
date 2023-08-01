import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IGIAARecommendation } from '../types';

export class GIAARecommendationService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/GIAARecommendations`);
    }

    public readAllWithFilters(giaaAuditReportId: number | string, incompleteOnly: boolean, justMine: boolean, actionStatusTypeId:number): Promise<IEntity[]> {
        return this.readAll(`?giaaAuditReportId=${giaaAuditReportId}&incompleteOnly=${incompleteOnly}&justMine=${justMine}&actionStatusTypeId=${actionStatusTypeId}`);
    }

    public readWithExpandActionOwners(ID: number): Promise<IGIAARecommendation> {

        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("GIAAActionOwners($expand=User)");

        return this.read(ID, false, false, entitiesToExpand).then((e: IGIAARecommendation): IGIAARecommendation => {
            return e;
        });
    }

    public getRecInfo(giaaRecommendationId: number): Promise<IGIAARecommendation> {

        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("GIAAAuditReport");

        return this.read(giaaRecommendationId, false, false, entitiesToExpand).then((e: IGIAARecommendation): IGIAARecommendation => {
            return e;
        });
    }

    public updateGiaaUpdateAfterEditRec(giaaRecommendationId:number, giaaPeriodId:number): Promise<string> {
        return super.readString(`?giaaRecommendationId=${giaaRecommendationId}&giaaPeriodId=${giaaPeriodId}&updateGiaaUpdateOnEditRec=`).then((result:string): string => {
            return result;
        });
    }
}