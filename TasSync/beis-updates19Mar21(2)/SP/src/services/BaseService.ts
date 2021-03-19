import { HttpClientResponse } from '@microsoft/sp-http';
import { DateService } from './DateService';

export abstract class BaseService<T> {
    protected makeRequest(httpRequest: Promise<HttpClientResponse>): Promise<any | T | T[]> {
        return new Promise<any | T | T[]>((resolve: (data: any | T | T[]) => void, reject: (error: any) => void): void => {
            httpRequest.then((response: HttpClientResponse) => {
                if (response.ok) {
                    return response.json().then((data: any | T | T[]) => {
                        if (response.ok) {
                            resolve(DateService.convertODataDates(data));
                        } else {
                            reject({ response: response, body: data });
                        }
                    }, (error: any) => {
                        if (response.ok) {
                            resolve(null);
                        } else {
                            reject({ response: response, body: null });
                        }
                    });
                } else {
                    if (response.status === 401) {
                        reject({ response: response, message: "Unauthorised" });
                    }
                    else
                        reject({ response: response });
                }
            }, (error: any) => {
                reject(error);
            });
        });
    }
}