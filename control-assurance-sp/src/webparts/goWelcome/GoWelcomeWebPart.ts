import * as React from 'react';
import GoWelcome from './components/GoWelcome';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class GoWelcomeWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for Welcome';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			GoWelcome,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


