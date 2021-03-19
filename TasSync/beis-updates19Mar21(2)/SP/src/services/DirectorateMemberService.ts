import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EntityService } from './EntityService';
import { IDataAPI, IDirectorateMember } from '../types';



export class DirectorateMemberService extends EntityService<IDirectorateMember> {
    public readonly parentEntities = [];
    protected childrenEntities = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super(spfxContext, api, `/DirectorateMembers`);
    }

    public readAllExpandAll(): Promise<IDirectorateMember[]> {
        return this.readAll(`?$orderby=User/Title&$expand=User,Directorate`);
    }
}