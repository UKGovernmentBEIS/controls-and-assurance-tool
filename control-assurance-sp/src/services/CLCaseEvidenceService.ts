import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, ICLCaseEvidence } from '../types';

export class CLCaseEvidenceService extends EntityService<ICLCaseEvidence> {
    public readonly parentEntities = [];
    protected childrenEntities = [];
    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/CLCaseEvidences`);
    }

    public readAllByParentId(parentId: number, workerId: number): Promise<IEntity[]> {
        return this.readAll(`?getGeneralEvidencesForList=&parentId=${parentId}&workerId=${workerId}`);
    }

    public readIR35Evidence(parentId: number): Promise<IEntity[]> {
        return this.readAll(`?$orderby=ID&$filter=ParentId eq ${parentId} and EvidenceType eq 'IR35' and RecordCreated eq true`);
    }

    public readContractorSecurityCheckEvidence(parentId: number): Promise<IEntity[]> {
        return this.readAll(`?$orderby=ID&$filter=ParentId eq ${parentId} and EvidenceType eq 'ContractorSecurityCheck' and RecordCreated eq true`);
    }

}