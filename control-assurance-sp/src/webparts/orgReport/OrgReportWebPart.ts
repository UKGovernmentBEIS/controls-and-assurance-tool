import * as React from 'react';
import OrgReport from './components/OrgReport';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class OrgReportWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for Org Reports';

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


