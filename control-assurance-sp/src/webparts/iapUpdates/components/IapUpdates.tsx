import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { CrDropdown, IDropdownOption } from '../../../components/cr/CrDropdown';
import Section1 from '../../../components/iap/Section1';
import Section2 from '../../../components/iap/Section2';
//import Section2Update from '../../../components/govUpdates/Section2Update';
//import Section3Update from '../../../components/govUpdates/Section3Update';
//import Section4Update from '../../../components/govUpdates/Section4Update';



import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IUser, IEntity, } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import { CrEntityPicker } from '../../../components/cr/CrEntityPicker';
import styles from '../../../styles/cr.module.scss';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination

export interface ILookupData {
  Users: IUser[];
}

export class LookupData implements ILookupData {

  public Users = null;

}

export interface IIapUpdatesState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
  //DirectorateGroupId: string | number;
  SelectedUserIds: number[];


  SelectedPivotKey: string;

  Section1_IsOpen: boolean;
  //Section1_MainList_IncompleteOnly: boolean;
  //Section1__MainList_JustMine: boolean;
  Section1_MainList_ListFilterText: string;
  Section1_MainList_SelectedId: number;
  Section1_MainList_SelectedTitle: string;
  Section1_MainList_FilteredItems: any[];

  IsDefultUserSet:boolean;


}
export class IapUpdatesState extends types.UserContextWebPartState implements IIapUpdatesState {
  public LookupData = new LookupData();

  public SelectedUserIds: number[] = [];
  //public DirectorateGroupId: string | number = 0;
  public SelectedPivotKey = "Individual Action Plans"; //default, 1st tab selected

  public Section1_IsOpen: boolean = false;


  public Section1_MainList_ListFilterText: string = null;
  public Section1_MainList_SelectedId: number = 0;
  public Section1_MainList_SelectedTitle: string = null;
  public Section1_MainList_FilteredItems = [];

  public IsDefultUserSet:boolean = false;

  constructor() {
    super();
  }
}

//#endregion types defination

export default class IapUpdates extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, IapUpdatesState> {


  //private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);

  //private isDefultUserSet:boolean = false;
  private readonly headerTxt_MainTab: string = "Individual Action Plans";
  //private readonly headerTxt_RecommendationsTab: string = "Recommendations";


  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new IapUpdatesState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {


    if(this.state.User){
      
      if(this.state.IsDefultUserSet === false){
        console.log('default user loaded');
        this.setDefaultUser();
      }

      //this.isDefultUserSet = true;

    }

    return (

      <Pivot onLinkClick={this.handlePivotClick} selectedKey={`${this.state.SelectedPivotKey}`}>
        <PivotItem headerText={this.headerTxt_MainTab} itemKey={this.headerTxt_MainTab}>
          {this.renderMainTab()}
        </PivotItem>
        {/* {this.renderRecommendationsTab()} */}


      </Pivot>
    );
  }

  private renderMainTab(): React.ReactElement<types.IWebPartComponentProps> {
    const { LookupData: lookups } = this.state;

    // let dgAreasDrpOptions = lookups.DGAreas.map((dgArea) => { return { key: dgArea.ID, text: dgArea.Title }; });
    // dgAreasDrpOptions = [{ key: 0, text: "All DGAreas" }, ...dgAreasDrpOptions];


    // const periodId = Number(this.state.PeriodId);
    // const directorateGroupId = Number(this.state.DirectorateGroupId);

    const users = this.state.LookupData.Users;




    return (
      <div>
        <CrLoadingOverlayWelcome isLoading={this.state.Loading} />
        <div style={{marginTop:'15px'}}>
          Select staff to view their action plan
        </div>
        <div style={{ paddingTop: "10px" }}>
          <CrEntityPicker
            
            displayForUser={true}
            entities={this.state.LookupData.Users}
            itemLimit={10}
            selectedEntities={this.state.SelectedUserIds.map((id) => { return id; })}
            onChange={(v) => this.changeMultiUserPicker(v)}
          />


          <br />

          {
            <div>
              <Section1
                onItemTitleClick={this.handleSection1_MainListItemTitleClick}
                section1_IsOpen={this.state.Section1_IsOpen}
                onSection1_toggleOpen={this.handleSection1_toggleOpen}
                listFilterText={this.state.Section1_MainList_ListFilterText}
                onChangeFilterText={this.handleSection1_ChangeFilterText}
                userIdsArr={this.state.SelectedUserIds}
                {...this.props}
              />
              <Section2
                {...this.props}
              />



            </div>
          }



        </div>
      </div>
    );
  }









  //#endregion Render


  //#region Data Load




  private loadUsers = (): Promise<IUser[]> => {
    return this.userService.readAll().then((data: IUser[]): IUser[] => {
      this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Users", data) }, );
      return data;
    }, (err) => { if (this.onError) this.onError(`Error loading Users lookup data`, err.message); });
  }

  private setDefaultUser = (): void => {
    const defaultUserId = this.state.User.ID;
    const newArr:number[] = [];
    newArr.push(defaultUserId);

    console.log('defaultUserId', defaultUserId);

    //let s:number[] = {...this.state.SelectedUserIds};
    //console.log('s arr', s);




    //s.push(defaultUserId);

    this.setState({ SelectedUserIds: newArr, IsDefultUserSet:true });
  }


  protected loadLookups(): Promise<any> {

    return Promise.all([

      this.loadUsers(),


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
        //super user or sys manager
        return true;
      }
    }

    return false;
  }





  //#endregion Permissions

  //#region event handlers






  private handlePivotClick = (item: PivotItem): void => {
    this.clearErrors();
    this.setState({ SelectedPivotKey: item.props.headerText });
  }

  private handleSection1_MainListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {

    console.log('on main list item title click ', ID, title, filteredItems);
    // this.setState({
    //   SelectedPivotKey: this.headerTxt_RecommendationsTab,
    //   Section1_MainList_SelectedId: ID,
    //   Section1_MainList_SelectedTitle: title,
    //   Section1_MainList_FilteredItems: filteredItems
    // });
  }



  private handleSection1_toggleOpen = (): void => {
    this.setState({ Section1_IsOpen: !this.state.Section1_IsOpen });
  }

  private handleSection1_ChangeFilterText = (value: string): void => {
    this.setState({ Section1_MainList_ListFilterText: value });
  }



  private handleShowListSection1 = (): void => {
    console.log('in handleShowListSection1');
    this.clearErrors();
    this.setState({ SelectedPivotKey: this.headerTxt_MainTab });
  }












  private changeMultiUserPicker = (value: number[]): void => {

    
    //to avoid same user to add multiple times
    const valuesUnique = value.filter((item, pos) => {
        return value.indexOf(item) == pos;
    });
    value = valuesUnique;

    
    console.log('changeMultiUserPicker', value, value.join(','));
    this.setState({ SelectedUserIds: value });

    
}


  //#endregion event handlers

}


