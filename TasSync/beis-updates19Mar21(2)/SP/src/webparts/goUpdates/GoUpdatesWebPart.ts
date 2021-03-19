import * as React from 'react';
import GoUpdates from './components/GoUpdates';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';
import { sp } from "@pnp/sp";



export default class GoUpdatesWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for GoUpdates';

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
			GoUpdates,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


