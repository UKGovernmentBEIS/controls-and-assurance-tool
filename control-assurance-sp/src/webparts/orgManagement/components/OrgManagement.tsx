import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType } from '../../../types/GenColumn';
import { IUserPermission } from '../../../types/UserPermissions';

import { DetailsListCustomColumnsExample } from '../../../components/DetailsListCustomColumnsExample';


//#region types defination


export interface IOrgManagementState extends types.IUserContextWebPartState {

}
export class OrgManagementState extends types.UserContextWebPartState {

	constructor() {
    super();


	}
}

//#endregion types defination

export default class OrgManagement extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, OrgManagementState> {
  
  constructor(props: types.IWebPartComponentProps) {
		super(props);
    this.state = new OrgManagementState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return(

      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="DG Areas">
          {this.renderDirectorateGroups()}
        </PivotItem> 
        <PivotItem headerText="Directorates">
          {this.renderDirectorates()}
        </PivotItem> 
        <PivotItem headerText="Divisions">
          {this.renderTeams()}
        </PivotItem> 
        <PivotItem headerText="DG Area Delegates">
          {this.renderDirectorateGroupMembers()}
        </PivotItem> 
        <PivotItem headerText="Directorate Delegates">
          {this.renderDirectorateMembers()}
        </PivotItem> 
        <PivotItem headerText="Division Delegates">
          {this.renderTeamMembers()}
        </PivotItem> 
        <PivotItem headerText="Test List">
          {this.renderTestList()}
        </PivotItem> 


      </Pivot>
    );
  }


  private renderTestList(): React.ReactElement<types.IWebPartComponentProps> {
    return(
      <DetailsListCustomColumnsExample {...this.props}></DetailsListCustomColumnsExample>
    );
  }

  private renderDirectorateGroups(): React.ReactElement<types.IWebPartComponentProps> {

    let allowAdd: boolean = this.allowAdd_DirectorateGroups();
    
    const listColumns: IGenColumn[] = [
      {
        key: '1',
        columnType: ColumnType.TextBox,
        name: 'Name',
        fieldName: 'Title',
        minWidth: 100,
        maxWidth: 220,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50
      },
      {
        key: '2',
        columnType: ColumnType.TagPickerForUser,
        name: 'Director General',
        fieldName: 'UserTitle',
        idFieldName: 'DirectorGeneralUserID',
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
        key: '3',
        columnType: ColumnType.DropDown,
        name: 'Status',
        fieldName: 'EntityStatusTitle',
        idFieldName: 'EntityStatusID',
        isParent: true,
        parentEntityName: 'EntityStatusType',
        parentColumnName: 'Title',
        parentService: new services.EntityStatusTypeService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        isRequired: true
      },
    ];


    return (
      <EntityList
        allowAdd={allowAdd}
        columns={listColumns}
        {...this.props}
        onError={this.onError}
        entityService={new services.DirectorateGroupService(this.props.spfxContext, this.props.api)}
        entityReadAllExpandAll={true}
        entityNamePlural="DG Areas"
        entityNameSingular="DG Area"
        childEntityNameApi="Directorates"
        childEntityNamePlural="Directorates"
        childEntityNameSingular="Directorate"
      />
    );
  }

  private renderDirectorates(): React.ReactElement<types.IWebPartComponentProps> {
    
    let allowAdd: boolean = this.allowAdd_Directorates();

    const listColumns: IGenColumn[] = [
      {
        key: '1',
        columnType: ColumnType.TextBox,
        name: 'Name',
        fieldName: 'Title',
        minWidth: 100,
        maxWidth: 220,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50
      },
      {
        key: '2',
        columnType: ColumnType.DropDown,
        name: 'DG Area',
        fieldName: 'DirectorateGroupTitle',
        idFieldName: 'DirectorateGroupID',
        isParent: true,
        parentEntityName: 'DirectorateGroup',
        parentColumnName: 'Title',
        parentService: new services.DirectorateGroupService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        maxWidth: 220,
        isResizable: true,
        isRequired: true
      },
      {
        key: '3',
        columnType: ColumnType.TagPickerForUser,
        name: 'Director',
        fieldName: 'UserTitle',
        idFieldName: 'DirectorUserID',
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
        key: '4',
        columnType: ColumnType.DropDown,
        name: 'Status',
        fieldName: 'EntityStatusTitle',
        idFieldName: 'EntityStatusID',
        isParent: true,
        parentEntityName: 'EntityStatusType',
        parentColumnName: 'Title',
        parentService: new services.EntityStatusTypeService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        isRequired: true
      },
    ];


    return (
      <EntityList
        allowAdd={allowAdd}
        columns={listColumns}
        {...this.props}
        onError={this.onError}
        entityService={new services.DirectorateService(this.props.spfxContext, this.props.api)}
        entityReadAllExpandAll={true}
        entityNamePlural="Directorates"
        entityNameSingular="Directorate"
        childEntityNameApi="Teams"
        childEntityNamePlural="Teams"
        childEntityNameSingular="Team"
      />
    );
  }

  private renderTeams(): React.ReactElement<types.IWebPartComponentProps> {
    
    let allowAdd: boolean = this.allowAdd_Teams();
    const listColumns: IGenColumn[] = [
      {
        key: '1',
        columnType: ColumnType.TextBox,
        name: 'Name',
        fieldName: 'Title',
        minWidth: 100,
        maxWidth: 220,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50
      },
      {
        key: '2',
        columnType: ColumnType.DropDown,
        name: 'Directorate',
        fieldName: 'DirectorateTitle',
        idFieldName: 'DirectorateId',
        isParent: true,
        parentEntityName: 'Directorate',
        parentColumnName: 'Title',
        parentService: new services.DirectorateService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        maxWidth: 220,
        isResizable: true,
        isRequired: true
      },
      {
        key: '3',
        columnType: ColumnType.TagPickerForUser,
        name: 'Deputy Director',
        fieldName: 'UserTitle',
        idFieldName: 'DeputyDirectorUserId',
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
        key: '4',
        columnType: ColumnType.DropDown,
        name: 'Status',
        fieldName: 'EntityStatusTitle',
        idFieldName: 'EntityStatusId',
        isParent: true,
        parentEntityName: 'EntityStatusType',
        parentColumnName: 'Title',
        parentService: new services.EntityStatusTypeService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        isRequired: true
      },
    ];


    return (
      <EntityList 
        allowAdd={allowAdd}
        onRowSelectionCheckEditDel={this.checkEditDel_Teams}
        columns={listColumns}
        {...this.props}
        onError={this.onError}
        entityService={new services.TeamService(this.props.spfxContext, this.props.api)}
        entityReadAllExpandAll={true}
        entityNamePlural="Divisions"
        entityNameSingular="Division"
        childEntityNameApi="Forms"
        childEntityNamePlural="Forms"
        childEntityNameSingular="Form"
      />
    );
  }


  private renderDirectorateGroupMembers(): React.ReactElement<types.IWebPartComponentProps> {
    
    let allowAdd: boolean = this.allowAdd_DirectorateGroupMembers();
    const listColumns: IGenColumn[] = [

      {
        key: '1',
        columnType: ColumnType.DropDown,
        name: 'DG Area',
        fieldName: 'DirectorateGroupTitle',
        idFieldName: 'DirectorateGroupID',
        isParent: true,
        parentEntityName: 'DirectorateGroup',
        parentColumnName: 'Title',
        parentService: new services.DirectorateGroupService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        maxWidth: 220,
        isResizable: true,
        isRequired: true
      },
      {
        key: '2',
        columnType: ColumnType.TagPickerForUser,
        name: 'User',
        fieldName: 'UserTitle',
        idFieldName: 'UserID',
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
        key: '3',
        columnType: ColumnType.Checkbox,
        name: 'Is Admin',
        fieldName: 'IsAdmin',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        //isRequired: true
      },

    ];


    return (
      <EntityList
        allowAdd={allowAdd}
        onRowSelectionCheckEditDel={this.checkEditDel_DirectorateGroupMembers}
        columns={listColumns}
        {...this.props}
        onError={this.onError}
        entityService={new services.DirectorateGroupMemberService(this.props.spfxContext, this.props.api)}
        entityReadAllExpandAll={true}
        entityNamePlural="DG Area Delegates"
        entityNameSingular="DG Area Delegate"
        childEntityNameApi=""
        childEntityNamePlural=""
        childEntityNameSingular=""
      />
    );
  }

  private renderDirectorateMembers(): React.ReactElement<types.IWebPartComponentProps> {
    let allowAdd: boolean = this.allowAdd_DirectorateMembers();
    const listColumns: IGenColumn[] = [

      {
        key: '1',
        columnType: ColumnType.DropDown,
        name: 'Directorate',
        fieldName: 'DirectorateTitle',
        idFieldName: 'DirectorateID',
        isParent: true,
        parentEntityName: 'Directorate',
        parentColumnName: 'Title',
        parentService: new services.DirectorateService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        maxWidth: 220,
        isResizable: true,
        isRequired: true
      },
      {
        key: '2',
        columnType: ColumnType.TagPickerForUser,
        name: 'User',
        fieldName: 'UserTitle',
        idFieldName: 'UserID',
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
        key: '3',
        columnType: ColumnType.Checkbox,
        name: 'Is Admin',
        fieldName: 'IsAdmin',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
      },
      {
        key: '4',
        columnType: ColumnType.Checkbox,
        name: 'Can Sign-Off',
        fieldName: 'CanSignOff',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
      },

    ];


    return (
      <EntityList
        allowAdd={allowAdd}
        onRowSelectionCheckEditDel={this.checkEditDel_DirectorateMembers}
        columns={listColumns}
        {...this.props}
        onError={this.onError}
        entityService={new services.DirectorateMemberService(this.props.spfxContext, this.props.api)}
        entityReadAllExpandAll={true}
        entityNamePlural="Directorate Delegates"
        entityNameSingular="Directorate Delegate"
        childEntityNameApi=""
        childEntityNamePlural=""
        childEntityNameSingular=""
      />
    );
  }

  private renderTeamMembers(): React.ReactElement<types.IWebPartComponentProps> {
    let allowAdd: boolean = this.allowAdd_TeamMembers();
    const listColumns: IGenColumn[] = [

      {
        key: '1',
        columnType: ColumnType.DropDown,
        name: 'Division',
        fieldName: 'TeamTitle',
        idFieldName: 'TeamId',
        isParent: true,
        parentEntityName: 'Team',
        parentColumnName: 'Title',
        parentService: new services.TeamService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        maxWidth: 220,
        isResizable: true,
        isRequired: true
      },
      {
        key: '2',
        columnType: ColumnType.TagPickerForUser,
        name: 'User',
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
        key: '3',
        columnType: ColumnType.Checkbox,
        name: 'Is Admin',
        fieldName: 'IsAdmin',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
      },
      {
        key: '4',
        columnType: ColumnType.Checkbox,
        name: 'Can Sign-Off',
        fieldName: 'CanSignOff',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
      },

    ];


    return (
      <EntityList
        allowAdd={allowAdd}
        onRowSelectionCheckEditDel={this.checkEditDel_TeamMembers}
        columns={listColumns}
        {...this.props}
        onError={this.onError}
        entityService={new services.TeamMemberService(this.props.spfxContext, this.props.api)}
        entityReadAllExpandAll={true}
        entityNamePlural="Division Delegates"
        entityNameSingular="Division Delegate"
        childEntityNameApi=""
        childEntityNamePlural=""
        childEntityNameSingular=""
      />
    );
  }




  //#endregion Render



  //#region Add/Edit/Del Checks

  private allowAdd_DirectorateGroups(): boolean{

    let ups = this.state.UserPermissions;

    for(let i=0; i<ups.length; i++){
      let up: IUserPermission = ups[i];
       if(up.PermissionTypeId == 1 || up.PermissionTypeId == 2){
         //super user or sys manager
         return true;
       }

    }

    return false;
  }


  private allowAdd_Directorates(): boolean{

    let ups = this.state.UserPermissions;

    for(let i=0; i<ups.length; i++){
      let up: IUserPermission = ups[i];
       if(up.PermissionTypeId == 1 || up.PermissionTypeId == 2){
         //super user or sys manager
         return true;
       }

    }

    return false;
  }

  private allowAdd_Teams(): boolean{

    //super user/SysManager check
    let ups = this.state.UserPermissions;
    for(let i=0; i<ups.length; i++){
      let up: IUserPermission = ups[i];
       if(up.PermissionTypeId == 1 || up.PermissionTypeId == 2){
         //super user or sys manager
         return true;
       }
    }

    //Directorate check
    if(this.state.Directorates.length > 0){
      return true;
    }
 
    //Directorate member check
    let dms = this.state.DirectorateMembers;
    for(let i=0; i<dms.length; i++){
      let dm: types.IDirectorateMember = dms[i];
       if(dm.IsAdmin === true){
         return true;
       }
    }


    return false;
  }

  private checkEditDel_Teams = (key: number) : Promise<boolean> => {
    const teamService = new services.TeamService(this.props.spfxContext, this.props.api);
    const resultPromise = teamService.checkEditDelPermission(key);
    return resultPromise;
    
  }

  private allowAdd_DirectorateGroupMembers(): boolean{
    //super user/SysManager check
    let ups = this.state.UserPermissions;

    for(let i=0; i<ups.length; i++){
      let up: IUserPermission = ups[i];
       if(up.PermissionTypeId == 1 || up.PermissionTypeId == 2){
         //super user or sys manager
         return true;
       }
    }
    //DirectorateGroup check
    if(this.state.DirectorateGroups.length > 0){
      return true;
    }

    //DirectorateGroupMembers check
    let dgms = this.state.DirectorateGroupMembers;
      for(let i=0; i<dgms.length; i++){
        let dgm: types.IDirectorateGroupMember = dgms[i];
        if(dgm.IsAdmin === true){
          return true;
        }
      }

    return false;
  }

  private checkEditDel_DirectorateGroupMembers = (key: number) : Promise<boolean> => {
    const dgmService = new services.DirectorateGroupMemberService(this.props.spfxContext, this.props.api);
    const resultPromise = dgmService.checkEditDelPermission(key);
    return resultPromise; 
  }

  private allowAdd_DirectorateMembers(): boolean{
    //super user/SysManager check
    let ups = this.state.UserPermissions;

    for(let i=0; i<ups.length; i++){
      let up: IUserPermission = ups[i];
       if(up.PermissionTypeId == 1 || up.PermissionTypeId == 2){
         //super user or sys manager
         return true;
       }
    }
    //DirectorateGroup check
    if(this.state.DirectorateGroups.length > 0){
      return true;
    }

    //DirectorateGroupMembers check
    let dgms = this.state.DirectorateGroupMembers;
      for(let i=0; i<dgms.length; i++){
        let dgm: types.IDirectorateGroupMember = dgms[i];
        if(dgm.IsAdmin === true){
          return true;
        }
    }

    //Directorate check
    if(this.state.Directorates.length > 0){
      return true;
    }
     
    //Directorate member check
    let dms = this.state.DirectorateMembers;
    for(let i=0; i<dms.length; i++){
      let dm: types.IDirectorateMember = dms[i];
      if(dm.IsAdmin === true){
        return true;
      }
    }

    return false;
  }

  private checkEditDel_DirectorateMembers = (key: number) : Promise<boolean> => {
    const dmService = new services.DirectorateMemberService(this.props.spfxContext, this.props.api);
    const resultPromise = dmService.checkEditDelPermission(key);
    return resultPromise; 
  }

  private allowAdd_TeamMembers(): boolean{
    //super user/SysManager check
    let ups = this.state.UserPermissions;

    for(let i=0; i<ups.length; i++){
      let up: IUserPermission = ups[i];
       if(up.PermissionTypeId == 1 || up.PermissionTypeId == 2){
         //super user or sys manager
         return true;
       }
    }
    //DirectorateGroup check
    if(this.state.DirectorateGroups.length > 0){
      return true;
    }

    //DirectorateGroupMembers check
    let dgms = this.state.DirectorateGroupMembers;
      for(let i=0; i<dgms.length; i++){
        let dgm: types.IDirectorateGroupMember = dgms[i];
        if(dgm.IsAdmin === true){
          return true;
        }
    }

    //Directorate check
    if(this.state.Directorates.length > 0){
      return true;
    }
     
    //Directorate member check
    let dms = this.state.DirectorateMembers;
    for(let i=0; i<dms.length; i++){
      let dm: types.IDirectorateMember = dms[i];
      if(dm.IsAdmin === true){
        return true;
      }
    }

    //Teams check
    if(this.state.Teams.length > 0){
      return true;
    }
         
    //Team members check
    let tms = this.state.TeamMembers;
    for(let i=0; i<tms.length; i++){
      let tm: types.ITeamMember = tms[i];
      if(tm.IsAdmin === true){
        return true;
      }
    }

    return false;
  }

  private checkEditDel_TeamMembers = (key: number) : Promise<boolean> => {
    const tmService = new services.TeamMemberService(this.props.spfxContext, this.props.api);
    const resultPromise = tmService.checkEditDelPermission(key);
    return resultPromise; 
  }
  
  //#endregion Add/Edit/Del Checks
  

}
