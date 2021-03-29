import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';
import Section from '../../../components/CL/Section';

import NewCaseTab from '../../../components/CL/NewCaseTab';
import { MessageDialog } from '../../../components/cr/MessageDialog';

import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IDefForm, IGIAAPeriod, IEntity, IDirectorateGroup, IGoDefForm, GoForm, IGoForm, CLCase, ICLCase, IClCaseCounts, ICLDefForm, ICLWorker } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import styles from '../../../styles/cr.module.scss';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination

export interface ILookupData {

}

export class LookupData implements ILookupData {


}

export interface IClUpdatesState extends types.IUserContextWebPartState {
  LookupData: ILookupData;

  SelectedPivotKey: string;

  Section1_IsOpen: boolean;
  Section1_MainList_ListFilterText: string;
  Section2_IsOpen: boolean;
  Section2_MainList_ListFilterText: string;
  Section3_IsOpen: boolean;
  Section3_MainList_ListFilterText: string;

  Section_MainList_SelectedId: number;
  Section_MainList_SelectedCaseId: number;
  Section_MainList_SelectedStage: string;

  HistoricCase_WorkerId: number;
  HistoricCase_CaseId: number;
  HistoricCase_Stage: string;

  TotalBusinessCases: number;
  TotalEngagedCases: number;
  TotalArchivedCases: number;
  DefForm: ICLDefForm;

  HideCantCreateExtensionMessage: boolean;


}
export class ClUpdatesState extends types.UserContextWebPartState implements IClUpdatesState {
  public LookupData = new LookupData();

  public SelectedPivotKey = "Contingent Labour"; //default, 1st tab selected

  public Section1_IsOpen: boolean = false;
  public Section1_MainList_ListFilterText: string = null;
  public Section2_IsOpen: boolean = false;
  public Section2_MainList_ListFilterText: string = null;
  public Section3_IsOpen: boolean = false;
  public Section3_MainList_ListFilterText: string = null;

  public Section_MainList_SelectedId = null;
  public Section_MainList_SelectedCaseId = null;
  public Section_MainList_SelectedStage = null;


  public HistoricCase_WorkerId: number = null;
  public HistoricCase_CaseId: number = null;
  public HistoricCase_Stage: string = null;

  public TotalBusinessCases = null;
  public TotalEngagedCases = null;
  public TotalArchivedCases = null;
  public DefForm: ICLDefForm = null;

  public HideCantCreateExtensionMessage = true;



  constructor() {
    super();
  }
}

//#endregion types defination

export default class ClUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, ClUpdatesState> {
  private clCaseService: services.CLCaseService = new services.CLCaseService(this.props.spfxContext, this.props.api);
  private clDefFormService: services.CLDefFormService = new services.CLDefFormService(this.props.spfxContext, this.props.api);

  private readonly headerTxt_MainTab: string = "Contingent Labour";
  private readonly headerTxt_NewCaseTab: string = "Case";
  private readonly headerTxt_HistoricCaseTab: string = "Extension Of";


  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new ClUpdatesState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <React.Fragment>
        <Pivot onLinkClick={this.handlePivotClick} selectedKey={`${this.state.SelectedPivotKey}`}>
          <PivotItem headerText={this.headerTxt_MainTab} itemKey={this.headerTxt_MainTab}>
            {this.renderMainTab()}
          </PivotItem>
          {this.renderNewCaseTab()}
          {this.renderHistoricCaseTab()}


        </Pivot>

        {/* submit for approval - done */}
        <MessageDialog hidden={this.state.HideCantCreateExtensionMessage} title={null} /*title="Validation Successful"*/ content="Cannot create extension. This case already has an extension in the system." handleOk={() => { this.setState({ HideCantCreateExtensionMessage: true }, ); }} />

      </React.Fragment>

    );
  }

  private renderMainTab(): React.ReactElement<types.IWebPartComponentProps> {


    return (
      <div>
        <CrLoadingOverlayWelcome isLoading={this.state.Loading} />
        <div style={{ paddingTop: "10px" }}>


          {
            <div>
              <Section
                sectionTitle="Business Cases"
                caseType="BusinessCases"
                sectionTotalCases={this.state.TotalBusinessCases}
                onItemTitleClick={this.handleSection_MainListItemTitleClick}
                section_IsOpen={this.state.Section1_IsOpen}
                onSection_toggleOpen={this.handleSection1_toggleOpen}
                listFilterText={this.state.Section1_MainList_ListFilterText}
                onChangeFilterText={this.handleSection1_ChangeFilterText}
                currentUserId={this.getCurrentUserId()}
                superUserPermission={this.isSuperUser()}

                {...this.props}
              />

              <Section
                sectionTitle="Engaged"
                caseType="Engaged"
                sectionTotalCases={this.state.TotalEngagedCases}
                onItemTitleClick={this.handleSection_MainListItemTitleClick}
                section_IsOpen={this.state.Section2_IsOpen}
                onSection_toggleOpen={this.handleSection2_toggleOpen}
                listFilterText={this.state.Section2_MainList_ListFilterText}
                onChangeFilterText={this.handleSection2_ChangeFilterText}
                onMoveToLeaving={this.handleMoveToLeavingClick}
                onCreateExtension={this.handleCreateExtensionClick}
                currentUserId={this.getCurrentUserId()}
                superUserPermission={this.isSuperUser()}
                {...this.props}
              />

              <Section
                sectionTitle="Archived"
                caseType="Archived"
                sectionTotalCases={this.state.TotalArchivedCases}
                onItemTitleClick={this.handleSection_MainListItemTitleClick}
                section_IsOpen={this.state.Section3_IsOpen}
                onSection_toggleOpen={this.handleSection3_toggleOpen}
                listFilterText={this.state.Section3_MainList_ListFilterText}
                onChangeFilterText={this.handleSection3_ChangeFilterText}
                currentUserId={this.getCurrentUserId()}
                superUserPermission={this.isSuperUser()}
                {...this.props}
              />





            </div>
          }



        </div>
      </div>
    );
  }

  private renderNewCaseTab() {
    if (this.state.SelectedPivotKey === this.headerTxt_NewCaseTab || this.state.SelectedPivotKey === this.headerTxt_HistoricCaseTab) {
      return (

        <PivotItem headerText={this.headerTxt_NewCaseTab} itemKey={this.headerTxt_NewCaseTab}>
          {this.renderNewCase()}
        </PivotItem>

      );
    }
    else
      return <React.Fragment></React.Fragment>;
  }

  private renderHistoricCaseTab() {
    if (this.state.SelectedPivotKey === this.headerTxt_HistoricCaseTab) {
      return (

        <PivotItem headerText={this.headerTxt_HistoricCaseTab} itemKey={this.headerTxt_HistoricCaseTab}>
          {this.renderHistoricCase()}
        </PivotItem>

      );
    }
    else
      return <React.Fragment></React.Fragment>;
  }

  private renderNewCase(): React.ReactElement<types.IWebPartComponentProps> {

    return (


      <NewCaseTab

        onShowList={this.handleShowMainTab}
        clWorkerId={this.state.Section_MainList_SelectedId}
        clCaseId={this.state.Section_MainList_SelectedCaseId}
        stage={this.state.Section_MainList_SelectedStage}
        currentUserName={this.getCurrentUserName()}
        currentUserId={this.getCurrentUserId()}
        superUserPermission={this.isSuperUser()}
        viewerPermission={this.isViewerPermission()}
        defForm={this.state.DefForm}
        onShowHistoricCase={this.handleShowHistoricCaseClick}
        {...this.props}
      />


    );

  }

  private renderHistoricCase(): React.ReactElement<types.IWebPartComponentProps> {

    return (


      <NewCaseTab

        onShowList={this.handleShowMainTab}
        clWorkerId={this.state.HistoricCase_WorkerId}
        clCaseId={this.state.HistoricCase_CaseId}
        stage={this.state.HistoricCase_Stage}
        currentUserName={this.getCurrentUserName()}
        currentUserId={this.getCurrentUserId()}
        superUserPermission={false}
        viewerPermission={true}
        historicCase={true}
        onShowCaseTab={this.handleShowCaseTab}
        defForm={this.state.DefForm}
        {...this.props}
      />


    );

  }






  //#endregion Render


  //#region Data Load




  protected loadLookups(): Promise<any> {

    return Promise.all([
      this.loadCaseCounts(),
      this.loadDefForm(),
    ]);
  }

  private loadCaseCounts = (): void => {


    this.clCaseService.getCaseCounts().then((x: IClCaseCounts) => {
      console.log('Case Counts', x);

      this.setState({
        TotalBusinessCases: x.TotalBusinessCases,
        TotalEngagedCases: x.TotalEngagedCases,
        TotalArchivedCases: x.TotalArchivedCases,
      });


    }, (err) => {
      if (this.onError) this.onError(`Error loading Case Counts`, err.message);
    });

  }

  private loadDefForm = (): Promise<void> => {
    console.log('loadDefForm');
    let x = this.clDefFormService.readDefForm().then((df: ICLDefForm): void => {
      console.log('df ', df);
      this.setState({ DefForm: df });

    }, (err) => { if (this.onError) this.onError(`Error loading df`, err.message); });
    return x;
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

  private getCurrentUserName = (): string => {
    let userName: string = "";
    if (this.state.User) {
      userName = this.state.User.Title;
    }

    return userName;
  }

  private isSuperUser(): boolean {
    //super user/SysManager check
    let ups = this.state.UserPermissions;
    //console.log('ups is: ', ups);
    for (let i = 0; i < ups.length; i++) {

      let up: IUserPermission = ups[i];
      //console.log('in isSuperUser loop', ups);
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 13) {
        //super user or giaa super user
        return true;
      }
    }

    return false;
  }

  private isViewerPermission(): boolean {
    let ups = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {

      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 14) {
        //CL Viewer
        return true;
      }
    }

    return false;
  }





  //#endregion Permissions

  //#region event handlers


  private handleShowMainTab = (refreshCounters?: boolean): void => {
    console.log('in handleShowMainTab');
    this.clearErrors();
    if (refreshCounters === true) {
      console.log('refreshCounters');
      this.loadCaseCounts();
    }
    this.setState({ SelectedPivotKey: this.headerTxt_MainTab });
  }


  private handlePivotClick = (item: PivotItem): void => {
    this.clearErrors();
    this.setState({ SelectedPivotKey: item.props.headerText });
  }

  private handleSection1_toggleOpen = (): void => {
    this.setState({ Section1_IsOpen: !this.state.Section1_IsOpen });
  }
  private handleSection2_toggleOpen = (): void => {
    this.setState({ Section2_IsOpen: !this.state.Section2_IsOpen });
  }
  private handleSection3_toggleOpen = (): void => {
    this.setState({ Section3_IsOpen: !this.state.Section3_IsOpen });
  }


  private handleSection1_ChangeFilterText = (value: string): void => {
    this.setState({ Section1_MainList_ListFilterText: value });
  }
  private handleSection2_ChangeFilterText = (value: string): void => {
    this.setState({ Section2_MainList_ListFilterText: value });
  }
  private handleSection3_ChangeFilterText = (value: string): void => {
    this.setState({ Section3_MainList_ListFilterText: value });
  }


  private handleSection_MainListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {

    //if ID is 0 then new case add request
    console.log('on main list item title click ', ID, title, filteredItems);

    //ID from parameter is workerID

    if (ID === 0) {
      let caseId: number = 0;
      const newCase = new CLCase("New Case");
      this.clCaseService.create(newCase).then((x: ICLCase): void => {
        console.log('case created', x);
        caseId = x.ID;

        this.setState({
          SelectedPivotKey: this.headerTxt_NewCaseTab,
          Section_MainList_SelectedId: 0, //worker id
          Section_MainList_SelectedCaseId: caseId,
          Section_MainList_SelectedStage: 'Draft',
          //Section_MainList_SelectedTitle: title,
          //Section_MainList_FilteredItems: filteredItems
        });


      }, (err) => { });
    }
    else {
      const caseF = (filteredItems.filter(x => x['ID'] === ID))[0];
      const caseId: number = Number(caseF['CaseId']);
      const stage: string = caseF['Stage'];
      console.log('stage', stage);

      this.setState({
        SelectedPivotKey: this.headerTxt_NewCaseTab,
        Section_MainList_SelectedId: ID,
        Section_MainList_SelectedCaseId: caseId,
        Section_MainList_SelectedStage: stage,
        //Section_MainList_SelectedTitle: title,
        //Section_MainList_FilteredItems: filteredItems
      });
    }



  }

  private handleMoveToLeavingClick = (ID: number, caseId: number): void => {

    this.setState({
      SelectedPivotKey: this.headerTxt_NewCaseTab,
      Section_MainList_SelectedId: ID,
      Section_MainList_SelectedCaseId: caseId,
      Section_MainList_SelectedStage: 'Leaving',

    });

  }

  private handleCreateExtensionClick = (ID: number, caseId: number): void => {

    console.log('in handleCreateExtensionClick');

    this.clCaseService.createExtension(ID).then((x: ICLWorker) => {
      console.log('Case', x);

      if (x.ID === 0) {
        console.log('extension already created');
        this.setState({ HideCantCreateExtensionMessage: false });
        return;
      }

      this.setState({
        SelectedPivotKey: this.headerTxt_NewCaseTab,
        Section_MainList_SelectedId: x.ID, //workerId
        Section_MainList_SelectedCaseId: x['CLCaseId'], //case id
        Section_MainList_SelectedStage: 'Draft',

      });


    }, (err) => {
      if (this.onError) this.onError(`Error creating extension`, err.message);
    });


  }

  private handleShowHistoricCaseClick = (workerId: number, caseId: number, stage: string): void => {

    console.log('in handleShowHistoricCaseClick', caseId, workerId, stage);



    this.setState({
      SelectedPivotKey: this.headerTxt_HistoricCaseTab,
      HistoricCase_CaseId: caseId,
      HistoricCase_WorkerId: workerId,
      HistoricCase_Stage: stage,

    });

  }

  private handleShowCaseTab = (): void => {
    console.log('in handleShowCaseTab');
    this.clearErrors();
    this.setState({ SelectedPivotKey: this.headerTxt_NewCaseTab });
  }



  //#endregion event handlers

}


