import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission } from '../../../types';

//#region types defination

export interface ILookupData {
}
export class LookupData implements ILookupData {
}

export interface IIapPropertiesState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
}
export class IapPropertiesState extends types.UserContextWebPartState implements IIapPropertiesState {
  public LookupData = new LookupData();
  constructor() {
    super();
  }
}

//#endregion types defination

export default class IapProperties extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, IapPropertiesState> {
  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new IapPropertiesState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (
      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="Define Form">
          {this.renderDefForms()}
        </PivotItem>
      </Pivot>
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
          entityService={new services.IAPDefFormService(this.props.spfxContext, this.props.api)}
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
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 11) {
        //super user or sys manager
        return true;
      }
    }
    return false;
  }


  //#endregion Permissions

  //#region Load Data

  protected loadLookups(): Promise<any> {
    return Promise.all([
    ]);
  }

  //#endregion Load Data

}
