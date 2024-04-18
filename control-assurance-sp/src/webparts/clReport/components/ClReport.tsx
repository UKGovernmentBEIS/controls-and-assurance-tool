import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import GenExport from '../../../components/export/GenExport';
import { IUserPermission } from '../../../types';

//#region types defination

export interface ILookupData {
}

export class LookupData implements ILookupData {
}

export interface IClReportState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
}
export class ClReportState extends types.UserContextWebPartState implements IClReportState {
  public LookupData = new LookupData();
  public FilteredItems = [];
  constructor() {
    super();
  }
}

//#endregion types defination

export default class GoUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, ClReportState> {
  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new ClReportState();
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
      const isSuperUserPermission = this.isSuperUser();
      console.log('isSuperUserPermission', isSuperUserPermission);
      return (
        <div>
          <div style={{ paddingTop: "10px" }}>
            {(isSuperUserPermission === true) &&
              <GenExport
                {...this.props}
                onError={this.onError}
                moduleName="CL"
              />
            }
            {
              (isSuperUserPermission === false) &&
              <div style={{ fontSize: '14px', color: 'navy', fontStyle: 'italic', paddingTop: '8px', paddingLeft: '5px' }}>
                Export to Excel function is only available to the Super User.
              </div>
            }
          </div>
        </div>
      );
    }
    else
      return null;
  }

  //#endregion Render

  //#region Permissions

  private isSuperUser(): boolean {
    //super user/SysManager check
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 13) {
        //super user
        return true;
      }
    }

    return false;
  }
  //#endregion Permissions
}


