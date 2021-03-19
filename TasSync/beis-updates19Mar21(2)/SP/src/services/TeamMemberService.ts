import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, ITeamMember } from '../types';



export class TeamMemberService extends EntityService<ITeamMember> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/TeamMembers`);
    }
    public readAllExpandAll(): Promise<ITeamMember[]> {
        return this.readAll(`?$orderby=User/Title&$expand=User,Team`);
    }





}