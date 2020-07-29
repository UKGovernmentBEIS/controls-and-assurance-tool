import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, INAODefForm, INAOPeriod } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import styles from '../../../styles/cr.module.scss';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination

export interface ILookupData{
  NAODefForm: INAODefForm;
  CurrentPeriod: INAOPeriod;
}

export class LookupData implements ILookupData{
  public NAODefForm: INAODefForm;
  public CurrentPeriod: INAOPeriod;
}

export interface INAOWelcomeState extends types.IUserContextWebPartState {
  LookupData : ILookupData;
}
export class NAOWelcomeState extends types.UserContextWebPartState {
  public LookupData = new LookupData();
	constructor() {
    super();
	}
}

//#endregion types defination

export default class NAOWelcome extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, NAOWelcomeState> {

  protected naoDefFormService: services.NAODefFormService = new services.NAODefFormService(this.props.spfxContext, this.props.api);
  protected periodService: services.NAOPeriodService = new services.NAOPeriodService(this.props.spfxContext, this.props.api);

  constructor(props: types.IWebPartComponentProps) {
		super(props);
    this.state = new NAOWelcomeState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return(
  
      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="NAO/PAC Tracker - Welcome">
          {this.renderWelcome()}
        </PivotItem> 

      </Pivot>
    );
  }

  private renderWelcome(): React.ReactElement<types.IWebPartComponentProps> {
    const { LookupData:lookups } = this.state;
    let periodEndDate:string="";
    if(lookups.CurrentPeriod){
      const endDate = lookups.CurrentPeriod.PeriodEndDate;
      periodEndDate = services.DateService.dateToUkDate(endDate);
    }
    //const pageUrl = this.props.spfxContext.pageContext.web.absoluteUrl;
    //console.log("page absoluteUrl url", pageUrl);

    return (
      <div>
        <CrLoadingOverlayWelcome isLoading={this.state.Loading} />
        <h1 className='ms-font-xl'>{lookups.NAODefForm && lookups.NAODefForm.Title}</h1>        
        <div dangerouslySetInnerHTML={{ __html: lookups.NAODefForm && lookups.NAODefForm.Details }}></div>
        <br />
        <PrimaryButton
          text="Start / View Updates"
          onClick={this.handleUpdatesClick}
        />
        <br /><br />
        <div>
          Current period ends on the {periodEndDate}
        </div>
          

        
      </div>
    );
  }


  //#endregion Render

  
  //#region Data Load

  private welcomeAccess = () : void => {
    this.naoDefFormService.welcomeAccess().then((res: string): void => {
    
      console.log('welcome accessed');

  }, (err) => {

  });

  }
  protected loadDefForm = (): Promise<INAODefForm> => {
    return this.naoDefFormService.read(1).then((df: INAODefForm): INAODefForm => {
        this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'NAODefForm', df) });
        return df;
    }, (err) => { if (this.onError) this.onError(`Error loading DefForm lookup data`, err.message); });
  }

  protected loadCurrentPeriod = (): Promise<INAOPeriod> => {
    return this.periodService.readAll("?$filter=PeriodStatus eq 'Current Period'").then((pArr: INAOPeriod[]): INAOPeriod => {
      if(pArr.length>0){
        const period: INAOPeriod = pArr[0];
        this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'CurrentPeriod', period) });
        return period;
      }
      return null;
    }, (err) => { if (this.onError) this.onError(`Error loading Current Period lookup data`, err.message); });
  }

  protected loadLookups(): Promise<any> {
    
    return Promise.all([
        this.welcomeAccess(),
        this.loadDefForm(),
        this.loadCurrentPeriod(),
    ]);
  }

  //#endregion Data Load


  //#region event handlers

  private handleUpdatesClick = (): void => {
    const pageUrl = this.props.spfxContext.pageContext.web.absoluteUrl + "/SitePages/NAOTrackerUpdates.aspx";
    window.location.href = pageUrl;
    
  }

  //#endregion event handlers

}

