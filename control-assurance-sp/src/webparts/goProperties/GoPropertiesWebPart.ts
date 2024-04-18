import * as React from 'react';
import GoProperties from './components/GoProperties';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class GoPropertiesWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for GoProperties';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			GoProperties,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


