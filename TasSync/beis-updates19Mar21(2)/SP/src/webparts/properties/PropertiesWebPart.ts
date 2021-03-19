import * as React from 'react';
import Properties from './components/Properties';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class PropertiesWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for properties';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			Properties,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


