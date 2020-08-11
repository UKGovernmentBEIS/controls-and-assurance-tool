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
import { IUserPermission, IDefForm, IPeriod, IEntity, IDirectorateGroup, IGoDefForm, GoForm, IGoForm } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import styles from '../../../styles/cr.module.scss';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination

export interface ILookupData {
  //GoDefForm: IGoDefForm;
  Periods: IEntity[];
  DGAreas: IDirectorateGroup[];
}

export class LookupData implements ILookupData {
  //public GoDefForm: IGoDefForm;
  public Periods: IPeriod[] = [];
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

  Section1UpdateStatus: string;
  Section2UpdateStatus: string;

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

  public Section1UpdateStatus: string = null;
  public Section2UpdateStatus: string = null;

  constructor() {
    super();
  }
}

//#endregion types defination

export default class NaoUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, NaoUpdatesState> {

  //protected goDefFormService: services.GoDefFormService = new services.GoDefFormService(this.props.spfxContext, this.props.api);
  //private goFormService: services.GoFormService = new services.GoFormService(this.props.spfxContext, this.props.api);
  protected periodService: services.NAOPeriodService = new services.NAOPeriodService(this.props.spfxContext, this.props.api);
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


    const periodId = Number(this.state.PeriodId);
    const directorateGroupId = Number(this.state.DirectorateGroupId);


    return (
      <div>
        <CrLoadingOverlayWelcome isLoading={this.state.Loading} />
        <div style={{ paddingTop: "10px" }}>
          <CrDropdown
            placeholder="Select an Option"
            label="Which period do you want to view or report on?"
            options={lookups.Periods.map((p) => { return { key: p.ID, text: p.Title }; })}
            onChanged={(v) => this.changeDropdown(v, 'PeriodId')}
            selectedKey={this.state.PeriodId}
          />
          <CrDropdown
            //placeholder="Select an Option"
            label="Which DGArea?"
            options={dgAreasDrpOptions}
            onChanged={(v) => this.changeDropdown(v, 'DirectorateGroupId')}
            selectedKey={this.state.DirectorateGroupId}
          />

          <br />

          {this.state.PeriodId > 0 &&
            <div>
              <Section
                isArchive={false}
                sectionTitle="Active NAO/PAC Publications"
                naoPeriodId={this.state.PeriodId}
                dgAreaId={this.state.DirectorateGroupId}
                sectionUpdateStatus={this.state.Section1UpdateStatus}
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
                {...this.props}
              />

              <Section
                isArchive={true}
                sectionTitle="Archived NAO/PAC Publications"
                naoPeriodId={this.state.PeriodId}
                dgAreaId={this.state.DirectorateGroupId}
                sectionUpdateStatus={this.state.Section2UpdateStatus}
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
        parentTitle={this.state.Section_MainList_SelectedTitle}
        //isViewOnly={this.isViewOnlyGoForm()}
        onItemTitleClick={this.handleSection1_RecListItemTitleClick}
        onShowList={this.handleShowListSection1}
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
        {...this.props}
      />


    );
  }




  //#endregion Render


  //#region Data Load

  // protected loadDefForm = (): Promise<IGoDefForm> => {
  //   return this.goDefFormService.read(1).then((df: IGoDefForm): IGoDefForm => {
  //     this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'GoDefForm', df) });
  //     return df;
  //   }, (err) => { if (this.onError) this.onError(`Error loading DefForm lookup data`, err.message); });
  // }

  private loadPeriods = (): Promise<IPeriod[]> => {
    return this.periodService.readAll().then((pArr: IPeriod[]): IPeriod[] => {
      //get the current period
      let currentPeriodId: number = 0;
      const currentPeriod = pArr.filter(p => p.PeriodStatus === "Current Period");
      if (currentPeriod && currentPeriod.length > 0) {
        currentPeriodId = currentPeriod[0].ID;
      }

      //show status like Qtr 2 2019 ( Current Period ) in Title
      for (let i = 0; i < pArr.length; i++) {
        let p: IPeriod = pArr[i];
        pArr[i].Title = `${p.Title} ( ${p.PeriodStatus} )`;
      }


      //check user permissions
      if (this.isSuperUser() === true) {
      }
      else {
        //dont show design periods
        pArr = pArr.filter(p => p.PeriodStatus !== "Design Period");
      }


      this.setState({
        LookupData: this.cloneObject(this.state.LookupData, 'Periods', pArr),
        PeriodId: currentPeriodId
      });
      return pArr;
    }, (err) => { if (this.onError) this.onError(`Error loading Periods lookup data`, err.message); });
  }

  protected loadDGAreas = (): Promise<IEntity[]> => {
    return this.deirectorateGroupService.readAll(`?$orderby=Title`).then((data: IEntity[]): IEntity[] => {
      this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'DGAreas', data) });
      return data;
    }, (err) => { if (this.onError) this.onError(`Error loading Teams lookup data`, err.message); });
  }

  private loadOverallUpdateStatuses() {
    this.naoPublicationService.readOverAllUpdateStatus(false, Number(this.state.DirectorateGroupId)).then((res: string): void => {
      console.log('loadOverallUpdateStatuses active', res);
      this.setState({ Section1UpdateStatus: res });

    }, (err) => { });

    this.naoPublicationService.readOverAllUpdateStatus(true, Number(this.state.DirectorateGroupId)).then((res: string): void => {
      console.log('loadOverallUpdateStatuses archived', res);

      this.setState({ Section2UpdateStatus: res });

    }, (err) => { });
  }


  protected loadLookups(): Promise<any> {

    return Promise.all([
      this.loadPeriods(),
      this.loadDGAreas(),
      this.loadOverallUpdateStatuses(),
      //this.loadDefForm(),

    ]);
  }

  //#endregion Data Load

  //#region Permissions

  private isSuperUser(): boolean {
    //super user/SysManager check
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 6) {
        //super user or sys manager
        return true;
      }
    }

    return false;
  }

  // private isViewOnlyGoForm = () :boolean => {

  //   if(this.state.GoForm && this.state.GoForm.DGSignOffStatus === "Completed") {
  //     return true;   
  //   }

  //   //DirectorateGroup member check
  //   let dgms = this.state.DirectorateGroupMembers;
  //   for(let i=0; i<dgms.length; i++){
  //     let dgm: types.IDirectorateGroupMember = dgms[i];
  //     if(dgm.ViewOnly === true){
  //       if(this.state.DirectorateGroupId === dgm.DirectorateGroupID){
  //         return true; 
  //       }

  //     }

  //   }

  //   return false;

  // }



  //#endregion Permissions

  //#region event handlers

  protected changeDropdown = (option: IDropdownOption, f: string, index?: number): void => {
    if (f === "PeriodId") {
      if (option.key !== this.state.PeriodId) {
        const pArrTemp: IPeriod[] = this.state.LookupData.Periods.filter(p => p.ID === option.key);
        let isArchivedPeriod: boolean = false;
        if (pArrTemp.length > 0) {
          if (pArrTemp[0].PeriodStatus === "Archived Period") {
            isArchivedPeriod = true;
          }
        }

        this.setState({ PeriodId: option.key, IsArchivedPeriod: isArchivedPeriod },
          //this.readOrCreateGoFormInDb
        );
      }
    }
    else {
      //f === "DirectorateGroupId"
      this.setState({ DirectorateGroupId: option.key },
        this.loadOverallUpdateStatuses
      );
    }

  }

  // private readOrCreateGoFormInDb = (): void => {

  //   if (this.state.PeriodId > 0 && this.state.DirectorateGroupId > 0) {

  //     const goForm = new GoForm(Number(this.state.PeriodId), Number(this.state.DirectorateGroupId));

  //     goForm.Title = "_ADD_ONLY_IF_DOESNT_EXIST_"; //send this msg to api, so it doesnt do any change if goForm already exist in the db

  //     delete goForm.ID;
  //     //delete goForm.Title;
  //     delete goForm.SummaryRagRating;
  //     delete goForm.SummaryEvidenceStatement;
  //     delete goForm.SummaryCompletionStatus;
  //     delete goForm.SummaryMarkReadyForApproval;
  //     delete goForm.SpecificAreasCompletionStatus;
  //     delete goForm.DGSignOffStatus;
  //     delete goForm.DGSignOffUserId;
  //     delete goForm.DGSignOffDate;



  //     //following service only adds form in db if its needed
  //     this.goFormService.create(goForm).then((newForm: IGoForm): void => {
  //       //this.setState({ GoFormId: newForm.ID });
  //       this.setState({ GoForm: newForm });
  //       //console.log('goForm created ', newForm);
  //     }, (err) => { });

  //   }

  // }


  private handlePivotClick = (item: PivotItem): void => {
    this.clearErrors();
    this.setState({ SelectedPivotKey: item.props.headerText });
  }

  private handleSection_MainListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {

    console.log('on main list item title click ', ID, title, filteredItems);
    this.setState({
      SelectedPivotKey: this.headerTxt_RecommendationsTab,
      Section_MainList_SelectedId: ID,
      Section_MainList_SelectedTitle: title,
      Section_MainList_FilteredItems: filteredItems
    });
  }

  private handleSection1_RecListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {

    console.log('on rec list item title click ', ID, title, filteredItems);
    this.setState({
      SelectedPivotKey: this.headerTxt_PeriodUpdateTab,
      Section1_RecList_SelectedId: ID,
      Section1_RecList_SelectedTitle: title,
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

    this.loadOverallUpdateStatuses();
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


