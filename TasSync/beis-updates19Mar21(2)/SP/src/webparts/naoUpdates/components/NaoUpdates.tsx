import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';
import Section from '../../../components/naoUpdates/Section';
import Section2 from '../../../components/naoUpdates/Section2';
//import Section2Update from '../../../components/govUpdates/Section2Update';
//import Section3Update from '../../../components/govUpdates/Section3Update';
//import Section4Update from '../../../components/govUpdates/Section4Update';
import RecommendationsTab from '../../../components/tracker/RecommendationsTab';
import PeriodUpdateTab from '../../../components/tracker/PeriodUpdateTab';

import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IDefForm, IEntity, IDirectorateGroup, IGoDefForm, GoForm, IGoForm } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import styles from '../../../styles/cr.module.scss';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination

export interface ILookupData {

  DGAreas: IDirectorateGroup[];
}

export class LookupData implements ILookupData {
  public DGAreas: IDirectorateGroup[] = [];

}

export interface INaoUpdatesState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
  PeriodId: string | number;
  DirectorateGroupId: string | number;
  IsArchivedPeriod: boolean;
  //GoFormId: number;
  //GoForm: IGoForm;
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
  Section1_RecList_SelectedId: number;
  Section1_RecList_SelectedTitle: string;
  Section1_RecList_FilteredItems: any[];


  RecList_SelectedItem_ViewOnly:boolean;

}
export class NaoUpdatesState extends types.UserContextWebPartState implements INaoUpdatesState {
  public LookupData = new LookupData();
  public PeriodId: string | number = 0;
  public IsArchivedPeriod = false;
  public DirectorateGroupId: string | number = 0;
  //public GoFormId: number = 0;
  //public GoForm: IGoForm = null;
  public SelectedPivotKey = "NAO/PAC Updates-Main"; //default, 1st tab selected

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
  public Section1_RecList_SelectedId: number;
  public Section1_RecList_SelectedTitle: string;
  public Section1_RecList_FilteredItems: any[];


  public RecList_SelectedItem_ViewOnly = false;

  constructor() {
    super();
  }
}

//#endregion types defination

export default class NaoUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, NaoUpdatesState> {

  //protected goDefFormService: services.GoDefFormService = new services.GoDefFormService(this.props.spfxContext, this.props.api);
  //private goFormService: services.GoFormService = new services.GoFormService(this.props.spfxContext, this.props.api);
  //protected periodService: services.NAOPeriodService = new services.NAOPeriodService(this.props.spfxContext, this.props.api);
  protected deirectorateGroupService: services.DirectorateGroupService = new services.DirectorateGroupService(this.props.spfxContext, this.props.api);
  protected naoPublicationService: services.NAOPublicationService = new services.NAOPublicationService(this.props.spfxContext, this.props.api);

  private readonly headerTxt_MainTab: string = "NAO/PAC Updates-Main";
  private readonly headerTxt_RecommendationsTab: string = "Recommendations";
  private readonly headerTxt_PeriodUpdateTab: string = "Period Update";

  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new NaoUpdatesState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <Pivot onLinkClick={this.handlePivotClick} selectedKey={`${this.state.SelectedPivotKey}`}>
        <PivotItem headerText={this.headerTxt_MainTab} itemKey={this.headerTxt_MainTab}>
          {this.renderMainTab()}
        </PivotItem>
        {this.renderRecommendationsTab()}
        {this.renderPeriodUpdateTab()}

      </Pivot>
    );
  }

  private renderMainTab(): React.ReactElement<types.IWebPartComponentProps> {
    const { LookupData: lookups } = this.state;

    let dgAreasDrpOptions = lookups.DGAreas.map((dgArea) => { return { key: dgArea.ID, text: dgArea.Title }; });
    dgAreasDrpOptions = [{ key: 0, text: "All DGAreas" }, ...dgAreasDrpOptions];


    //const periodId = Number(this.state.PeriodId);
    const directorateGroupId = Number(this.state.DirectorateGroupId);


    return (
      <div>
        <CrLoadingOverlayWelcome isLoading={this.state.Loading} />
        <div style={{ paddingTop: "10px" }}>
          <CrDropdown
            //placeholder="Select an Option"
            label="Which DGArea?"
            options={dgAreasDrpOptions}
            onChanged={(v) => this.changeDropdown(v, 'DirectorateGroupId')}
            selectedKey={this.state.DirectorateGroupId}
          />

          <br />

          {
            <div>
              <Section
                isArchive={false}
                sectionTitle="Active NAO/PAC Publications"
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
                sectionTitle="Archived NAO/PAC Publications"
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
    if (this.state.SelectedPivotKey === this.headerTxt_RecommendationsTab || this.state.SelectedPivotKey === this.headerTxt_PeriodUpdateTab) {
      return (

        <PivotItem headerText={this.headerTxt_RecommendationsTab} itemKey={this.headerTxt_RecommendationsTab}>
          {this.renderRecommendations()}
        </PivotItem>

      );
    }
    else
      return <React.Fragment></React.Fragment>;
  }

  private renderPeriodUpdateTab() {
    if (this.state.SelectedPivotKey === this.headerTxt_PeriodUpdateTab) {
      return (

        <PivotItem headerText={this.headerTxt_PeriodUpdateTab} itemKey={this.headerTxt_PeriodUpdateTab}>
          {this.renderPeriodUpdate()}
        </PivotItem>

      );
    }
    else
      return <React.Fragment></React.Fragment>;
  }


  private renderRecommendations(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <RecommendationsTab
        filteredItems={this.state.Section_MainList_FilteredItems}
        parentId={this.state.Section_MainList_SelectedId}
        periodId={this.state.PeriodId}
        parentTitle={this.state.Section_MainList_SelectedTitle}
        //isViewOnly={this.isViewOnlyGoForm()}
        onItemTitleClick={this.handleSection1_RecListItemTitleClick}
        onShowList={this.handleShowListSection1}
        superUserPermission={this.isSuperUser()}
        dgOrDGMemberPermission={this.isDG_Or_DGMember()}
        {...this.props}
      />


    );

  }

  private renderPeriodUpdate(): React.ReactElement<types.IWebPartComponentProps> {
    return (
      <PeriodUpdateTab
        naoRecommendationId={this.state.Section1_RecList_SelectedId}
        naoPeriodId={this.state.PeriodId}
        filteredItems={this.state.Section1_RecList_FilteredItems}
        onShowList={this.handleShowSection1RecList}
        
        isViewOnly={this.state.RecList_SelectedItem_ViewOnly}
        {...this.props}
      />


    );
  }




  //#endregion Render


  //#region Data Load

  protected loadDGAreas = (): Promise<IEntity[]> => {
    return this.deirectorateGroupService.readAll(`?$orderby=Title`).then((data: IEntity[]): IEntity[] => {
      this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'DGAreas', data) });
      return data;
    }, (err) => { if (this.onError) this.onError(`Error loading Teams lookup data`, err.message); });
  }

  // private loadOverallUpdateStatuses() {
  //   this.naoPublicationService.readOverAllUpdateStatus(false, Number(this.state.DirectorateGroupId), Number(this.state.PeriodId) ).then((res: string): void => {
  //     console.log('loadOverallUpdateStatuses active', res);
  //     this.setState({ Section1UpdateStatus: res });

  //   }, (err) => { });

  //   this.naoPublicationService.readOverAllUpdateStatus(true, Number(this.state.DirectorateGroupId), Number(this.state.PeriodId) ).then((res: string): void => {
  //     console.log('loadOverallUpdateStatuses archived', res);

  //     this.setState({ Section2UpdateStatus: res });

  //   }, (err) => { });
  // }


  protected loadLookups(): Promise<any> {

    return Promise.all([
      this.loadDGAreas(),

    ]);
  }

  //#endregion Data Load

  //#region Permissions

  private getCurrentUserId = ():number =>{
    let userId:number = 0;
    if(this.state.User){
      userId = this.state.User.ID;
    }

    return userId;
  }
  
  
  private isSuperUser(): boolean {
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



  private isDG_Or_DGMember(): boolean{

    //Archived Period check - dont allow if period is archived
    // if(this.state.IsArchivedPeriod === true)
    //   return false;

    //DirectorateGroups check
    if(this.state.DirectorateGroups.length > 0){
      return true;
    }
     
    //DirectorateGroup member check
    let dgms = this.state.DirectorateGroupMembers;
    for(let i=0; i<dgms.length; i++){
      let dgm: types.IDirectorateGroupMember = dgms[i];
      if(this.state.DirectorateGroupId === dgm.DirectorateGroupID){
        if(dgm.ViewOnly === true){
          return false;
        }
        else{
          //may need is admin check here
          return true;
        }  
      }

    }

    return false;
  }





  //#endregion Permissions

  //#region event handlers

  protected changeDropdown = (option: IDropdownOption, f: string, index?: number): void => {

          //f === "DirectorateGroupId"
          this.setState({ DirectorateGroupId: option.key },
            //this.loadOverallUpdateStatuses
          );


  }




  private handlePivotClick = (item: PivotItem): void => {
    this.clearErrors();
    this.setState({ SelectedPivotKey: item.props.headerText });
  }

  private handleSection_MainListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {

    console.log('on main list item title click ', ID, title, filteredItems);
    const currentPublication = filteredItems.filter(x => x['ID'] === ID);
    const currentPeriodId:number = Number(currentPublication[0]["CurrentPeriodId"]);
    console.log('currentPeriodId', currentPeriodId);

    this.setState({
      SelectedPivotKey: this.headerTxt_RecommendationsTab,
      Section_MainList_SelectedId: ID,
      Section_MainList_SelectedTitle: title,
      Section_MainList_FilteredItems: filteredItems,
      PeriodId: currentPeriodId,
    });
  }

  private handleSection1_RecListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {

    const currentUderId:number = this.getCurrentUserId();
    console.log('on rec list current user id ', currentUderId);
    console.log('on rec list item title click ', ID, title, filteredItems);


    let assigneePermission:boolean = false;
    const currentRec = filteredItems.filter(x => x['ID'] === ID);
    //console.log('currectRec', currentRec);
    let assignedToIdsStr:string = "";
    if(currentRec.length > 0){
      assignedToIdsStr = currentRec[0]["AssignedToIds"];
      //console.log('ownerIdsStr', ownerIdsStr);
      const assignedToIdsArr:string[] = assignedToIdsStr.split(',');
      //console.log('ownerIdsArr', ownerIdsArr);


      
      for (let i = 0; i < assignedToIdsArr.length; i++) {
      
        let assigneeId:number = Number(assignedToIdsArr[i]);
        if(assigneeId === currentUderId){
          assigneePermission = true;
          break;
        }
      }
    }

    console.log('assignee permission', assigneePermission);

    let recList_SelectedItem_ViewOnly:boolean = true;
    if(this.isSuperUser() === true || assigneePermission === true){
      recList_SelectedItem_ViewOnly = false;
    }

    console.log('recList_SelectedItem_ViewOnly', recList_SelectedItem_ViewOnly);

    this.setState({
      SelectedPivotKey: this.headerTxt_PeriodUpdateTab,
      Section1_RecList_SelectedId: ID,
      Section1_RecList_SelectedTitle: title,
      RecList_SelectedItem_ViewOnly: recList_SelectedItem_ViewOnly,
      Section1_RecList_FilteredItems: filteredItems
    });
  }

  private handleSection1_toggleOpen = (): void => {
    this.setState({ Section1_IsOpen: !this.state.Section1_IsOpen });
  }

  private handleSection1_ChangeFilterText = (value: string): void => {
    this.setState({ Section1_MainList_ListFilterText: value });
  }

  private handleSection1_ChangeIncompleteOnly = (value: boolean): void => {
    this.setState({ Section1_MainList_IncompleteOnly: value });
  }

  private handleSection1_ChangeJustMine = (value: boolean): void => {
    this.setState({ Section1__MainList_JustMine: value });
  }

  private handleShowListSection1 = (): void => {
    console.log('in handleShowListSection1');
    this.clearErrors();
    this.setState({ SelectedPivotKey: this.headerTxt_MainTab });
  }

  private handleShowSection1RecList = (): void => {
    console.log('in handleShowSection1RecList');
    this.clearErrors();
    this.setState({ SelectedPivotKey: this.headerTxt_RecommendationsTab });
  }

  private handleMainFormSaved = (): void => {

    //this.loadOverallUpdateStatuses();
    const x: number = this.state.MainListsSaveCounter + 1;
    console.log('in handleMainFormSaved', x);
    this.setState({ MainListsSaveCounter: x });

  }

  //section 2 event handlers



  private handleSection2_toggleOpen = (): void => {
    this.setState({ Section2_IsOpen: !this.state.Section2_IsOpen });
  }

  private handleSection2_ChangeFilterText = (value: string): void => {
    this.setState({ Section2_MainList_ListFilterText: value });
  }

  private handleSection2_ChangeIncompleteOnly = (value: boolean): void => {
    this.setState({ Section2_MainList_IncompleteOnly: value });
  }

  private handleSection2_ChangeJustMine = (value: boolean): void => {
    this.setState({ Section2__MainList_JustMine: value });
  }

  //#endregion event handlers

}


