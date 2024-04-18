import * as React from 'react';
import NaoSettings from './components/NaoSettings';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class NaoSettingsWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for NaoSettings';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			NaoSettings,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


