import * as React from 'react';
import ClProperties from './components/ClProperties';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class NaoSettingsWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for CLProperties';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			ClProperties,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


