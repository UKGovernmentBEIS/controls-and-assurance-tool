import * as React from 'react';
import GiaaReport from './components/GiaaReport';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';
import { sp } from "@pnp/sp";



export default class GiaaReportWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for GiaaReport';

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
			GiaaReport,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


