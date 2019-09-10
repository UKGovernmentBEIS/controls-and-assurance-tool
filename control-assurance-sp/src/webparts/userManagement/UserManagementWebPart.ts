import * as React from 'react';
import UserManagement from './components/UserManagement';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class UserManagementWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for user management';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			UserManagement,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


