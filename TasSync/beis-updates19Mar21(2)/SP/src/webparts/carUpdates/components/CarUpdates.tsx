import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';
import Section from '../../../components/car/Section';
import UpdatesTab from '../../../components/car/UpdatesTab';
import ElementGroupUpdateList from '../../../components/elementGroup/ElementGroupUpdateList';
import SignOffList from '../../../components/signoffGroup/SignOffList';
import * as services from '../../../services';
import * as types from '../../../types';
import { IEntity, IDefElementGroup, IDefForm, IFForm, FForm, IUserPermission, IPeriod } from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import styles from '../../../styles/cr.module.scss';
import { SelectableOptionMenuItemType } from 'office-ui-fabric-react/lib/ComboBox';


//#region types defination

export interface ILookupData {
  DefForm: IDefForm;
  DefElementGroups: IDefElementGroup[];
  Periods: IEntity[];
  Teams: IEntity[];
}

export class LookupData implements ILookupData {
  public DefForm: IDefForm;
  public DefElementGroups: IDefElementGroup[] = [];
  public Periods: IPeriod[] = [];
  public Teams: IEntity[] = [];


}

export interface ICarUpdatesState<T> extends types.IUserContextWebPartState {
  LookupData: ILookupData;
  FormData: T;
  FormId: number;
  IsArchivedPeriod: boolean;

  Section1_IsOpen: boolean;
  Section1_MainList_ListFilterText: string;

  SelectedPivotKey: string;

  Section_MainList_SelectedId: number;
  Section_MainList_SelectedTitle: string;
  Section_MainList_FilteredItems: any[];

  Section1UpdateStatus: string;
}
export class CarUpdatesState<T> extends types.UserContextWebPartState {
  public SignOffPeriod = null;
  public FormData: T;
  public FormId: number = 0;
  public IsArchivedPeriod: boolean = false;
  public LookupData = new LookupData();
  public Section1_IsOpen: boolean = false;
  public Section1_MainList_ListFilterText: string = null;
  public SelectedPivotKey = "Controls Assurance"; //default, 1st tab selected
  
  public Section_MainList_SelectedId: number = 0;
  public Section_MainList_SelectedTitle: string = null;
  public Section_MainList_FilteredItems = [];

  public Section1UpdateStatus: string = null;

  constructor(formData: T) {
    super();
    this.FormData = formData;
  }
}

//#endregion types defination

export default class CarUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, CarUpdatesState<IFForm>> {

  protected defFormService: services.DefFormService = new services.DefFormService(this.props.spfxContext, this.props.api);
  protected defElementGroupService: services.DefElementGroupService = new services.DefElementGroupService(this.props.spfxContext, this.props.api);
  protected periodService: services.PeriodService = new services.PeriodService(this.props.spfxContext, this.props.api);
  protected teamService: services.TeamService = new services.TeamService(this.props.spfxContext, this.props.api);
  protected formService: services.FormService = new services.FormService(this.props.spfxContext, this.props.api);

  private readonly headerTxt_MainTab: string = "Controls Assurance";
  private readonly headerTxt_UpdatesTab: string = "Updates";

  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new CarUpdatesState(new FForm());
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <Pivot onLinkClick={this.handlePivotClick} selectedKey={`${this.state.SelectedPivotKey}`}>
        <PivotItem headerText={this.headerTxt_MainTab} itemKey={this.headerTxt_MainTab}>
          {this.renderMainTab()}
        </PivotItem>
        {this.renderUpdatesTab()}

      </Pivot>
    );
  }

  private renderMainTab(): React.ReactElement<types.IWebPartComponentProps> {
    const { LookupData: lookups, FormId } = this.state;


    return (
      <div>
        <CrLoadingOverlayWelcome isLoading={this.state.Loading} />
        <div style={{ paddingTop: "10px" }}>
          <CrDropdown
            placeholder="Select an Option"
            label="Which period do you want to view or report on?"
            options={lookups.Periods.map((p) => { return { key: p.ID, text: p.Title }; })}
            onChanged={(v) => this.changeDropdown(v, 'PeriodId')}
            selectedKey={this.state.FormData.PeriodId}
          />
          <CrDropdown
            placeholder="Select an Option"
            label="Which Division/Team?"
            options={lookups.Teams.map((t) => { return { key: t.ID, text: t.Title }; })}
            onChanged={(v) => this.changeDropdown(v, 'TeamId')}
            selectedKey={this.state.FormData.TeamId}
          />

          <br />
          
          {/* {FormId>0 && lookups.DefElementGroups.map((m,i) =>
            <ElementGroupUpdateList isArchivedPeriod={this.state.IsArchivedPeriod} externalUserLoggedIn={this.externalUserLoggedIn()} onElementSave={this.updateFormInState} key={m.ID} formId={FormId} form={this.state.FormData} title={m.Title} {...this.props} entityId={m.ID} onError={this.onError} signOffPeriod={this.state.SignOffPeriod} />
          )} */}
          {
            FormId > 0 &&
            <Section

              periodId={this.state.FormData.PeriodId}
              formId={this.state.FormId}
              sectionUpdateStatus={this.state.Section1UpdateStatus}
              onItemTitleClick={this.handleSection_MainListItemTitleClick}
              section_IsOpen={this.state.Section1_IsOpen}
              onSection_toggleOpen={this.handleSection1_toggleOpen}
              listFilterText={this.state.Section1_MainList_ListFilterText}
              onChangeFilterText={this.handleSection1_ChangeFilterText}


              {...this.props}
            />
          }
          {FormId > 0 &&
            <SignOffList showCancelSignOffs={this.showCancelSignOffs()} onSignOff={this.updateFormInState} canSignOffDDSection={this.canSignOff_DDSection()} canSignOffDirSection={this.canSignOff_DirSection()} formId={FormId} form={this.state.FormData} defForm={lookups.DefForm} {...this.props} />
          }
        </div>
      </div>
    );
  }

  private renderUpdatesTab() {
    if (this.state.SelectedPivotKey === this.headerTxt_UpdatesTab) {
      return (

        <PivotItem headerText={this.headerTxt_UpdatesTab} itemKey={this.headerTxt_UpdatesTab}>
          {this.renderUpdates()}
        </PivotItem>

      );
    }
    else
      return <React.Fragment></React.Fragment>;
  }

  private renderUpdates(): React.ReactElement<types.IWebPartComponentProps> {
    return (

      <UpdatesTab
        defElementId={this.state.Section_MainList_SelectedId}
        formId={this.state.FormId}
        form={this.state.FormData}
        filteredItemsMainList={this.state.Section_MainList_FilteredItems}
        onShowList={this.handleShowMainTab}
        externalUserLoggedIn={this.externalUserLoggedIn()}
        isArchivedPeriod={this.state.IsArchivedPeriod}


        onChangeMainListID={this.handleSection_MainListChangeSelectedID}

        {...this.props}
      />


    );
  }

  private renderAuditFeedback() {

    const listColumns: IGenColumn[] = [
      {
        key: 'PeriodTitle',
        columnType: ColumnType.DropDown,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Period',
        fieldName: 'PeriodTitle',
        idFieldName: 'PeriodId',
        isParent: true,
        parentEntityName: 'Period',
        parentColumnName: 'Title',
        parentService: new services.PeriodService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        maxWidth: 100,
        isRequired: true
      },
      {
        key: 'TeamTitle',
        columnType: ColumnType.DropDown,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Division',
        fieldName: 'TeamTitle',
        idFieldName: 'TeamId',
        isParent: true,
        parentEntityName: 'Team',
        parentColumnName: 'Title',
        parentService: new services.TeamService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        maxWidth: 100,
        isRequired: true
      },
      {
        key: 'Title',
        columnType: ColumnType.TextBox,
        name: 'Title',
        fieldName: 'Title',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50,
        isMultiline: true
      },
      {
        key: 'Details',
        columnType: ColumnType.TextBox,
        //columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Details',
        fieldName: 'Details',
        isMultiline: true,
        numRows: 4,
        minWidth: 100,
        maxWidth: 400,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 4000
      },
      {
        key: 'UserTitle',
        columnType: ColumnType.DisplayInListOnly,
        name: 'User',
        fieldName: 'UserTitle',
        isParent: true,
        parentEntityName: 'User',
        parentColumnName: 'Title',
        minWidth: 100,
        maxWidth: 100,
        isResizable: true,
      },
      {
        key: 'DateUpdated',
        columnType: ColumnType.DisplayInListOnly,
        name: 'Date',
        fieldName: 'DateUpdated',
        minWidth: 100,
        maxWidth: 100,
        isResizable: true,
      },
    ];

    return (
      <React.Fragment>
        <EntityList
          allowAdd={this.auditorPermission()}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.AuditFeedbackService(this.props.spfxContext, this.props.api)}
          entityReadAllExpandAll={true}
          entityNamePlural="GIAA Feedback"
          entityNameSingular="GIAA Feedback"
          childEntityNameApi=""
          childEntityNamePlural=""
          childEntityNameSingular=""
        />

      </React.Fragment>
    );
  }


  //#endregion Render

  //#region form creation logic


  protected changeDropdown = (option: IDropdownOption, f: string, index?: number): void => {
    if (f === "PeriodId") {
      if (option.key !== this.state.FormData.PeriodId) {
        const pArrTemp: IPeriod[] = this.state.LookupData.Periods.filter(p => p.ID === option.key);
        let isArchivedPeriod: boolean = false;
        if (pArrTemp.length > 0) {
          if (pArrTemp[0].PeriodStatus === "Archived Period") {
            isArchivedPeriod = true;
          }
        }

        this.setState({ FormData: this.cloneObject(this.state.FormData, f, option.key), IsArchivedPeriod: isArchivedPeriod },
          this.loadDefForm //load DefForm then DefElementGroups and then createFormInDb
        );
      }
    }
    else {
      //f === "TeamId"
      this.setState({ FormData: this.cloneObject(this.state.FormData, f, option.key) }, this.createFormInDb);
    }

  }

  private createFormInDb = (): void => {

    if (this.state.FormData.PeriodId > 0 && this.state.FormData.TeamId > 0) {

      const form = this.state.FormData;
      //we only want to send form.PeriodId and form.TeamId, so delete rest of the fields
      delete form.ID;
      delete form['Id'];
      delete form.DefFormId;
      delete form.Title;
      delete form.DDSignOffStatus;
      delete form.DDSignOffUserId;
      delete form.DDSignOffDate;
      delete form.DirSignOffStatus;
      delete form.DirSignOffUserId;
      delete form.DirSignOffDate;
      delete form.LastSignOffFor;
      delete form.FirstSignedOff;


      //following service only adds form in db if its needed
      this.formService.create(form).then((newForm: IFForm): void => {
        this.setState({ FormData: newForm, FormId: newForm.ID }, this.loadFormUpdateStatuses);
      }, (err) => { });

    }

  }

  //#endregion form creation logic

  //#region Data Load

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
      if (this.superUserLoggedIn() === true) {
      }
      else {
        //dont show design periods
        pArr = pArr.filter(p => p.PeriodStatus !== "Design Period");
      }


      this.setState({
        LookupData: this.cloneObject(this.state.LookupData, 'Periods', pArr),
        FormData: this.cloneObject(this.state.FormData, "PeriodId", currentPeriodId)
      }, this.loadDefForm);
      return pArr;
    }, (err) => { if (this.onError) this.onError(`Error loading Periods lookup data`, err.message); });
  }

  protected loadTeams = (): Promise<IEntity[]> => {
    //const username = services.ContextService.Username(this.props.spfxContext);
    //console.log("Username from SP: ", `'${username}'`);
    return this.teamService.readAllOpenTeamsForUser_ControlsAssurance().then((t: IEntity[]): IEntity[] => {
      this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'Teams', t) });
      return t;
    }, (err) => { if (this.onError) this.onError(`Error loading Teams lookup data`, err.message); });
  }

  protected loadDefForm = (): void => {
    this.defFormService.readAll(`?$filter=PeriodId eq ${this.state.FormData.PeriodId}`).then((dfArr: IDefForm[]): void => {
      if (dfArr.length > 0) {
        const df: IDefForm = dfArr[0];
        this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'DefForm', df) }, this.loadDefElementGroups);
      }
    }, (err) => { if (this.onError) this.onError(`Error loading DefForm lookup data`, err.message); });
  }

  protected loadDefElementGroups = (): void => {
    this.defElementGroupService.readAllDefElementGroups(this.state.LookupData.DefForm.ID).then((deg: IDefElementGroup[]): void => {
      this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'DefElementGroups', deg) }, this.createFormInDb);
    }, (err) => { if (this.onError) this.onError(`Error loading DefElementGroups lookup data`, err.message); });
  }

  protected loadLookups(): Promise<any> {

    return Promise.all([
      this.loadPeriods(),
      this.loadTeams(),
    ]);
  }

  private updateFormInState = () => {
    this.formService.read(this.state.FormId).then((form: IFForm): void => {
      this.setState({ FormData: form });

    }, (err) => { if (this.onError) this.onError(`Error loading Form data`, err.message); });
  }

  private loadFormUpdateStatuses() {
    this.formService.readFormUpdateStatus(Number(this.state.FormData.PeriodId), Number(this.state.FormId) ).then((res: string): void => {
      console.log('loadFormUpdateStatuses', res);
      this.setState({ Section1UpdateStatus: res });

    }, (err) => { });


  }

  //#endregion Data Load

  //#region event handlers

  private handleSection_MainListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {

    console.log('on main list item title click ', ID, title, filteredItems);
    this.setState({
      SelectedPivotKey: this.headerTxt_UpdatesTab,
      Section_MainList_SelectedId: ID,
      Section_MainList_SelectedTitle: title,
      Section_MainList_FilteredItems: filteredItems
    });
  }

  private handleSection1_toggleOpen = (): void => {
    this.setState({ Section1_IsOpen: !this.state.Section1_IsOpen });
  }

  
  private handleSection1_ChangeFilterText = (value: string): void => {
    this.setState({ Section1_MainList_ListFilterText: value });
  }

  private handlePivotClick = (item: PivotItem): void => {
    this.clearErrors();
    this.setState({ SelectedPivotKey: item.props.headerText });
  }

  private handleShowMainTab = (): void => {
    console.log('in handleShowMainTab');
    this.clearErrors();
    this.setState({ SelectedPivotKey: this.headerTxt_MainTab });
  }
  private handleSection_MainListChangeSelectedID = (ID: number): void => {

    console.log('on handleSection_MainListSelectedID', ID);
    this.setState({
      Section_MainList_SelectedId: ID,
      
    });
  }

  //#endregion event handlers

  //#region Permissions

  private canSignOff_DDSection(): boolean {

    //Archived Period check - dont allow if period is archived
    if (this.state.IsArchivedPeriod === true)
      return false;

    //Directorate check
    if (this.state.Directorates.length > 0) {
      return true;
    }

    //Directorate member check
    let dms = this.state.DirectorateMembers;
    for (let i = 0; i < dms.length; i++) {
      let dm: types.IDirectorateMember = dms[i];
      if (dm.CanSignOff === true)
        return true;
    }

    //Teams check
    if (this.state.Teams.length > 0) {
      return true;
    }

    //Team members check
    let tms = this.state.TeamMembers;
    for (let i = 0; i < tms.length; i++) {
      let tm: types.ITeamMember = tms[i];
      if (tm.CanSignOff === true)
        return true;
    }

    return false;
  }

  private canSignOff_DirSection(): boolean {

    //Archived Period check - dont allow if period is archived
    if (this.state.IsArchivedPeriod === true)
      return false;

    //Directorate check
    if (this.state.Directorates.length > 0) {
      return true;
    }

    //Directorate member check
    let dms = this.state.DirectorateMembers;
    for (let i = 0; i < dms.length; i++) {
      let dm: types.IDirectorateMember = dms[i];
      if (dm.CanSignOff === true)
        return true;
    }

    return false;
  }

  private superUserLoggedIn(): boolean {
    //super user
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 5) {
        //super user
        return true;
      }
    }

    return false;
  }

  private showCancelSignOffs(): boolean {
    //Archived Period check - dont allow if period is archived
    if (this.state.IsArchivedPeriod === true)
      return false;

    return this.superUserLoggedIn();
  }

  private externalUserLoggedIn(): boolean {

    //External User check
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 3) {
        //external user
        return true;
      }
    }

    return false;
  }

  private auditorPermission(): boolean {

    //Auditor User check
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 4) {
        //Auditor user
        return true;
      }
    }

    return false;
  }


  //#endregion Permissions

  //#region Commented Code

  private renderPeriodsList() {

    const listColumns: IGenColumn[] = [
      { key: '1', columnType: ColumnType.TextBox, name: 'Name', fieldName: 'Title', minWidth: 300, isResizable: true, isRequired: true, fieldMaxLength: 50 }
    ];

    return (
      <EntityList
        displayIDColumn={true}
        columns={listColumns}
        {...this.props}
        onError={this.onError}
        entityService={new services.PeriodService(this.props.spfxContext, this.props.api)}
        entityNamePlural="Periods"
        entityNameSingular="Period"
        childEntityNameApi="Forms"
        childEntityNamePlural="Forms"
        childEntityNameSingular="Form"
      />
    );
  }

  private renderDefElementGroupsList() {

    const listColumns: IGenColumn[] = [
      { key: '1', columnType: ColumnType.TextBox, name: 'Name', fieldName: 'Title', minWidth: 50, maxWidth: 280, isResizable: true, isRequired: true, fieldMaxLength: 50 },
      { key: '2', columnType: ColumnType.TextBox, name: 'Sequence', fieldName: 'Sequence', minWidth: 50, maxWidth: 80, isResizable: true, isRequired: true },

      // fieldName - for DropDown column type it should be any appropidate name ie DefFormTitle is good, which means to show Title from DefForm
      // idFieldName: 'DefFormId' - this is the forign key column from main table ie DefElementGroup.DefFormId
      // isParent: true is also necessary cause we want to show Title of parent table (DefForm)
      // parentEntityName: 'DefForm' - it should be always in singular form cause in this case DefForm is parent of DefElementGroup, ie each DefElementGroup can have only 1 parent
      // parentColumnName: 'Title' - column from parent table (DefForm) which we want to display in list
      { key: '3', columnType: ColumnType.TagPicker, name: 'DefForm', fieldName: 'DefFormTitle', idFieldName: 'DefFormId', isParent: true, parentEntityName: 'DefForm', parentColumnName: 'Title', parentService: new services.DefFormService(this.props.spfxContext, this.props.api), minWidth: 100, isResizable: true, isRequired: true }

    ];

    // entityReadAllExpandAll={true} - this is necessary in following List cause we have a DropList column, and in list we want to display Title of parent which is DefForm.Title
    // also in entityService (DefElementGroupServer) a method readAllExpandAll() should be present
    return (
      <EntityList
        displayIDColumn={false}
        idColumnWidth={20}
        columns={listColumns}
        {...this.props}
        onError={this.onError}
        entityService={new services.DefElementGroupService(this.props.spfxContext, this.props.api)}
        entityReadAllExpandAll={true}
        entityNamePlural="DefElementGroups"
        entityNameSingular="DefElementGroup"
        childEntityNameApi="DefElements"
        childEntityNamePlural="DefElements"
        childEntityNameSingular="DefElement"
      />
    );
  }

  //#endregion Commented Code
}
