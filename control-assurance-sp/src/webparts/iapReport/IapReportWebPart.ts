import * as React from 'react';
import IapReport from './components/IapReport';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';
import { sp } from "@pnp/sp";



export default class IapReportWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for IapReport';

	public onInit(): Promise<void> {
		return super.onInit().then(_ => {
			sp.setup({
				spfxContext: this.context
			});
		});
	}

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			IapReport,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


