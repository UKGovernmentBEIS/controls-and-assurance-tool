import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';
import Section from '../../../components/CL/Section';

import NewCaseTab from '../../../components/CL/NewCaseTab';
import ActionUpdatesTab from '../../../components/giaaActions/ActionUpdatesTab';

import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IDefForm, IGIAAPeriod, IEntity, IDirectorateGroup, IGoDefForm, GoForm, IGoForm } from '../../../types';
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
  Section_MainList_SelectedId:number;



}
export class ClUpdatesState extends types.UserContextWebPartState implements IClUpdatesState {
  public LookupData = new LookupData();

  public SelectedPivotKey = "Contingent Labour"; //default, 1st tab selected

  public Section1_IsOpen: boolean = false;
  public Section1_MainList_ListFilterText: string = null;
  public Section_MainList_SelectedId = null;



  constructor() {
    super();
  }
}

//#endregion types defination

export default class ClUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, ClUpdatesState> {

  private readonly headerTxt_MainTab: string = "Contingent Labour";
  private readonly headerTxt_NewCaseTab: string = "Case";


  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new ClUpdatesState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <Pivot onLinkClick={this.handlePivotClick} selectedKey={`${this.state.SelectedPivotKey}`}>
        <PivotItem headerText={this.headerTxt_MainTab} itemKey={this.headerTxt_MainTab}>
          {this.renderMainTab()}
        </PivotItem>
        {this.renderNewCaseTab()}


      </Pivot>
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
                onItemTitleClick={this.handleSection_MainListItemTitleClick}
                section_IsOpen={this.state.Section1_IsOpen}
                onSection_toggleOpen={this.handleSection1_toggleOpen}
                listFilterText={this.state.Section1_MainList_ListFilterText}
                onChangeFilterText={this.handleSection1_ChangeFilterText}
                {...this.props}
              />






            </div>
          }



        </div>
      </div>
    );
  }

  private renderNewCaseTab() {
    if (this.state.SelectedPivotKey === this.headerTxt_NewCaseTab) {
      return (

        <PivotItem headerText={this.headerTxt_NewCaseTab} itemKey={this.headerTxt_NewCaseTab}>
          {this.renderNewCase()}
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
        clCaseId={this.state.Section_MainList_SelectedId}
        currentUserName={this.getCurrentUserName()}
        currentUserId={this.getCurrentUserId()}
        superUserPermission={this.isSuperUser()}
        {...this.props}
      />


    );

  }






  //#endregion Render


  //#region Data Load




  protected loadLookups(): Promise<any> {

    return Promise.all([

    ]);
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
      console.log('in isSuperUser loop', ups);
      if (up.PermissionTypeId == 1 || up.PermissionTypeId == 13) {
        //super user or giaa super user
        return true;
      }
    }

    return false;
  }





  //#endregion Permissions

  //#region event handlers


  private handleShowMainTab = (): void => {
    console.log('in handleShowMainTab');
    this.clearErrors();
    this.setState({ SelectedPivotKey: this.headerTxt_MainTab });
  }


  private handlePivotClick = (item: PivotItem): void => {
    this.clearErrors();
    this.setState({ SelectedPivotKey: item.props.headerText });
  }

  private handleSection1_toggleOpen = (): void => {
    this.setState({ Section1_IsOpen: !this.state.Section1_IsOpen });
  }


  private handleSection1_ChangeFilterText = (value: string): void => {
    this.setState({ Section1_MainList_ListFilterText: value });
  }


  private handleSection_MainListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {

    //if ID is 0 then new case add request
    console.log('on main list item title click ', ID, title, filteredItems);
    this.setState({
      SelectedPivotKey: this.headerTxt_NewCaseTab,
      Section_MainList_SelectedId: ID,
      //Section_MainList_SelectedTitle: title,
      //Section_MainList_FilteredItems: filteredItems
    });
  }




  //#endregion event handlers

}


