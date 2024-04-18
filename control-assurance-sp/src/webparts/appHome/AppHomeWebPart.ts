import * as React from 'react';
import AppHome from './components/AppHome';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class AppHomeWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for App Home';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			AppHome,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


