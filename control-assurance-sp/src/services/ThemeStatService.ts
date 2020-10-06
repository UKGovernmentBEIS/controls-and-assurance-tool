import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IEntity, IDirectorateGroupMember } from '../types';


export class ThemeStatService extends EntityService<IEntity> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/ThemeStats`);
    }

    public readAllWithOrgFilters(teamId:number, directorateId:number, directorateGroupId:number, periodId:number): Promise<IEntity[]> {
        return this.readAll(`?teamId=${teamId}&directorateId=${directorateId}&directorateGroupId=${directorateGroupId}&periodId=${periodId}`);
    }

    public readAllWithOrgFilters2(teamId:number, directorateId:number, directorateGroupId:number, periodId:number): Promise<IEntity[]> {
        return this.readAll(`?teamId=${teamId}&directorateId=${directorateId}&directorateGroupId=${directorateGroupId}&periodId=${periodId}&ThemeStat2=`);
    }


}