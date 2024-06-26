import * as React from 'react';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import { IUserPermission, IEntity } from '../../../types';
import PlatformLinks from '../../../components/PlatformLinks';

export interface IAppHomeState extends types.IUserContextWebPartState {
}
export class AppHomeState extends types.UserContextWebPartState {

  constructor() {
    super();
  }
}

export default class AppHome extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, AppHomeState> {
  private controlsAssuranceApphomeImg: string = ""; // require('../../../images/controls-assurance-apphome.png');
  private governanceApphomeImg: string = "";
  private naoApphomeImg: string = "";
  private giaaApphomeImg: string = "";
  private individualActionAppHomeImg: string = "";
  private contingentLabourAppHomeImg: string = "";
  private spSiteUrl: string = this.props.spfxContext.pageContext.web.absoluteUrl;
  private giaaDefFormService: services.GIAADefFormService = new services.GIAADefFormService(this.props.spfxContext, this.props.api);

  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new AppHomeState();
    console.log('spSiteUrl', this.spSiteUrl);
    this.controlsAssuranceApphomeImg = `${this.spSiteUrl}/Shared%20Documents/images/controls-assurance-apphome.png`;
    this.governanceApphomeImg = `${this.spSiteUrl}/Shared%20Documents/images/governance-apphome.png`;
    this.naoApphomeImg = `${this.spSiteUrl}/Shared%20Documents/images/naotracker-apphome.png`;
    this.giaaApphomeImg = `${this.spSiteUrl}/Shared%20Documents/images/giaaactions-apphome.png`;
    this.individualActionAppHomeImg = `${this.spSiteUrl}/Shared%20Documents/images/individual-actions-apphome.png`;
    this.contingentLabourAppHomeImg = `${this.spSiteUrl}/Shared%20Documents/images/contingent-labour-apphome.png`;
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (
      <div style={{ paddingLeft: '0px', paddingTop: '0px' }}>
        {this.state.UserPermissions.length > 0 && <PlatformLinks module='Home' visible={this.isSuperUser()} {...this.props} />}
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>

          {/* giaa individual actions */}
          <div style={{ marginTop: '20px', marginRight: '20px', width: '250px' }}>
            <div style={{ textAlign: 'center', color: 'white', backgroundColor: 'rgb(122,116,117)', fontSize: '35px', height: '270px', borderBottom: '1px solid white' }}>
              <img src={this.individualActionAppHomeImg}></img>
              <div>Management Actions</div>
            </div>
            <div style={{ backgroundColor: 'rgb(122,116,117)', textAlign: 'center', padding: '10px', cursor: 'pointer' }} onClick={this.handleIndividualActionClick} >
              <a style={{ color: 'white', fontSize: '25px', textDecoration: 'none' }} >Start</a>
            </div>
          </div>

          {/* giaa actions */}
          <div style={{ marginTop: '20px', marginRight: '20px', width: '250px' }}>
            <div style={{ textAlign: 'center', color: 'white', backgroundColor: 'rgb(122,116,117)', fontSize: '35px', height: '270px', borderBottom: '1px solid white' }}>
              <img src={this.giaaApphomeImg}></img>
              <div>GIAA Actions</div>
            </div>
            <div style={{ backgroundColor: 'rgb(122,116,117)', textAlign: 'center', padding: '10px', cursor: 'pointer' }}
              onClick={this.handleGIAATrackerClick}  >
              <a style={{ color: 'white', fontSize: '25px', textDecoration: 'none' }} >Start</a>
            </div>
          </div>

          {/* NAO/PAC Tracker */}
          <div style={{ marginTop: '20px', marginRight: '20px', width: '250px' }}>
            <div style={{ textAlign: 'center', color: 'white', backgroundColor: 'rgb(122,116,117)', fontSize: '35px', height: '270px', borderBottom: '1px solid white' }}>
              <img src={this.naoApphomeImg}></img>
              <div>NAO/PAC Tracker</div>
            </div>
            <div style={{ backgroundColor: 'rgb(122,116,117)', textAlign: 'center', padding: '10px', cursor: 'pointer' }}
              onClick={this.handleNAOTrackerClick}  >
              <a style={{ color: 'white', fontSize: '25px', textDecoration: 'none' }} >Start</a>
            </div>
          </div>

          {/* Controls Assurance */}
          <div style={{ marginTop: '20px', marginRight: '20px', width: '250px' }}>
            <div style={{ textAlign: 'center', color: 'white', backgroundColor: 'rgb(122,116,117)', fontSize: '35px', height: '270px', borderBottom: '1px solid white' }}>
              <img src={this.controlsAssuranceApphomeImg}></img>
              <div>Controls &amp; Assurance</div>
            </div>
            <div style={{ backgroundColor: 'rgb(122,116,117)', textAlign: 'center', padding: '10px', cursor: 'pointer' }} onClick={this.handleControlsAssuranceClick} >
              <a style={{ color: 'white', fontSize: '25px', textDecoration: 'none' }} >Start</a>
            </div>
          </div>

          {/* Governance */}
          <div style={{ marginTop: '20px', marginRight: '20px', width: '250px' }}>
            <div style={{ textAlign: 'center', color: 'white', backgroundColor: 'rgb(122,116,117)', fontSize: '35px', height: '270px', borderBottom: '1px solid white' }}>
              <img src={this.governanceApphomeImg}></img>
              <div>Governance</div>
            </div>
            <div style={{ backgroundColor: 'rgb(122,116,117)', textAlign: 'center', padding: '10px', cursor: 'pointer' }}
              onClick={this.handleGovernanceClick}  >
              <a style={{ color: 'white', fontSize: '25px', textDecoration: 'none' }} >Start</a>
            </div>
          </div>

          {/* Contingent Labour */}
          <div style={{ marginTop: '20px', marginRight: '20px', width: '250px' }}>
            <div style={{ textAlign: 'center', color: 'white', backgroundColor: 'rgb(122,116,117)', fontSize: '35px', height: '270px', borderBottom: '1px solid white' }}>
              <img src={this.contingentLabourAppHomeImg}></img>
              <div>Contingent Labour</div>
            </div>
            <div style={{ backgroundColor: 'rgb(122,116,117)', textAlign: 'center', padding: '10px', cursor: 'pointer' }}
              onClick={this.handleContingentLabourClick}  >
              <a style={{ color: 'white', fontSize: '25px', textDecoration: 'none' }} >Start</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //#endregion Render


  //#region event handlers

  private handleControlsAssuranceClick = (): void => {
    const pageUrl = this.spSiteUrl + "/SitePages/ControlsAssuranceWelcome.aspx";
    window.location.href = pageUrl;
  }

  private handleGovernanceClick = (): void => {
    const pageUrl = this.spSiteUrl + "/SitePages/GovernanceWelcome.aspx";
    window.location.href = pageUrl;
  }

  private handleContingentLabourClick = (): void => {
    const pageUrl = this.spSiteUrl + "/SitePages/ContingentLabourWelcome.aspx";
    window.location.href = pageUrl;
  }

  private handleNAOTrackerClick = (): void => {
    const pageUrl = this.spSiteUrl + "/SitePages/NAOTrackerWelcome.aspx";
    window.location.href = pageUrl;
  }

  private handleGIAATrackerClick = (): void => {
    const pageUrl = this.spSiteUrl + "/SitePages/GIAAActionsWelcome.aspx";
    window.location.href = pageUrl;
  }

  private handleIndividualActionClick = (): void => {
    const pageUrl = this.spSiteUrl + "/SitePages/IndividualActionsWelcome.aspx";
    window.location.href = pageUrl;
  }

  //#endregion event handlers


  //#region Data Load

  private getTestDateTime = (): void => {

    this.giaaDefFormService.getTestDateTime().then((x: IEntity) => {
      console.log('DateTime Info', x);

    }, (err) => { });

  }

  private isSuperUser(): boolean {

    //super user/SysManager check
    let ups: IUserPermission[] = this.state.UserPermissions;
    for (let i = 0; i < ups.length; i++) {
      let up: IUserPermission = ups[i];
      if (up.PermissionTypeId == 1) {
        return true;
      }
    }
    return false;
  }

  protected loadLookups(): Promise<any> {
    return Promise.all([
      this.getTestDateTime(),
    ]);
  }

  //#endregion Data Load
}
