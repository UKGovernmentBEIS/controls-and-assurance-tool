import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';
import Section1Update from '../../../components/govUpdates/Section1Update';
import Section2Update from '../../../components/govUpdates/Section2Update';
import Section3Update from '../../../components/govUpdates/Section3Update';
import Section4Update from '../../../components/govUpdates/Section4Update';
import UpdateForm from '../../../components/govUpdates/UpdateForm';

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
  GoDefForm: IGoDefForm;
  Periods: IEntity[];
  DGAreas: IDirectorateGroup[];
}

export class LookupData implements ILookupData {
  public GoDefForm: IGoDefForm;
  public Periods: IPeriod[] = [];
  public DGAreas: IDirectorateGroup[] = [];

}

export interface IGoUpdatesState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
  PeriodId: string | number;
  DirectorateGroupId: string | number;
  IsArchivedPeriod:boolean;
  //GoFormId: number;
  GoForm: IGoForm;
  SelectedPivotKey: string;

  Section2_IsOpen: boolean;
  Section2_IncompleteOnly: boolean;
  Section2_JustMine: boolean;
  Section2_ListFilterText: string;
  Section2_SelectedDefElementId: number;
  Section2_SelectedElementId: number;
  Section2_SelectedDefElementTitle: string;

  FilteredItems: any[];
}
export class GoUpdatesState extends types.UserContextWebPartState implements IGoUpdatesState {
  public LookupData = new LookupData();
  public PeriodId: string | number = 0;
  public IsArchivedPeriod = false;
  public DirectorateGroupId: string | number = 0;
  //public GoFormId: number = 0;
  public GoForm: IGoForm = null;
  public SelectedPivotKey = "Governance-Updates"; //default, 1st tab selected

  public Section2_IsOpen: boolean = false;
  public Section2_IncompleteOnly = false;
  public Section2_JustMine = false;
  public Section2_ListFilterText: string = null;
  public Section2_SelectedDefElementId: number = 0;
  public Section2_SelectedElementId: number = 0;
  public Section2_SelectedDefElementTitle: string = null;

  public FilteredItems = [];

  constructor() {
    super();
  }
}

//#endregion types defination

export default class GoUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, GoUpdatesState> {

  protected goDefFormService: services.GoDefFormService = new services.GoDefFormService(this.props.spfxContext, this.props.api);
  private goFormService: services.GoFormService = new services.GoFormService(this.props.spfxContext, this.props.api);
  protected periodService: services.GoPeriodService = new services.GoPeriodService(this.props.spfxContext, this.props.api);
  protected deirectorateGroupService: services.DirectorateGroupService = new services.DirectorateGroupService(this.props.spfxContext, this.props.api);

  private readonly headerTxt_Updates: string = "Governance-Updates";
  private readonly headerTxt_UpdateForm: string = "Details";

  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new GoUpdatesState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <Pivot onLinkClick={this.handlePivotClick} selectedKey={`${this.state.SelectedPivotKey}`}>
        <PivotItem headerText={this.headerTxt_Updates} itemKey={this.headerTxt_Updates}>
          {this.renderMyUpdates()}
        </PivotItem>
        {this.renderUpdateFormTab()}

      </Pivot>
    );
  }

  private renderMyUpdates(): React.ReactElement<types.IWebPartComponentProps> {
    const { LookupData: lookups } = this.state;
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
            placeholder="Select an Option"
            label="Which DGArea?"
            options={lookups.DGAreas.map((d) => { return { key: d.ID, text: d.Title }; })}
            onChanged={(v) => this.changeDropdown(v, 'DirectorateGroupId')}
            selectedKey={this.state.DirectorateGroupId}
          />

          <br />

          {this.state.PeriodId > 0 && this.state.DirectorateGroupId > 0 && this.state.GoForm &&
            <div>
              <Section1Update
                goDefForm={this.state.LookupData.GoDefForm}
                goForm={this.state.GoForm}
                isViewOnly={this.isViewOnlyGoForm()}
                //periodId={periodId}
                //directorateGroupId={directorateGroupId}
                onSaved={this.readOrCreateGoFormInDb} //to refresh goForm in state
                {...this.props}
              />
              <Section2Update
                goDefForm={this.state.LookupData.GoDefForm}
                goFormId={this.state.GoForm.ID}
                section2CompletionStatus={this.state.GoForm.SpecificAreasCompletionStatus}
                onItemTitleClick={this.handleSection2_ListItemTitleClick}
                section2_IsOpen={this.state.Section2_IsOpen}
                onSection2_toggleOpen={this.handleSection2_toggleOpen}
                justMine={this.state.Section2_JustMine}
                incompleteOnly={this.state.Section2_IncompleteOnly}
                listFilterText={this.state.Section2_ListFilterText}
                onChangeFilterText={this.handleSection2_ChangeFilterText}
                onChangeIncompleteOnly={this.handleSection2_ChangeIncompleteOnly}
                onChangeJustMine={this.handleSection2_ChangeJustMine}

                {...this.props}
              />
              <Section3Update
                goDefForm={this.state.LookupData.GoDefForm}
                goForm={this.state.GoForm}
                canSignOff={this.canSignOff()}
                canUnSign={this.canUnSign()}
                onSignOff={this.readOrCreateGoFormInDb} //to refresh goForm in state
                {...this.props} />
              <Section4Update {...this.props} />
            </div>
          }



        </div>
      </div>
    );
  }

  private renderUpdateFormTab() {
    if (this.state.SelectedPivotKey === this.headerTxt_UpdateForm) {
      return (

        <PivotItem headerText={this.headerTxt_UpdateForm} itemKey={this.headerTxt_UpdateForm}>
          {this.renderUpdateForm()}
        </PivotItem>

      );
    }
    else
      return <React.Fragment></React.Fragment>;
  }
  private renderUpdateForm(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <UpdateForm
        filteredItems={this.state.FilteredItems}
        goElementId={this.state.Section2_SelectedElementId}
        isViewOnly={this.isViewOnlyGoForm()}
        onShowList={this.handleShowListSection2}
        {...this.props}
      />

    );

  }




  //#endregion Render


  //#region Data Load

  protected loadDefForm = (): Promise<IGoDefForm> => {
    return this.goDefFormService.read(1).then((df: IGoDefForm): IGoDefForm => {
      this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'GoDefForm', df) });
      return df;
    }, (err) => { if (this.onError) this.onError(`Error loading DefForm lookup data`, err.message); });
  }

  protected loadPeriods = (): Promise<IPeriod[]> => {
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
    return this.deirectorateGroupService.readAllForGoList().then((data: IEntity[]): IEntity[] => {
      this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'DGAreas', data) });
      return data;
    }, (err) => { if (this.onError) this.onError(`Error loading Teams lookup data`, err.message); });
  }


  protected loadLookups(): Promise<any> {

    return Promise.all([
      this.loadPeriods(),
      this.loadDGAreas(),
      this.loadDefForm(),

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

  private isViewOnlyGoForm = () :boolean => {

    if(this.state.GoForm && this.state.GoForm.DGSignOffStatus === "Completed") {
      return true;   
    }

    //DirectorateGroup member check
    let dgms = this.state.DirectorateGroupMembers;
    for(let i=0; i<dgms.length; i++){
      let dgm: types.IDirectorateGroupMember = dgms[i];
      if(dgm.ViewOnly === true){
        if(this.state.DirectorateGroupId === dgm.DirectorateGroupID){
          return true; 
        }
        
      }
        
    }

    return false;

  }

  private canSignOff(): boolean{

    //Archived Period check - dont allow if period is archived
    if(this.state.IsArchivedPeriod === true)
      return false;

    //DirectorateGroups check
    if(this.state.DirectorateGroups.length > 0){
      return true;
    }
     
    // //DirectorateGroup member check
    // let dgms = this.state.DirectorateGroupMembers;
    // for(let i=0; i<dgms.length; i++){
    //   let dgm: types.IDirectorateGroupMember = dgms[i];
    //   if(dgm.CanSignOff === true)
    //     return true; 
    // }

    return false;
  }

  private canUnSign(): boolean{

    //Archived Period check - dont allow if period is archived
    if(this.state.IsArchivedPeriod === true)
      return false;

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

    if(this.isSuperUser() === true)
      return true;

    return false;
  }

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
          this.readOrCreateGoFormInDb
        );
      }
    }
    else {
      //f === "DirectorateGroupId"
      this.setState({ DirectorateGroupId: option.key },
        this.readOrCreateGoFormInDb
      );
    }

  }

  private readOrCreateGoFormInDb = (): void => {

    if (this.state.PeriodId > 0 && this.state.DirectorateGroupId > 0) {

      const goForm = new GoForm(Number(this.state.PeriodId), Number(this.state.DirectorateGroupId));

      goForm.Title = "_ADD_ONLY_IF_DOESNT_EXIST_"; //send this msg to api, so it doesnt do any change if goForm already exist in the db

      delete goForm.ID;
      //delete goForm.Title;
      delete goForm.SummaryRagRating;
      delete goForm.SummaryEvidenceStatement;
      delete goForm.SummaryCompletionStatus;
      delete goForm.SummaryMarkReadyForApproval;
      delete goForm.SpecificAreasCompletionStatus;
      delete goForm.DGSignOffStatus;
      delete goForm.DGSignOffUserId;
      delete goForm.DGSignOffDate;



      //following service only adds form in db if its needed
      this.goFormService.create(goForm).then((newForm: IGoForm): void => {
        //this.setState({ GoFormId: newForm.ID });
        this.setState({ GoForm: newForm });
        //console.log('goForm created ', newForm);
      }, (err) => { });

    }

  }


  private handlePivotClick = (item: PivotItem): void => {
    this.clearErrors();
    this.setState({ SelectedPivotKey: item.props.headerText });
  }

  private handleSection2_ListItemTitleClick = (ID: number, goElementId, title: string, filteredItems: any[]): void => {

    console.log('on item title click ', ID, goElementId, title, filteredItems);
    this.setState({
      SelectedPivotKey: this.headerTxt_UpdateForm,
      Section2_SelectedDefElementId: ID,
      Section2_SelectedElementId: goElementId,
      Section2_SelectedDefElementTitle: title,
      FilteredItems: filteredItems
    });
  }

  private handleSection2_toggleOpen = (): void => {
    this.setState({ Section2_IsOpen: !this.state.Section2_IsOpen });
  }

  private handleSection2_ChangeFilterText = (value: string): void => {
    this.setState({ Section2_ListFilterText: value });
  }

  private handleSection2_ChangeIncompleteOnly = (value: boolean): void => {
    this.setState({ Section2_IncompleteOnly: value });
  }

  private handleSection2_ChangeJustMine = (value: boolean): void => {
    this.setState({ Section2_JustMine: value });
  }

  private handleShowListSection2 = (): void => {
    console.log('in handleShowListSection2');
    this.clearErrors();
    this.setState({ SelectedPivotKey: this.headerTxt_Updates }, this.readOrCreateGoFormInDb);
  }

  //#endregion event handlers

}


