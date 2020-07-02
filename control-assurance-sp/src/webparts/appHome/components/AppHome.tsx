import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IDefForm, IPeriod } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import styles from '../../../styles/cr.module.scss';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';



export interface IAppHomeState extends types.IUserContextWebPartState {

}
export class AppHomeState extends types.UserContextWebPartState {

  constructor() {
    super();
  }
}

export default class AppHome extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, AppHomeState> {

  private controlsAssuranceApphomeImg: string = ""; // require('../../../images/controls-assurance-apphome.png');
  private governanceApphomeImg: string = ""; // require('../../../images/governance-apphome.png');
  private naoApphomeImg: string = "";
  private giaaApphomeImg: string = "";
  private individualActionAppHomeImg: string = "";

  private spSiteUrl: string = this.props.spfxContext.pageContext.web.absoluteUrl;



  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new AppHomeState();
    console.log('spSiteUrl', this.spSiteUrl);
    this.controlsAssuranceApphomeImg = `${this.spSiteUrl}/Shared%20Documents/images/controls-assurance-apphome.png`;
    this.governanceApphomeImg = `${this.spSiteUrl}/Shared%20Documents/images/governance-apphome.png`;
    this.naoApphomeImg = `${this.spSiteUrl}/Shared%20Documents/images/naotracker-apphome.png`;
    this.giaaApphomeImg = `${this.spSiteUrl}/Shared%20Documents/images/giaaactions-apphome.png`;
    this.individualActionAppHomeImg = `${this.spSiteUrl}/Shared%20Documents/images/individual-actions-apphome.png`;
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <div style={{ paddingLeft: '0px', paddingTop: '0px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>

          {/* giaa individual actions */}
          <div style={{ marginTop: '20px', marginRight: '20px', width: '250px' }}>
            <div style={{ textAlign: 'center', color: 'white', backgroundColor: 'rgb(122,116,117)', fontSize: '35px', height: '270px', borderBottom: '1px solid white' }}>
              <img src={this.individualActionAppHomeImg}></img>
              <div>Individual Action Plans</div>
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

}
