import * as React from 'react';
import OrgReport from './components/OrgReport';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';
import { sp } from "@pnp/sp";



export default class OrgReportWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for Org Reports';

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
			OrgReport,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


