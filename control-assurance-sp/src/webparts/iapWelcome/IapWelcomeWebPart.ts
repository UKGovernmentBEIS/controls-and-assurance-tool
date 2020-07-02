import * as React from 'react';
import IapWelcome from './components/IapWelcome';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class IapWelcomeWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for Welcome';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			IapWelcome,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


