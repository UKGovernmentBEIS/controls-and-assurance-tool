import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, ICLCaseEvidence } from '../types';



export class CLCaseEvidenceService extends EntityService<ICLCaseEvidence> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/CLCaseEvidences`);
    }

    public readAllByParentId(parentId:number, workerId:number): Promise<IEntity[]> {
        //ne null means not null, cause we only want to get completed uploaded files.
        //return this.readAll(`?$orderby=ID&$expand=User&$filter=ParentId eq ${parentId} and Title ne null and EvidenceType ne 'IR35'`);
        return this.readAll(`?getGeneralEvidencesForList=&parentId=${parentId}&workerId=${workerId}`);
    }

    public readIR35Evidence(parentId:number): Promise<IEntity[]> {
        return this.readAll(`?$orderby=ID&$filter=ParentId eq ${parentId} and EvidenceType eq 'IR35'`);
    }

    public readContractorSecurityCheckEvidence(parentId:number): Promise<IEntity[]> {
        return this.readAll(`?$orderby=ID&$filter=ParentId eq ${parentId} and EvidenceType eq 'ContractorSecurityCheck'`);
    }

}