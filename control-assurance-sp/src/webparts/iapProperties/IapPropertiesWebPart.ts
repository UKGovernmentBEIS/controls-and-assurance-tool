import * as React from 'react';
import IapProperties from './components/IapProperties';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class NaoSettingsWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for IapProperties';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			IapProperties,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


