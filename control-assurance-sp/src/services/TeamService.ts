import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, ITeam } from '../types';



export class TeamService extends EntityService<ITeam> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/Teams`);
    }
    public readAllExpandAll(): Promise<ITeam[]> {
        return this.readAll(`?$orderby=User/Title&$expand=User,EntityStatusType,Directorate`);
    }

    public readAllOpenTeamsForUser(): Promise<ITeam[]> {
        //reads all teams for current user, just need to send "?user=&openTeams=" with request.
        return this.readAll(`?user=&openTeams=&$orderby=Title`);
    }

    public readAllForUser(): Promise<ITeam[]> {
        return this.readAll(`?currentUser=&$orderby=Title`);
    }

    public readAllByDirectorateId(directorateId: number): Promise<ITeam[]> {
        if(directorateId > 0)
            return this.readAll(`?$filter=DirectorateId eq ${directorateId}&$orderby=Title`);
        else
            return this.readAll(`?$orderby=Title`);
    }

    public readAllByDirectorateId_OR_DirectorateGroupId(directorateId: number, directorateGroupId: number): Promise<ITeam[]> {
        if(directorateId > 0)
            return this.readAll(`?$filter=DirectorateId eq ${directorateId}&$orderby=Title`);
        else if(directorateGroupId > 0)
            return this.readAll(`?getTeamsByDirectorateGroup=true&directorateGroupId=${directorateGroupId}&$orderby=Title`);
        else
            return this.readAll(`?$orderby=Title`);
    }






}