import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import PeriodList from '../../../components/period/PeriodList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IPeriod, IEntity } from '../../../types';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';
import { EntityService } from '../../../services';

//#region types defination

export interface ILookupData {
  //Periods: IPeriod[];
}
export class LookupData implements ILookupData {
  //public Periods: IPeriod[] = [];
}

export interface IClPropertiesState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
  SelectedDropList: string;
  //CLStaffGrades: IEntity[];
  //CLProfessionalCats: IEntity[];

}
export class ClPropertiesState extends types.UserContextWebPartState implements IClPropertiesState {
  public LookupData = new LookupData();
  public SelectedDropList = "Gender";
  //public CLStaffGrades: IEntity[] = [];
  //public CLProfessionalCats: IEntity[] = [];
  constructor() {
    super();
  }
}

//#endregion types defination

export default class ClProperties extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, ClPropertiesState> {

  private periodService: services.PeriodService = new services.PeriodService(this.props.spfxContext, this.props.api);
  private clGenderService: services.CLGenderService = new services.CLGenderService(this.props.spfxContext, this.props.api);
  private clStaffGradeService: services.CLStaffGradeService = new services.CLStaffGradeService(this.props.spfxContext, this.props.api);
  private clProfessionalCatService: services.CLProfessionalCatService = new services.CLProfessionalCatService(this.props.spfxContext, this.props.api);
  private clWorkLocationService: services.CLWorkLocationService = new services.CLWorkLocationService(this.props.spfxContext, this.props.api);
  private clComFrameworkService: services.CLComFrameworkService = new services.CLComFrameworkService(this.props.spfxContext, this.props.api);
  private clSecurityClearanceService: services.CLSecurityClearanceService = new services.CLSecurityClearanceService(this.props.spfxContext, this.props.api);
  private clDeclarationConflictService: services.CLDeclarationConflictService = new services.CLDeclarationConflictService(this.props.spfxContext, this.props.api);
  private personTitleService: services.PersonTitleService = new services.PersonTitleService(this.props.spfxContext, this.props.api);
  private clIR35ScopeService: services.CLIR35ScopeService = new services.CLIR35ScopeService(this.props.spfxContext, this.props.api);


  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new ClPropertiesState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <Pivot onLinkClick={this.clearErrors}>

        <PivotItem headerText="Define Form">
          {this.renderDefForms()}
        </PivotItem>

        <PivotItem headerText="Droplists">
          {this.renderDefLists()}
        </PivotItem>

      </Pivot>
    );
  }




  private renderDefForms() {

    const listColumns: IGenColumn[] = [

      {
        key: 'Title',
        columnType: ColumnType.TextBox,
        name: 'Welcome Text Heading',
        fieldName: 'Title',
        minWidth: 300,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 100
      },
      {
        key: 'Details',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Welcome Text',
        fieldName: 'Details',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },

      {
        key: 'OnboardingStageFormText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Onboarding Stage Form Text',
        fieldName: 'OnboardingStageFormText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },

      {
        key: 'EngagedStageFormText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Engaged Stage Form Text',
        fieldName: 'EngagedStageFormText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },


    ];


    return (


      <React.Fragment>


        <EntityList
          allowAdd={this.superUserPermission()}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.CLDefFormService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Define Form"
          entityNameSingular="Define Form"
          childEntityNameApi=""
          childEntityNamePlural=""
          childEntityNameSingular=""
        />
      </React.Fragment>





    );
  }


  private renderDefLists() {


    const listColumns: IGenColumn[] = [
      {
        key: 'Title',
        columnType: ColumnType.TextBox,
        name: 'Title',
        fieldName: 'Title',
        minWidth: 300,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 100
      },





    ];

    const drpOptions: IDropdownOption[] = [
      { key: 'Gender', text: 'Gender' },
      { key: 'Grades', text: 'Grades' },
      { key: 'Professional Categories', text: 'Professional Categories' },
      { key: 'Locations', text: 'Locations' },
      { key: 'Frameworks', text: 'Frameworks' },
      { key: 'IR35Scopes', text: 'IR35Scopes' },
      { key: 'Person Titles', text: 'Person Titles' },
      { key: 'Security Clearance', text: 'Security Clearance' },
      { key: 'Declaration Conflict', text: 'Declaration Conflict' },
    ];


    return (

      <React.Fragment>
        <CrDropdown
          style={{ marginTop: "10px", marginRight: "24px" }}
          options={drpOptions}
          onChanged={(v) => this.changeDropdown_DropList(v)}
          selectedKey={this.state.SelectedDropList}
        />

        <EntityList
          allowAdd={this.superUserPermission()}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={this.getEntityServiceDropList()}
          entityNamePlural={this.getEntityNamePlural()}
          entityNameSingular={this.getEntityNameSingular()}
          childEntityNameApi={this.getChildApiName()}
          childEntityNamePlural="records"
          childEntityNameSingular="record"
        />
      </React.Fragment>


    );
  }


  //#endregion Render


  //#region Permissions


  private superUserPermission(): boolean {

    //super user check
    let ups: IUserPermission[] = this.state.UserPermissions;

    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 13) {
        //super user or CL super user
        return true;
      }
    }

    return false;
  }


  //#endregion Permissions

  //#region Load Data

  private getChildApiName = (): string => {

    if (this.state.SelectedDropList === "Professional Categories") {
      return "CLCases";
    }
    else if (this.state.SelectedDropList === "Locations") {
      return "CLCases";
    }
    else if (this.state.SelectedDropList === "Frameworks") {
      return "CLCases";
    }
    else if (this.state.SelectedDropList === "IR35Scopes") {
      return "CLCases";
    }

    return "CLWorkers";
  }

  private getEntityServiceDropList = (): EntityService<IEntity> => {
    let service: EntityService<IEntity>;
    if (this.state.SelectedDropList === "Grades") {
      //console.log('getEntityServiceDropList - Grades');
      return this.clStaffGradeService;
    }
    else if (this.state.SelectedDropList === "Gender") {
      return this.clGenderService;
    }
    else if (this.state.SelectedDropList === "Professional Categories") {
      //console.log('getEntityServiceDropList - Professional Categories');
      return this.clProfessionalCatService;
    }
    else if (this.state.SelectedDropList === "Locations") {
      return this.clWorkLocationService;
    }
    else if (this.state.SelectedDropList === "Frameworks") {
      return this.clComFrameworkService;
    }
    else if (this.state.SelectedDropList === "IR35Scopes") {
      return this.clIR35ScopeService;
    }
    else if (this.state.SelectedDropList === "Person Titles") {
      return this.personTitleService;
    }
    else if (this.state.SelectedDropList === "Security Clearance") {
      return this.clSecurityClearanceService;
    }
    else if (this.state.SelectedDropList === "Declaration Conflict") {
      return this.clDeclarationConflictService;
    }


    return service;
  }

  private getEntityNamePlural = (): string => {
    if (this.state.SelectedDropList === "Grades") {
      return "Grades";
    }
    else if (this.state.SelectedDropList === "Gender") {
      return "Gender";
    }
    else if (this.state.SelectedDropList === "Professional Categories") {
      return "Professional Categories";
    }
    else if (this.state.SelectedDropList === "Locations") {
      return "Locations";
    }
    else if (this.state.SelectedDropList === "Frameworks") {
      return "Frameworks";
    }
    else if (this.state.SelectedDropList === "IR35Scopes") {
      return "IR35Scopes";
    }
    else if (this.state.SelectedDropList === "Person Titles") {
      return "Person Titles";
    }
    else if (this.state.SelectedDropList === "Security Clearance") {
      return "Security Clearance";
    }
    else if (this.state.SelectedDropList === "Declaration Conflict") {
      return "Declaration Conflict";
    }

    return "";
  }

  private getEntityNameSingular = (): string => {
    if (this.state.SelectedDropList === "Grades") {
      return "Grade";
    }
    else if (this.state.SelectedDropList === "Gender") {
      return "Gender";
    }
    else if (this.state.SelectedDropList === "Professional Categories") {
      return "Professional Category";
    }
    else if (this.state.SelectedDropList === "Locations") {
      return "Location";
    }
    else if (this.state.SelectedDropList === "Frameworks") {
      return "Framework";
    }
    else if (this.state.SelectedDropList === "IR35Scopes") {
      return "IR35Scope";
    }
    else if (this.state.SelectedDropList === "Person Titles") {
      return "Person Title";
    }
    else if (this.state.SelectedDropList === "Security Clearance") {
      return "Security Clearance";
    }
    else if (this.state.SelectedDropList === "Declaration Conflict") {
      return "Declaration Conflict";
    }

    return "";
  }

  protected loadLookups(): Promise<any> {

    return Promise.all([

    ]);
  }


  //#endregion Load Data

  //#region Event Handlers

  private changeDropdown_DropList = (option: IDropdownOption): void => {
    this.setState({
      SelectedDropList: String(option.key),
    });

  }




  //#endregion Event Handlers

}
