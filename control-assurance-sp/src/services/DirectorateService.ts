import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDirectorate } from '../types';

export class DirectorateService extends EntityService<IDirectorate> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/Directorates`);
    }

    public readAll(): Promise<IDirectorate[]> {
        return super.readAll(`?$orderby=Title`);
    }
    public readAllOpenDirectorates(): Promise<IDirectorate[]> {
        return super.readAll(`?$filter=EntityStatusID eq 1&$orderby=Title`);
    }

    public readAllExpandAll(querystring?: string): Promise<IDirectorate[]> {
        let fullQryString: string;
        if (querystring)
            fullQryString = `${querystring}&$orderby=ID desc&$expand=User,EntityStatusType,DirectorateGroup`;
        else
            fullQryString = `?$orderby=User/Title&$expand=User,EntityStatusType,DirectorateGroup`;
        return super.readAll(fullQryString);
    }

    public readAllForUser(): Promise<IDirectorate[]> {
        return super.readAll(`?currentUser=&$orderby=Title`);
    }
    public readAllByDirectorateGroupId(directorateGroupId: number): Promise<IDirectorate[]> {
        if (directorateGroupId > 0)
            return super.readAll(`?$filter=DirectorateGroupID eq ${directorateGroupId}`);
        else
            return super.readAll(`?$orderby=Title`);
    }
}