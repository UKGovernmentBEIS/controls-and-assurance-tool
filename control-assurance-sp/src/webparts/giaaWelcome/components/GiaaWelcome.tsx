import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IGIAADefForm, IGIAAPeriod } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import styles from '../../../styles/cr.module.scss';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination

export interface ILookupData{
  GIAADefForm: IGIAADefForm;
  CurrentPeriod: IGIAAPeriod;
}

export class LookupData implements ILookupData{
  public GIAADefForm: IGIAADefForm;
  public CurrentPeriod: IGIAAPeriod;
}

export interface IGIAAWelcomeState extends types.IUserContextWebPartState {
  LookupData : ILookupData;
}
export class GIAAWelcomeState extends types.UserContextWebPartState {
  public LookupData = new LookupData();
	constructor() {
    super();
	}
}

//#endregion types defination

export default class GIAAWelcome extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, GIAAWelcomeState> {

  protected giaaDefFormService: services.GIAADefFormService = new services.GIAADefFormService(this.props.spfxContext, this.props.api);
  protected periodService: services.GIAAPeriodService = new services.GIAAPeriodService(this.props.spfxContext, this.props.api);

  constructor(props: types.IWebPartComponentProps) {
		super(props);
    this.state = new GIAAWelcomeState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return(
  
      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="GIAA Actions - Welcome">
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
        <h1 className='ms-font-xl'>{lookups.GIAADefForm && lookups.GIAADefForm.Title}</h1>        
        <div dangerouslySetInnerHTML={{ __html: lookups.GIAADefForm && lookups.GIAADefForm.Details }}></div>
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
    this.giaaDefFormService.welcomeAccess().then((res: string): void => {
    
      console.log('welcome accessed');

  }, (err) => {

  });

  }
  protected loadDefForm = (): Promise<IGIAADefForm> => {
    return this.giaaDefFormService.read(1).then((df: IGIAADefForm): IGIAADefForm => {
        this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'GIAADefForm', df) });
        return df;
    }, (err) => { if (this.onError) this.onError(`Error loading DefForm lookup data`, err.message); });
  }

  protected loadCurrentPeriod = (): Promise<IGIAAPeriod> => {
    return this.periodService.readAll("?$filter=PeriodStatus eq 'Current Period'").then((pArr: IGIAAPeriod[]): IGIAAPeriod => {
      if(pArr.length>0){
        const period: IGIAAPeriod = pArr[0];
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
    const pageUrl = this.props.spfxContext.pageContext.web.absoluteUrl + "/SitePages/GIAAActionsUpdates.aspx";
    window.location.href = pageUrl;
    
  }

  //#endregion event handlers

}


