import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import AutomationOptionsList from '../../../components/automationOptions/AutomationOptionsList';
import OutboxList from '../../../components/automationOptions/OutboxList';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { IGenColumn, ColumnType } from '../../../types/GenColumn';
import { IUserPermission } from '../../../types';
import PlatformLinks from '../../../components/PlatformLinks';

//#region types defination

export interface ILookupData {
}
export class LookupData implements ILookupData {
}

export interface IAppSettingsState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
  LastRunMsg_Stage1: string;
  LastRunMsg_Stage2: string;
  OutboxListRefreshCounter: number;
  Outbox_ListFilterText: string;

}
export class AppSettingsState extends types.UserContextWebPartState implements IAppSettingsState {
  public LookupData = new LookupData();
  public LastRunMsg_Stage1 = "";
  public LastRunMsg_Stage2 = "";
  public OutboxListRefreshCounter = 0;
  public Outbox_ListFilterText: string = null;
  constructor() {
    super();
  }
}

//#endregion types defination

export default class AppSettings extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, AppSettingsState> {

  private automationOptionService: services.AutomationOptionService = new services.AutomationOptionService(this.props.spfxContext, this.props.api);
  private autoFunctionLastRunService: services.AutoFunctionLastRunService = new services.AutoFunctionLastRunService(this.props.spfxContext, this.props.api);
  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new AppSettingsState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {
    return (
      <React.Fragment>
        {this.state.UserPermissions.length > 0 && <PlatformLinks module='Settings' visible={this.isSuperUser()} {...this.props} />}
        <Pivot onLinkClick={this.clearErrors}>
          <PivotItem headerText="Process Emails">
            {this.renderAutomationOptions()}
          </PivotItem>
          <PivotItem headerText="Email Outbox">
            {this.renderOutboxList()}
          </PivotItem>
          <PivotItem headerText="Logs">
            {this.renderLogsList()}
          </PivotItem>
        </Pivot>
      </React.Fragment>
    );
  }

  private renderAutomationOptions() {
    const sendEmailsPermission = this.sendEmailsPermission();
    return (
      <div>
        <AutomationOptionsList
          disabled={!sendEmailsPermission}
          {...this.props}
        />
        {
          (sendEmailsPermission === true) &&

          <div style={{ paddingTop: '30px' }}>
            <div style={{ paddingBottom: '10px' }}>
              {
                this.state.LastRunMsg_Stage1 !== "Working" &&
                <span>Note: {this.state.LastRunMsg_Stage1}</span>
              }
              {this.state.LastRunMsg_Stage1 === "Working" &&
                <div>
                  <span>Working... Please Wait</span><br />
                  <span style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }} onClick={this.loadAutoFunctionLastRun_Stage1} >Click to Refresh Status</span>
                </div>
              }
            </div>
            <PrimaryButton
              text="Send Emails to Outbox"
              onClick={this.handleProcessLnk_Step1}
              disabled={this.state.LastRunMsg_Stage1 === "Working" ? true : false}
            />

          </div>
        }

      </div>
    );
  }

  private renderOutboxList(): React.ReactElement<types.IWebPartComponentProps> {
    const sendEmailsPermission = this.sendEmailsPermission();
    return (
      <div>
        <div style={{ paddingTop: "10px" }}>
          <OutboxList
            {...this.props}
            onError={this.onError}
            filterText={this.state.Outbox_ListFilterText}
            onChangeFilterText={this.handleOutboxList_ChangeFilterText}
            outboxListRefreshCounter={this.state.OutboxListRefreshCounter}
          />
          {
            (sendEmailsPermission === true) &&
            <div style={{ paddingTop: '30px' }}>
              <div style={{ paddingBottom: '10px' }}>
                {
                  this.state.LastRunMsg_Stage2 !== "Working" &&
                  <span>{this.state.LastRunMsg_Stage2}</span>
                }
                {this.state.LastRunMsg_Stage2 === "Working" &&
                  <div>
                    <span>Working... Please Wait</span><br />
                    <span style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }} onClick={this.loadAutoFunctionLastRun_Stage2} >Click to Refresh Data</span>
                  </div>
                }

              </div>
              <PrimaryButton
                text="Send Emails Now"
                onClick={this.handleProcessLnk_Step2}
                disabled={this.state.LastRunMsg_Stage2 === "Working" ? true : false}
              />
            </div>
          }
        </div>
      </div>
    );
  }

  private renderLogsList() {

    const listColumns: IGenColumn[] = [
      {
        key: '1',
        columnType: ColumnType.TextBox,
        name: 'Category',
        fieldName: 'Module',
        minWidth: 80,
        maxWidth: 80,
        isMultiline: true,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50
      },
      {
        key: '2',
        columnType: ColumnType.TextBox,
        name: 'Title',
        fieldName: 'Title',
        minWidth: 120,
        maxWidth: 120,
        isMultiline: true,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50
      },

      {
        key: '4',
        columnType: ColumnType.TagPickerForUser,
        name: 'Display Name',
        fieldName: 'UserTitle',
        idFieldName: 'UserId',
        isParent: true,
        parentEntityName: 'User',
        parentColumnName: 'Title',
        parentService: new services.UserService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        maxWidth: 100,
        isMultiline: true,
        isResizable: true,
        isRequired: true
      },
      {
        key: '5',
        columnType: ColumnType.DropDown,
        name: 'Period',
        fieldName: 'PeriodTitle',
        idFieldName: 'PeriodId',
        isParent: true,
        parentEntityName: 'Period',
        parentColumnName: 'Title',
        parentService: new services.PeriodService(this.props.spfxContext, this.props.api),
        minWidth: 120,
        maxWidth: 120,
        isMultiline: true,
        isResizable: true,
        isRequired: true
      },
      {
        key: '6',
        columnType: ColumnType.DropDown,
        name: 'Division',
        fieldName: 'TeamTitle',
        idFieldName: 'TeamId',
        isParent: true,
        parentEntityName: 'Team',
        parentColumnName: 'Title',
        parentService: new services.TeamService(this.props.spfxContext, this.props.api),
        minWidth: 120,
        maxWidth: 160,
        isMultiline: true,
        isResizable: true,
        isRequired: true
      },
      {
        key: '7',
        columnType: ColumnType.TextBox,
        name: 'Date',
        fieldName: 'LogDate',
        minWidth: 140,
        maxWidth: 140,
        isMultiline: true,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50
      },
      {
        key: '3',
        columnType: ColumnType.TextBox,
        name: 'Details',
        fieldName: 'Details',
        minWidth: 160,
        maxWidth: 460,
        isResizable: true,
        isMultiline: true,
        isRequired: true,
        fieldMaxLength: 5000,
        numRows: 5
      }
    ];

    return (
      <React.Fragment>
        <EntityList
          pageSize={100}
          allowAdd={false}
          columns={listColumns}
          entityReadAllExpandAll={true}
          {...this.props}
          onError={this.onError}
          entityService={new services.LogService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Logs"
          entityNameSingular="Log"
          childEntityNameApi=""
          childEntityNamePlural=""
          childEntityNameSingular=""
        />
      </React.Fragment>
    );
  }


  private handleProcessLnk_Step1 = (): void => {
    console.log('In Process');
    this.automationOptionService.processAsAutoFunction().then((res: string): void => {
      console.log('Result', res);
      this.setState({
        LastRunMsg_Stage1: res, //res = "Working" at this stage
      });

    }, (err) => {
    });
  }

  private handleProcessLnk_Step2 = (): void => {
    console.log('In Process step2');
    this.automationOptionService.processAsAutoFunctionFromOutbox().then((res: string): void => {
      console.log('Result', res);
      this.setState({
        LastRunMsg_Stage2: res, //res = "Working" at this stage
      });
    }, (err) => {
    });
  }

  //#endregion Render


  //#region Permissions


  private sendEmailsPermission(): boolean {
    //super user/SysManager check
    let ups: IUserPermission[] = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 15) {
        return true;
      }
    }

    return false;
  }

  private isSuperUser(): boolean {
    //super user/SysManager check
    let ups: IUserPermission[] = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1) {
        return true;
      }
    }

    return false;
  }


  //#endregion Permissions

  //#region Load Data

  private loadAutoFunctionLastRun_Stage1 = (): void => {
    this.autoFunctionLastRunService.getLastRunMsg("Stage1").then((res: string): void => {
      console.log('Last Run Msg', res);
      this.setState({
        LastRunMsg_Stage1: res,
      });

    }, (err) => {

    });
  }

  private loadAutoFunctionLastRun_Stage2 = (): void => {
    this.autoFunctionLastRunService.getLastRunMsg("Stage2").then((res: string): void => {
      console.log('Last Run Msg', res);
      this.setState({
        LastRunMsg_Stage2: res,
        OutboxListRefreshCounter: (this.state.OutboxListRefreshCounter + 1),
      });

    }, (err) => {

    });
  }

  protected loadLookups(): Promise<any> {
    return Promise.all([
      this.loadAutoFunctionLastRun_Stage1(),
      this.loadAutoFunctionLastRun_Stage2(),
    ]);
  }

  //#endregion Load Data

  //#region Event Handlers

  private handleOutboxList_ChangeFilterText = (event?: React.ChangeEvent<HTMLInputElement>, value?: string): void => {
    this.setState({ Outbox_ListFilterText: value });
  }

  //#endregion Event Handlers

}
