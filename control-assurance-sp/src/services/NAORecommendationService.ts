import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, INAORecommendation } from '../types';



export class NAORecommendationService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/NAORecommendations`);
    }

    public readAllWithFilters(naoPublicationId: number | string, naoPeriodId: number | string, incompleteOnly: boolean, justMine: boolean): Promise<IEntity[]> {
        return this.readAll(`?naoPublicationId=${naoPublicationId}&naoPeriodId=${naoPeriodId}&incompleteOnly=${incompleteOnly}&justMine=${justMine}`);
    }






    
    public readWithExpandAssignments(ID: number): Promise<INAORecommendation> {
        //const qry:string = `?$expand=NAOAssignments($expand=User)`;

        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("NAOAssignments($expand=User)");

        return this.read(ID, false, false, entitiesToExpand).then((e: INAORecommendation): INAORecommendation => {
            return e;
        });
    }
    public readWithExpand(ID: number, naoPeriodId: number | string): Promise<INAORecommendation> {
        //const qry:string = `?$expand=NAOAssignments($expand=User),NAOUpdates($filter=NAOPeriodId eq 2)`;

        let entitiesToExpand: string[] = [];
        entitiesToExpand.push("NAOAssignments($expand=User)");
        entitiesToExpand.push(`NAOUpdates($filter=NAOPeriodId eq ${naoPeriodId})`);

        return this.read(ID, false, false, entitiesToExpand).then((e: INAORecommendation): INAORecommendation => {
            return e;
        });
    }

    public updateTargetDateAndRecStatus(naoRecommendationId:number, naoPeriodId:number|string, targetDate:string, naoRecStatusTypeId:number): Promise<string> {
        //?updateTargetDateAndRecStatus=&naoRecommendationId=1&naoPeriodId=2&targetDate=aug&naoRecStatusTypeId=1
        return super.readString(`?updateTargetDateAndRecStatus=&naoRecommendationId=${naoRecommendationId}&naoPeriodId=${naoPeriodId}&targetDate=${targetDate}&naoRecStatusTypeId=${naoRecStatusTypeId}`).then((result:string): string => {
            return result;
        });
    }





}