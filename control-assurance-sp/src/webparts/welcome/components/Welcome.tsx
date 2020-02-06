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

//#region types defination

export interface ILookupData{
  DefForm: IDefForm;
  CurrentPeriod: IPeriod;
}

export class LookupData implements ILookupData{
  public DefForm: IDefForm;
  public CurrentPeriod: IPeriod;
}

export interface IWelcomeState extends types.IUserContextWebPartState {
  LookupData : ILookupData;
}
export class WelcomeState extends types.UserContextWebPartState {
  public LookupData = new LookupData();
	constructor() {
    super();
	}
}

//#endregion types defination

export default class Welcome extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, WelcomeState> {

  protected defFormService: services.DefFormService = new services.DefFormService(this.props.spfxContext, this.props.api);
  protected periodService: services.PeriodService = new services.PeriodService(this.props.spfxContext, this.props.api);

  constructor(props: types.IWebPartComponentProps) {
		super(props);
    this.state = new WelcomeState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return(
  
      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="Welcome!!">
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
        <h1 className='ms-font-xl'>{lookups.DefForm && lookups.DefForm.Title}</h1>        
        <div dangerouslySetInnerHTML={{ __html: lookups.DefForm && lookups.DefForm.Details }}></div>
        <br />
        <PrimaryButton
          text="Start / View Updates"
          onClick={this.handleUpdatesClick}
        />
        <PrimaryButton
          text="Upload a File"
          onClick={this.handleUploadFileClick}
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

  protected loadDefForm = (): Promise<IDefForm> => {
    return this.defFormService.read(1).then((df: IDefForm): IDefForm => {
        this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'DefForm', df) });
        return df;
    }, (err) => { if (this.onError) this.onError(`Error loading DefForm lookup data`, err.message); });
  }

  protected loadCurrentPeriod = (): Promise<IPeriod> => {
    return this.periodService.readAll("?$filter=PeriodStatus eq 'Current Period'").then((pArr: IPeriod[]): IPeriod => {
      if(pArr.length>0){
        const period: IPeriod = pArr[0];
        this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'CurrentPeriod', period) });
        return period;
      }
      return null;
    }, (err) => { if (this.onError) this.onError(`Error loading Current Period lookup data`, err.message); });
  }

  protected loadLookups(): Promise<any> {
    
    return Promise.all([
        this.loadDefForm(),
        this.loadCurrentPeriod(),
    ]);
  }

  //#endregion Data Load


  //#region event handlers

  private handleUpdatesClick = (): void => {
    const pageUrl = this.props.spfxContext.pageContext.web.absoluteUrl + "/SitePages/updates.aspx";
    window.location.href = pageUrl;
  }

  
  private handleUploadFileClick = (): void => {
    //const pageUrl = this.props.spfxContext.pageContext.web.absoluteUrl + "/SitePages/updates.aspx";
    //window.location.href = pageUrl;
  }
  //#endregion event handlers

}


