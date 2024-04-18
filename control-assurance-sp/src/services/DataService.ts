import { BaseService } from './BaseService';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IDataAPI } from '../types';

export abstract class DataService<T> extends BaseService<T> {
    protected Api: IDataAPI;
    protected spfxContext: WebPartContext;

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super();
        this.Api = api;
        this.spfxContext = spfxContext;
    }

    protected getEntity(url: string): Promise<T> {
        let request = this.Api.ApiClient.get(url, this.Api.getConfig());
        return this.makeRequest(request).then((data: T): T => {
            return data;
        });
    }

    protected getEntities(url: string): Promise<T[]> {
        let request = this.Api.ApiClient.get(url, this.Api.getConfig());
        return this.makeRequest(request).then((data: T[]): T[] => {
            return data;
        });
    }

    protected postEntity(entity: T, url: string): Promise<T> {
        let requestHeaders: Headers = new Headers();
        requestHeaders.append("Content-Type", "application/json");
        //https://github.com/SharePoint/sp-dev-docs/issues/502

        let request = this.Api.ApiClient.post(url, this.Api.getConfig(), { headers: requestHeaders, body: JSON.stringify(entity) });
        return this.makeRequest(request).then((data: T): T => {
            return data;
        });
    }

    protected putEntity(entity: T, url: string): Promise<void> {
        let requestHeaders: Headers = new Headers();
        requestHeaders.append("Content-Type", "application/json");
        return this.makeRequest(this.Api.ApiClient.fetch(url, this.Api.getConfig(), { method: 'PUT', headers: requestHeaders, body: JSON.stringify(entity) }));
    }

    protected patchEntity(entity: Partial<T>, url: string): Promise<void> {
        let requestHeaders: Headers = new Headers();
        requestHeaders.append("Content-Type", "application/json");
        return this.makeRequest(this.Api.ApiClient.fetch(url, this.Api.getConfig(), { method: 'PATCH', headers: requestHeaders, body: JSON.stringify(entity) }));
    }

    protected deleteEntity(url: string): Promise<void> {
        return this.makeRequest(this.Api.ApiClient.fetch(url, this.Api.getConfig(), { method: 'DELETE' }));
    }
}