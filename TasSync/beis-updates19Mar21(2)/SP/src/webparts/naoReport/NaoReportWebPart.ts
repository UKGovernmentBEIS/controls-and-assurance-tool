import * as React from 'react';
import NaoReport from './components/NaoReport';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';
import { sp } from "@pnp/sp";



export default class NaoReportWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for NaoReport';

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
			NaoReport,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


