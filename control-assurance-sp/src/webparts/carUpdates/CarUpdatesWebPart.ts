import * as React from 'react';
// import * as ReactDom from 'react-dom';
// import { Version } from '@microsoft/sp-core-library';
// import {
//   BaseClientSideWebPart,
//   IPropertyPaneConfiguration,
//   PropertyPaneTextField
// } from '@microsoft/sp-webpart-base';

// import * as strings from 'CarUpdatesWebPartStrings';
import CarUpdates from './components/CarUpdates';
// import { ICarUpdatesProps } from './components/ICarUpdatesProps';

import { IWebPartComponentProps } from '../../types';
import DataAPIWebPart from '../DataAPIWebPart';

// export interface ICarUpdatesWebPartProps {
//   description: string;
// }

export default class CarUpdatesWebPart extends DataAPIWebPart {
	protected WebPartDescription = 'Web part for adding and editing progress updates';

	protected renderWebPart(): React.ReactElement<IWebPartComponentProps> {
		return React.createElement(
			CarUpdates,
			{
				spfxContext: this.context,
				api: this.api
			}
		);
	}
}

// export default class CarUpdatesWebPart extends BaseClientSideWebPart<ICarUpdatesWebPartProps> {

//   public render(): void {
//     const element: React.ReactElement<ICarUpdatesProps > = React.createElement(
//       CarUpdates,
//       {
//         description: this.properties.description
//       }
//     );

//     ReactDom.render(element, this.domElement);
//   }

//   protected onDispose(): void {
//     ReactDom.unmountComponentAtNode(this.domElement);
//   }

//   protected get dataVersion(): Version {
//     return Version.parse('1.0');
//   }

//   protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
//     return {
//       pages: [
//         {
//           header: {
//             description: strings.PropertyPaneDescription
//           },
//           groups: [
//             {
//               groupName: strings.BasicGroupName,
//               groupFields: [
//                 PropertyPaneTextField('description', {
//                   label: strings.DescriptionFieldLabel
//                 })
//               ]
//             }
//           ]
//         }
//       ]
//     };
//   }
// }
