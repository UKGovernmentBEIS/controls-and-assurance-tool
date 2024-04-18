import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, ICLHiringMember } from '../types';

export class CLHiringMemberService extends EntityService<ICLHiringMember> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/CLHiringMembers`);
    }
}