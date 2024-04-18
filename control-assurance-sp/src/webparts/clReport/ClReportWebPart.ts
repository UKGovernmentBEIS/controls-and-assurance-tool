import * as React from 'react';
import ClReport from './components/ClReport';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';
import { sp } from "@pnp/sp";



export default class GiaaReportWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for CLReport';

	public onInit(): Promise<void> {
		return super.onInit().then(_ => {
			sp.setup({
				spfxContext: this.context
			});
		});
	}

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			ClReport,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


