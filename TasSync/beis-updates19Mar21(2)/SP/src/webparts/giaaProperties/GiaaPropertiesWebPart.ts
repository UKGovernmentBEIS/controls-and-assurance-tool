import * as React from 'react';
import GiaaProperties from './components/GiaaProperties';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class NaoSettingsWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for GiaaProperties';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			GiaaProperties,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


