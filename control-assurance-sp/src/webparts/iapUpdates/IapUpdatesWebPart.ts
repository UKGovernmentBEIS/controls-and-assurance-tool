import * as React from 'react';
import IapUpdates from './components/IapUpdates';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';
import { sp } from "@pnp/sp";



export default class IapUpdatesWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for IapUpdates';

	public onInit(): Promise<void> {
		return super.onInit().then(_ => {
			sp.setup({
				spfxContext: this.context
			});
		});
	}

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			IapUpdates,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


