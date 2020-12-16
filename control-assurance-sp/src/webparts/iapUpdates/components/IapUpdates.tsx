import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';
import Section from '../../../components/iap/Section';
import Section2 from '../../../components/iap/Section2';
import ActionUpdatesTab from '../../../components/iap/ActionUpdatesTab';
import GroupActionsTab from '../../../components/iap/GroupActionsTab';

import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IUser, IEntity, } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import { CrEntityPicker } from '../../../components/cr/CrEntityPicker';
import styles from '../../../styles/cr.module.scss';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination

export interface ILookupData {
  Users: IUser[];
}

export class LookupData implements ILookupData {

  public Users = null;

}

export interface IIapUpdatesState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
  SelectedUserIds: number[];


  SelectedPivotKey: string;

  Section1_IsOpen: boolean;
  Section1_MainList_ListFilterText: string;

  Section2_IsOpen: boolean;
  Section2_MainList_ListFilterText: string;

  //common for both sections
  Section_MainList_SelectedId: number;
  Section_MainList_FilteredItems: any[];
  Section_MainList_SelectedItem_ActionOwnerPermission:boolean;

  MainListsSaveCounter: number;

  ShowingGroupUpdates:boolean;

  GroupsList_SelectedId: number;


}
export class IapUpdatesState extends types.UserContextWebPartState implements IIapUpdatesState {
  public LookupData = new LookupData();

  public SelectedUserIds: number[] = [];
  public SelectedPivotKey = "Management Action Plans"; //default, 1st tab selected

  public Section1_IsOpen: boolean = false;
  public Section1_MainList_ListFilterText: string = null;

  public Section2_IsOpen: boolean = false;
  public Section2_MainList_ListFilterText: string = null;

  //common for both sections
  public Section_MainList_SelectedId: number = 0;
  public Section_MainList_FilteredItems = [];
  public Section_MainList_SelectedItem_ActionOwnerPermission = false;

  public MainListsSaveCounter: number = 0;

  public ShowingGroupUpdates:boolean = false;
  public GroupsList_SelectedId:number = 0;

  constructor() {
    super();
  }
}

//#endregion types defination

export default class IapUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, IapUpdatesState> {


  //private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);

  //private isDefultUserSet:boolean = false;
  private readonly headerTxt_MainTab: string = "Management Action Plans";
  private readonly headerTxt_GroupActionsTab: string = "Group Actions";
  private readonly headerTxt_ActionUpdatesTab: string = "Action Updates";


  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new IapUpdatesState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {



    return (

      <Pivot onLinkClick={this.handlePivotClick} selectedKey={`${this.state.SelectedPivotKey}`}>
        <PivotItem headerText={this.headerTxt_MainTab} itemKey={this.headerTxt_MainTab}>
          {this.renderMainTab()}
        </PivotItem>
        {this.renderGroupActionsTab()}
        {this.renderActionUpdatesTab()}


      </Pivot>
    );
  }

  private renderMainTab(): React.ReactElement<types.IWebPartComponentProps> {
    const { LookupData: lookups } = this.state;


    const viewOtherActionOwnersPermission: boolean = this.viewOtherActionOwnersPermission();



    return (
      <div>
        <CrLoadingOverlayWelcome isLoading={this.state.Loading} />

        {this.state.User && <div>
          
          {viewOtherActionOwnersPermission && <div>
            <div style={{ marginTop: '15px' }}>
              Select other Action Owners to view their Action Plans
          </div>
            <div style={{ paddingTop: "10px" }}>
              <CrEntityPicker
                //key={usersPickerKey}
                displayForUser={true}
                entities={this.state.LookupData.Users}
                itemLimit={10}
                selectedEntities={this.state.SelectedUserIds.map((id) => { return id; })}
                onChange={(v) => this.changeMultiUserPicker(v)}


              />
            </div>
          </div>}

          <br />


          <div>
            <Section
              isArchive={false}
              sectionTitle="Open Actions"
              onItemTitleClick={this.handleSection_MainListItemTitleClick}
              section_IsOpen={this.state.Section1_IsOpen}
              onSection_toggleOpen={this.handleSection1_toggleOpen}
              listFilterText={this.state.Section1_MainList_ListFilterText}
              onChangeFilterText={this.handleSection1_ChangeFilterText}
              userIdsArr={this.state.SelectedUserIds}
              onMainSaved={this.handleMainFormSaved}
              mainListsSaveCounter={this.state.MainListsSaveCounter}
              superUserPermission={this.isSuperUser()}
              currentUserId={this.getCurrentUserId()}
              {...this.props}
            />

            <Section
              isArchive={true}
              sectionTitle="Archived Actions"
              onItemTitleClick={this.handleSection_MainListItemTitleClick}
              section_IsOpen={this.state.Section2_IsOpen}
              onSection_toggleOpen={this.handleSection2_toggleOpen}
              listFilterText={this.state.Section2_MainList_ListFilterText}
              onChangeFilterText={this.handleSection2_ChangeFilterText}
              userIdsArr={this.state.SelectedUserIds}
              onMainSaved={this.handleMainFormSaved}
              mainListsSaveCounter={this.state.MainListsSaveCounter}
              superUserPermission={this.isSuperUser()}
              currentUserId={this.getCurrentUserId()}
              {...this.props}
            />



          </div>




        </div>}
      </div>
    );
  }

  private renderGroupActionsTab() {
    if (this.state.ShowingGroupUpdates === true && (this.state.SelectedPivotKey === this.headerTxt_GroupActionsTab || this.state.SelectedPivotKey === this.headerTxt_ActionUpdatesTab)) {
      return (

        <PivotItem headerText={this.headerTxt_GroupActionsTab} itemKey={this.headerTxt_GroupActionsTab}>
          {this.renderGroupActions()}
        </PivotItem>

      );
    }
    else
      return <React.Fragment></React.Fragment>;
  }

  private renderActionUpdatesTab() {
    if (this.state.SelectedPivotKey === this.headerTxt_ActionUpdatesTab) {
      return (

        <PivotItem headerText={this.headerTxt_ActionUpdatesTab} itemKey={this.headerTxt_ActionUpdatesTab}>
          {this.renderActionUpdates()}
        </PivotItem>

      );
    }
    else
      return <React.Fragment></React.Fragment>;
  }


  private renderGroupActions(): React.ReactElement<types.IWebPartComponentProps> {

    return(
      <GroupActionsTab
        iapActionId={this.state.Section_MainList_SelectedId}
        onShowList={this.handleShowListSection1_fromGroup}
        onItemTitleClick={this.handle_GroupsListItemTitleClick}
        {...this.props}
      />
    );

  }

  private renderActionUpdates(): React.ReactElement<types.IWebPartComponentProps> {

    const iapActionId:number = this.state.ShowingGroupUpdates === true ? this.state.GroupsList_SelectedId : this.state.Section_MainList_SelectedId;

    return (
      <ActionUpdatesTab
        iapActionId={iapActionId}
        filteredItemsMainList={this.state.Section_MainList_FilteredItems}
        onShowList={this.handleShowListSection1}
        superUserPermission={this.isSuperUser()}
        actionOwnerPermission={this.state.Section_MainList_SelectedItem_ActionOwnerPermission}
        currentUserId={this.getCurrentUserId()}
        showingGroupUpdates={this.state.ShowingGroupUpdates}
        {...this.props}
      />


    );
  }









  //#endregion Render


  //#region Data Load




  private loadUsers = (): Promise<IUser[]> => {
    return this.userService.readAll().then((data: IUser[]): IUser[] => {
      this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Users", data) },);
      return data;
    }, (err) => { if (this.onError) this.onError(`Error loading Users lookup data`, err.message); });
  }



  protected loadLookups(): Promise<any> {

    return Promise.all([

      this.loadUsers(),


    ]);
  }

  //#endregion Data Load

  //#region Permissions

  private isSuperUser(): boolean {

    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 11) {
        //super user
        return true;
      }
    }

    return false;
  }

  private viewOtherActionOwnersPermission(): boolean {

    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 11 || up.PermissionTypeId == 12) {
        //super user or MAViewOtherActionOwners
        return true;
      }
    }

    return false;
  }

  private getCurrentUserId = ():number =>{
    let userId:number = 0;
    if(this.state.User){
      userId = this.state.User.ID;
    }

    return userId;
  }




  //#endregion Permissions

  //#region event handlers






  private handlePivotClick = (item: PivotItem): void => {
    console.log('tab clicked', item);
    this.clearErrors();
    //following conditoin is to resolve bug in the users picker, so by closing a section and opening again resolves the bug
    if(item.props.headerText === this.headerTxt_MainTab){
      if(this.state.Section1_IsOpen === true){
        this.setState({ SelectedPivotKey: item.props.headerText, Section1_IsOpen: false }, this.handleSection1_toggleOpen);
      }
      else if(this.state.Section2_IsOpen === true){
        this.setState({ SelectedPivotKey: item.props.headerText, Section2_IsOpen: false }, this.handleSection2_toggleOpen);
      }
      
    }
    else{
      this.setState({ SelectedPivotKey: item.props.headerText });
    }
    

  }

  private handleSection_MainListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {
    
    console.log('on main list item title click ', ID, title, filteredItems);


    const currentUderId:number = this.getCurrentUserId();
    console.log('on rec list current user id ', currentUderId);

    let actionOwnerPermission:boolean = false;

    const currentAction = filteredItems.filter(x => x['ID'] === ID);

    let ownerIdsStr:string = "";
    let iapTypeId: number = 0;
    if(currentAction.length > 0){
      ownerIdsStr = currentAction[0]["OwnerIds"];
      const ownerIdsArr:string[] = ownerIdsStr.split(',');


      
      for (let i = 0; i < ownerIdsArr.length; i++) {
      
        let ownerId:number = Number(ownerIdsArr[i]);
        if(ownerId === currentUderId){
          actionOwnerPermission = true;
          break;
        }
      }

      iapTypeId = Number(currentAction[0]["IAPTypeId"]);
      

    }

    console.log('action owner permission', actionOwnerPermission);
    console.log('IAPTypeId', iapTypeId);

    const filteredItemWithoutGroupActions = filteredItems.filter(x => Number(x["IAPTypeId"]) !== 2);

    this.setState({
      ShowingGroupUpdates: (iapTypeId === 2) ? true : false,
      SelectedPivotKey: (iapTypeId === 2) ? this.headerTxt_GroupActionsTab : this.headerTxt_ActionUpdatesTab,
      Section_MainList_SelectedId: ID,
      Section_MainList_SelectedItem_ActionOwnerPermission: actionOwnerPermission,
      Section_MainList_FilteredItems: filteredItemWithoutGroupActions,
    });
  }



  private handleSection1_toggleOpen = (): void => {
    this.setState({ Section1_IsOpen: !this.state.Section1_IsOpen });
  }

  private handleSection1_ChangeFilterText = (value: string): void => {
    this.setState({ Section1_MainList_ListFilterText: value });
  }

  private handleSection2_toggleOpen = (): void => {
    this.setState({ Section2_IsOpen: !this.state.Section2_IsOpen });
  }

  private handleSection2_ChangeFilterText = (value: string): void => {
    this.setState({ Section2_MainList_ListFilterText: value });
  }


  private handleShowListSection1_fromGroup = (): void => {
    console.log('in handleShowListSection1');
    this.clearErrors();

    //following conditoin is to resolved bug in the users picker, so by closing a section and opening again resolves the bug
    if(this.state.Section1_IsOpen === true){
      this.setState({ SelectedPivotKey: this.headerTxt_MainTab, Section1_IsOpen: false }, this.handleSection1_toggleOpen);
    }
    else if(this.state.Section2_IsOpen === true){
      this.setState({ SelectedPivotKey: this.headerTxt_MainTab, Section2_IsOpen: false }, this.handleSection2_toggleOpen);
    }



    
    this.changeMultiUserPicker(this.state.SelectedUserIds);
  }

  private handleShowListSection1 = (): void => {
    console.log('in handleShowListSection1');
    this.clearErrors();

    if(this.state.ShowingGroupUpdates === true){
      this.setState({
        SelectedPivotKey: this.headerTxt_GroupActionsTab
      });
    }
    else{

          //following conditoin is to resolved bug in the users picker, so by closing a section and opening again resolves the bug
    if(this.state.Section1_IsOpen === true){
      this.setState({ SelectedPivotKey: this.headerTxt_MainTab, Section1_IsOpen: false }, this.handleSection1_toggleOpen);
    }
    else if(this.state.Section2_IsOpen === true){
      this.setState({ SelectedPivotKey: this.headerTxt_MainTab, Section2_IsOpen: false }, this.handleSection2_toggleOpen);
    }



    
    this.changeMultiUserPicker(this.state.SelectedUserIds);

    }


  }

  private handleMainFormSaved = (): void => {

    const x: number = this.state.MainListsSaveCounter + 1;
    console.log('in handleMainFormSaved', x);
    this.setState({ MainListsSaveCounter: x });

  }


  private handle_GroupsListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {
    
    console.log('handle_GroupsListItemTitleClick', ID, title, filteredItems);


    const currentUderId:number = this.getCurrentUserId();
    console.log('on rec list current user id ', currentUderId);

    let actionOwnerPermission:boolean = false;

    const currentAction = filteredItems.filter(x => x['ID'] === ID);

    let ownerIdsStr:string = "";
    if(currentAction.length > 0){
      ownerIdsStr = currentAction[0]["OwnerIds"];
      //console.log('ownerIdsStr', ownerIdsStr);
      const ownerIdsArr:string[] = ownerIdsStr.split(',');
      //console.log('ownerIdsArr', ownerIdsArr);


      
      for (let i = 0; i < ownerIdsArr.length; i++) {
      
        let ownerId:number = Number(ownerIdsArr[i]);
        if(ownerId === currentUderId){
          actionOwnerPermission = true;
          break;
        }
      }


      

    }

    console.log('action owner permission', actionOwnerPermission);

    this.setState({
      ShowingGroupUpdates: true,
      SelectedPivotKey: this.headerTxt_ActionUpdatesTab,
      GroupsList_SelectedId: ID,
      Section_MainList_SelectedItem_ActionOwnerPermission: actionOwnerPermission,
      Section_MainList_FilteredItems: filteredItems
    });
  }










  private changeMultiUserPicker = (value: number[]): void => {


    //to avoid same user to add multiple times
    const valuesUnique = value.filter((item, pos) => {
      return value.indexOf(item) == pos;
    });
    value = valuesUnique;


    console.log('changeMultiUserPicker', value, value.join(','));
    this.setState({ SelectedUserIds: value });


  }


  //#endregion event handlers

}


