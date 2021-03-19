import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IGoDefForm, IPeriod } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import styles from '../../../styles/cr.module.scss';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination

export interface ILookupData{
  GoDefForm: IGoDefForm;
  CurrentPeriod: IPeriod;
}

export class LookupData implements ILookupData{
  public GoDefForm: IGoDefForm;
  public CurrentPeriod: IPeriod;
}

export interface IGoWelcomeState extends types.IUserContextWebPartState {
  LookupData : ILookupData;
}
export class GoWelcomeState extends types.UserContextWebPartState {
  public LookupData = new LookupData();
	constructor() {
    super();
	}
}

//#endregion types defination

export default class GoWelcome extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, GoWelcomeState> {

  protected goDefFormService: services.GoDefFormService = new services.GoDefFormService(this.props.spfxContext, this.props.api);
  protected periodService: services.PeriodService = new services.PeriodService(this.props.spfxContext, this.props.api);

  constructor(props: types.IWebPartComponentProps) {
		super(props);
    this.state = new GoWelcomeState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return(
  
      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="Governance - Welcome">
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
        <h1 className='ms-font-xl'>{lookups.GoDefForm && lookups.GoDefForm.Title}</h1>        
        <div dangerouslySetInnerHTML={{ __html: lookups.GoDefForm && lookups.GoDefForm.Details }}></div>
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
    this.goDefFormService.welcomeAccess().then((res: string): void => {
    
      console.log('welcome accessed');

  }, (err) => {

  });

  }
  protected loadDefForm = (): Promise<IGoDefForm> => {
    return this.goDefFormService.read(1).then((df: IGoDefForm): IGoDefForm => {
        this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'GoDefForm', df) });
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
        this.welcomeAccess(),
        this.loadDefForm(),
        this.loadCurrentPeriod(),
    ]);
  }

  //#endregion Data Load


  //#region event handlers

  private handleUpdatesClick = (): void => {
    const pageUrl = this.props.spfxContext.pageContext.web.absoluteUrl + "/SitePages/GovernanceUpdates.aspx";
    window.location.href = pageUrl;
    
  }

  //#endregion event handlers

}


