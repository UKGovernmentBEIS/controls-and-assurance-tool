import * as React from 'react';
import Welcome from './components/Welcome';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class WelcomeWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for Welcome';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			Welcome,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


