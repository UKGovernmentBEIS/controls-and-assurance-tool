import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';
import Section1Update from '../../../components/govUpdates/Section1Update';
import Section2Update from '../../../components/govUpdates/Section2Update';
import Section3Update from '../../../components/govUpdates/Section3Update';
import Section4Update from '../../../components/govUpdates/Section4Update';
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
  GoFormId:number;
}
export class GoUpdatesState extends types.UserContextWebPartState implements IGoUpdatesState {
  public LookupData = new LookupData();
  public PeriodId: string | number = 0;
  public DirectorateGroupId: string | number = 0;
  public GoFormId:number = 0;
  constructor() {
    super();
  }
}

//#endregion types defination

export default class GoUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, GoUpdatesState> {

  protected goDefFormService: services.GoDefFormService = new services.GoDefFormService(this.props.spfxContext, this.props.api);
  private goFormService: services.GoFormService = new services.GoFormService(this.props.spfxContext, this.props.api);
  protected periodService: services.PeriodService = new services.PeriodService(this.props.spfxContext, this.props.api);
  protected deirectorateGroupService: services.DirectorateGroupService = new services.DirectorateGroupService(this.props.spfxContext, this.props.api);

  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new GoUpdatesState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="Governance - Updates">
          {this.renderMyUpdates()}
        </PivotItem>

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

          {this.state.PeriodId > 0 && this.state.DirectorateGroupId > 0 && this.state.GoFormId > 0 &&
            <div>
              <Section1Update GoDefForm={this.state.LookupData.GoDefForm} PeriodId={periodId} DirectorateGroupId={directorateGroupId} {...this.props} />
              <Section2Update GoDefForm={this.state.LookupData.GoDefForm} goFormId={this.state.GoFormId} {...this.props} />
              <Section3Update GoDefForm={this.state.LookupData.GoDefForm} {...this.props} />
              <Section4Update {...this.props} />
            </div>
          }



        </div>
      </div>
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
      if (this.superUserOrSysManagerLoggedIn() === true) {
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
    return this.deirectorateGroupService.readAll().then((data: IEntity[]): IEntity[] => {
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

  private superUserOrSysManagerLoggedIn(): boolean {
    //super user/SysManager check
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 2) {
        //super user or sys manager
        return true;
      }
    }

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

        this.setState({ PeriodId: option.key/*, IsArchivedPeriod: isArchivedPeriod*/ },
          this.createGoFormInDb
        );
      }
    }
    else {
      //f === "DirectorateGroupId"
      this.setState({ DirectorateGroupId: option.key },
        this.createGoFormInDb
      );
    }

  }

  private createGoFormInDb = (): void => {

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
        this.setState({ GoFormId: newForm.ID } );
        //console.log('goForm created ', newForm);
      }, (err) => { });

    }

  }


  //#endregion event handlers

}


