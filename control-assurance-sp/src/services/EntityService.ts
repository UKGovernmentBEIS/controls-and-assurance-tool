import { DataService } from './DataService';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IDataAPI } from '../types';
import { DateService } from './DateService';

export class EntityService<T> extends DataService<T> {
    protected entityUrl: string;
    public readonly parentEntities: string[] = [];
    protected childrenEntities: string[] = [];

    constructor(spfxContext: WebPartContext, api: IDataAPI, entityUrl: string) {
        super(spfxContext, api);
        this.entityUrl = `${api.URL}${entityUrl}`;
    }



    public read(id: number, includeParents?: boolean, includeChildren?: boolean, customExpandEntities?: string[]): Promise<T> {
        let entitiesToExpand: string[] = [];
        if (includeParents)
            entitiesToExpand.push(...this.parentEntities);
        if (includeChildren)
            entitiesToExpand.push(...this.childrenEntities);
        if (customExpandEntities)
            entitiesToExpand.push(...customExpandEntities);
        let expand: string = entitiesToExpand.length > 0 ? `?$expand=${entitiesToExpand.join(',')}` : '';
        return this.getEntity(`${this.entityUrl}(${id})${expand}`).then((data: T): T => {
            return data;
        });
    }

    public readHistory(id: number, asOf: Date): Promise<T> {
        return this.getEntity(`${this.entityUrl}History(Id=@p1,AsOf=@p2)?@p1=${id}&@p2=${asOf.toISOString()}`).then((data: any): T => {
            return data;
        });
    }

    public readAllHistory(asOf: Date): Promise<T[]> {
        return this.getEntities(`${this.entityUrl}History(AsOf=@p1)?@p1=${asOf.toISOString()}`).then((data: any): T[] => {
            return data.value;
        });
    }

    public readAll(querystring?: string): Promise<T[]> {
        return this.getEntities(this.entityUrl + (querystring || '?$orderby=ID')).then((data: any): T[] => {
            return data.value;
        });
    }

    //6Nov19 Start - Add
    public readString(querystring?: string): Promise<string> {
        return this.getEntities(this.entityUrl + querystring).then((data: any): string => 
            {return data.value;
        });
    }
    //6Nov19 End

    public readEntity(querystring?: string): Promise<T> {
        return this.getEntity(this.entityUrl + querystring).then((data: any): T => {
            return data;
        });
    }

    public readAllForUser(querystring?: string): Promise<T[]> {
        return this.readAll(querystring);
    }

    public readAllExpandAll(querystring?: string): Promise<T[]> {
        return this.readAll(querystring);
    }
    public readAllWithArgs(arg1?:any, arg2?:any, arg3?:any): Promise<T[]> {
        return this.readAll();
    }

    public create(entity: T): Promise<T> {
        return this.postEntity(entity, this.entityUrl).then((data: T): T => {
            return data;
        });
    }

    public update(entityId: number, entity: Partial<T>): Promise<void> {
        return this.patchEntity(entity, `${this.entityUrl}(${entityId})`);
    }

    public delete(entityId: number): Promise<void> {
        return this.deleteEntity(`${this.entityUrl}(${entityId})`);
    }

    public numberOfChildren(id: number, childEntity?: string): Promise<number> {
        return this.getEntities(`${this.entityUrl}(${id})/${childEntity}?$select=ID`).then((data: any): number => {
            return data.value.length;
        });
    }

    //checks edit delete permission for the current user
    public checkEditDelPermission(key: number) : Promise<boolean>{
        return this.getEntity(`${this.entityUrl}?key=${key}&currentUser=&checkEditDelPermission=true`).then((data: any): boolean => {
            const result : boolean = data.value;
            return result;
        });
    }
}