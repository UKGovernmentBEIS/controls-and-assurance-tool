import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';

import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType } from '../../../types/GenColumn';
import { IUserPermission } from '../../../types/UserPermissions';
import { ICLCase, ICLHiringMember, IUser } from '../../../types';
import { sp, ChunkedFileUploadProgressData, Folder, SharePointQueryableSecurable } from '@pnp/sp';
import { Promise } from 'es6-promise';

//#region types defination


export interface IUserManagementState extends types.IUserContextWebPartState {
  Cases: ICLCase[];
  Users: IUser[];
  CLSuperUsersAndViewers: IUser[];

}
export class UserManagementState extends types.UserContextWebPartState {

  public Cases: ICLCase[] = [];
  public Users: IUser[] = [];
  public CLSuperUsersAndViewers: IUser[] = [];

  constructor() {
    super();


  }
}

//#endregion types defination

export default class UserManagement extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, UserManagementState> {

  private clCaseService: services.CLCaseService = new services.CLCaseService(this.props.spfxContext, this.props.api);

  private userFoundByEmail: number = 0;
  private userFoundByUserPrincipalName: number = 0;
  private usersToTryByUserPrincipalName: string[] = [];

  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new UserManagementState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="Users">
          {this.renderUsers()}
        </PivotItem>
        <PivotItem headerText="User Permissions">
          {this.renderUserPermissions()}
        </PivotItem>
        <PivotItem headerText="Debug Info">
          {this.renderTest1()}
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

  private renderTest1(): React.ReactElement<types.IWebPartComponentProps> {



    return (
      <React.Fragment>
        <div style={{ paddingTop: '15px' }} >
          <div>
            This information is for developers only and necessary for certain support tasks. Can be ignored by non developers.
          </div>
          <br />
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.testCasesPermissions}>Click Here to List Active Directory Users in Log</span>
          <br />
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.allSiteUsersLog}>All Users</span>
          <br />
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.currentSiteUsersLog}>Current User</span>
          <br />
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.siteUserByEmailLog}>User by Email</span>
          <br />
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.siteUserByLoginLog}>User by Login</span>
          <br />
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.siteUserByEmail2Log}>User by Email 2</span>
          <br />
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.siteUserByUserPrincipalNameLog}>User by PrincipalName</span>

        </div>
      </React.Fragment>
    );
  }






  //#endregion Render



  //#region Permissions


  private allowAdd_Users(): boolean {

    //super user/SysManager check
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 5 || up.PermissionTypeId == 6 || up.PermissionTypeId == 7 || up.PermissionTypeId == 8 || up.PermissionTypeId == 11) {
        //any super user is allowed to add/edit/del users
        return true;
      }
    }

    return false;
  }

  private allowAdd_UserPermissions(): boolean {

    //super user/SysManager check
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 5 || up.PermissionTypeId == 6 || up.PermissionTypeId == 7 || up.PermissionTypeId == 8 || up.PermissionTypeId == 11) {
        //any super user is allowed to add/edit/del users
        return true;
      }
    }

    return false;
  }

  private checkEditDel_UserPermissions = (key: number): Promise<boolean> => {
    const upService = new services.UserPermissionService(this.props.spfxContext, this.props.api);
    const resultPromise = upService.checkEditDelPermission(key);
    return resultPromise;

  }

  //#endregion Permissions

  private loadCases = (): Promise<void> => {
    //const qryStr:string = "?$filter=ID eq 2176&$expand=CLHiringMembers($expand=User($select=Username,ID))";
    const qryStr: string = "?$expand=CLHiringMembers($expand=User($select=Username,ID))";
    let x = this.clCaseService.readAll(qryStr).then((data: ICLCase[]): void => {
      console.log('cases', data);
      this.setState({ Cases: data });
    }, (err) => { if (this.onError) this.onError(`Error loading data`, err.message); });
    return x;
  }
  private loadUsers = (): Promise<void> => {
    let x = this.userService.readAll().then((data: IUser[]): void => {
      this.setState({ Users: data });
    }, (err) => { if (this.onError) this.onError(`Error loading Users`, err.message); });
    return x;
  }

  private loadAllCLSuperUsersAndViewers = (): Promise<void> => {
    let x = this.userService.readAll_CL_SuperUsers_Viewers().then((data: IUser[]): void => {
      this.setState({ CLSuperUsersAndViewers: data });
      //console.log('SuperUsersAndViewers', data);
    }, (err) => { if (this.onError) this.onError(`Error loading super users`, err.message); });
    return x;
  }

  protected loadLookups(): Promise<any> {

    return Promise.all([

      this.loadCases(),
      this.loadUsers(),
      this.loadAllCLSuperUsersAndViewers(),
    ]);
  }




  private testCasesPermissions = (): void => {

    //set stat vars to 0;
    this.userFoundByEmail = 0;
    this.userFoundByUserPrincipalName = 0;
    this.usersToTryByUserPrincipalName = [];

    console.log('in testCasesPermissions');

    let users: string[] = [];

    console.log('building unique users');

    //Superusers/viewers
    this.state.CLSuperUsersAndViewers.forEach(su => {
      users.push(su.Username);
    });


    this.state.Cases.forEach(caseData => {
      console.log('caseId', caseData.ID);
      //hiring manager
      if (caseData.ApplHMUserId > 0) {
        const u1 = this.state.Users.filter(x => x.ID === caseData.ApplHMUserId)[0].Username;
        if (users.indexOf(u1) === -1) users.push(u1);
      }

      //hiring members
      const hiringMembers: ICLHiringMember[] = caseData['CLHiringMembers'];
      hiringMembers.forEach(m => {
        const u1 = this.state.Users.filter(x => x.ID === m.UserId)[0].Username;
        if (users.indexOf(u1) === -1) users.push(u1);
      });

      //BH
      if (caseData.BHUserId > 0) {
        const u1 = this.state.Users.filter(x => x.ID === caseData.BHUserId)[0].Username;
        if (users.indexOf(u1) === -1) users.push(u1);
      }

      //FBP
      if (caseData.FBPUserId > 0) {
        const u1 = this.state.Users.filter(x => x.ID === caseData.FBPUserId)[0].Username;
        if (users.indexOf(u1) === -1) users.push(u1);
      }

      //HRBP
      if (caseData.HRBPUserId > 0) {
        const u1 = this.state.Users.filter(x => x.ID === caseData.HRBPUserId)[0].Username;
        if (users.indexOf(u1) === -1) users.push(u1);
      }


    });

    console.log('after building unique users', users);

    //get info from sp
    let promisesUsersByEmail = [];
    let promisesUsersByUserPrincipalName = [];

    users.forEach(userEmail => {
      //promisesRemove.push(this.removeFolderRole(userEmail, folderItem));
      console.log(`trying to find sp user by email: ${userEmail}`);
      promisesUsersByEmail.push(this.findSPUserByEmail(userEmail));

      // let xPromise = sp.web.siteUsers.filter(`Email eq '${userEmail}'`).get().then(spUs => {
      //   if(spUs.length > 0){
      //     //sp user found by email
      //     this.userFoundByEmail++;
      //     const currentUserPrincipalId: number = Number(spUs[0]['Id']);
      //     console.log(`SP user found by email: ${userEmail}, SP User Id: ${currentUserPrincipalId}`);
      //   }
      //   else{
      //     console.log(`SP user not found by email: ${userEmail}`);
      //   }
      // });



    });

    Promise.all(promisesUsersByEmail).then(() => {

      if (this.userFoundByEmail < users.length) {
        //try to find remaining users by UserPrincipalName
        console.log('could not find all sp users by email, so trying to find rest by UserPrincipalName');
        this.usersToTryByUserPrincipalName.forEach(uEmailTry => {
          promisesUsersByUserPrincipalName.push(this.findSPUserByUserPrincipalName(uEmailTry));
        });

        Promise.all(promisesUsersByUserPrincipalName).then(() => {

          //stats
          console.log('\n\n');
          console.log('=============================');
          console.log("Total Unique Users: ", users.length);
          console.log("User Found By Email: ", this.userFoundByEmail);
          console.log("User Found By User Principal Name: ", this.userFoundByUserPrincipalName);
          console.log('=============================');
          console.log('\n\n');

        });


      }
      else {
        //found all users by email
        //stats
        console.log('\n\n');
        console.log('=============================');
        console.log("Total Unique Users: ", users.length);
        console.log("User Found By Email: ", this.userFoundByEmail);
        console.log('=============================');
        console.log('\n\n');

      }



    });


  }


  private findSPUserByEmail = (userEmail: string): Promise<any> => {


    // return sp.web.siteUsers.getByEmail(userEmail).get().then(user => {

    //   if (user) {

    //     this.userFoundByEmail++;
    //     const currentUserPrincipalId: number = user['Id'];
    //     console.log(`SP user found by email: ${userEmail}, SP User Id: ${currentUserPrincipalId}`);
    //   }
    //   else {
    //     console.log(`SP user not found by email: ${userEmail}`);
    //   }



    // });

    return sp.web.siteUsers.filter(`Email eq '${userEmail}'`).get().then(users => {

      if (users.length > 0) {

        this.userFoundByEmail++;
        const currentUserPrincipalId: number = users[0]['Id'];
        console.log(`SP user found by email: ${userEmail}, SP User Id: ${currentUserPrincipalId}`);
      }
      else {
        console.log(`SP user not found by email: ${userEmail}`);
        this.usersToTryByUserPrincipalName.push(userEmail);
      }



    });

  }

  private findSPUserByUserPrincipalName = (userEmail: string): Promise<any> => {

    return sp.web.siteUsers.filter(`UserPrincipalName eq '${userEmail}'`).get().then(users => {

      if (users.length > 0) {

        this.userFoundByUserPrincipalName++;
        const currentUserPrincipalId: number = users[0]['Id'];
        console.log(`SP user found by UserPrincipalName: ${userEmail}, SP User Id: ${currentUserPrincipalId}`);
      }
      else {
        console.log(`SP user not found by UserPrincipalName: ${userEmail}`);
      }



    });

  }

  private allSiteUsersLog = (): void => {

    sp.web.siteUsers.get().then(users => {
      console.log('siteUsers', users);
    });

  }

  private currentSiteUsersLog = (): void => {

    sp.web.currentUser.get().then(user => {
      console.log('currentSiteUser', user);
    });

  }

  private siteUserByEmailLog = (): void => {

    sp.web.siteUsers.getByEmail('tas.tasniem@beisdigitalsvc.onmicrosoft.com').get().then(user => {
      console.log('currentSiteUser', user);
    });

  }

  private siteUserByLoginLog = (): void => {

    sp.web.siteUsers.getByLoginName('tas.tasniem@beisdigitalsvc.onmicrosoft.com').get().then(user => {
      console.log('currentSiteUser', user);
    });

  }

  private siteUserByEmail2Log = (): void => {

    sp.web.siteUsers.filter("Email eq 'tas.tasniem@beisdigitalsvc.onmicrosoft.com'").get().then(user => {
      if(user.length > 0){
        console.log('user found', user[0]);
      }
      else{
        console.log('user not found');
      }
      
    });

  }

  private siteUserByUserPrincipalNameLog = (): void => {

    sp.web.siteUsers.filter("UserPrincipalName eq 'tas.tasniem@beisdigitalsvc.onmicrosoft.com'").get().then(user => {
      if(user.length > 0){
        console.log('user found', user[0]);
      }
      else{
        console.log('user not found');
      }
      
    });

  }


}
