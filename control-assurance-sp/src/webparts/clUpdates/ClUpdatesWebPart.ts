import * as React from 'react';
import ClUpdates from './components/ClUpdates';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';
import { sp } from "@pnp/sp";



export default class GiaaUpdatesWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for ClUpdates';

	public onInit(): Promise<void> {

		return super.onInit().then(_ => {

			// other init code may be present
			console.log('on init');

			sp.setup({
				spfxContext: this.context
			});
		});
	}

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			ClUpdates,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


