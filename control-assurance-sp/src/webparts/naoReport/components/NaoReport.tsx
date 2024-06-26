import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import Report1List from '../../../components/naoReport/Report1List';
import Report2List from '../../../components/naoReport/Report2List';
import GenExport from '../../../components/export/GenExport';
import * as services from '../../../services';
import { IUserPermission } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';

//#region types defination

export interface ILookupData {
}

export class LookupData implements ILookupData {
}

export interface INaoReportState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
  Report1_ListFilterText: string;
  Report2_ListFilterText: string;
}
export class NaoReportState extends types.UserContextWebPartState implements INaoReportState {
  public LookupData = new LookupData();
  public Report1_ListFilterText: string = null;
  public Report2_ListFilterText: string = null;

  public FilteredItems = [];
  constructor() {
    super();
  }
}

//#endregion types defination

export default class GoUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, NaoReportState> {

  protected periodService: services.NAOPeriodService = new services.NAOPeriodService(this.props.spfxContext, this.props.api);

  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new NaoReportState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (
      <React.Fragment>
        <Pivot onLinkClick={this.clearErrors}>
          <PivotItem headerText="Output PDF by DG Areas">
            {this.renderReport1()}
          </PivotItem>
          <PivotItem headerText="Output PDF by Publication">
            {this.renderReport2()}
          </PivotItem>
          <PivotItem headerText="Export to Excel" itemKey="Export to Excel">
            {this.renderGenExport()}
          </PivotItem>
        </Pivot>
      </React.Fragment>
    );
  }

  private renderReport1(): React.ReactElement<types.IWebPartComponentProps> {
    if (this.state.User) {
      const canAccessNAOReports = this.canAccessNAOReports();
      console.log('canAccessNAOReports', canAccessNAOReports);

      return (
        <div>
          <CrLoadingOverlayWelcome isLoading={this.state.Loading} />
          <div style={{ paddingTop: "10px" }}>
            {(canAccessNAOReports === true) &&
              <Report1List
                {...this.props}
                onError={this.onError}
                filterText={this.state.Report1_ListFilterText}
                onChangeFilterText={this.handleReport1_ChangeFilterText}
              />
            }
            {
              (canAccessNAOReports === false) &&
              <div style={{ fontSize: '14px', color: 'navy', fontStyle: 'italic', paddingTop: '8px', paddingLeft: '5px' }}>
                You do not have permission to access this function.
              </div>
            }
          </div>
        </div>
      );
    }
    else
      return null;

  }

  private renderReport2(): React.ReactElement<types.IWebPartComponentProps> {
    if (this.state.User) {
      const canAccessNAOReports = this.canAccessNAOReports();
      console.log('canAccessNAOReports', canAccessNAOReports);

      return (
        <div>
          <CrLoadingOverlayWelcome isLoading={this.state.Loading} />
          <div style={{ paddingTop: "10px" }}>

            {(canAccessNAOReports === true) &&
              <Report2List
                {...this.props}
                onError={this.onError}
                filterText={this.state.Report2_ListFilterText}
                onChangeFilterText={this.handleReport2_ChangeFilterText}
              />
            }
            {
              (canAccessNAOReports === false) &&
              <div style={{ fontSize: '14px', color: 'navy', fontStyle: 'italic', paddingTop: '8px', paddingLeft: '5px' }}>
                You do not have permission to access this function.
              </div>
            }
          </div>
        </div>
      );
    }
    else
      return null;

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
                moduleName="NAO"
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


  //#region Data Load

  protected loadLookups(): Promise<any> {

    return Promise.all([
    ]);
  }

  //#endregion Data Load

  //#region Permissions

  private isSuperUser(): boolean {
    //super user/SysManager check
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 8) {
        //super user or sys manager
        return true;
      }
    }

    return false;
  }

  private canAccessNAOReports(): boolean {
    //super user/SysManager check
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 8 || up.PermissionTypeId == 9 || up.PermissionTypeId == 10) {
        //super user/nao staff/pac staff
        return true;
      }
    }

    return false;
  }


  //#endregion Permissions

  //#region event handlers

  private handleReport1_ChangeFilterText = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    this.setState({ Report1_ListFilterText: newValue });
  }
  private handleReport2_ChangeFilterText = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    this.setState({ Report2_ListFilterText: newValue });
  }

  //#endregion event handlers
}


