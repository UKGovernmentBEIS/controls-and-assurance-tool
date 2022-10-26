import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';

import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType } from '../../../types/GenColumn';
import { IUserPermission } from '../../../types/UserPermissions';
import { ICLCase, ICLCaseEvidence, ICLHiringMember, IUser } from '../../../types';
import { sp, ChunkedFileUploadProgressData, Folder, SharePointQueryableSecurable } from '@pnp/sp';
import { Promise } from 'es6-promise';
import { CrTextField } from '../../../components/cr/CrTextField';
import { getUploadFolder_CLEvidence, getUploadFolder_CLRoot, getUploadFolder_Report } from '../../../types/AppGlobals';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination


export interface IUserManagementState extends types.IUserContextWebPartState {
  Cases: ICLCase[];
  Users: IUser[];
  CLSuperUsersAndViewers: IUser[];
  SearchUser: string;
  FullControlFolderRoleId: number;
  CurrentUserPrincipalId: number;
  SetFolderPermissionsPressed:boolean;
  SetFolderPermissionsCompleted:boolean;

}
export class UserManagementState extends types.UserContextWebPartState {

  public Cases: ICLCase[] = [];
  public Users: IUser[] = [];
  public CLSuperUsersAndViewers: IUser[] = [];
  public SearchUser: string = "";
  public FullControlFolderRoleId: number = 0;
  public CurrentUserPrincipalId: number =0;
  public SetFolderPermissionsPressed:boolean = false;
  public SetFolderPermissionsCompleted:boolean = false;


  constructor() {
    super();
  }
}

//#endregion types defination

export default class UserManagement extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, UserManagementState> {

  private clCaseService: services.CLCaseService = new services.CLCaseService(this.props.spfxContext, this.props.api);
  private clWorkerService: services.CLWorkerService = new services.CLWorkerService(this.props.spfxContext, this.props.api);

  private userFoundByEmail: number = 0;
  private userFoundByUserPrincipalName: number = 0;
  private usersToTryByUserPrincipalName: string[] = [];
  private UploadFolder_CLRoot: string = "";
  private totalCases:number=0;
  private totalCasesProcessed:number = 0;

  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.UploadFolder_CLRoot = getUploadFolder_CLRoot(props.spfxContext);
    this.state = new UserManagementState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (

        <React.Fragment>
          <div>
            <strong>Important Note: </strong> If you change any user permissions, please go into Set Folder Permissions and follow the instructions to ensure Sharepoint level Folder permissions are adjusted.
            <br/>
            <br/>
            <br/>
          </div>
          <Pivot onLinkClick={this.clearErrors}>
            <PivotItem headerText="Users">
              {this.renderUsers()}
            </PivotItem>
            <PivotItem headerText="User Permissions">
              {this.renderUserPermissions()}
            </PivotItem>
            <PivotItem headerText="Set Folder Permissions">
              {this.renderSetFolderPermissions()}
            </PivotItem>
            
            <PivotItem headerText="Debug Info">
              {this.renderTest1()}
            </PivotItem>
            
            {/* <PivotItem headerText="Permission Types">
              {this.renderPermissionTypes()}
            </PivotItem>  */}


          </Pivot>
        </React.Fragment>
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

    if(this.state.UserPermissions === null) return null;

    if(this.sysManagerPermission() === false) return null;

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
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.allSiteUsersInfoListLog}>All Users Info List</span>
          <br />
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.allSiteUsersInfoList2Log}>All Users Info List 2</span>
          <br />
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.currentSiteUsersLog}>Current User</span>
          <br />
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.siteUserByLoginLog}>User by Login</span>
          <br />
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.siteUserByEmail2Log}>User by Email 2</span>
          <br />
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.siteUserByUserPrincipalNameLog}>User by PrincipalName</span>

          <br /><br /><br />
          <CrTextField
            //className={styles.formField}
            onChanged={(v) => this.changeSearchUserTextField(v)}
            value={this.state.SearchUser}

          />
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.siteUserBySearchLog}>User by Search</span>
          &nbsp;&nbsp;
          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.siteUserByEmailLog}>User by Email</span>
          <br />

          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.copyFile}>Copy File test</span>
          <br />

          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.createExistingCLCasesFolders}>Create existing CLCases Folders</span>
          <br />

          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.copyAllCasesEvDocs}>Copy all CLCases EV docs</span>
          <br />

          <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.copyAllCasesPDFs}>Copy all CLCases PDFs</span>
          <br />

        </div>
      </React.Fragment>
    );
  }

  private renderSetFolderPermissions():React.ReactElement<types.IWebPartComponentProps>{
    return (
      <React.Fragment>
      <div style={{ paddingTop: '15px' }}>
        Click the 'Set Folder Permissions' button below to reset all Sharepoint folder level permissions for record level folder.
        <br/>
        Note this is necessary whenever you change User Permissions.

        <br/>
        <br/>
        <PrimaryButton
              text="Set Folder Permissions"
              onClick={this.setFolderPermissions}
              disabled={this.state.SetFolderPermissionsPressed}
            />

        {this.state.SetFolderPermissionsPressed === true && this.state.SetFolderPermissionsCompleted === false && <div style={{ paddingTop: '15px' }}>
          Progress: Folder permissions are being updates.
          <br/>
          <br/>
          <strong>Please do not close this browser or click to another module from menu or press refresh, until this message changes. </strong>
          </div> }

        {this.state.SetFolderPermissionsCompleted && <div style={{ paddingTop: '15px' }}>
          <strong>Progress: Folder permissions have being updated. You may close this browser now.</strong>
        </div> }


        </div>
      

      </React.Fragment>
      );
  }



  private setFolderPermissions = (): void => {
    
      this.totalCases=0;
      this.totalCasesProcessed=0;

      this.setState({ SetFolderPermissionsPressed:true });

      this.totalCases = this.state.Cases.length;
      console.log('total cased:', this.totalCases);

      let promisesReload = [];
      promisesReload.push(this.loadUsers());
      promisesReload.push(this.loadAllCLSuperUsersAndViewers());

      Promise.all(promisesReload).then(() => {
        console.log('users loaded');
        this.state.Cases.forEach(c => {
          console.log('start folder permission for case ', c.ID);        
          const folderNewUsers: string[] = this.makeCLFolderNewUsersArr(c);
          this.resetFolderPermissionsAfterEditCase(String(c.ID), folderNewUsers);

        });

      });



      const interval = setInterval(()=> {
        // method to be executed;
        console.log('set interval called');
        if(this.totalCases <= this.totalCasesProcessed){
          clearInterval(interval);
          console.log('all folders processed');
          this.setState({ SetFolderPermissionsCompleted:true });
        }
      }, 2000);

    
  }

  private makeCLFolderNewUsersArr = (caseData: ICLCase): string[] => {
    let users: string[] = [];

    //hiring manager
    if (caseData.ApplHMUserId > 0) {
      const u1 = this.state.Users.filter(x => x.ID === caseData.ApplHMUserId)[0];
      users.push(u1.Username);
    }

    //hiring members
    const hiringMembers: ICLHiringMember[] = caseData['CLHiringMembers'];
    hiringMembers.forEach(m => {
      const u1 = this.state.Users.filter(x => x.ID === m.UserId)[0];
      users.push(u1.Username);
    });

    //BH
    if (caseData.BHUserId > 0) {
      const u1 = this.state.Users.filter(x => x.ID === caseData.BHUserId)[0];
      users.push(u1.Username);
    }

    //FBP
    if (caseData.FBPUserId > 0) {
      const u1 = this.state.Users.filter(x => x.ID === caseData.FBPUserId)[0];
      users.push(u1.Username);
    }

    //HRBP
    if (caseData.HRBPUserId > 0) {
      const u1 = this.state.Users.filter(x => x.ID === caseData.HRBPUserId)[0];
      users.push(u1.Username);
    }

    //Superusers/viewers
    this.state.CLSuperUsersAndViewers.forEach(su => {
      users.push(su.Username);
    });





    return users;
  }

  private resetFolderPermissionsAfterEditCase = (casefolderName: string, folderNewUsers: string[]) => {

    sp.web.getFolderByServerRelativeUrl(this.UploadFolder_CLRoot).folders.getByName(casefolderName).getItem().then((folderItem: SharePointQueryableSecurable) => {

      let promisesRemove = [];

      folderItem.roleAssignments.get().then(rass => {

        rass.forEach(ra => {
          const principalId: number = Number(ra['PrincipalId']);
          console.log('principalId', principalId);
          if(principalId !== this.state.CurrentUserPrincipalId)
            promisesRemove.push(this.removeFolderRoleBySiteUserId(principalId, folderItem));
          else
            console.log('not adding current user in folder permission remove list');

        });
      }).then(() => {

        Promise.all(promisesRemove).then(() => {

          let promisesAddUser = [];
          folderNewUsers.forEach(userEmail => {
            promisesAddUser.push(this.addFolderRole(userEmail, folderItem));
          });

          Promise.all(promisesAddUser).then(() => {
            console.log('folder new users are added');
            this.totalCasesProcessed++;
            console.log('total cases processed:', this.totalCasesProcessed);
          });


        });

      });


    });
  }

  private removeFolderRoleBySiteUserId = (siteUserId: number, folderItem: SharePointQueryableSecurable): Promise<any> => {

    return folderItem.roleAssignments.remove(siteUserId, this.state.FullControlFolderRoleId).then(roleAddedValue => {
      console.log(`role removed for user ${siteUserId}`);
    });
  }

  private addFolderRole = (userEmail: string, folderItem: SharePointQueryableSecurable): Promise<any> => {

    //let promises = [];

    return sp.web.siteUsers.getByEmail(userEmail).get().then(user => {

      const userId: number = Number(user['Id']);
      console.log('userId', userId);

      folderItem.roleAssignments.add(userId, this.state.FullControlFolderRoleId).then(roleAddedValue => {
        console.log(`role added for user ${userEmail}`);
      });

    }).catch(e => {
      console.log('error', e);
      sp.web.ensureUser(userEmail).then(userEnsured => {
        const userId: number = userEnsured.data.Id;
        console.log('UserIdEnured', userId);
        folderItem.roleAssignments.add(userId, this.state.FullControlFolderRoleId).then(roleAddedValue => {
          console.log(`role added for ensured user ${userEmail}`);
        });
      });
      
    });

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

  private sysManagerPermission(): boolean {

    //SysManager check
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 2) {
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
    const qryStr: string = "?$filter=CaseCreated eq true&$expand=CLHiringMembers($expand=User($select=Username,ID))";
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
      console.log('loadAllCLSuperUsersAndViewers loaded');
      //console.log('SuperUsersAndViewers', data);
    }, (err) => { if (this.onError) this.onError(`Error loading super users`, err.message); });
    return x;
  }

  private loadSPFoldersCoreStuff = (): void => {

    //get doc lib rolder role Full Control Id and set in state
    sp.web.roleDefinitions.getByName('Full Control').get().then(r => {
      //console.log('r', r);
      const roleId: number = r['Id'];
      this.setState({ FullControlFolderRoleId: roleId });
    });

        //get current user sharepoint id (PrincipalId) and set in state
        sp.web.currentUser.get().then(u => {
          console.log('currentSiteUser', u);
          const currentUserPrincipalId: number = Number(u['Id']);
          console.log('currentUserPrincipalId', currentUserPrincipalId);
          this.setState({ CurrentUserPrincipalId: currentUserPrincipalId });
        });

  }

  protected loadLookups(): Promise<any> {

    return Promise.all([
      this.loadSPFoldersCoreStuff(),
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
    this.state.Users.forEach(su => {
      users.push(su.Username);
    });


    // this.state.Cases.forEach(caseData => {
    //   console.log('caseId', caseData.ID);
    //   //hiring manager
    //   if (caseData.ApplHMUserId > 0) {
    //     const u1 = this.state.Users.filter(x => x.ID === caseData.ApplHMUserId)[0].Username;
    //     if (users.indexOf(u1) === -1) users.push(u1);
    //   }

    //   //hiring members
    //   const hiringMembers: ICLHiringMember[] = caseData['CLHiringMembers'];
    //   hiringMembers.forEach(m => {
    //     const u1 = this.state.Users.filter(x => x.ID === m.UserId)[0].Username;
    //     if (users.indexOf(u1) === -1) users.push(u1);
    //   });

    //   //BH
    //   if (caseData.BHUserId > 0) {
    //     const u1 = this.state.Users.filter(x => x.ID === caseData.BHUserId)[0].Username;
    //     if (users.indexOf(u1) === -1) users.push(u1);
    //   }

    //   //FBP
    //   if (caseData.FBPUserId > 0) {
    //     const u1 = this.state.Users.filter(x => x.ID === caseData.FBPUserId)[0].Username;
    //     if (users.indexOf(u1) === -1) users.push(u1);
    //   }

    //   //HRBP
    //   if (caseData.HRBPUserId > 0) {
    //     const u1 = this.state.Users.filter(x => x.ID === caseData.HRBPUserId)[0].Username;
    //     if (users.indexOf(u1) === -1) users.push(u1);
    //   }


    // });

    console.log('after building unique users', users);

    //get info from sp
    let promisesUsersByEmail = [];
    let promisesUsersByUserPrincipalName = [];

    users.forEach(userEmail => {

      console.log(`trying to find sp user by email: ${userEmail}`);
      promisesUsersByEmail.push(this.findSPUserByEmail(userEmail));


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


    return sp.web.siteUsers.getByEmail(userEmail).get().then(user => {

      if (user) {

        this.userFoundByEmail++;
        const currentUserPrincipalId: number = user['Id'];
        console.log(`SP user found by email: ${userEmail}, SP User Id: ${currentUserPrincipalId}`);
      }
      else {
        console.log(`SP user not found by email: ${userEmail}`);
        this.usersToTryByUserPrincipalName.push(userEmail);
      }

    }).catch(err => {
      console.log(err, `Exception, SP user not found by email: ${userEmail}`);
      this.usersToTryByUserPrincipalName.push(userEmail);

    });

    // return sp.web.siteUsers.filter(`Email eq '${userEmail}'`).get().then(users => {

    //   if (users.length > 0) {

    //     this.userFoundByEmail++;
    //     const currentUserPrincipalId: number = users[0]['Id'];
    //     console.log(`SP user found by email: ${userEmail}, SP User Id: ${currentUserPrincipalId}`);
    //   }
    //   else {
    //     console.log(`SP user not found by email: ${userEmail}`);
    //     this.usersToTryByUserPrincipalName.push(userEmail);
    //   }



    // });

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


  private allSiteUsersInfoListLog = (): void => {

    sp.web.siteUserInfoList.items.get().then(users => {
      console.log('siteUserInfoList', users);
    });

  }

  private allSiteUsersInfoList2Log = (): void => {

    sp.web.siteUserInfoList.items.getAll().then(users => {
      console.log('siteUserInfoList2', users);
    });

  }

  private currentSiteUsersLog = (): void => {

    sp.web.currentUser.get().then(user => {
      console.log('currentSiteUser', user);
    });

  }

  private siteUserByEmailLog = (): void => {



    sp.web.siteUsers.getByEmail(this.state.SearchUser).get().then(user => {
      console.log('getByEmail', user);
      console.log('UserId', user['Id']);
    }).catch(e => {
      console.log('error', e);
      sp.web.ensureUser(this.state.SearchUser).then(xx => {
        console.log('xx', xx);
        console.log('UserId', xx.data.Id);
      });
      
    });

  }

  private siteUserByLoginLog = (): void => {

    sp.web.siteUsers.getByLoginName('tas.tasniem@beisdigitalsvc.onmicrosoft.com').get().then(user => {
      console.log('currentSiteUser', user);
    });

  }

  private siteUserByEmail2Log = (): void => {

    sp.web.siteUsers.filter("Email eq 'tas.tasniem@beisdigitalsvc.onmicrosoft.com'").get().then(user => {
      if (user.length > 0) {
        console.log('user found', user[0]);
      }
      else {
        console.log('user not found');
      }

    });

  }

  private siteUserByUserPrincipalNameLog = (): void => {

    sp.web.siteUsers.filter("UserPrincipalName eq 'tas.tasniem@beisdigitalsvc.onmicrosoft.com'").get().then(user => {
      if (user.length > 0) {
        console.log('user found', user[0]);
      }
      else {
        console.log('user not found');
      }

    });

  }

  private siteUserBySearchLog = (): void => {

    //https://www.odata.org/documentation/odata-version-2-0/uri-conventions/
    //many ways to search
    //UserPrincipalName eq 'tas.tasniem@beisdigitalsvc.onmicrosoft.com'
    //Id eq 12
    //startswith(Email, 'adnan')
    //substringof('tas_', LoginName) eq true - working for search in the middle on text example "i:0#.f|membership|tas_swiftpro.com#ext#@beisdigitalsvc.onmicrosoft.com"
    //endswith(Email, 'com') eq true - not worked


    sp.web.siteUsers.filter(this.state.SearchUser).get().then(user => {
      if (user.length > 0) {
        console.log(`${user.length} user found`, user);
      }
      else {
        console.log('user not found');
      }

    });

  }

  private copyFile = (): void => {

    const srcFolder = getUploadFolder_CLEvidence(this.props.spfxContext);
    const destFolder = getUploadFolder_CLRoot(this.props.spfxContext) + "/Test1/" + this.state.SearchUser;

    sp.web.getFolderByServerRelativeUrl(srcFolder).files.getByName(this.state.SearchUser).copyTo(destFolder).then(() => {
      console.log('file copied');
      
    }).catch(err => {
      console.log('error', err);
    });

  }

  private createExistingCLCasesFolders = (): void => {
    const spService = new services.SPService(this.props.spfxContext);
    this.state.Cases.forEach(clCase => {
      console.log('going to create folder for case ', clCase.ID);
      const folderNewUsers: string[] = spService.makeCLFolderNewUsersArr(clCase, this.state.Users, this.state.CLSuperUsersAndViewers);
      spService.createNewCaseUploadFolder(String(clCase.ID), folderNewUsers, this.state.FullControlFolderRoleId);
    });
  }

  private copyAllCasesEvDocs = (): void => {
    const srcFolder = getUploadFolder_CLEvidence(this.props.spfxContext);
    const clRootFolder = getUploadFolder_CLRoot(this.props.spfxContext);
    const caseEvService = new services.CLCaseEvidenceService(this.props.spfxContext, this.props.api);

    caseEvService.readAll(`?$filter=AttachmentType eq 'PDF' and RecordCreated eq true`).then(evs => {
      evs.forEach(ev => {
        console.log(`going to copy ev with ID: ${ev.ID} and filename: ${ev.Title}`);
        if(ev.EvidenceType === 'ContractorSecurityCheck'){
          //parentID is worker id, get case id for that worker
          this.clWorkerService.readAll(`?$filter=ID eq ${ev.ParentId}&$select=CLCaseId`).then(ws => {
            if(ws.length > 0){
              const caseId:number = ws[0].CLCaseId;
              console.log('got caseId', caseId);
              this.copyCaseFile(caseId, srcFolder, clRootFolder, ev.Title);
            }
          });
          

        }
        else{
          //parent id is case id
          this.copyCaseFile(ev.ParentId, srcFolder, clRootFolder, ev.Title);
        }

      });

    });

  }

  private copyAllCasesPDFs = (): void => {
    const srcFolder = getUploadFolder_Report(this.props.spfxContext);
    const clRootFolder = getUploadFolder_CLRoot(this.props.spfxContext);
    const workerService = new services.CLWorkerService(this.props.spfxContext, this.props.api);
    
    //case pdf
    workerService.readAll(`?$filter=CasePdfStatus eq 'Cr'&$select=ID,ClCaseId,CasePdfName`).then(workers => {
      workers.forEach(worker =>{
        this.copyCaseFile(worker.CLCaseId, srcFolder, clRootFolder, worker.CasePdfName);
      });
    });

    //SDS pdf
    workerService.readAll(`?$filter=SDSPdfStatus eq 'Cr'&$select=ID,ClCaseId,SDSPdfName`).then(workers => {
      workers.forEach(worker =>{
        this.copyCaseFile(worker.CLCaseId, srcFolder, clRootFolder, worker.SDSPdfName);
      });
    });

  }

  private copyCaseFile = (caseId: number, srcFolder: string, clRootFolder:string, fileName: string): void => {
    const destFile = `${clRootFolder}/${caseId}/${fileName}`;

    sp.web.getFolderByServerRelativeUrl(srcFolder).files.getByName(fileName).copyTo(destFile).then(() => {
      console.log(`file copied ${destFile}`,);
      
    }).catch(err => {
      console.log('error on copy', err);
    });

  }



  private changeSearchUserTextField = (value: string): void => {
    this.setState({ SearchUser: value });
  }


}
