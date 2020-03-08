import { BaseService } from './BaseService';
import { WebPartContext } from '@microsoft/sp-webpart-base';
//import { AadHttpClient, HttpClient } from '@microsoft/sp-http';
import { IDataAPI } from '../types';


export abstract class DataService<T> extends BaseService<T> {
    protected Api: IDataAPI;
    protected spfxContext: WebPartContext;

    constructor(spfxContext: WebPartContext, api: IDataAPI) {
        super();
        this.Api = api;
        this.spfxContext = spfxContext;
    }

    // private getConfig(){
    //     //return AadHttpClient.configurations.v1;
    //     //return HttpClient.configurations.v1;
    //     //return getConfig();
    //     return this.Api.getConfig();
    // }
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
        //const opt: ISPHttpClientOptions = { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entity) };
        //this.context.spHttpClient.post('', SPHttpClient.configurations.v1, opt);
        //let request = this.Api.ApiClient.post(url, HttpClient.configurations.v1, opt);
        

        let request = this.Api.ApiClient.post(url, this.Api.getConfig(), { headers: requestHeaders, body: JSON.stringify(entity) });
        return this.makeRequest(request).then((data: T): T => {
            return data;
        });
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