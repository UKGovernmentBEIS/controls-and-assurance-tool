import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import AutomationOptionsList from '../../../components/automationOptions/AutomationOptionsList';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import PeriodList from '../../../components/period/PeriodList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IPeriod, IEntity } from '../../../types';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';

//#region types defination

export interface ILookupData {
  //Periods: IPeriod[];
}
export class LookupData implements ILookupData {
  //public Periods: IPeriod[] = [];
}

export interface IAppSettingsState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
  LastRunMsg: string;

}
export class AppSettingsState extends types.UserContextWebPartState implements IAppSettingsState {
  public LookupData = new LookupData();
  public LastRunMsg = "";
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

      <Pivot onLinkClick={this.clearErrors}>

        <PivotItem headerText="Automation Options">
          {this.renderAutomationOptions()}
        </PivotItem>
        <PivotItem headerText="Logs">
          {this.renderLogsList()}
        </PivotItem>
      </Pivot>
    );
  }



  private renderAutomationOptions() {

    const superUserPermission = this.superUserPermission();
    return (
      <div>
        <AutomationOptionsList
          disabled={!superUserPermission}
          {...this.props}

        />

        {
          (superUserPermission === true) &&

          <div style={{ paddingTop: '30px' }}>
            <div style={{ paddingBottom: '10px' }}>
              Note: {this.state.LastRunMsg}
            </div>
            <PrimaryButton
              text="Send Emails Now"
              onClick={this.handleProcessLnk}
            />

          </div>
        }

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
        //columnDisplayType: ColumnDisplayType.FormOnly,
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


  private handleProcessLnk = (): void => {
    console.log('In Process');

    this.automationOptionService.processAsAutoFunction().then((res: string): void => {

      console.log('Result', res);
      this.loadAutoFunctionLastRun();

    }, (err) => {

    });


  }

  //#endregion Render


  //#region Permissions


  private superUserPermission(): boolean {

    //super user/SysManager check
    let ups: IUserPermission[] = this.state.UserPermissions;

    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1) {
        //super user or sys manager
        return true;
      }
    }

    return false;
  }



  //#endregion Permissions

  //#region Load Data

  private loadAutoFunctionLastRun = (): void => {
    this.autoFunctionLastRunService.getLastRunMsg().then((res: string): void => {

      console.log('Last Run Msg', res);
      this.setState({
        LastRunMsg: res,
      });

    }, (err) => {

    });

  }


  protected loadLookups(): Promise<any> {

    return Promise.all([
      this.loadAutoFunctionLastRun(),
    ]);
  }

  //#endregion Load Data

  //#region Event Handlers



  //#endregion Event Handlers

}
