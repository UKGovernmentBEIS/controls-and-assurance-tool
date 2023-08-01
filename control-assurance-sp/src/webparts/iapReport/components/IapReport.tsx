import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import GenExport from '../../../components/export/GenExport';

//#region types defination

export interface ILookupData {
}

export class LookupData implements ILookupData {
}

export interface IIapReportState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
}

export class IapReportState extends types.UserContextWebPartState implements IIapReportState {
  public LookupData = new LookupData();
  public FilteredItems = [];
  constructor() {
    super();
  }
}

//#endregion types defination

export default class GoUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, IapReportState> {

  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new IapReportState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (
      <React.Fragment>
        <Pivot onLinkClick={this.clearErrors}>
          <PivotItem headerText="Export to Excel" itemKey="Export to Excel">
            {this.renderGenExport()}
          </PivotItem>
        </Pivot>
      </React.Fragment>
    );
  }

  private renderGenExport(): React.ReactElement<types.IWebPartComponentProps> {

    if (this.state.User) {
      return (
        <div>
          <div style={{ paddingTop: "10px" }}>
            <GenExport
              {...this.props}
              onError={this.onError}
              moduleName="IAP"
            />
          </div>
        </div>
      );
    }
    else
      return null;
  }

  //#endregion Render

}


