import * as React from 'react';
import AppSettings from './components/AppSettings';
import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';



export default class AppSettingsWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for AppSettings';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			AppSettings,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}


