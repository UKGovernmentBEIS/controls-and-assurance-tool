import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';

import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType } from '../../../types/GenColumn';
import { IUserPermission } from '../../../types/UserPermissions';

//#region types defination


export interface IUserManagementState extends types.IUserContextWebPartState {

}
export class UserManagementState extends types.UserContextWebPartState {


	constructor() {
    super();


	}
}

//#endregion types defination

export default class UserManagement extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, UserManagementState> {



  constructor(props: types.IWebPartComponentProps) {
		super(props);
    this.state = new UserManagementState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return(

      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="Users">
          {this.renderUsers()}
        </PivotItem> 
        <PivotItem headerText="User Permissions">
          {this.renderUserPermissions()}
        </PivotItem> 
        {/* <PivotItem headerText="Permission Types">
          {this.renderPermissionTypes()}
        </PivotItem>  */}


      </Pivot>
    );
  }



  private renderUsers(): React.ReactElement<types.IWebPartComponentProps> {
    
    const listColumns: IGenColumn[] = [
      {
        key: '1',
        columnType: ColumnType.TextBox,
        name: 'Username(Email)',
        fieldName: 'Username',
        minWidth: 300,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50
      },
      {
        key: '2',
        columnType: ColumnType.TextBox,
        name: 'Display Name',
        fieldName: 'Title',
        minWidth: 300,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50
      }
    ];

    return (
      <EntityList
        allowAdd={this.allowAdd_Users()}
        columns={listColumns}
        {...this.props}
        onError={this.onError}
        entityService={new services.UserService(this.props.spfxContext, this.props.api)}
        entityNamePlural="Users"
        entityNameSingular="User"
        childEntityNameApi="UserPermissions"
        childEntityNamePlural="UserPermissions"
        childEntityNameSingular="UserPermission"
      />
    );
  }

  private renderUserPermissions(): React.ReactElement<types.IWebPartComponentProps> {
    const listColumns: IGenColumn[] = [
      {
        key: '1',
        columnType: ColumnType.TagPickerForUser,
        name: 'Username(Email)',
        fieldName: 'UserTitle',
        idFieldName: 'UserId',
        isParent: true,
        parentEntityName: 'User',
        parentColumnName: 'Username',
        parentService: new services.UserService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        maxWidth: 300,
        isResizable: true,
        isRequired: true
      },

      {
        key: '2',
        columnType: ColumnType.DisplayInListOnly,
        name: 'Display Name',
        fieldName: 'UserUsername',
        isParent: true,
        parentEntityName: 'User',
        parentColumnName: 'Title',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        isRequired: true
      },

      {
        key: '3',
        columnType: ColumnType.DropDown,
        name: 'Permission Type',
        fieldName: 'PermissionTypeTitle',
        idFieldName: 'PermissionTypeId',
        isParent: true,
        parentEntityName: 'PermissionType',
        parentColumnName: 'Title',
        parentService: new services.PermissionTypeService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        isResizable: true,
        isRequired: true
      }
    ];

    return (
      <EntityList
        allowAdd={this.allowAdd_UserPermissions()}
        onRowSelectionCheckEditDel={this.checkEditDel_UserPermissions}
        columns={listColumns}
        {...this.props}
        onError={this.onError}
        entityService={new services.UserPermissionService(this.props.spfxContext, this.props.api)}
        entityReadAllExpandAll={true}
        entityNamePlural="User Permissions"
        entityNameSingular="User Permission"
        childEntityNameApi=""
        childEntityNamePlural=""
        childEntityNameSingular=""
      />
    );
  }

  private renderPermissionTypes(): React.ReactElement<types.IWebPartComponentProps> {
    
    const listColumns: IGenColumn[] = [
      {
        key: '1',
        columnType: ColumnType.TextBox,
        name: 'Permission Type',
        fieldName: 'Title',
        minWidth: 300,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50
      }
    ];


    return (
      <EntityList
        allowAdd={true}
        columns={listColumns}
        {...this.props}
        onError={this.onError}
        entityService={new services.PermissionTypeService(this.props.spfxContext, this.props.api)}
        entityNamePlural="Permission Types"
        entityNameSingular="Permission Type"
        childEntityNameApi="UserPermissions"
        childEntityNamePlural="User Permissions"
        childEntityNameSingular="User Permission"
      />
    );
  }






  //#endregion Render



  //#region Permissions


  private allowAdd_Users(): boolean{

    //super user/SysManager check
    let ups = this.state.UserPermissions;
    for(let i=0; i<ups.length; i++){
      let up: IUserPermission = ups[i];
       if(up.PermissionTypeId == 1 || up.PermissionTypeId == 5 || up.PermissionTypeId == 6 || up.PermissionTypeId == 7 || up.PermissionTypeId == 8 || up.PermissionTypeId == 11){
         //any super user is allowed to add/edit/del users
         return true;
       }
    }

    return false;
  }

  private allowAdd_UserPermissions(): boolean{

    //super user/SysManager check
    let ups = this.state.UserPermissions;
    for(let i=0; i<ups.length; i++){
      let up: IUserPermission = ups[i];
      if(up.PermissionTypeId == 1 || up.PermissionTypeId == 5 || up.PermissionTypeId == 6 || up.PermissionTypeId == 7 || up.PermissionTypeId == 8 || up.PermissionTypeId == 11){
        //any super user is allowed to add/edit/del users
        return true;
      }
    }

    return false;
  }

  private checkEditDel_UserPermissions = (key: number) : Promise<boolean> => {
    const upService = new services.UserPermissionService(this.props.spfxContext, this.props.api);
    const resultPromise = upService.checkEditDelPermission(key);
    return resultPromise;
    
  }
  
  //#endregion Permissions
  

}
