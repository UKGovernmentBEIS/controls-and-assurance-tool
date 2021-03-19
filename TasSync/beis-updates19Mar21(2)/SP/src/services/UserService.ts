import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDefForm } from '../types';
import { IUser } from '../types/User';



export class UserService extends EntityService<IUser> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/Users`);
    }

    public readMyPermissions(): Promise<IUser> {
        return this.readAll(`?currentUser=&$expand=DirectorateGroups,Directorates,Teams,DirectorateGroupMembers,DirectorateMembers,TeamMembers,UserPermissions`).then((users: IUser[]): IUser => {
            if (users && users.length > 0)
                return users[0];
        });
    }

    //6Nov19 Start - Add
    public firstRequestToAPI(): Promise<string> {
        return super.readString(`?firstRequest=&checkDb=&checkCurrentUser`).then((result:string): string => {
            return result;
        });
    }
    //6Nov19 End
}