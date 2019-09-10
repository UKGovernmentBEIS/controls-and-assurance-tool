import { AadHttpClient, HttpClient } from "@microsoft/sp-http";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ContextualMenu } from "office-ui-fabric-react/lib/ContextualMenu";

export interface IDataAPI {
    URL: string;
    AppIdUri: string;
    getConfig() : any;

    // ApiClient: AadHttpClient;
    // createClient: (context: WebPartContext, resourceEndpoint: string) => Promise<AadHttpClient>;

    ApiClient: HttpClient;
    createClient: (context: WebPartContext, resourceEndpoint: string) => Promise<any>;


}

export class DataAPI {

    public URL = null;
    public AppIdUri = null;
    public ApiClient = null;

    //#region commented

        // public createClient(context: WebPartContext, resourceEndpoint: string): Promise<AadHttpClient> {
    //     this.AppIdUri = resourceEndpoint;
    //     return context.aadHttpClientFactory.getClient(resourceEndpoint).then((client: AadHttpClient) => {
    //         this.ApiClient = client;
    //         return client;
    //     });
    // }

    // public createClient(context: WebPartContext, resourceEndpoint: string): Promise<any> {
    //     //console.log("in createClient");
    //     this.AppIdUri = resourceEndpoint;
    //     let client = context.httpClient;
        
    //     this.ApiClient = client;

    //     return new Promise<any>((resolve) =>{
    //         resolve();
    //     });
    // }

    //#endregion commented
    
    public createClient(context: WebPartContext, resourceEndpoint: string): Promise<any> {
        this.AppIdUri = resourceEndpoint;
        
        if(resourceEndpoint == "na"){
            let client = context.httpClient; 
            this.ApiClient = client;
    
            return new Promise<any>((resolve) =>{
                resolve();
            });                
        }
        else{
            return context.aadHttpClientFactory.getClient(resourceEndpoint).then((client: AadHttpClient) => {
                this.ApiClient = client;
                return client;
            });
        }

    }

    public getConfig() : any {
        //return AadHttpClient.configurations.v1;
        return HttpClient.configurations.v1;
    }
}

