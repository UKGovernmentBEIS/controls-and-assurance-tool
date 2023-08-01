import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDefForm, IDirectorateGroupMember } from '../types';

export class DirectorateGroupMemberService extends EntityService<IDirectorateGroupMember> {
    public readonly parentEntities = [];
    protected childrenEntities = [];
    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/DirectorateGroupMembers`);
    }
    public readAllExpandAll(): Promise<IDirectorateGroupMember[]> {
        return this.readAll(`?$orderby=User/Title&$expand=User,DirectorateGroup`);
    }
}