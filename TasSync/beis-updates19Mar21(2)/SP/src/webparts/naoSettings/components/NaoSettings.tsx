import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import PeriodList from '../../../components/period/PeriodList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IPeriod } from '../../../types';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';

//#region types defination

export interface ILookupData {
  //Periods: IPeriod[];
}
export class LookupData implements ILookupData {
  //public Periods: IPeriod[] = [];
}

export interface INaoSettingsState extends types.IUserContextWebPartState {
  LookupData: ILookupData;

}
export class NaoSettingsState extends types.UserContextWebPartState implements INaoSettingsState {
  public LookupData = new LookupData();
  constructor() {
    super();
  }
}

//#endregion types defination

export default class NaoSettings extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, NaoSettingsState> {

  private periodService: services.PeriodService = new services.PeriodService(this.props.spfxContext, this.props.api);
  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new NaoSettingsState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <Pivot onLinkClick={this.clearErrors}>
        {/* <PivotItem headerText="Periods">
          {this.renderCustomPeriodsList()}
        </PivotItem> */}
        <PivotItem headerText="Define Form">
          {this.renderDefForms()}
        </PivotItem>

      </Pivot>
    );
  }


  private renderCustomPeriodsList() {

    const listColumns: IGenColumn[] = [
      {
        key: '1',
        columnType: ColumnType.TextBox,
        name: 'Name',
        fieldName: 'Title',
        minWidth: 150,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50,

      },
      {
        key: '2',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.ListOnly,
        name: 'Period Status',
        fieldName: 'PeriodStatus',
        minWidth: 150,
        isResizable: true,
        fieldMaxLength: 50,
      },
      {
        key: '3',
        columnType: ColumnType.DatePicker,
        name: 'Start Date',
        fieldName: 'PeriodStartDate',
        minWidth: 150,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50,
      },
      {
        key: '4',
        columnType: ColumnType.DatePicker,
        name: 'End Date',
        fieldName: 'PeriodEndDate',
        minWidth: 150,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50,
      },

    ];

    return (
      <React.Fragment>
        <PeriodList
          allowAdd={this.allowAdd_Periods()}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.NAOPeriodService(this.props.spfxContext, this.props.api)}
          entityNamePlural="NAO Periods"
          entityNameSingular="Period"
          childEntityNameApi=""
          childEntityNamePlural=""
          childEntityNameSingular=""
        />

      </React.Fragment>
    );
  }

  private renderDefForms() {

    const listColumns: IGenColumn[] = [

      {
        key: 'Title',
        columnType: ColumnType.TextBox,
        name: 'Welcome Text Heading',
        fieldName: 'Title',
        minWidth: 300,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 100
      },
      {
        key: 'Details',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Welcome Text',
        fieldName: 'Details',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },


    ];


    return (


      <React.Fragment>


        <EntityList
          allowAdd={this.superUserOrSysManagerPermission()}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.NAODefFormService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Define Form"
          entityNameSingular="Define Form"
          childEntityNameApi=""
          childEntityNamePlural=""
          childEntityNameSingular=""
        />
      </React.Fragment>





    );
  }




  //#endregion Render


  //#region Permissions


  private superUserOrSysManagerPermission(): boolean {

    //super user/SysManager check
    let ups: IUserPermission[] = this.state.UserPermissions;
    
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 8) {
        //super user or sys manager
        return true;
      }
    }

    return false;
  }

  private allowAdd_Periods(): boolean {
    return this.superUserOrSysManagerPermission();
  }

  //#endregion Permissions

  //#region Load Data



  protected loadLookups(): Promise<any> {

    return Promise.all([
      
    ]);
  }

  //#endregion Load Data

  //#region Event Handlers



  //#endregion Event Handlers

}
