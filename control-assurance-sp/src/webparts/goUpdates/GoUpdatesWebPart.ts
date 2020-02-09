import * as React from 'react';
import GoUpdates from './components/GoUpdates';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class GoUpdatesWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for GoUpdates';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			GoUpdates,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


