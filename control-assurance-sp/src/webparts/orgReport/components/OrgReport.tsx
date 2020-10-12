import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import { IOrgRepColumn, ColumnDisplayTypes } from '../../../types/OrgRepColumn';
import OrgGenReport from '../../../components/report/OrgGenReport';
import OrgGenReport2 from '../../../components/report/OrgGenReport2';
import ThemeStatReport from '../../../components/report/ThemeStatReport';
import ThemeStatReport2 from '../../../components/report/ThemeStatReport2';
import '../../../styles/CustomFabric2.scss';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';
import { IPeriod, IUserPermission } from '../../../types';
import GenExport from '../../../components/export/GenExport';

export interface ILookupData {
  Periods: IPeriod[];
  PeriodsOriginal: IPeriod[];
}
export class LookupData implements ILookupData {
  public Periods: IPeriod[] = [];
  public PeriodsOriginal: IPeriod[] = [];
}

export interface IOrgReportState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
  SelectedPeriod: string | number;
  SelectedPeriodTxt: string;

  SelectedPivotKey: string;

  DirectoratesFilter: string;
  DivisionsFilter: string;
  ThemeFilter_DivisionLst: string;

  DGAreaStackedBar: boolean;
  DirectoratesStackedBar: boolean;
  DivisionsStackedBar: boolean;
  ThemeStackedBar: boolean;

  DGAreaBreakdowns: boolean;
  DirectoratesBreakdowns: boolean;
  DivisionsBreakdowns: boolean;
  
  ThemeBreakdowns: boolean;

  DGAreaControls: boolean;
  DirectoratesControls: boolean;
  DivisionsControls: boolean;
  ThemeControls: boolean;

  DGAreaHighlightOnly: boolean;
  DirectoratesHighlightOnly: boolean;
  DivisionsHighlightOnly: boolean;
  ThemeHighlightOnly: boolean;

  DGAreaAssurances: boolean;
  DirectoratesAssurances: boolean;
  DivisionsAssurances: boolean;
  ThemeAssurances: boolean;

  DGAreaAssurance1: boolean;
  DirectoratesAssurance1: boolean;
  DivisionsAssurance1: boolean;
  ThemeAssurance1: boolean;

  DGAreaAssurance2: boolean;
  DirectoratesAssurance2: boolean;
  DivisionsAssurance2: boolean;
  ThemeAssurance2: boolean;

  DGAreaAssurance3: boolean;
  DirectoratesAssurance3: boolean;
  DivisionsAssurance3: boolean;
  ThemeAssurance3: boolean;
}
export class OrgReportState extends types.UserContextWebPartState {
  public LookupData = new LookupData();
  public SelectedPeriod: string | number = 0;
  public SelectedPeriodTxt: string = "";

  public SelectedPivotKey = "Browse DG Areas"; //default, 1st tab selected

  public DirectoratesFilter = "";
  public DivisionsFilter = "";
  public ThemeFilter_DivisionLst = "";


  public DGAreaStackedBar = false;
  public DirectoratesStackedBar = false;
  public DivisionsStackedBar = false;
  public ThemeStackedBar = false;

  public DGAreaBreakdowns = false;
  public DirectoratesBreakdowns: boolean;
  public DivisionsBreakdowns: boolean;

  
  
  public ThemeBreakdowns = false;

  public DGAreaControls = true;
  public DirectoratesControls = true;
  public DivisionsControls = true;
  public ThemeControls = true;

  public DGAreaHighlightOnly = false;
  public DirectoratesHighlightOnly = false;
  public DivisionsHighlightOnly = false;
  public ThemeHighlightOnly = false;

  public DGAreaAssurances = true;
  public DirectoratesAssurances = true;
  public DivisionsAssurances = true;
  public ThemeAssurances = true;

  public DGAreaAssurance1 = false;
  public DirectoratesAssurance1 = false;
  public DivisionsAssurance1 = false;
  public ThemeAssurance1 = false;

  public DGAreaAssurance2 = false;
  public DirectoratesAssurance2 = false;
  public DivisionsAssurance2 = false;
  public ThemeAssurance2 = false;


  public DGAreaAssurance3 = false;
  public DirectoratesAssurance3 = false;
  public DivisionsAssurance3 = false;
  public ThemeAssurance3 = false;


  constructor() {
    super();
  }
}

export default class OrgReport extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, OrgReportState> {

  private readonly headerTxt_DGAreas: string = "Browse DG Areas";
  private readonly headerTxt_Directorates: string = "Browse Directorates";
  private readonly headerTxt_Divisions: string = "Browse Divisions";
  private readonly headerTxt_Theme: string = "Browse Theme";
  private readonly headerTxt_ExportRep: string = "Export to Excel";

  private periodService: services.PeriodService = new services.PeriodService(this.props.spfxContext, this.props.api);


  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new OrgReportState();
  }

  //#region Render
  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (
      <React.Fragment>
        <CrDropdown
          label="Which period do you want to view?"
          placeholder="Select a Period"
          style={{ marginTop: "10px", marginBottom: "20px" }}
          options={this.state.LookupData.Periods.map((p) => { return { key: p.ID, text: p.Title }; })}
          onChanged={(v) => this.changePeriodsDropdown(v)}
          selectedKey={this.state.SelectedPeriod}
        />

        <Pivot onLinkClick={this.handlePivotClick} selectedKey={`${this.state.SelectedPivotKey}`}>
          <PivotItem headerText={this.headerTxt_DGAreas} itemKey={this.headerTxt_DGAreas}>
            {this.renderDGAreasReport()}
          </PivotItem>
          <PivotItem headerText={this.headerTxt_Directorates} itemKey={this.headerTxt_Directorates}>
            {this.renderDirectoratesReport()}
          </PivotItem>
          <PivotItem headerText={this.headerTxt_Divisions} itemKey={this.headerTxt_Divisions}>
            {this.renderDivisionsReport()}
          </PivotItem>
          <PivotItem headerText={this.headerTxt_Theme} itemKey={this.headerTxt_Theme}>
            {this.renderThemeReport()}
          </PivotItem>

          <PivotItem headerText={this.headerTxt_ExportRep} itemKey={this.headerTxt_ExportRep}>
            {this.renderGenExport()}
          </PivotItem>

        </Pivot>
      </React.Fragment>
    );
  }


  private renderGenExport(): React.ReactElement<types.IWebPartComponentProps> {

    if(this.state.SelectedPeriod > 0){

      return (
        <div>

          <div style={{ paddingTop: "10px" }}>
  
            <GenExport
              {...this.props}
              onError={this.onError}
              moduleName="ControlsAssurance"
              periodId={Number(this.state.SelectedPeriod)}
              periodTitle={this.state.SelectedPeriodTxt}
  
            />
  
  
          </div>
        </div>
      );
    }

    else
      return null;


  }

  private renderDGAreasReport_old() {

    const listColumns: IOrgRepColumn[] = [
      //use fieldName as key
      {
        key: 'Title',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOnAndOff,
        name: 'DG Area',
        fieldName: 'Title',
        minWidth: 250,
        maxWidth: 300,
        isResizable: true,
        headerClassName: "bold"
        //isSortedDescending: false,
        //isSorted: true

      },
      {
        key: 'TotalUnsatisfactory',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Unsatisfactory',
        fieldName: 'TotalUnsatisfactory',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalLimited',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Limited',
        fieldName: 'TotalLimited',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalModerate',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Moderate',
        fieldName: 'TotalModerate',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalSubstantial',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Substantial',
        fieldName: 'TotalSubstantial',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalEffective',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Effective Total',
        fieldName: 'TotalEffective',
        minWidth: 90,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalNotApplicable',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Not Applicable',
        fieldName: 'TotalNotApplicable',
        minWidth: 90,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalIncomplete',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Incomplete',
        fieldName: 'TotalIncomplete',
        minWidth: 90,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'Aggregate',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Aggregate',
        fieldName: 'Aggregate',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },

      //Following Columns will be displayed when breakdowns mode is off
      {
        key: 'AggregateControls',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateControls: true,
        name: 'Controls',
        fieldName: 'AggregateControls',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurances',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurances: true,
        name: 'Assurances',
        fieldName: 'AggregateAssurances',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurance1',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurance1: true,
        name: 'Assurance1',
        fieldName: 'AggregateAssurance1',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurance2',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurance2: true,
        name: 'Assurance2',
        fieldName: 'AggregateAssurance2',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurance3',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurance3: true,
        name: 'Assurance3',
        fieldName: 'AggregateAssurance3',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
    ];

    return (
      this.state.LookupData.Periods && this.state.SelectedPeriod > 0 &&
      <React.Fragment>
        <OrgGenReport
          periodId={this.state.SelectedPeriod}
          onItemTitleClick={this.handleItemTitleClick}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.DGAreaStatService(this.props.spfxContext, this.props.api)}
          entityNamePlural="DG Areas"
          breakdowns={this.state.DGAreaBreakdowns}
          onChangeBreakdowns={this.handleChangeBreakdowns_DGAreas}
          controls={this.state.DGAreaControls}
          onChangeControls={this.handleChangeControls_DGAreas}
          highlightOnly={this.state.DGAreaHighlightOnly}
          onChangeHighlightOnly={this.handleChangeHighlightOnly_DGAreas}
          assurances={this.state.DGAreaAssurances}
          onChangeAssurances={this.handleChangeAssurances_DGAreas}
          assurance1={this.state.DGAreaAssurance1}
          onChangeAssurance1={this.handleChangeAssurance1_DGAreas}
          assurance2={this.state.DGAreaAssurance2}
          onChangeAssurance2={this.handleChangeAssurance2_DGAreas}
          assurance3={this.state.DGAreaAssurance3}
          onChangeAssurance3={this.handleChangeAssurance3_DGAreas}


        />

      </React.Fragment>
    );
  }

  private renderDirectoratesReport_old() {

    const listColumns: IOrgRepColumn[] = [
      //use fieldName as key
      {
        key: 'DGTitle',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'DGTitle',
        fieldName: 'DGTitle',
        minWidth: 1,
      },
      {
        key: 'Title',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOnAndOff,
        name: 'Directorate',
        fieldName: 'Title',
        minWidth: 250,
        maxWidth: 300,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalUnsatisfactory',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Unsatisfactory',
        fieldName: 'TotalUnsatisfactory',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalLimited',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Limited',
        fieldName: 'TotalLimited',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalModerate',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Moderate',
        fieldName: 'TotalModerate',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalSubstantial',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Substantial',
        fieldName: 'TotalSubstantial',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalEffective',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Effective Total',
        fieldName: 'TotalEffective',
        minWidth: 90,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalNotApplicable',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Not Applicable',
        fieldName: 'TotalNotApplicable',
        minWidth: 90,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalIncomplete',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Incomplete',
        fieldName: 'TotalIncomplete',
        minWidth: 90,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'Aggregate',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Aggregate',
        fieldName: 'Aggregate',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },

      //Following Columns will be displayed when breakdowns mode is off
      {
        key: 'AggregateControls',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateControls: true,
        name: 'Controls',
        fieldName: 'AggregateControls',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurances',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurances: true,
        name: 'Assurances',
        fieldName: 'AggregateAssurances',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurance1',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurance1: true,
        name: 'Assurance1',
        fieldName: 'AggregateAssurance1',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurance2',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurance2: true,
        name: 'Assurance2',
        fieldName: 'AggregateAssurance2',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurance3',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurance3: true,
        name: 'Assurance3',
        fieldName: 'AggregateAssurance3',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
    ];

    return (
      <React.Fragment>
        <OrgGenReport
          periodId={this.state.SelectedPeriod}
          onItemTitleClick={this.handleItemTitleClick}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.DirectorateStatService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Directorates"
          filterText={this.state.DirectoratesFilter}
          breakdowns={this.state.DirectoratesBreakdowns}
          onChangeBreakdowns={this.handleChangeBreakdowns_Directorates}
          controls={this.state.DirectoratesControls}
          onChangeControls={this.handleChangeControls_Directorates}
          highlightOnly={this.state.DirectoratesHighlightOnly}
          onChangeHighlightOnly={this.handleChangeHighlightOnly_Directorates}
          assurances={this.state.DirectoratesAssurances}
          onChangeAssurances={this.handleChangeAssurances_Directorates}
          assurance1={this.state.DirectoratesAssurance1}
          onChangeAssurance1={this.handleChangeAssurance1_Directorates}
          assurance2={this.state.DirectoratesAssurance2}
          onChangeAssurance2={this.handleChangeAssurance2_Directorates}
          assurance3={this.state.DirectoratesAssurance3}
          onChangeAssurance3={this.handleChangeAssurance3_Directorates}
        />

      </React.Fragment>
    );
  }

  private renderDivisionsReport_old() {

    const listColumns: IOrgRepColumn[] = [
      //use fieldName as key
      {
        key: 'DGTitle',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'DGTitle',
        fieldName: 'DGTitle',
        minWidth: 1,
      },
      {
        key: 'DirTitle',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'DirTitle',
        fieldName: 'DirTitle',
        minWidth: 1,
      },
      {
        key: 'Title',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOnAndOff,
        name: 'Division',
        fieldName: 'Title',
        minWidth: 250,
        maxWidth: 300,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalUnsatisfactory',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Unsatisfactory',
        fieldName: 'TotalUnsatisfactory',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalLimited',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Limited',
        fieldName: 'TotalLimited',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalModerate',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Moderate',
        fieldName: 'TotalModerate',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalSubstantial',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Substantial',
        fieldName: 'TotalSubstantial',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalEffective',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Effective Total',
        fieldName: 'TotalEffective',
        minWidth: 90,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalNotApplicable',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Not Applicable',
        fieldName: 'TotalNotApplicable',
        minWidth: 90,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalIncomplete',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Incomplete',
        fieldName: 'TotalIncomplete',
        minWidth: 90,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'Aggregate',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Aggregate',
        fieldName: 'Aggregate',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },

      //Following Columns will be displayed when breakdowns mode is off
      {
        key: 'AggregateControls',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateControls: true,
        name: 'Controls',
        fieldName: 'AggregateControls',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurances',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurances: true,
        name: 'Assurances',
        fieldName: 'AggregateAssurances',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurance1',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurance1: true,
        name: 'Assurance1',
        fieldName: 'AggregateAssurance1',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurance2',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurance2: true,
        name: 'Assurance2',
        fieldName: 'AggregateAssurance2',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurance3',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurance3: true,
        name: 'Assurance3',
        fieldName: 'AggregateAssurance3',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
    ];

    return (
      <React.Fragment>
        <OrgGenReport
          periodId={this.state.SelectedPeriod}
          onItemTitleClick={this.handleItemTitleClick}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.DivisionStatService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Divisions"
          filterText={this.state.DivisionsFilter}
          breakdowns={this.state.DivisionsBreakdowns}
          onChangeBreakdowns={this.handleChangeBreakdowns_Divisions}
          controls={this.state.DivisionsControls}
          onChangeControls={this.handleChangeControls_Divisions}
          highlightOnly={this.state.DivisionsHighlightOnly}
          onChangeHighlightOnly={this.handleChangeHighlightOnly_Divisions}
          assurances={this.state.DivisionsAssurances}
          onChangeAssurances={this.handleChangeAssurances_Divisions}
          assurance1={this.state.DivisionsAssurance1}
          onChangeAssurance1={this.handleChangeAssurance1_Divisions}
          assurance2={this.state.DivisionsAssurance2}
          onChangeAssurance2={this.handleChangeAssurance2_Divisions}
          assurance3={this.state.DivisionsAssurance3}
          onChangeAssurance3={this.handleChangeAssurance3_Divisions}
        />

      </React.Fragment>
    );
  }

  private renderThemeReport_old() {

    const listColumns: IOrgRepColumn[] = [
      //use fieldName as key
      {
        key: 'Title',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOnAndOff,
        name: 'Element',
        fieldName: 'Title',
        minWidth: 250,
        maxWidth: 300,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalUnsatisfactory',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Unsatisfactory',
        fieldName: 'TotalUnsatisfactory',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalLimited',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Limited',
        fieldName: 'TotalLimited',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalModerate',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Moderate',
        fieldName: 'TotalModerate',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalSubstantial',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Substantial',
        fieldName: 'TotalSubstantial',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalEffective',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Effective Total',
        fieldName: 'TotalEffective',
        minWidth: 90,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalNotApplicable',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Not Applicable',
        fieldName: 'TotalNotApplicable',
        minWidth: 90,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalIncomplete',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Incomplete',
        fieldName: 'TotalIncomplete',
        minWidth: 90,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'Aggregate',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOn,
        name: 'Aggregate',
        fieldName: 'Aggregate',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },

      //Following Columns will be displayed when breakdowns mode is off
      {
        key: 'AggregateControls',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateControls: true,
        name: 'Controls',
        fieldName: 'AggregateControls',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurances',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurances: true,
        name: 'Assurances',
        fieldName: 'AggregateAssurances',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurance1',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurance1: true,
        name: 'Assurance1',
        fieldName: 'AggregateAssurance1',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurance2',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurance2: true,
        name: 'Assurance2',
        fieldName: 'AggregateAssurance2',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AggregateAssurance3',
        columnDisplayType: ColumnDisplayTypes.BreakdownsOff,
        aggregateAssurance3: true,
        name: 'Assurance3',
        fieldName: 'AggregateAssurance3',
        minWidth: 150,
        maxWidth: 150,
        isResizable: true,
        headerClassName: "bold",
      },
    ];

    return (
      <React.Fragment>
        <ThemeStatReport
          periodId={this.state.SelectedPeriod}
          onItemTitleClick={this.handleItemTitleClick}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.ThemeStatService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Themes"
          divisionLstFilter={this.state.ThemeFilter_DivisionLst}
          breakdowns={this.state.ThemeBreakdowns}
          onChangeBreakdowns={this.handleChangeBreakdowns_Theme}
          controls={this.state.ThemeControls}
          onChangeControls={this.handleChangeControls_Theme}
          highlightOnly={this.state.ThemeHighlightOnly}
          onChangeHighlightOnly={this.handleChangeHighlightOnly_Theme}
          assurances={this.state.ThemeAssurances}
          onChangeAssurances={this.handleChangeAssurances_Theme}
          assurance1={this.state.ThemeAssurance1}
          onChangeAssurance1={this.handleChangeAssurance1_Theme}
          assurance2={this.state.ThemeAssurance2}
          onChangeAssurance2={this.handleChangeAssurance2_Theme}
          assurance3={this.state.ThemeAssurance3}
          onChangeAssurance3={this.handleChangeAssurance3_Theme}


        />

      </React.Fragment>
    );
  }

  private renderDGAreasReport() {

    const listColumns: IOrgRepColumn[] = [
      //use fieldName as key
      {
        key: 'Title',
        columnDisplayType: ColumnDisplayTypes.StackedBarOnAndOff,
        name: 'DG Area',
        fieldName: 'Title',
        minWidth: 250,
        maxWidth: 300,
        isResizable: true,
        headerClassName: "bold"
        //isSortedDescending: false,
        //isSorted: true

      },
      {
        key: 'TotalAUnsatisfactory',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalAUnsatisfactory',
        fieldName: 'TotalAUnsatisfactory',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalALimited',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalALimited',
        fieldName: 'TotalALimited',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalAModerate',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalAModerate',
        fieldName: 'TotalAModerate',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalASubstantial',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalASubstantial',
        fieldName: 'TotalASubstantial',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalANotApplicable',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalANotApplicable',
        fieldName: 'TotalANotApplicable',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },

      {
        key: 'TotalB1Unsatisfactory',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Unsatisfactory',
        fieldName: 'TotalB1Unsatisfactory',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1Limited',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Limited',
        fieldName: 'TotalB1Limited',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1Moderate',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Moderate',
        fieldName: 'TotalB1Moderate',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1Substantial',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Substantial',
        fieldName: 'TotalB1Substantial',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1NotApplicable',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1NotApplicable',
        fieldName: 'TotalB1NotApplicable',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },


      {
        key: 'ControlsBar',
        columnDisplayType: ColumnDisplayTypes.StackedBarOn,
        name: 'Controls',
        fieldName: 'ControlsBar',
        minWidth: 245,
        maxWidth: 245,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AssuranceBar',
        columnDisplayType: ColumnDisplayTypes.StackedBarOn,
        name: 'Assurance',
        fieldName: 'AssuranceBar',
        minWidth: 245,
        maxWidth: 245,
        isResizable: true,
        headerClassName: "bold",
      },


    ];

    return (
      this.state.LookupData.Periods && this.state.SelectedPeriod > 0 &&
      <React.Fragment>
        <OrgGenReport2
          periodId={this.state.SelectedPeriod}
          onItemTitleClick={this.handleItemTitleClick}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.DGAreaStatService(this.props.spfxContext, this.props.api)}
          entityNamePlural="DG Areas"
          stackedBar={this.state.DGAreaStackedBar}
          onChangeStackedBar={this.handleChangeStackedBar_DGAreas}


        />

      </React.Fragment>
    );
  }


  private renderDirectoratesReport() {

    const listColumns: IOrgRepColumn[] = [
      //use fieldName as key
      {
        key: 'DGTitle',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'DGTitle',
        fieldName: 'DGTitle',
        minWidth: 1,
      },
      {
        key: 'Title',
        columnDisplayType: ColumnDisplayTypes.StackedBarOnAndOff,
        name: 'Directorate',
        fieldName: 'Title',
        minWidth: 250,
        maxWidth: 300,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalAUnsatisfactory',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalAUnsatisfactory',
        fieldName: 'TotalAUnsatisfactory',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalALimited',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalALimited',
        fieldName: 'TotalALimited',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalAModerate',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalAModerate',
        fieldName: 'TotalAModerate',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalASubstantial',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalASubstantial',
        fieldName: 'TotalASubstantial',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalANotApplicable',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalANotApplicable',
        fieldName: 'TotalANotApplicable',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },

      {
        key: 'TotalB1Unsatisfactory',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Unsatisfactory',
        fieldName: 'TotalB1Unsatisfactory',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1Limited',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Limited',
        fieldName: 'TotalB1Limited',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1Moderate',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Moderate',
        fieldName: 'TotalB1Moderate',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1Substantial',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Substantial',
        fieldName: 'TotalB1Substantial',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1NotApplicable',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1NotApplicable',
        fieldName: 'TotalB1NotApplicable',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },


      {
        key: 'ControlsBar',
        columnDisplayType: ColumnDisplayTypes.StackedBarOn,
        name: 'Controls',
        fieldName: 'ControlsBar',
        minWidth: 245,
        maxWidth: 245,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AssuranceBar',
        columnDisplayType: ColumnDisplayTypes.StackedBarOn,
        name: 'Assurance',
        fieldName: 'AssuranceBar',
        minWidth: 245,
        maxWidth: 245,
        isResizable: true,
        headerClassName: "bold",
      },



    ];

    return (
      <React.Fragment>
        <OrgGenReport2
          periodId={this.state.SelectedPeriod}
          onItemTitleClick={this.handleItemTitleClick}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.DirectorateStatService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Directorates"
          filterText={this.state.DirectoratesFilter}
          stackedBar={this.state.DirectoratesStackedBar}
          onChangeStackedBar={this.handleChangeStackedBar_Directorates}


        />

      </React.Fragment>
    );
  }


  private renderDivisionsReport() {

    const listColumns: IOrgRepColumn[] = [
      //use fieldName as key
      {
        key: 'DGTitle',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'DGTitle',
        fieldName: 'DGTitle',
        minWidth: 1,
      },
      {
        key: 'DirTitle',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'DirTitle',
        fieldName: 'DirTitle',
        minWidth: 1,
      },
      {
        key: 'Title',
        columnDisplayType: ColumnDisplayTypes.StackedBarOnAndOff,
        name: 'Division',
        fieldName: 'Title',
        minWidth: 250,
        maxWidth: 300,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalAUnsatisfactory',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalAUnsatisfactory',
        fieldName: 'TotalAUnsatisfactory',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalALimited',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalALimited',
        fieldName: 'TotalALimited',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalAModerate',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalAModerate',
        fieldName: 'TotalAModerate',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalASubstantial',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalASubstantial',
        fieldName: 'TotalASubstantial',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalANotApplicable',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalANotApplicable',
        fieldName: 'TotalANotApplicable',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },

      {
        key: 'TotalB1Unsatisfactory',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Unsatisfactory',
        fieldName: 'TotalB1Unsatisfactory',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1Limited',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Limited',
        fieldName: 'TotalB1Limited',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1Moderate',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Moderate',
        fieldName: 'TotalB1Moderate',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1Substantial',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Substantial',
        fieldName: 'TotalB1Substantial',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1NotApplicable',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1NotApplicable',
        fieldName: 'TotalB1NotApplicable',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },


      {
        key: 'ControlsBar',
        columnDisplayType: ColumnDisplayTypes.StackedBarOn,
        name: 'Controls',
        fieldName: 'ControlsBar',
        minWidth: 245,
        maxWidth: 245,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AssuranceBar',
        columnDisplayType: ColumnDisplayTypes.StackedBarOn,
        name: 'Assurance',
        fieldName: 'AssuranceBar',
        minWidth: 245,
        maxWidth: 245,
        isResizable: true,
        headerClassName: "bold",
      },


    ];

    return (
      <React.Fragment>
        <OrgGenReport2
          periodId={this.state.SelectedPeriod}
          onItemTitleClick={this.handleItemTitleClick}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.DivisionStatService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Divisions"
          filterText={this.state.DivisionsFilter}
          stackedBar={this.state.DivisionsStackedBar}
          onChangeStackedBar={this.handleChangeStackedBar_Divisions}

        />

      </React.Fragment>
    );
  }

  private renderThemeReport() {

    const listColumns: IOrgRepColumn[] = [
      //use fieldName as key
      {
        key: 'Title',
        columnDisplayType: ColumnDisplayTypes.StackedBarOnAndOff,
        name: 'Theme',
        fieldName: 'Title',
        minWidth: 250,
        maxWidth: 300,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalAUnsatisfactory',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalAUnsatisfactory',
        fieldName: 'TotalAUnsatisfactory',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalALimited',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalALimited',
        fieldName: 'TotalALimited',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalAModerate',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalAModerate',
        fieldName: 'TotalAModerate',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalASubstantial',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalASubstantial',
        fieldName: 'TotalASubstantial',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalANotApplicable',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalANotApplicable',
        fieldName: 'TotalANotApplicable',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },

      {
        key: 'TotalB1Unsatisfactory',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Unsatisfactory',
        fieldName: 'TotalB1Unsatisfactory',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1Limited',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Limited',
        fieldName: 'TotalB1Limited',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1Moderate',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Moderate',
        fieldName: 'TotalB1Moderate',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1Substantial',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1Substantial',
        fieldName: 'TotalB1Substantial',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'TotalB1NotApplicable',
        columnDisplayType: ColumnDisplayTypes.Hidden,
        name: 'TotalB1NotApplicable',
        fieldName: 'TotalB1NotApplicable',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        headerClassName: "bold",
      },


      {
        key: 'ControlsBar',
        columnDisplayType: ColumnDisplayTypes.StackedBarOn,
        name: 'Controls',
        fieldName: 'ControlsBar',
        minWidth: 245,
        maxWidth: 245,
        isResizable: true,
        headerClassName: "bold",
      },
      {
        key: 'AssuranceBar',
        columnDisplayType: ColumnDisplayTypes.StackedBarOn,
        name: 'Assurance',
        fieldName: 'AssuranceBar',
        minWidth: 245,
        maxWidth: 245,
        isResizable: true,
        headerClassName: "bold",
      },


    ];

    return (
      <React.Fragment>
        <ThemeStatReport2
          periodId={this.state.SelectedPeriod}
          onItemTitleClick={this.handleItemTitleClick}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.ThemeStatService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Themes"
          divisionLstFilter={this.state.ThemeFilter_DivisionLst}

          stackedBar={this.state.ThemeStackedBar}
          onChangeStackedBar={this.handleChangeStackedBar_Theme}


        />

      </React.Fragment>
    );
  }



  //#endregion Render



  //#region Events Handlers

  private handlePivotClick = (item: PivotItem): void => {
    this.clearErrors();
    this.setState({ SelectedPivotKey: item.props.headerText, DirectoratesFilter: "", DivisionsFilter: "", ThemeFilter_DivisionLst: "" });

  }
  private handleItemTitleClick = (value: string, entityNamePlural: string): void => {
    if (entityNamePlural === "DG Areas") {
      this.setState({
        SelectedPivotKey: this.headerTxt_Directorates, DirectoratesFilter: value,
        DirectoratesBreakdowns: this.state.DGAreaBreakdowns,
        DirectoratesControls: this.state.DGAreaControls,
        DirectoratesHighlightOnly: this.state.DGAreaHighlightOnly,
        DirectoratesAssurances: this.state.DGAreaAssurances,
        DirectoratesAssurance1: this.state.DGAreaAssurance1,
        DirectoratesAssurance2: this.state.DGAreaAssurance2,
        DirectoratesAssurance3: this.state.DGAreaAssurance3,
      });
    }
    else if (entityNamePlural === "Directorates") {
      this.setState({
        SelectedPivotKey: this.headerTxt_Divisions, DivisionsFilter: value,
        DivisionsBreakdowns: this.state.DirectoratesBreakdowns,
        DivisionsControls: this.state.DirectoratesControls,
        DivisionsHighlightOnly: this.state.DirectoratesHighlightOnly,
        DivisionsAssurances: this.state.DirectoratesAssurances,
        DivisionsAssurance1: this.state.DirectoratesAssurance1,
        DivisionsAssurance2: this.state.DirectoratesAssurance2,
        DivisionsAssurance3: this.state.DirectoratesAssurance3,
      });
    }
    else if (entityNamePlural === "Divisions") {
      this.setState({
        SelectedPivotKey: this.headerTxt_Theme, ThemeFilter_DivisionLst: value,
        ThemeBreakdowns: this.state.DivisionsBreakdowns,
        ThemeControls: this.state.DivisionsControls,
        ThemeHighlightOnly: this.state.DivisionsHighlightOnly,
        ThemeAssurances: this.state.DivisionsAssurances,
        ThemeAssurance1: this.state.DivisionsAssurance1,
        ThemeAssurance2: this.state.DivisionsAssurance2,
        ThemeAssurance3: this.state.DivisionsAssurance3,
      });
    }

  }


  private handleChangeStackedBar_DGAreas = (value: boolean): void => {
    this.setState({ DGAreaStackedBar: value });
  }
  private handleChangeStackedBar_Directorates = (value: boolean): void => {
    this.setState({ DirectoratesStackedBar: value });
  }
  private handleChangeStackedBar_Divisions = (value: boolean): void => {
    this.setState({ DivisionsStackedBar : value });
  }

  private handleChangeStackedBar_Theme = (value: boolean): void => {
    this.setState({ ThemeStackedBar : value });
  }







  private handleChangeBreakdowns_DGAreas = (value: boolean): void => {
    this.setState({ DGAreaBreakdowns: value });
  }
  private handleChangeBreakdowns_Directorates = (value: boolean): void => {
    this.setState({ DirectoratesBreakdowns: value });
  }
  private handleChangeBreakdowns_Divisions = (value: boolean): void => {
    this.setState({ DivisionsBreakdowns: value });
  }
  private handleChangeBreakdowns_Theme = (value: boolean): void => {
    this.setState({ ThemeBreakdowns: value });
  }

  private handleChangeControls_DGAreas = (value: boolean): void => {
    this.setState({ DGAreaControls: value });
  }
  private handleChangeControls_Directorates = (value: boolean): void => {
    this.setState({ DirectoratesControls: value });
  }
  private handleChangeControls_Divisions = (value: boolean): void => {
    this.setState({ DivisionsControls: value });
  }
  private handleChangeControls_Theme = (value: boolean): void => {
    this.setState({ ThemeControls: value });
  }

  private handleChangeHighlightOnly_DGAreas = (value: boolean): void => {
    this.setState({ DGAreaHighlightOnly: value });
  }
  private handleChangeHighlightOnly_Directorates = (value: boolean): void => {
    this.setState({ DirectoratesHighlightOnly: value });
  }
  private handleChangeHighlightOnly_Divisions = (value: boolean): void => {
    this.setState({ DivisionsHighlightOnly: value });
  }
  private handleChangeHighlightOnly_Theme = (value: boolean): void => {
    this.setState({ ThemeHighlightOnly: value });
  }

  private handleChangeAssurances_DGAreas = (value: boolean): void => {
    this.setState({ DGAreaAssurances: value });
  }
  private handleChangeAssurances_Directorates = (value: boolean): void => {
    this.setState({ DirectoratesAssurances: value });
  }
  private handleChangeAssurances_Divisions = (value: boolean): void => {
    this.setState({ DivisionsAssurances: value });
  }
  private handleChangeAssurances_Theme = (value: boolean): void => {
    this.setState({ ThemeAssurances: value });
  }

  private handleChangeAssurance1_DGAreas = (value: boolean): void => {
    this.setState({ DGAreaAssurance1: value });
  }
  private handleChangeAssurance1_Directorates = (value: boolean): void => {
    this.setState({ DirectoratesAssurance1: value });
  }
  private handleChangeAssurance1_Divisions = (value: boolean): void => {
    this.setState({ DivisionsAssurance1: value });
  }
  private handleChangeAssurance1_Theme = (value: boolean): void => {
    this.setState({ ThemeAssurance1: value });
  }

  private handleChangeAssurance2_DGAreas = (value: boolean): void => {
    this.setState({ DGAreaAssurance2: value });
  }
  private handleChangeAssurance2_Directorates = (value: boolean): void => {
    this.setState({ DirectoratesAssurance2: value });
  }
  private handleChangeAssurance2_Divisions = (value: boolean): void => {
    this.setState({ DivisionsAssurance2: value });
  }
  private handleChangeAssurance2_Theme = (value: boolean): void => {
    this.setState({ ThemeAssurance2: value });
  }

  private handleChangeAssurance3_DGAreas = (value: boolean): void => {
    this.setState({ DGAreaAssurance3: value });
  }
  private handleChangeAssurance3_Directorates = (value: boolean): void => {
    this.setState({ DirectoratesAssurance3: value });
  }
  private handleChangeAssurance3_Divisions = (value: boolean): void => {
    this.setState({ DivisionsAssurance3: value });
  }
  private handleChangeAssurance3_Theme = (value: boolean): void => {
    this.setState({ ThemeAssurance3: value });
  }

  private changePeriodsDropdown = (option: IDropdownOption): void => {

    const selectedPeriodTxt:string = this.getSelectedPeriodText(Number(option.key), this.state.LookupData.PeriodsOriginal );
    this.setState({ SelectedPeriod: option.key, SelectedPeriodTxt: selectedPeriodTxt });
  }

  //#endregion Events Handlers

  //#region Data Load

  protected loadPeriods = (): Promise<IPeriod[]> => {
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
      if (this.superUserOrSysManagerLoggedIn() === true) {
      }
      else {
        //dont show design periods
        pArr = pArr.filter(p => p.PeriodStatus !== "Design Period");
      }

      //console.group('pArrCopy', pArrCopy);

      const xx = { ...this.state.LookupData, ['Periods']: pArr, ['PeriodsOriginal']: pArrCopy };

      this.setState({
        //LookupData: this.cloneObject(this.state.LookupData, 'Periods', pArr),
        LookupData: xx,
        SelectedPeriod: currentPeriodId,
        SelectedPeriodTxt: selectedPeriodTxt
      }, () => { console.log("After set ", this.state.SelectedPeriod); });
      return pArr;
    }, (err) => { if (this.onError) this.onError(`Error loading Periods lookup data`, err.message); });
  }

  protected loadLookups(): Promise<any> {

    return Promise.all([
      this.loadPeriods(),
    ]);
  }

  // private getSelectedPeriodText = (periodId:number): string => {
  //   let periodTxt:string = "";
  //   console.log('getSelectedPeriodText - id', periodId);
  //   var pp = this.state.LookupData.PeriodsOriginal.filter(p => p.ID === periodId);
  //   console.log('getSelectedPeriodText - pp', pp);
  //   if(pp[0]){
  //     periodTxt = pp[0]["Title"];
  //   }
  //   console.log('selected period text', periodTxt);

  //   return periodTxt;
  // }

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
}
