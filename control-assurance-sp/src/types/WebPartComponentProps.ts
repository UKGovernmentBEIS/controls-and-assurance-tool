import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IDataAPI } from './DataAPI';

export interface IWebPartComponentProps {
    spfxContext: WebPartContext;
    api: IDataAPI;
}