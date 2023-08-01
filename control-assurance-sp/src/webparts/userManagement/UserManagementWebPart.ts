import * as React from 'react';
import UserManagement from './components/UserManagement';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';
import { sp } from "@pnp/sp";



export default class UserManagementWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for user management';

	public onInit(): Promise<void> {
		return super.onInit().then(_ => {
			sp.setup({
				spfxContext: this.context
			});
		});
	}

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


