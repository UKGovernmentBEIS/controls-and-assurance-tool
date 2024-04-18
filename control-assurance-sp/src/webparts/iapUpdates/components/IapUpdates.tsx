import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import Section from '../../../components/iap/Section';
import ActionUpdatesTab from '../../../components/iap/ActionUpdatesTab';
import GroupActionsTab from '../../../components/iap/GroupActionsTab';
import { default as GIAARecommendationsTab } from '../../../components/giaaActions/RecommendationsTab';//rename to avoid conflict
import { default as GIAAActionUpdatesTab } from '../../../components/giaaActions/ActionUpdatesTab';//rename to avoid conflict
import { default as NAORecommendationsTab } from '../../../components/tracker/RecommendationsTab';
import { default as NAOPeriodUpdateTab } from '../../../components/tracker/PeriodUpdateTab';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import { IUserPermission, IUser } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import { CrEntityPicker } from '../../../components/cr/CrEntityPicker';

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
  Section_MainList_SelectedTitle: string;
  Section_MainList_FilteredItems: any[];
  Section_MainList_SelectedItem_ActionOwnerPermission: boolean;
  MainListsSaveCounter: number;
  ShowingGroupUpdates: boolean;
  GroupsList_SelectedId: number;
  //GIAA or NAP recs
  //Rec Tab
  RecList_SelectedId: number;
  RecList_SelectedTitle: string;
  RecList_FilteredItems: any[];
  RecList_SelectedItem_ActionOwnerPermission: boolean;
  RecList_SelectedItem_ViewOnly: boolean;
  PeriodId: number;
}
export class IapUpdatesState extends types.UserContextWebPartState implements IIapUpdatesState {
  public LookupData = new LookupData();
  public SelectedUserIds: number[] = [];
  public SelectedPivotKey = "Management Actions"; //default, 1st tab selected
  public Section1_IsOpen: boolean = false;
  public Section1_MainList_ListFilterText: string = null;
  public Section2_IsOpen: boolean = false;
  public Section2_MainList_ListFilterText: string = null;
  //common for both sections
  public Section_MainList_SelectedId: number = 0;
  public Section_MainList_SelectedTitle: string = null;
  public Section_MainList_FilteredItems = [];
  public Section_MainList_SelectedItem_ActionOwnerPermission = false;
  public MainListsSaveCounter: number = 0;
  public ShowingGroupUpdates: boolean = false;
  public GroupsList_SelectedId: number = 0;
  //Rec Tab
  public RecList_SelectedId: number;
  public RecList_SelectedTitle: string;
  public RecList_FilteredItems: any[];
  public RecList_SelectedItem_ActionOwnerPermission: boolean = false;
  public RecList_SelectedItem_ViewOnly = true;
  public PeriodId: number = 0;
  constructor() {
    super();
  }
}

//#endregion types defination

export default class IapUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, IapUpdatesState> {
  private readonly headerTxt_MainTab: string = "Management Actions";
  private readonly headerTxt_GroupActionsTab: string = "Group Actions";
  private readonly headerTxt_ActionUpdatesTab: string = "Action Updates";
  private readonly headerTxt_GIAA_RecommendationsTab: string = "GIAA Recommendations";
  private readonly headerTxt_GIAA_ActionUpdatesTab: string = "GIAA Action Updates";
  private readonly headerTxt_NAO_RecommendationsTab: string = "NAO/PAC Recommendations";
  private readonly headerTxt_NAO_ActionUpdatesTab: string = "NAO/PAC Period Update";

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
        {this.renderGIAARecommendationsTab()}
        {this.renderGIAAActionUpdatesTab()}
        {this.renderNAORecommendationsTab()}
        {this.renderNAOPeriodUpdateTab()}
      </Pivot>
    );
  }

  private renderMainTab(): React.ReactElement<types.IWebPartComponentProps> {
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

    return (
      <GroupActionsTab
        iapActionId={this.state.Section_MainList_SelectedId}
        onShowList={this.handleShowListSection1_fromGroup}
        onItemTitleClick={this.handle_GroupsListItemTitleClick}
        {...this.props}
      />
    );
  }

  private renderActionUpdates(): React.ReactElement<types.IWebPartComponentProps> {
    const iapActionId: number = this.state.ShowingGroupUpdates === true ? this.state.GroupsList_SelectedId : this.state.Section_MainList_SelectedId;
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


  private renderGIAARecommendationsTab() {
    if (this.state.SelectedPivotKey === this.headerTxt_GIAA_RecommendationsTab || this.state.SelectedPivotKey === this.headerTxt_GIAA_ActionUpdatesTab) {
      return (
        <PivotItem headerText={this.headerTxt_GIAA_RecommendationsTab} itemKey={this.headerTxt_GIAA_RecommendationsTab}>
          {this.renderGIAARecommendations()}
        </PivotItem>
      );
    }
    else
      return <React.Fragment></React.Fragment>;
  }
  private renderGIAARecommendations(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <GIAARecommendationsTab
        parentId={this.state.Section_MainList_SelectedId}
        parentTitle={this.state.Section_MainList_SelectedTitle}
        onItemTitleClick={this.handle_GIAA_RecListItemTitleClick}
        onShowList={this.handleShowListSection1_fromGroup}
        incompleteOnly={true}
        justMine={true}
        actionStatusTypeId={0}
        onChangeIncompleteOnly={null}
        onChangeJustMine={null}
        onChangeActionStatusType={null}
        superUserPermission={this.isGiaaSuperUser()}
        consumerName="Management Actions"
        {...this.props}
      />
    );
  }

  private renderGIAAActionUpdatesTab() {
    if (this.state.SelectedPivotKey === this.headerTxt_GIAA_ActionUpdatesTab) {
      return (
        <PivotItem headerText={this.headerTxt_GIAA_ActionUpdatesTab} itemKey={this.headerTxt_GIAA_ActionUpdatesTab}>
          {this.renderGIAAActionUpdates()}
        </PivotItem>
      );
    }
    else
      return <React.Fragment></React.Fragment>;
  }

  private renderGIAAActionUpdates(): React.ReactElement<types.IWebPartComponentProps> {
    return (
      <GIAAActionUpdatesTab
        giaaRecommendationId={this.state.RecList_SelectedId}
        giaaAuditReportId={this.state.Section_MainList_SelectedId}
        filteredItemsRecList={this.state.RecList_FilteredItems}
        filteredItemsMainList={this.state.Section_MainList_FilteredItems}
        onShowList={this.handleShowGIAARecList}
        recListIncompleteOnly={true}
        recListJustMine={true}
        recListActionStatusTypeId={0}
        onChangeMainListID={this.handleSection_MainListChangeSelectedID}
        superUserPermission={this.isGiaaSuperUser()}
        giaaStaffPermission={this.isGIAAStaff()}
        actionOwnerPermission={this.state.RecList_SelectedItem_ActionOwnerPermission}
        {...this.props}
      />
    );
  }

  private renderNAORecommendationsTab() {
    if (this.state.SelectedPivotKey === this.headerTxt_NAO_RecommendationsTab || this.state.SelectedPivotKey === this.headerTxt_NAO_ActionUpdatesTab) {
      return (
        <PivotItem headerText={this.headerTxt_NAO_RecommendationsTab} itemKey={this.headerTxt_NAO_RecommendationsTab}>
          {this.renderNAORecommendations()}
        </PivotItem>
      );
    }
    else
      return <React.Fragment></React.Fragment>;
  }

  private renderNAORecommendations(): React.ReactElement<types.IWebPartComponentProps> {
    return (
      <NAORecommendationsTab
        filteredItems={this.state.Section_MainList_FilteredItems}
        parentId={this.state.Section_MainList_SelectedId}
        periodId={this.state.PeriodId}
        parentTitle={this.state.Section_MainList_SelectedTitle}
        onItemTitleClick={this.handle_NAO_RecListItemTitleClick}
        onShowList={this.handleShowListSection1_fromGroup}
        superUserPermission={this.isSuperUser()}
        dgOrDGMemberPermission={false}
        {...this.props}
      />
    );
  }

  private renderNAOPeriodUpdateTab() {
    if (this.state.SelectedPivotKey === this.headerTxt_NAO_ActionUpdatesTab) {
      return (
        <PivotItem headerText={this.headerTxt_NAO_ActionUpdatesTab} itemKey={this.headerTxt_NAO_ActionUpdatesTab}>
          {this.renderNAOPeriodUpdate()}
        </PivotItem>
      );
    }
    else
      return <React.Fragment></React.Fragment>;
  }

  private renderNAOPeriodUpdate(): React.ReactElement<types.IWebPartComponentProps> {
    return (
      <NAOPeriodUpdateTab
        naoRecommendationId={this.state.RecList_SelectedId}
        naoPeriodId={this.state.PeriodId}
        filteredItems={this.state.RecList_FilteredItems}
        onShowList={this.handleShowNAORecList}
        isViewOnly={this.state.RecList_SelectedItem_ViewOnly}
        {...this.props}
      />
    );
  }

  //#endregion Render


  //#region Data Load

  private loadUsers = (): Promise<IUser[]> => {
    return this.userService.readAll()
      .then((data: IUser[]): IUser[] => {
        this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Users", data) });
        return data;
      })
      .catch((err) => {
        if (this.onError) this.onError(`Error loading Users lookup data`, err.message);
        return null;
      });
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

  private isGiaaSuperUser(): boolean {
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 7) {
        //super user or giaa super user
        return true;
      }
    }

    return false;
  }

  private isGIAAStaff(): boolean {
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 4) {
        //giaa staff
        return true;
      }
    }

    return false;
  }

  private isNAOSuperUser(): boolean {
    //super user/SysManager check
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 8) {
        //super user or nao super user
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

  private getCurrentUserId = (): number => {
    let userId: number = 0;
    if (this.state.User) {
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
    if (item.props.headerText === this.headerTxt_MainTab) {
      if (this.state.Section1_IsOpen === true) {
        this.setState({ SelectedPivotKey: item.props.headerText, Section1_IsOpen: false }, this.handleSection1_toggleOpen);
      }
      else if (this.state.Section2_IsOpen === true) {
        this.setState({ SelectedPivotKey: item.props.headerText, Section2_IsOpen: false }, this.handleSection2_toggleOpen);
      }
    }
    else {
      this.setState({ SelectedPivotKey: item.props.headerText });
    }
  }

  private handleSection_MainListItemTitleClick = (ID_any: any, title: string, filteredItems: any[]): void => {

    console.log('on main list item title click ', ID_any, title, filteredItems);
    if (String(ID_any).search("GIAA_") === 0) {
      //giaa action
      console.log('giaa action');
      let numID = Number(String(ID_any).replace('GIAA_', ''));
      console.log('numID', numID);

      const giaaFilteredItems = filteredItems.filter(x => Number(x["IAPTypeId"]) === 4);
      console.log('giaaFilteredItems', giaaFilteredItems);
      this.setState({
        SelectedPivotKey: this.headerTxt_GIAA_RecommendationsTab,
        Section_MainList_SelectedId: numID,
        Section_MainList_SelectedTitle: title,
        Section_MainList_FilteredItems: giaaFilteredItems
      });

    }
    else if (String(ID_any).search("NAO_") === 0) {
      console.log('nao publication');
      let numID = Number(String(ID_any).replace('NAO_', ''));
      console.log('numID', numID);
      const naoFilteredItems = filteredItems.filter(x => Number(x["IAPTypeId"]) === 5);
      console.log('naoFilteredItems', naoFilteredItems);
      const currentPublication = naoFilteredItems.filter(x => x['ID'] === ID_any);
      const currentPeriodId: number = Number(currentPublication[0]["CurrentPeriodId"]);
      console.log('currentPeriodId', currentPeriodId);
      this.setState({
        SelectedPivotKey: this.headerTxt_NAO_RecommendationsTab,
        Section_MainList_SelectedId: numID,
        Section_MainList_SelectedTitle: title,
        PeriodId: currentPeriodId,
        Section_MainList_FilteredItems: naoFilteredItems
      });
    }
    else {
      //IAP Actions
      const filteredItem_IAPActions = filteredItems.filter(x => Number(x["IAPTypeId"]) === 1 || Number(x["IAPTypeId"]) === 2 || Number(x["IAPTypeId"]) === 3 || Number(x["IAPTypeId"]) === 6);
      console.log('filteredItem_IAPActions', filteredItem_IAPActions);
      const ID: number = Number(ID_any);
      const currentUderId: number = this.getCurrentUserId();
      console.log('on rec list current user id ', currentUderId);
      let actionOwnerPermission: boolean = false;
      const currentAction = filteredItem_IAPActions.filter(x => Number(x['ID']) === ID);
      let ownerIdsStr: string = "";
      let iapTypeId: number = 0;
      if (currentAction.length > 0) {
        ownerIdsStr = currentAction[0]["OwnerIds"];
        const ownerIdsArr: string[] = ownerIdsStr.split(',');
        for (let i = 0; i < ownerIdsArr.length; i++) {
          let ownerId: number = Number(ownerIdsArr[i]);
          if (ownerId === currentUderId) {
            actionOwnerPermission = true;
            break;
          }
        }
        iapTypeId = Number(currentAction[0]["IAPTypeId"]);
      }

      console.log('action owner permission', actionOwnerPermission);
      console.log('IAPTypeId', iapTypeId);
      const filteredItem_Type_1_3 = filteredItem_IAPActions.filter(x => Number(x["IAPTypeId"]) === 1 || Number(x["IAPTypeId"]) === 3 || Number(x["IAPTypeId"]) === 6);
      console.log('filteredItem_Type_1_3', filteredItem_Type_1_3);
      this.setState({
        ShowingGroupUpdates: (iapTypeId === 2) ? true : false,
        SelectedPivotKey: (iapTypeId === 2) ? this.headerTxt_GroupActionsTab : this.headerTxt_ActionUpdatesTab,
        Section_MainList_SelectedId: ID,
        Section_MainList_SelectedItem_ActionOwnerPermission: actionOwnerPermission,
        Section_MainList_FilteredItems: filteredItem_Type_1_3,
      });
    }
  }

  private handleSection_MainListChangeSelectedID = (ID: number): void => {
    console.log('on handleSection_MainListSelectedID', ID);
    this.setState({
      Section_MainList_SelectedId: ID,
    });
  }

  private handle_GIAA_RecListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {
    const currentUderId: number = this.getCurrentUserId();
    console.log('on rec list current user id ', currentUderId);
    console.log('on rec list item title click ', ID, title, filteredItems);
    let actionOwnerPermission: boolean = false;
    const currentRec = filteredItems.filter(x => x['ID'] === ID);
    let ownerIdsStr: string = "";
    if (currentRec.length > 0) {
      ownerIdsStr = currentRec[0]["OwnerIds"];
      const ownerIdsArr: string[] = ownerIdsStr.split(',');
      for (let i = 0; i < ownerIdsArr.length; i++) {
        let ownerId: number = Number(ownerIdsArr[i]);
        if (ownerId === currentUderId) {
          actionOwnerPermission = true;
          break;
        }
      }
    }
    console.log('action owner permission', actionOwnerPermission);
    this.setState({
      SelectedPivotKey: this.headerTxt_GIAA_ActionUpdatesTab,
      RecList_SelectedId: ID,
      RecList_SelectedTitle: title,
      RecList_SelectedItem_ActionOwnerPermission: actionOwnerPermission,
      RecList_FilteredItems: filteredItems
    });
  }

  private handle_NAO_RecListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {
    const currentUderId: number = this.getCurrentUserId();
    console.log('on rec list current user id ', currentUderId);
    console.log('on rec list item title click ', ID, title, filteredItems);
    let assigneePermission: boolean = false;
    const currentRec = filteredItems.filter(x => x['ID'] === ID);
    let assignedToIdsStr: string = "";
    if (currentRec.length > 0) {
      assignedToIdsStr = currentRec[0]["AssignedToIds"];
      const assignedToIdsArr: string[] = assignedToIdsStr.split(',');
      for (let i = 0; i < assignedToIdsArr.length; i++) {
        let assigneeId: number = Number(assignedToIdsArr[i]);
        if (assigneeId === currentUderId) {
          assigneePermission = true;
          break;
        }
      }
    }

    console.log('assignee permission', assigneePermission);
    let recList_SelectedItem_ViewOnly: boolean = true;
    if (this.isNAOSuperUser() === true || assigneePermission === true) {
      recList_SelectedItem_ViewOnly = false;
    }
    console.log('recList_SelectedItem_ViewOnly', recList_SelectedItem_ViewOnly);
    this.setState({
      SelectedPivotKey: this.headerTxt_NAO_ActionUpdatesTab,
      RecList_SelectedId: ID,
      RecList_SelectedTitle: title,
      RecList_SelectedItem_ViewOnly: recList_SelectedItem_ViewOnly,
      RecList_FilteredItems: filteredItems
    });
  }

  private handleSection1_toggleOpen = (): void => {
    this.setState({ Section1_IsOpen: !this.state.Section1_IsOpen });
  }

  private handleSection1_ChangeFilterText = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    this.setState({ Section1_MainList_ListFilterText: newValue });
  }

  private handleSection2_toggleOpen = (): void => {
    this.setState({ Section2_IsOpen: !this.state.Section2_IsOpen });
  }

  private handleSection2_ChangeFilterText = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    this.setState({ Section2_MainList_ListFilterText: newValue });
  }

  private handleShowListSection1_fromGroup = (): void => {
    console.log('in handleShowListSection1');
    this.clearErrors();

    //following conditoin is to resolved bug in the users picker, so by closing a section and opening again resolves the bug
    if (this.state.Section1_IsOpen === true) {
      this.setState({ SelectedPivotKey: this.headerTxt_MainTab, Section1_IsOpen: false }, this.handleSection1_toggleOpen);
    }
    else if (this.state.Section2_IsOpen === true) {
      this.setState({ SelectedPivotKey: this.headerTxt_MainTab, Section2_IsOpen: false }, this.handleSection2_toggleOpen);
    }
    this.changeMultiUserPicker(this.state.SelectedUserIds);
  }

  private handleShowListSection1 = (): void => {
    console.log('in handleShowListSection1');
    this.clearErrors();

    if (this.state.ShowingGroupUpdates === true) {
      this.setState({
        SelectedPivotKey: this.headerTxt_GroupActionsTab
      });
    }
    else {

      //following conditoin is to resolved bug in the users picker, so by closing a section and opening again resolves the bug
      if (this.state.Section1_IsOpen === true) {
        this.setState({ SelectedPivotKey: this.headerTxt_MainTab, Section1_IsOpen: false }, this.handleSection1_toggleOpen);
      }
      else if (this.state.Section2_IsOpen === true) {
        this.setState({ SelectedPivotKey: this.headerTxt_MainTab, Section2_IsOpen: false }, this.handleSection2_toggleOpen);
      }
      this.changeMultiUserPicker(this.state.SelectedUserIds);
    }

  }

  private handleShowGIAARecList = (): void => {
    console.log('in handleShowSection1RecList');
    this.clearErrors();
    this.setState({ SelectedPivotKey: this.headerTxt_GIAA_RecommendationsTab });
  }
  private handleShowNAORecList = (): void => {
    console.log('in handleShowNAORecList');
    this.clearErrors();
    this.setState({ SelectedPivotKey: this.headerTxt_NAO_RecommendationsTab });
  }

  private handleMainFormSaved = (): void => {
    const x: number = this.state.MainListsSaveCounter + 1;
    console.log('in handleMainFormSaved', x);
    this.setState({ MainListsSaveCounter: x });
  }

  private handle_GroupsListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {
    console.log('handle_GroupsListItemTitleClick', ID, title, filteredItems);
    const currentUderId: number = this.getCurrentUserId();
    console.log('on rec list current user id ', currentUderId);
    let actionOwnerPermission: boolean = false;
    const currentAction = filteredItems.filter(x => x['ID'] === ID);
    let ownerIdsStr: string = "";
    if (currentAction.length > 0) {
      ownerIdsStr = currentAction[0]["OwnerIds"];
      const ownerIdsArr: string[] = ownerIdsStr.split(',');
      for (let i = 0; i < ownerIdsArr.length; i++) {

        let ownerId: number = Number(ownerIdsArr[i]);
        if (ownerId === currentUderId) {
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


