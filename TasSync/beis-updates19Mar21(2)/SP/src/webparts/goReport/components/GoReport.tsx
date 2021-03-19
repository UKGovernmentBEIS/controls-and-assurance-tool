import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import Report1List from '../../../components/goReport/Report1List';
import * as services from '../../../services';
import GenExport from '../../../components/export/GenExport';

import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IDefForm, IPeriod, IEntity, IDirectorateGroup, IGoDefForm, GoForm, IGoForm } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import styles from '../../../styles/cr.module.scss';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination

export interface ILookupData {
  Periods: IEntity[];
  PeriodsOriginal: IPeriod[];
}

export class LookupData implements ILookupData {
  public Periods: IPeriod[] = [];
  public PeriodsOriginal: IPeriod[] = [];
}

export interface IGoReportState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
  PeriodId: string | number;
  SelectedPeriodTxt: string;
  IsArchivedPeriod: boolean;
  Report1_ListFilterText: string;
}
export class GoReportState extends types.UserContextWebPartState implements IGoReportState {
  public LookupData = new LookupData();
  public PeriodId: string | number = 0;
  public SelectedPeriodTxt: string = "";
  public IsArchivedPeriod = false;
  public Report1_ListFilterText: string = null;


  public FilteredItems = [];

  constructor() {
    super();
  }
}

//#endregion types defination

export default class GoUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, GoReportState> {

  private goFormService: services.GoFormService = new services.GoFormService(this.props.spfxContext, this.props.api);
  protected periodService: services.GoPeriodService = new services.GoPeriodService(this.props.spfxContext, this.props.api);


  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new GoReportState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <React.Fragment>


        <CrDropdown
          placeholder="Select a Period"
          style={{ marginTop: "10px", marginBottom: "20px" }}
          label="Which period do you want to view?"
          options={this.state.LookupData.Periods.map((p) => { return { key: p.ID, text: p.Title }; })}
          onChanged={(v) => this.changeDropdown(v, 'PeriodId')}
          selectedKey={this.state.PeriodId}
        />

        <Pivot onLinkClick={this.clearErrors}>
          <PivotItem headerText="DG Areas">
            {this.renderReport1()}
          </PivotItem>

          <PivotItem headerText="Export to Excel" itemKey="Export to Excel">
            {this.renderGenExport()}
          </PivotItem>


        </Pivot>


      </React.Fragment>


    );
  }

  private renderReport1(): React.ReactElement<types.IWebPartComponentProps> {
    //const { LookupData: lookups } = this.state;
    //const periodId = Number(this.state.PeriodId);

    return (
      <div>
        <CrLoadingOverlayWelcome isLoading={this.state.Loading} />
        <div style={{ paddingTop: "10px" }}>

          <Report1List
            {...this.props}
            onError={this.onError}
            periodId={this.state.PeriodId}
            filterText={this.state.Report1_ListFilterText}
            onChangeFilterText={this.handleReport1_ChangeFilterText}

          />


        </div>
      </div>
    );
  }

  private renderGenExport(): React.ReactElement<types.IWebPartComponentProps> {

    if(this.state.PeriodId > 0){

      return (
        <div>

          <div style={{ paddingTop: "10px" }}>
  
            <GenExport
              {...this.props}
              onError={this.onError}
              moduleName="Governance"
              periodId={Number(this.state.PeriodId)}
              periodTitle={this.state.SelectedPeriodTxt}
  
            />
  
  
          </div>
        </div>
      );
    }

    else
      return null;


  }




  //#endregion Render


  //#region Data Load


  private getSelectedPeriodText = (periodId:number, periodsOriginal: IPeriod[]): string => {
    let periodTxt:string = "";
    console.log('getSelectedPeriodText - id', periodId);
    //var pp = this.state.LookupData.PeriodsOriginal.filter(p => p.ID === periodId);
    var pp = periodsOriginal.filter(p => p.ID === periodId);
    console.log('getSelectedPeriodText - pp', pp);
    if(pp[0]){
      periodTxt = pp[0]["Title"];
    }
    console.log('selected period text', periodTxt);

    return periodTxt;
  }

  private loadPeriods = (): Promise<IPeriod[]> => {
    return this.periodService.readAll().then((pArr: IPeriod[]): IPeriod[] => {
      
      const pArrCopy = JSON.parse(JSON.stringify(pArr));
      //get the current period
      let currentPeriodId: number = 0;
      const currentPeriod = pArr.filter(p => p.PeriodStatus === "Current Period");
      if (currentPeriod && currentPeriod.length > 0) {
        currentPeriodId = currentPeriod[0].ID;
      }

      const selectedPeriodTxt:string = this.getSelectedPeriodText(currentPeriodId, pArrCopy);

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

      const xx = { ...this.state.LookupData, ['Periods']: pArr, ['PeriodsOriginal']: pArrCopy };

      this.setState({
        //LookupData: this.cloneObject(this.state.LookupData, 'Periods', pArr),
        LookupData: xx,
        PeriodId: currentPeriodId,
        SelectedPeriodTxt: selectedPeriodTxt
      });
      return pArr;
    }, (err) => { if (this.onError) this.onError(`Error loading Periods lookup data`, err.message); });
  }




  protected loadLookups(): Promise<any> {

    return Promise.all([
      this.loadPeriods(),

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
        //super user
        return true;
      }
    }

    return false;
  }





  //#endregion Permissions

  //#region event handlers

  private changeDropdown = (option: IDropdownOption, f: string, index?: number): void => {

    if (option.key !== this.state.PeriodId) {
      const pArrTemp: IPeriod[] = this.state.LookupData.Periods.filter(p => p.ID === option.key);
      let isArchivedPeriod: boolean = false;
      if (pArrTemp.length > 0) {
        if (pArrTemp[0].PeriodStatus === "Archived Period") {
          isArchivedPeriod = true;
        }
      }

      const selectedPeriodTxt:string = this.getSelectedPeriodText(Number(option.key), this.state.LookupData.PeriodsOriginal );

      this.setState({ PeriodId: option.key, IsArchivedPeriod: isArchivedPeriod, SelectedPeriodTxt: selectedPeriodTxt },
        //this.readOrCreateGoFormInDb
      );
    }

  }

  private handleReport1_ChangeFilterText = (value: string): void => {
    this.setState({ Report1_ListFilterText: value });
  }


  //#endregion event handlers

}


