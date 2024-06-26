import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IEntity } from '../../../types';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';
import { EntityService } from '../../../services';

//#region types defination

export interface ILookupData {
}
export class LookupData implements ILookupData {
}

export interface IClPropertiesState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
  SelectedDropList: string;
}
export class ClPropertiesState extends types.UserContextWebPartState implements IClPropertiesState {
  public LookupData = new LookupData();
  public SelectedDropList = "Gender";
  constructor() {
    super();
  }
}

//#endregion types defination

export default class ClProperties extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, ClPropertiesState> {

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
      {
        key: 'CaseDetailsHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Case Details Help Text',
        fieldName: 'CaseDetailsHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'DetailsOfApplicantEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Details of Applicant Add/Edit Help Text',
        fieldName: 'DetailsOfApplicantEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'DetailsOfApplicantViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Details of Applicant View Help Text',
        fieldName: 'DetailsOfApplicantViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'RequirementEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Requirement Add/Edit Help Text',
        fieldName: 'RequirementEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'RequirementViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Requirement View Help Text',
        fieldName: 'RequirementViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'CommercialEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Commercial Add/Edit HelpText',
        fieldName: 'CommercialEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'CommercialViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Commercial View HelpText',
        fieldName: 'CommercialViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },

      {
        key: 'ResourcingJustificationEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Resourcing Justification Add/Edit Help Text',
        fieldName: 'ResourcingJustificationEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'ResourcingJustificationViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Resourcing Justification View Help Text',
        fieldName: 'ResourcingJustificationViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },

      {
        key: 'FinanceEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Finance Add/Edit Help Text',
        fieldName: 'FinanceEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'FinanceViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Finance View Help Text',
        fieldName: 'FinanceViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },

      {
        key: 'OtherEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Other Add/Edit Help Text',
        fieldName: 'OtherEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'OtherViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Other View Help Text',
        fieldName: 'OtherViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },

      {
        key: 'ApproversEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Approvers Add/Edit Help Text',
        fieldName: 'ApproversEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'ApproversViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Approvers View Help Text',
        fieldName: 'ApproversViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'BHApprovalDecisionEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'BH Approval Decision Add/Edit Help Text',
        fieldName: 'BHApprovalDecisionEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'BHApprovalDecisionViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'BH Approval Decision View Help Text',
        fieldName: 'BHApprovalDecisionViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },

      {
        key: 'FBPApprovalDecisionEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'FBP Approval Decision Add/Edit Help Text',
        fieldName: 'FBPApprovalDecisionEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'FBPApprovalDecisionViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'FBP Approval Decision View Help Text',
        fieldName: 'FBPApprovalDecisionViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'HRBPApprovalDecisionEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'HRBP Approval Decision Add/Edit Help Text',
        fieldName: 'HRBPApprovalDecisionEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'HRBPApprovalDecisionViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'HRBP Approval Decision View Help Text',
        fieldName: 'HRBPApprovalDecisionViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'CBPApprovalDecisionEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'CBP Approval Decision Add/Edit Help Text',
        fieldName: 'CBPApprovalDecisionEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'CBPApprovalDecisionViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'CBP Approval Decision View Help Text',
        fieldName: 'CBPApprovalDecisionViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'ICApprovalDecisionEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Internal Controls Approval Decision Add/Edit Help Text',
        fieldName: 'ICApprovalDecisionEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'ICApprovalDecisionViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Internal Controls Approval Decision View Help Text',
        fieldName: 'ICApprovalDecisionViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'OnboardingEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Onboarding Add/Edit Help Text',
        fieldName: 'OnboardingEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'OnboardingViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Onboarding View Help Text',
        fieldName: 'OnboardingViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'EngagedEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Engaged Add/Edit Help Text',
        fieldName: 'EngagedEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'EngagedViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Engaged View Help Text',
        fieldName: 'EngagedViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'LeavingEditHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Leaving Add/Edit Help Text',
        fieldName: 'LeavingEditHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'LeavingViewHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Leaving View Help Text',
        fieldName: 'LeavingViewHelpText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
      {
        key: 'CaseDiscussionHelpText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Case Discussion, General Comments and File Attachments Help Text',
        fieldName: 'CaseDiscussionHelpText',
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
      return this.clStaffGradeService;
    }
    else if (this.state.SelectedDropList === "Gender") {
      return this.clGenderService;
    }
    else if (this.state.SelectedDropList === "Professional Categories") {
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
