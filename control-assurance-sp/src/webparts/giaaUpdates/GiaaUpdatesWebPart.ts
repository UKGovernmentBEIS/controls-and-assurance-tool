import * as React from 'react';
import GiaaUpdates from './components/GiaaUpdates';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';
import { sp } from "@pnp/sp";



export default class GiaaUpdatesWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for GiaaUpdates';

	public onInit(): Promise<void> {
		return super.onInit().then(_ => {
			sp.setup({
				spfxContext: this.context
			});
		});
	}

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			GiaaUpdates,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


