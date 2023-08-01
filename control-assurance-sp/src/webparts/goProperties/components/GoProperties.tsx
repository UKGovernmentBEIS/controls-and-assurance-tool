import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import PeriodList from '../../../components/period/PeriodList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission } from '../../../types';

//#region types defination

export interface IGoPropertiesState extends types.IUserContextWebPartState {
}
export class GoPropertiesState extends types.UserContextWebPartState implements IGoPropertiesState {

  constructor() {
    super();
  }
}

//#endregion types defination


export default class GoProperties extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, GoPropertiesState> {

  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new GoPropertiesState();
  }

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {
    return (
      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="Periods">
          {this.renderCustomPeriodsList()}
        </PivotItem>
        <PivotItem headerText="Define Form">
          {this.renderGoDefForms()}
        </PivotItem>
        <PivotItem headerText="Define Specific Areas">
          {this.renderGoDefElements()}
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
          entityService={new services.GoPeriodService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Gov Periods"
          entityNameSingular="Period"
          childEntityNameApi=""
          childEntityNamePlural=""
          childEntityNameSingular=""
        />

      </React.Fragment>
    );
  }

  private renderGoDefForms() {

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
        key: 'Section1Title',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section 1 Title',
        fieldName: 'Section1Title',
        minWidth: 100,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 300
      },
      {
        key: 'Section2Title',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section 2 Title',
        fieldName: 'Section2Title',
        minWidth: 100,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 300
      },
      {
        key: 'Section3Title',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Section 3 Title',
        fieldName: 'Section3Title',
        minWidth: 100,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 300
      },
      {
        key: 'SummaryShortInstructions',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Summary Short Instructions',
        fieldName: 'SummaryShortInstructions',
        minWidth: 100,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 3
      },
      {
        key: 'SummaryFullInstructions',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Summary Full Instructions',
        fieldName: 'SummaryFullInstructions',
        minWidth: 100,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 6
      },
      {
        key: 'SummaryFormRatingText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Summary Form Rating Text',
        fieldName: 'SummaryFormRatingText',
        minWidth: 100,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 2000,
        numRows: 3
      },
      {
        key: 'DGSignOffText',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'DG SignOff Text',
        fieldName: 'DGSignOffText',
        minWidth: 100,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 2000,
        numRows: 3
      },
    ];

    return (

      <React.Fragment>
        <EntityList
          allowAdd={this.superUserPermission()}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.GoDefFormService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Define Form"
          entityNameSingular="Define Form"
          childEntityNameApi=""
          childEntityNamePlural=""
          childEntityNameSingular=""
        />
      </React.Fragment>

    );
  }

  private renderGoDefElements() {

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

      {
        key: 'Instructions',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Instructions',
        fieldName: 'Instructions',
        minWidth: 100,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 1000,
        numRows: 3
      },
      {
        key: 'FullInstructions',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'Full Instructions',
        fieldName: 'FullInstructions',
        minWidth: 100,
        isResizable: true,
        isRequired: false,
        fieldMaxLength: 5000,
        numRows: 6
      },
      {
        key: 'RagRatingStyle',
        columnType: ColumnType.TextBox,
        columnDisplayType: ColumnDisplayType.FormOnly,
        name: 'RAG Rating Style (1 or 2)',
        fieldName: 'RagRatingStyle',
        minWidth: 100,
        isResizable: true,
        isRequired: true,
        fieldMaxLength: 1,
      },
    ];

    return (

      <React.Fragment>
        <EntityList
          allowAdd={this.superUserPermission()}
          columns={listColumns}
          {...this.props}
          onError={this.onError}
          entityService={new services.GoDefElementService(this.props.spfxContext, this.props.api)}
          entityNamePlural="Define Specific Areas"
          entityNameSingular="Define Specific Area"
          childEntityNameApi=""
          childEntityNamePlural=""
          childEntityNameSingular=""
        />
      </React.Fragment>
    );
  }


  //#region Permissions

  private superUserPermission = (): boolean => {

    //super user check
    let ups: IUserPermission[] = this.state.UserPermissions;

    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 6) {
        //super user
        return true;
      }
    }

    return false;
  }

  private allowAdd_Periods(): boolean {
    return this.superUserPermission();
  }

  //#endregion Permissions

}
