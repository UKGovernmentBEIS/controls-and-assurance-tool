import { AadHttpClient, HttpClient } from "@microsoft/sp-http";
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IDataAPI {
    URL: string;
    AppIdUri: string;
    getConfig(): any;
    ApiClient: HttpClient;
    createClient: (context: WebPartContext, resourceEndpoint: string) => Promise<any>;
}

export class DataAPI {
    public URL = null;
    public AppIdUri = null;
    public ApiClient = null;

    public createClient(context: WebPartContext, resourceEndpoint: string): Promise<any> {
        this.AppIdUri = resourceEndpoint;

        if (resourceEndpoint == "na") {
            let client = context.httpClient;
            this.ApiClient = client;
            return new Promise<void>((resolve) => {
                resolve();
            });
        }
        else {
            return context.aadHttpClientFactory.getClient(resourceEndpoint).then((client: AadHttpClient) => {
                this.ApiClient = client;
                return client;
            });
        }
    }

    public getConfig(): any {
        return HttpClient.configurations.v1;
    }
}

