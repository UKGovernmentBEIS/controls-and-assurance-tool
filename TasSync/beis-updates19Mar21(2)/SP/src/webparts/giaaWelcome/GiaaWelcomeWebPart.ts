import * as React from 'react';
import GiaaWelcome from './components/GiaaWelcome';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class GiaaWelcomeWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for Welcome';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			GiaaWelcome,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


