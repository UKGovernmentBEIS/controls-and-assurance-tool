import * as React from 'react';
import OrgManagement from './components/OrgManagement';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class OrgManagementWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for org management';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			OrgManagement,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


