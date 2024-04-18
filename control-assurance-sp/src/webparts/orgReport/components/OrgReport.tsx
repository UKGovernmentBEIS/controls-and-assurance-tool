import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import { IOrgRepColumn, ColumnDisplayTypes } from '../../../types/OrgRepColumn';
import OrgGenReport2 from '../../../components/report/OrgGenReport2';
import ThemeStatReport2 from '../../../components/report/ThemeStatReport2';
import '../../../styles/CustomFabric2.scss';
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
  SelectedPeriod: number;
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
  public SelectedPeriod: number = 0;
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

    if (this.state.SelectedPeriod > 0) {
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
    this.setState({ DivisionsStackedBar: value });
  }

  private handleChangeStackedBar_Theme = (value: boolean): void => {
    this.setState({ ThemeStackedBar: value });
  }

  private changePeriodsDropdown = (option: IDropdownOption): void => {
    const selectedPeriodTxt: string = this.getSelectedPeriodText(Number(option.key), this.state.LookupData.PeriodsOriginal);
    this.setState({ SelectedPeriod: Number(option.key), SelectedPeriodTxt: selectedPeriodTxt });
  }

  //#endregion Events Handlers

  //#region Data Load

  protected loadPeriods = (): Promise<IPeriod[]> => {
    return this.periodService.readAll()
      .then((pArr: IPeriod[]): IPeriod[] => {
        const pArrCopy = JSON.parse(JSON.stringify(pArr));
        //get the current period
        let currentPeriodId: number = 0;
        const currentPeriod = pArr.filter(p => p.PeriodStatus === "Current Period");
        if (currentPeriod && currentPeriod.length > 0) {
          currentPeriodId = currentPeriod[0].ID;
        }
        const selectedPeriodTxt: string = this.getSelectedPeriodText(currentPeriodId, pArrCopy);
        //show status like Qtr 2 2019 ( Current Period ) in Title
        for (let i = 0; i < pArr.length; i++) {
          let p: IPeriod = pArr[i];
          pArr[i].Title = `${p.Title} ( ${p.PeriodStatus} )`;
        }

        //check user permissions
        if (this.superUserLoggedIn() === true) {
        } else {
          //dont show design periods
          pArr = pArr.filter(p => p.PeriodStatus !== "Design Period");
        }

        const xx = { ...this.state.LookupData, ['Periods']: pArr, ['PeriodsOriginal']: pArrCopy };
        this.setState({
          LookupData: xx,
          SelectedPeriod: currentPeriodId,
          SelectedPeriodTxt: selectedPeriodTxt
        });
        return pArr;
      })
      .catch((err) => {
        if (this.onError) this.onError(`Error loading Periods lookup data`, err.message);
        return null;
      });
  }

  protected loadLookups(): Promise<any> {
    return Promise.all([
      this.loadPeriods(),
    ]);
  }

  private getSelectedPeriodText = (periodId: number, periodsOriginal: IPeriod[]): string => {
    let periodTxt: string = "";
    console.log('getSelectedPeriodText - id', periodId);
    const pp = periodsOriginal.filter(p => p.ID === periodId);
    console.log('getSelectedPeriodText - pp', pp);
    if (pp[0]) {
      periodTxt = pp[0]["Title"];
    }
    console.log('selected period text', periodTxt);
    return periodTxt;
  }

  //#endregion Data Load


  //#region Permissions

  private superUserLoggedIn(): boolean {
    //super user/SysManager check
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 5) {
        //super user or sys manager
        return true;
      }
    }
    return false;
  }

  //#endregion Permissions
}
