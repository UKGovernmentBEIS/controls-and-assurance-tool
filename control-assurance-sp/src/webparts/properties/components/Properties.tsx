import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import PeriodList from '../../../components/period/PeriodList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IPeriod } from '../../../types';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';

//#region types defination

export interface ILookupData {
  Periods: IPeriod[];
}
export class LookupData implements ILookupData {
  public Periods: IPeriod[] = [];
}

export interface IPropertiesState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
  SelectedPeriodDefForms: string | number;
  IsArchivedPeriodDefForms: boolean;
  SelectedPeriodDefElementGroups: string | number;
  IsArchivedPeriodDefElementGroups: boolean;
  SelectedPeriodDefElements: string | number;
  IsArchivedPeriodDefElements: boolean;
}
export class PropertiesState extends types.UserContextWebPartState implements IPropertiesState {
  public LookupData = new LookupData();
  public SelectedPeriodDefForms: string | number = 0;
  public IsArchivedPeriodDefForms = false;
  public SelectedPeriodDefElementGroups: string | number = 0;
  public IsArchivedPeriodDefElementGroups = false;
  public SelectedPeriodDefElements: string | number = 0;
  public IsArchivedPeriodDefElements = false;
  constructor() {
    super();
  }
}

//#endregion types defination

export default class Properties extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, PropertiesState> {

  private periodService: services.PeriodService = new services.PeriodService(this.props.spfxContext, this.props.api);
  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new PropertiesState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="Periods">
          {this.renderCustomPeriodsList()}
        </PivotItem>
        <PivotItem headerText="Define Form">
          {this.renderDefForm()}
        </PivotItem>
        <PivotItem headerText="Define Element Groups">
          {this.renderDefElementGroups()}
        </PivotItem>
        <PivotItem headerText="Define Elements">
          {this.renderDefElements()}
        </PivotItem>
        <PivotItem headerText="Define Help">
          {this.renderDefineHelp()}
        </PivotItem>
        <PivotItem headerText="Logs">
          {this.renderLogsList()}
        </PivotItem>
      </Pivot>
    );
  }


  private renderCustomPeriodsList() {

    const listColumns: IGenColumn[] = [
      {
        key: '1',
        columnType: ColumnType.TextBox,
        name: 'Name',
        fieldName: 'Title',
        minWidth: 150,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50,

      },
      {
        key: '2',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.ListOnly,
        name: 'Period Status',
        fieldName: 'PeriodStatus',
        minWidth: 150,
        isResizable: true,
        fieldMaxLength: 50,
      },
      {
        key: '3',
        columnType: ColumnType.DatePicker,
        name: 'Start Date',
        fieldName: 'PeriodStartDate',
        minWidth: 150,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50,
      },
      {
        key: '4',
        columnType: ColumnType.DatePicker,
        name: 'End Date',
        fieldName: 'PeriodEndDate',
        minWidth: 150,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50,
      },

    ];

    return (
      <React.Fragment>
        <PeriodList
          allowAdd={this.allowAdd_Periods()}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.PeriodService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Periods"
          entityNameSingular="Period"
          childEntityNameApi=""
          childEntityNamePlural=""
          childEntityNameSingular=""
        />

      </React.Fragment>
    );
  }

  private renderDefineHelp() {

    const listColumns: IGenColumn[] = [
      {
        key: '1',
        columnType: ColumnType.TextBox,
        name: 'Name',
        fieldName: 'Title',
        minWidth: 300,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50
      },
      {
        key: '2',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Help Text',
        fieldName: 'HelpText',
        minWidth: 300,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 10
      },
    ];

    return (
      <React.Fragment>
        <EntityList
          allowAdd={this.allowAdd_Periods()}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.UserHelpService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Define Help"
          entityNameSingular="Define Help"
          childEntityNameApi=""
          childEntityNamePlural=""
          childEntityNameSingular=""
        />

      </React.Fragment>
    );
  }

  private renderDefForm() {

    const listColumns: IGenColumn[] = [
      {
        key: 'DefFormPeriod',
        fieldDisabled: true,
        fieldDefaultValue: this.state.SelectedPeriodDefForms,
        columnType: ColumnType.DropDown,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Period',
        fieldName: 'DefFormPeriod',
        idFieldName: 'PeriodId',
        isParent: true,
        parentEntityName: 'Period',
        parentColumnName: 'Title',
        parentService: new services.PeriodService(this.props.spfxContext, this.props.api),
        minWidth: 150,
        isResizable: true,
        isRequired: true,
      },
      {
        key: '1',
        columnType: ColumnType.TextBox,
        name: 'Welcome Text Heading',
        fieldName: 'Title',
        minWidth: 300,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 100
      },
      {
        key: '2',
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
        key: '3',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'DD Sign Off Title',
        fieldName: 'DDSignOffTitle',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 100
      },
      {
        key: '4',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'DD Sign Off Text',
        fieldName: 'DDSignOffText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 4
      },
      {
        key: '5',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Director Sign Off Title',
        fieldName: 'DirSignOffTitle',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 100
      },
      {
        key: '6',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Director Sign Off Text',
        fieldName: 'DirSignOffText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 4
      }


    ];

    const { LookupData: lookups } = this.state;
    return (

      lookups.Periods &&
      <React.Fragment>
        <CrDropdown
          placeholder="Select a Period"
          style={{ marginTop: "10px", marginRight: "24px" }}
          options={lookups.Periods.map((p) => { return { key: p.ID, text: p.Title }; })}
          onChanged={(v) => this.changePeriodsDropdown_DefForms(v)}
          selectedKey={this.state.SelectedPeriodDefForms}
        />

        <EntityList
          entityReadAllWithArg1={this.state.SelectedPeriodDefForms}
          allowAdd={this.allowAdd_DefForms()}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.DefFormService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Define Forms"
          entityNameSingular="Define Form"
          childEntityNameApi="DefElementGroups"
          childEntityNamePlural="Define Element Groups"
          childEntityNameSingular="Define Element Group"
        />
      </React.Fragment>





    );
  }

  /* Tas15May Let user define the element section headings and questions */
  private renderDefElementGroups() {


    const listColumns: IGenColumn[] = [
      {
        key: 'DefElementGroupPeriod',
        fieldDisabled: true,
        fieldDefaultValue: this.state.SelectedPeriodDefElementGroups,
        columnType: ColumnType.DropDown,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Period',
        fieldName: 'DefElementGroupPeriod',
        idFieldName: 'PeriodId',
        isParent: true,
        parentEntityName: 'Period',
        parentColumnName: 'Title',
        parentService: new services.PeriodService(this.props.spfxContext, this.props.api),
        minWidth: 150,
        isResizable: true,
        isRequired: true,
      },
      {
        key: '1',
        columnType: ColumnType.TextBox,
        name: 'Element Group Title',
        fieldName: 'Title',
        minWidth: 300,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 100
      },
      {
        key: '2',
        columnType: ColumnType.TextBox,
        name: 'Element Group Sequence',
        fieldName: 'Sequence',
        minWidth: 300,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 100
      },

      {
        key: '3',
        columnType: ColumnType.DropDown,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Def Form',
        fieldName: 'DefForm',
        idFieldName: 'DefFormId',
        isParent: true,
        parentEntityName: 'DefForm',
        parentColumnName: 'Title',
        parentService: new services.DefFormService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 10

      }



    ];

    const { LookupData: lookups } = this.state;

    return (
      lookups.Periods &&
      <React.Fragment>
        <CrDropdown
          placeholder="Select a Period"
          style={{ marginTop: "10px", marginRight: "24px" }}
          options={lookups.Periods.map((p) => { return { key: p.ID, text: p.Title }; })}
          onChanged={(v) => this.changePeriodsDropdown_DefElementGroups(v)}
          selectedKey={this.state.SelectedPeriodDefElementGroups}
        />

        <EntityList
          allowAdd={this.allowAdd_DefElementGroups()}
          entityReadAllWithArg1={this.state.SelectedPeriodDefElementGroups}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.DefElementGroupService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Define Element Groups"
          entityNameSingular="Define Element Group"
          childEntityNameApi="DefElements"
          childEntityNamePlural="Define Elements"
          childEntityNameSingular="Define Element"
        />
      </React.Fragment>


    );
  }

  /* Tas15May Let user define the element section headings and questions */
  private renderDefElements() {


    const listColumns: IGenColumn[] = [
      {
        key: 'DefElementPeriod',
        fieldDisabled: true,
        fieldDefaultValue: this.state.SelectedPeriodDefElements,
        columnType: ColumnType.DropDown,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Period',
        fieldName: 'DefElementPeriod',
        idFieldName: 'PeriodId',
        isParent: true,
        parentEntityName: 'Period',
        parentColumnName: 'Title',
        parentService: new services.PeriodService(this.props.spfxContext, this.props.api),
        minWidth: 150,
        isResizable: true,
        isRequired: true,
      },
      {
        key: '1',
        columnType: ColumnType.TextBox,
        name: 'Element Title',
        fieldName: 'Title',
        minWidth: 300,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 100
      },
      {
        key: '2',
        columnType: ColumnType.TextBox,
        name: 'Element Objective',
        fieldName: 'ElementObjective',
        minWidth: 300,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 5000,
        numRows: 3
      },

      {
        key: '45',
        columnType: ColumnType.DropDown,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Elements Group',
        fieldName: 'ElementsGroup',
        idFieldName: 'DefElementGroupId',
        isParent: true,
        parentEntityName: 'DefElementGroup',
        parentColumnName: 'Title',
        parentService: new services.DefElementGroupService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 10

      },

      {
        key: '3',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Title',
        fieldName: 'SectionATitle',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },

      {
        key: '4',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Title Help',
        fieldName: 'SectionATitleHelp',
        idFieldName: 'SectionATitleHelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 10

      },


      {
        key: '5',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 1',
        fieldName: 'SectionAQuestion1',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 2

      },
      {
        key: '6',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 1 Help',
        fieldName: 'SectionAQuestion1Help',
        idFieldName: 'SectionAQuestion1HelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },

      /*
           {
             key: '4',
             columnType: ColumnType.TagPickerForUser,
             name: 'Director',
             fieldName: 'UserTitle',
             idFieldName: 'DirectorUserID',
             isParent: true,
             parentEntityName: 'User',
             parentColumnName: 'Username',
             parentService: new services.UserService(this.props.spfxContext, this.props.api),
             minWidth: 100,
             maxWidth: 300,
             isResizable: true,
             isRequired: true
           },
           */

      {
        key: '7',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 2',
        fieldName: 'SectionAQuestion2',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 2

      },
      {
        key: '8',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 2 Help',
        fieldName: 'SectionAQuestion2Help',
        idFieldName: 'SectionAQuestion2HelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },


      {
        key: '9',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 3',
        fieldName: 'SectionAQuestion3',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 2

      },
      {
        key: '10',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 3 Help',
        fieldName: 'SectionAQuestion3Help',
        idFieldName: 'SectionAQuestion3HelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },

      {
        key: '11',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 4',
        fieldName: 'SectionAQuestion4',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 2

      },
      {
        key: '12',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 4 Help',
        fieldName: 'SectionAQuestion4Help',
        idFieldName: 'SectionAQuestion4HelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },


      {
        key: '13',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 5',
        fieldName: 'SectionAQuestion5',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 2

      },
      {
        key: '14',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 5 Help',
        fieldName: 'SectionAQuestion5Help',
        idFieldName: 'SectionAQuestion5HelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },


      {
        key: '15',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 6',
        fieldName: 'SectionAQuestion6',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 2

      },
      {
        key: '16',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 6 Help',
        fieldName: 'SectionAQuestion6Help',
        idFieldName: 'SectionAQuestion6HelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),

        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },


      {
        key: '17',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 7',
        fieldName: 'SectionAQuestion7',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 2

      },
      {
        key: '18',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 7 Help',
        fieldName: 'SectionAQuestion7Help',
        idFieldName: 'SectionAQuestion8HelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },


      {
        key: '19',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 8',
        fieldName: 'SectionAQuestion8',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 2

      },
      {
        key: '20',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 8 Help',
        fieldName: 'SectionAQuestion8Help',
        idFieldName: 'SectionAQuestion8HelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },


      {
        key: '21',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 9',
        fieldName: 'SectionAQuestion9',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 2

      },
      {
        key: '22',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 9 Help',
        fieldName: 'SectionAQuestion9Help',
        idFieldName: 'SectionAQuestion9HelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },


      {
        key: '23',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 10',
        fieldName: 'SectionAQuestion10',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 2

      },
      {
        key: '24',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Question 10 Help',
        fieldName: 'SectionAQuestion10Help',
        idFieldName: 'SectionAQuestion10HelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },


      {
        key: '25',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Other Question',
        fieldName: 'SectionAOtherQuestion',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 2

      },
      {
        key: '26',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Other Question Help',
        fieldName: 'SectionAOtherQuestionHelp',
        idFieldName: 'SectionAOtherQuestionHelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000
      },

      {
        key: '27',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Faded note in Other Question Textbox',
        fieldName: 'SectionAOtherBoxText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 2

      },

      {
        key: '28',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Effectiveness Question',
        fieldName: 'SectionAEffectQuestion',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 2

      },
      {
        key: '29',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Effectiveness Question Help',
        fieldName: 'SectionAEffectQuestionHelp',
        idFieldName: 'SectionAEffectQuestionHelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000
      },
      {
        key: '30',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section A: Effectiveness Details Question ',
        fieldName: 'SectionAEffectBoxText',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 2

      },

      {
        key: '31',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section B: Title',
        fieldName: 'SectionBTitle',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },

      {
        key: '32',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section B: Title Help',
        fieldName: 'SectionBTitleHelp',
        idFieldName: 'SectionBTitleHelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 10

      },

      {
        key: '33',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section B: Question 1',
        fieldName: 'SectionBQuestion1',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },

      {
        key: '34',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section B: Question 1 Help',
        fieldName: 'SectionBQuestion1Help',
        idFieldName: 'SectionBQuestion1HelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 10

      },

      {
        key: '35',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section B: Question above Details Box 1',
        fieldName: 'SectionBBoxText1',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },

      {
        key: '36',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section B: Question above Effectiveness Choice 1',
        fieldName: 'SectionBEffect1',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },


      {
        key: '37',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section B: Question 2',
        fieldName: 'SectionBQuestion2',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },

      {
        key: '38',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section B: Question 2 Help',
        fieldName: 'SectionBQuestion2Help',
        idFieldName: 'SectionBQuestion2HelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 10

      },

      {
        key: '39',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section B: Question above Details Box 2',
        fieldName: 'SectionBBoxText2',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },

      {
        key: '40',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section B: Question above Effectiveness Choice 2',
        fieldName: 'SectionBEffect2',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },

      {
        key: '41',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section B: Question 3',
        fieldName: 'SectionBQuestion3',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },

      {
        key: '42',
        columnType: ColumnType.TagPicker,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section B: Question 3 Help',
        fieldName: 'SectionBQuestion3Help',
        idFieldName: 'SectionBQuestion3HelpId',
        isParent: true,
        parentEntityName: 'UserHelp',
        parentColumnName: 'Title',
        parentService: new services.UserHelpService(this.props.spfxContext, this.props.api),
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 10

      },

      {
        key: '43',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section B: Question above Details Box 3',
        fieldName: 'SectionBBoxText3',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      },

      {
        key: '44',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section B: Question above Effectiveness Choice 3',
        fieldName: 'SectionBEffect3',
        minWidth: 300,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000

      }

      /*
      {
        key: '4',
        columnType: ColumnType.TagPickerForUser,
        name: 'Director',
        fieldName: 'UserTitle',
        idFieldName: 'DirectorUserID',
        isParent: true,
        parentEntityName: 'User',
        parentColumnName: 'Username',
        parentService: new services.UserService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        maxWidth: 300,
        isResizable: true,
        isRequired: true
      },
      */

    ];

    const { LookupData: lookups } = this.state;

    return (
      <React.Fragment>
        <CrDropdown
          placeholder="Select a Period"
          style={{ marginTop: "10px", marginRight: "24px" }}
          options={lookups.Periods.map((p) => { return { key: p.ID, text: p.Title }; })}
          onChanged={(v) => this.changePeriodsDropdown_DefElements(v)}
          selectedKey={this.state.SelectedPeriodDefElements}
        />
        <EntityList
          allowAdd={this.allowAdd_DefElements()}
          entityReadAllWithArg1={this.state.SelectedPeriodDefElements}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.DefElementService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Define Elements"
          entityNameSingular="Define Element"
          childEntityNameApi="Elements"
          childEntityNamePlural="Elements"
          childEntityNameSingular="Element"
        />

      </React.Fragment>


    );
  }





  private renderLogsList() {

    const listColumns: IGenColumn[] = [
      {
        key: '1',
        columnType: ColumnType.TextBox,
        name: 'Category',
        fieldName: 'Module',
        minWidth: 80,
        maxWidth: 80,
        isMultiline: true,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50
      },
      {
        key: '2',
        columnType: ColumnType.TextBox,
        name: 'Title',
        fieldName: 'Title',
        minWidth: 120,
        maxWidth: 120,
        isMultiline: true,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50
      },

      {
        key: '4',
        columnType: ColumnType.TagPickerForUser,
        name: 'Display Name',
        fieldName: 'UserTitle',
        idFieldName: 'UserId',
        isParent: true,
        parentEntityName: 'User',
        parentColumnName: 'Title',
        parentService: new services.UserService(this.props.spfxContext, this.props.api),
        minWidth: 100,
        maxWidth: 100,
        isMultiline: true,
        isResizable: true,
        isRequired: true
      },
      {
        key: '5',
        columnType: ColumnType.DropDown,
        name: 'Period',
        fieldName: 'PeriodTitle',
        idFieldName: 'PeriodId',
        isParent: true,
        parentEntityName: 'Period',
        parentColumnName: 'Title',
        parentService: new services.PeriodService(this.props.spfxContext, this.props.api),
        minWidth: 120,
        maxWidth: 120,
        isMultiline: true,
        isResizable: true,
        isRequired: true
      },
      {
        key: '6',
        columnType: ColumnType.DropDown,
        name: 'Division',
        fieldName: 'TeamTitle',
        idFieldName: 'TeamId',
        isParent: true,
        parentEntityName: 'Team',
        parentColumnName: 'Title',
        parentService: new services.TeamService(this.props.spfxContext, this.props.api),
        minWidth: 120,
        maxWidth: 160,
        isMultiline: true,
        isResizable: true,
        isRequired: true
      },
      {
        key: '7',
        columnType: ColumnType.TextBox,
        name: 'Date',
        fieldName: 'LogDate',
        minWidth: 140,
        maxWidth: 140,
        isMultiline: true,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 50
      },
      {
        key: '3',
        columnType: ColumnType.TextBox,
        //columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Details',
        fieldName: 'Details',
        minWidth: 160,
        maxWidth: 460,
        isResizable: true,
        isMultiline: true,
        isRequired: true,
        fieldMaxLength: 5000,
        numRows: 5
      }
    ];

    return (
      <React.Fragment>
        <EntityList
          pageSize={100}
          allowAdd={false}
          columns={listColumns}
          entityReadAllExpandAll={true}
          {...this.props}
          onError={this.onError}
          entityService={new services.LogService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Logs"
          entityNameSingular="Log"
          childEntityNameApi=""
          childEntityNamePlural=""
          childEntityNameSingular=""
        />

      </React.Fragment>
    );
  }



  //#endregion Render


  //#region Permissions


  private superUserOrSysManagerPermission(): boolean {

    //super user/SysManager check
    let ups: IUserPermission[] = this.state.UserPermissions;
    
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 2 || up.PermissionTypeId == 5) {
        //super user or sys manager
        return true;
      }
    }

    return false;
  }

  private allowAdd_Periods(): boolean {
    return this.superUserOrSysManagerPermission();
  }

  private allowAdd_DefForms(): boolean {

    if (this.state.IsArchivedPeriodDefForms === false) {
      return this.superUserOrSysManagerPermission();
    }
    return false;
  }

  private allowAdd_DefElementGroups(): boolean {

    if (this.state.IsArchivedPeriodDefElementGroups === false) {
      return this.superUserOrSysManagerPermission();
    }
    return false;
  }

  private allowAdd_DefElements(): boolean {

    if (this.state.IsArchivedPeriodDefElements === false) {
      return this.superUserOrSysManagerPermission();
    }
    return false;
  }

  //#endregion Permissions

  //#region Load Data

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


      this.setState({
        LookupData: this.cloneObject(this.state.LookupData, 'Periods', pArr),
        SelectedPeriodDefForms: currentPeriodId,
        SelectedPeriodDefElementGroups: currentPeriodId,
        SelectedPeriodDefElements: currentPeriodId
      });
      return pArr;
    }, (err) => { if (this.onError) this.onError(`Error loading Periods lookup data`, err.message); });
  }

  protected loadLookups(): Promise<any> {

    return Promise.all([
      this.loadPeriods(),
    ]);
  }

  //#endregion Load Data

  //#region Event Handlers

  protected changePeriodsDropdown_DefForms = (option: IDropdownOption): void => {

    const pArrTemp: IPeriod[] = this.state.LookupData.Periods.filter(p => p.ID === option.key);
    let isArchivedPeriod: boolean = false;
    if (pArrTemp.length > 0) {
      if (pArrTemp[0].PeriodStatus === "Archived Period") {
        isArchivedPeriod = true;
      }
    }

    this.setState({
      SelectedPeriodDefForms: option.key,
      IsArchivedPeriodDefForms: isArchivedPeriod
    });

  }

  protected changePeriodsDropdown_DefElementGroups = (option: IDropdownOption): void => {

    const pArrTemp: IPeriod[] = this.state.LookupData.Periods.filter(p => p.ID === option.key);
    let isArchivedPeriod: boolean = false;
    if (pArrTemp.length > 0) {
      if (pArrTemp[0].PeriodStatus === "Archived Period") {
        isArchivedPeriod = true;
      }
    }

    this.setState({
      SelectedPeriodDefElementGroups: option.key,
      IsArchivedPeriodDefElementGroups: isArchivedPeriod
    });

  }

  protected changePeriodsDropdown_DefElements = (option: IDropdownOption): void => {

    const pArrTemp: IPeriod[] = this.state.LookupData.Periods.filter(p => p.ID === option.key);
    let isArchivedPeriod: boolean = false;
    if (pArrTemp.length > 0) {
      if (pArrTemp[0].PeriodStatus === "Archived Period") {
        isArchivedPeriod = true;
      }
    }

    this.setState({
      SelectedPeriodDefElements: option.key,
      IsArchivedPeriodDefElements: isArchivedPeriod
    });

  }

  //#endregion Event Handlers

}
