import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
    BaseClientSideWebPart,
    IPropertyPaneConfiguration,
    PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import { IWebPartComponentProps, DataAPI, IDataAPI } from '../types';

export interface IDataAPIWebPartProps {
    appIdUri: string;
    apiUrl: string;
}

export default abstract class DataAPIWebPart extends BaseClientSideWebPart<IDataAPIWebPartProps> {
    protected api: IDataAPI = new DataAPI();
    protected abstract WebPartDescription: string;

    public render(): void {
        if (!this.properties.appIdUri || !this.properties.apiUrl) {
            this.domElement.innerHTML = `<div>Please configure the web part properties.</div>`;
        } else {

            this.api.URL = this.properties.apiUrl;
            this.api.createClient(this.context, this.properties.appIdUri).then(() => {
                ReactDom.render(this.renderWebPart(), this.domElement);
            });
        }
    }

    protected abstract renderWebPart(): React.ReactElement<IWebPartComponentProps>;

    protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
    }

    protected get dataVersion(): Version {
        return Version.parse('1.0');
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages: [
                {
                    header: {
                        description: this.WebPartDescription
                    },
                    groups: [
                        {
                            groupName: 'Settings',
                            groupFields: [
                                PropertyPaneTextField('appIdUri', {
                                    label: 'App ID URI'
                                }),
                                PropertyPaneTextField('apiUrl', {
                                    label: 'API URL'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
