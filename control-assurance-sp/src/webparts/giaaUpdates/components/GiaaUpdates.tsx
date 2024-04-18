import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';
import Section from '../../../components/giaaActions/Section';
import RecommendationsTab from '../../../components/giaaActions/RecommendationsTab';
import ActionUpdatesTab from '../../../components/giaaActions/ActionUpdatesTab';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import { IUserPermission, IEntity, IDirectorateGroup } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import PlatformLinks from '../../../components/PlatformLinks';

//#region types defination

export interface ILookupData {
  DGAreas: IDirectorateGroup[];
}

export class LookupData implements ILookupData {
  public DGAreas: IDirectorateGroup[] = [];
}

export interface IGiaaUpdatesState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
  DirectorateGroupId: string | number;
  IsArchivedPeriod: boolean;
  SelectedPivotKey: string;
  Section1_IsOpen: boolean;
  Section1_MainList_IncompleteOnly: boolean;
  Section1__MainList_JustMine: boolean;
  Section1_MainList_ListFilterText: string;
  Section2_IsOpen: boolean;
  Section2_MainList_IncompleteOnly: boolean;
  Section2__MainList_JustMine: boolean;
  Section2_MainList_ListFilterText: string;
  MainListsSaveCounter: number;

  //generic for both sections
  Section_MainList_SelectedId: number;
  Section_MainList_SelectedTitle: string;
  Section_MainList_FilteredItems: any[];

  //Rec Tab
  RecList_SelectedId: number;
  RecList_SelectedTitle: string;
  RecList_FilteredItems: any[];
  RecList_SelectedItem_ActionOwnerPermission: boolean;
  RecList_IncompleteOnly: boolean;
  RecList_JustMine: boolean;
  RecList_ActionStatusTypeId: number;

}
export class GiaaUpdatesState extends types.UserContextWebPartState implements IGiaaUpdatesState {
  public LookupData = new LookupData();
  public IsArchivedPeriod = false;
  public DirectorateGroupId: string | number = 0;
  public SelectedPivotKey = "GIAA Updates-Main"; //default, 1st tab selected
  public Section1_IsOpen: boolean = false;
  public Section1_MainList_IncompleteOnly = false;
  public Section1__MainList_JustMine = false;
  public Section1_MainList_ListFilterText: string = null;
  public MainListsSaveCounter: number = 0;
  public Section2_IsOpen: boolean = false;
  public Section2_MainList_IncompleteOnly = false;
  public Section2__MainList_JustMine = false;
  public Section2_MainList_ListFilterText: string = null;
  //generic for both sections
  public Section_MainList_SelectedId: number = 0;
  public Section_MainList_SelectedTitle: string = null;
  public Section_MainList_FilteredItems = [];
  //Rec Tab
  public RecList_SelectedId: number;
  public RecList_SelectedTitle: string;
  public RecList_FilteredItems: any[];
  public RecList_SelectedItem_ActionOwnerPermission: boolean = false;
  public RecList_IncompleteOnly = false;
  public RecList_JustMine = false;
  public RecList_ActionStatusTypeId = 0;

  constructor() {
    super();
  }
}

//#endregion types defination

export default class GiaaUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, GiaaUpdatesState> {
  private deirectorateGroupService: services.DirectorateGroupService = new services.DirectorateGroupService(this.props.spfxContext, this.props.api);
  private readonly headerTxt_MainTab: string = "GIAA Updates-Main";
  private readonly headerTxt_RecommendationsTab: string = "Recommendations";
  private readonly headerTxt_ActionUpdatesTab: string = "Action Updates";
  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new GiaaUpdatesState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {
    return (
      <React.Fragment>
        {this.state.UserPermissions.length > 0 && <PlatformLinks module='GIaaActions-Updates' visible={this.isSuperUser()} {...this.props} />}
        <Pivot onLinkClick={this.handlePivotClick} selectedKey={`${this.state.SelectedPivotKey}`}>
          <PivotItem headerText={this.headerTxt_MainTab} itemKey={this.headerTxt_MainTab}>
            {this.renderMainTab()}
          </PivotItem>
          {this.renderRecommendationsTab()}
          {this.renderActionUpdatesTab()}
        </Pivot>
      </React.Fragment>
    );
  }

  private renderMainTab(): React.ReactElement<types.IWebPartComponentProps> {
    const { LookupData: lookups } = this.state;
    let dgAreasDrpOptions = lookups.DGAreas.map((dgArea) => { return { key: dgArea.ID, text: dgArea.Title }; });
    dgAreasDrpOptions = [{ key: 0, text: "All DGAreas" }, ...dgAreasDrpOptions];

    return (
      <div>
        <CrLoadingOverlayWelcome isLoading={this.state.Loading} />
        <div style={{ paddingTop: "10px" }}>
          <CrDropdown
            label="Which DGArea?"
            options={dgAreasDrpOptions}
            onChanged={(v) => this.changeDropdown(v, 'DirectorateGroupId')}
            selectedKey={this.state.DirectorateGroupId}
          />
          <br />

          {//this.state.PeriodId > 0 &&
            <div>
              <Section
                isArchive={false}
                sectionTitle="Active GIAA Audit Reports"
                dgAreaId={this.state.DirectorateGroupId}
                onItemTitleClick={this.handleSection_MainListItemTitleClick}
                section_IsOpen={this.state.Section1_IsOpen}
                onSection_toggleOpen={this.handleSection1_toggleOpen}
                justMine={this.state.Section1__MainList_JustMine}
                incompleteOnly={this.state.Section1_MainList_IncompleteOnly}
                listFilterText={this.state.Section1_MainList_ListFilterText}
                onChangeFilterText={this.handleSection1_ChangeFilterText}
                onChangeIncompleteOnly={this.handleSection1_ChangeIncompleteOnly}
                onChangeJustMine={this.handleSection1_ChangeJustMine}
                onMainSaved={this.handleMainFormSaved}
                mainListsSaveCounter={this.state.MainListsSaveCounter}
                superUserPermission={this.isSuperUser()}
                {...this.props}
              />

              <Section
                isArchive={true}
                sectionTitle="Archived GIAA Audit Reports"
                dgAreaId={this.state.DirectorateGroupId}
                onItemTitleClick={this.handleSection_MainListItemTitleClick}
                section_IsOpen={this.state.Section2_IsOpen}
                onSection_toggleOpen={this.handleSection2_toggleOpen}
                justMine={this.state.Section2__MainList_JustMine}
                incompleteOnly={this.state.Section2_MainList_IncompleteOnly}
                listFilterText={this.state.Section2_MainList_ListFilterText}
                onChangeFilterText={this.handleSection2_ChangeFilterText}
                onChangeIncompleteOnly={this.handleSection2_ChangeIncompleteOnly}
                onChangeJustMine={this.handleSection2_ChangeJustMine}
                onMainSaved={this.handleMainFormSaved}
                mainListsSaveCounter={this.state.MainListsSaveCounter}
                superUserPermission={this.isSuperUser()}
                {...this.props}
              />

            </div>
          }
        </div>
      </div>
    );
  }

  private renderRecommendationsTab() {
    if (this.state.SelectedPivotKey === this.headerTxt_RecommendationsTab || this.state.SelectedPivotKey === this.headerTxt_ActionUpdatesTab) {
      return (
        <PivotItem headerText={this.headerTxt_RecommendationsTab} itemKey={this.headerTxt_RecommendationsTab}>
          {this.renderRecommendations()}
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

  private renderRecommendations(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <RecommendationsTab
        parentId={this.state.Section_MainList_SelectedId}
        parentTitle={this.state.Section_MainList_SelectedTitle}
        onItemTitleClick={this.handle_RecListItemTitleClick}
        onShowList={this.handleShowMainTab}
        incompleteOnly={this.state.RecList_IncompleteOnly}
        justMine={this.state.RecList_JustMine}
        actionStatusTypeId={this.state.RecList_ActionStatusTypeId}
        onChangeIncompleteOnly={this.handleRecList_ChangeIncompleteOnly}
        onChangeJustMine={this.handleRecList_ChangeJustMine}
        onChangeActionStatusType={this.handleRecList_ChangeActionStatusType}
        superUserPermission={this.isSuperUser()}
        consumerName="GIAA Audit Reports"
        {...this.props}
      />
    );
  }

  private renderActionUpdates(): React.ReactElement<types.IWebPartComponentProps> {
    return (
      <ActionUpdatesTab
        giaaRecommendationId={this.state.RecList_SelectedId}
        giaaAuditReportId={this.state.Section_MainList_SelectedId}
        filteredItemsRecList={this.state.RecList_FilteredItems}
        filteredItemsMainList={this.state.Section_MainList_FilteredItems}
        onShowList={this.handleShowRecList}
        recListIncompleteOnly={this.state.RecList_IncompleteOnly}
        recListJustMine={this.state.RecList_JustMine}
        recListActionStatusTypeId={this.state.RecList_ActionStatusTypeId}
        onChangeMainListID={this.handleSection_MainListChangeSelectedID}
        superUserPermission={this.isSuperUser()}
        giaaStaffPermission={this.isGIAAStaff()}
        actionOwnerPermission={this.state.RecList_SelectedItem_ActionOwnerPermission}
        {...this.props}
      />
    );
  }


  //#endregion Render

  protected loadDGAreas = (): Promise<IEntity[]> => {
    return this.deirectorateGroupService.readAll(`?$orderby=Title`)
      .then((data: IEntity[]): IEntity[] => {
        this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'DGAreas', data) });
        return data;
      })
      .catch(err => {
        if (this.onError) this.onError(`Error loading DGAreas lookup data`, err.message);
        return [];
      });
  }

  protected loadLookups(): Promise<any> {
    return Promise.all([
      this.loadDGAreas(),
    ]);
  }

  //#endregion Data Load

  //#region Permissions

  private getCurrentUserId = (): number => {
    let userId: number = 0;
    if (this.state.User) {
      userId = this.state.User.ID;
    }
    return userId;
  }

  private isSuperUser(): boolean {
    //super user/SysManager check
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      console.log('in isSuperUser loop', ups);
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


  //#endregion Permissions

  //#region event handlers

  private changeDropdown = (option: IDropdownOption, f: string, index?: number): void => {
    if (f === "PeriodId") {
    }
    else {
      this.setState({ DirectorateGroupId: option.key },
      );
    }
  }

  private handlePivotClick = (item: PivotItem): void => {
    this.clearErrors();
    this.setState({ SelectedPivotKey: item.props.headerText });
  }

  //section 1 event handlers

  private handleSection_MainListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {
    console.log('on main list item title click ', ID, title, filteredItems);
    this.setState({
      SelectedPivotKey: this.headerTxt_RecommendationsTab,
      Section_MainList_SelectedId: ID,
      Section_MainList_SelectedTitle: title,
      Section_MainList_FilteredItems: filteredItems
    });
  }

  private handleSection_MainListChangeSelectedID = (ID: number): void => {
    console.log('on handleSection_MainListSelectedID', ID);
    this.setState({
      Section_MainList_SelectedId: ID,
    });
  }

  private handleSection1_toggleOpen = (): void => {
    this.setState({ Section1_IsOpen: !this.state.Section1_IsOpen });
  }

  private handleSection1_ChangeFilterText = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    this.setState({ Section1_MainList_ListFilterText: newValue });
  }

  private handleSection1_ChangeIncompleteOnly = (value: boolean): void => {
    this.setState({ Section1_MainList_IncompleteOnly: value });
  }

  private handleSection1_ChangeJustMine = (value: boolean): void => {
    this.setState({ Section1__MainList_JustMine: value });
  }

  private handleMainFormSaved = (): void => {

    const x: number = this.state.MainListsSaveCounter + 1;
    console.log('in handleMainFormSaved', x);
    this.setState({ MainListsSaveCounter: x });

  }

  //section 2 event handlers

  private handleSection2_toggleOpen = (): void => {
    this.setState({ Section2_IsOpen: !this.state.Section2_IsOpen });
  }

  private handleSection2_ChangeFilterText = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    this.setState({ Section2_MainList_ListFilterText: newValue });
  }

  private handleSection2_ChangeIncompleteOnly = (value: boolean): void => {
    this.setState({ Section2_MainList_IncompleteOnly: value });
  }

  private handleSection2_ChangeJustMine = (value: boolean): void => {
    this.setState({ Section2__MainList_JustMine: value });
  }

  //rec event handlers
  private handleShowMainTab = (): void => {
    console.log('in handleShowMainTab');
    this.clearErrors();
    this.setState({ SelectedPivotKey: this.headerTxt_MainTab });
  }

  private handle_RecListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {

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
      SelectedPivotKey: this.headerTxt_ActionUpdatesTab,
      RecList_SelectedId: ID,
      RecList_SelectedTitle: title,
      RecList_SelectedItem_ActionOwnerPermission: actionOwnerPermission,
      RecList_FilteredItems: filteredItems
    });
  }

  private handleRecList_ChangeIncompleteOnly = (value: boolean): void => {
    this.setState({ RecList_IncompleteOnly: value });
  }

  private handleRecList_ChangeJustMine = (value: boolean): void => {
    this.setState({ RecList_JustMine: value });
  }

  private handleRecList_ChangeActionStatusType = (option: IDropdownOption): void => {
    this.setState({ RecList_ActionStatusTypeId: Number(option.key), },);
  }

  //update (3rd tab) event handerls
  private handleShowRecList = (): void => {
    console.log('in handleShowSection1RecList');
    this.clearErrors();
    this.setState({ SelectedPivotKey: this.headerTxt_RecommendationsTab });
  }
  //#endregion event handlers
}

