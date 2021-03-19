import * as React from 'react';
import NaoWelcome from './components/NaoWelcome';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class NAOWelcomeWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for Welcome';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			NaoWelcome,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


