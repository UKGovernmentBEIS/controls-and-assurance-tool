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

  private spSiteUrl: string = this.props.spfxContext.pageContext.web.absoluteUrl;



  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new AppHomeState();
    console.log('spSiteUrl', this.spSiteUrl);
    this.controlsAssuranceApphomeImg = `${this.spSiteUrl}/Shared%20Documents/images/controls-assurance-apphome.png`;
    this.governanceApphomeImg = `${this.spSiteUrl}/Shared%20Documents/images/governance-apphome.png`;
    this.naoApphomeImg = `${this.spSiteUrl}/Shared%20Documents/images/naotracker-apphome.png`;
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (

      <div style={{ paddingLeft: '0px', paddingTop: '0px' }}>
        <div style={{ display: 'flex' }}>
          {/* first card */}
          <div style={{ width: '250px' }}>
            <div style={{ textAlign: 'center', color: 'white', backgroundColor: 'rgb(122,116,117)', fontSize: '35px', height: '270px', borderBottom: '1px solid white' }}>
              <img src={this.controlsAssuranceApphomeImg}></img>
              <div>Controls &amp; Assurance</div>
            </div>
            <div style={{ backgroundColor: 'rgb(122,116,117)', textAlign: 'center', padding: '10px', cursor: 'pointer' }} onClick={this.handleControlsAssuranceClick} >
              <a style={{ color: 'white', fontSize: '25px', textDecoration: 'none' }} >Start</a>
            </div>
          </div>

          {/* second card */}
          <div style={{ marginLeft: '20px', width: '250px' }}>
            <div style={{ textAlign: 'center', color: 'white', backgroundColor: 'rgb(122,116,117)', fontSize: '35px', height: '270px', borderBottom: '1px solid white' }}>
              <img src={this.governanceApphomeImg}></img>
              <div>Governance</div>
            </div>
            <div style={{ backgroundColor: 'rgb(122,116,117)', textAlign: 'center', padding: '10px', cursor: 'pointer' }}
              onClick={this.handleGovernanceClick}  >
              <a style={{ color: 'white', fontSize: '25px', textDecoration: 'none' }} >Start</a>
            </div>
          </div>

          {/* third card */}
          <div style={{ marginLeft: '20px', width: '250px' }}>
            <div style={{ textAlign: 'center', color: 'white', backgroundColor: 'rgb(122,116,117)', fontSize: '35px', height: '270px', borderBottom: '1px solid white' }}>
              <img src={this.naoApphomeImg}></img>
              <div>NAO/PAC Tracker</div>
            </div>
            <div style={{ backgroundColor: 'rgb(122,116,117)', textAlign: 'center', padding: '10px', cursor: 'pointer' }}
              onClick={this.handleNAOTrackerClick}  >
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




  //#endregion event handlers

}
