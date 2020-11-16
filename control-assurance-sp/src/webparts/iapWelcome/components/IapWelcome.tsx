import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import EntityList from '../../../components/entity/EntityList';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../../types/GenColumn';
import { IUserPermission, IIAPDefForm } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import styles from '../../../styles/cr.module.scss';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination

export interface ILookupData{
  IAPDefForm: IIAPDefForm;
  //CurrentPeriod: IGIAAPeriod;
}

export class LookupData implements ILookupData{
  public IAPDefForm: IIAPDefForm;
  //public CurrentPeriod: IGIAAPeriod;
}

export interface IIAPWelcomeState extends types.IUserContextWebPartState {
  LookupData : ILookupData;
}
export class IAPWelcomeState extends types.UserContextWebPartState {
  public LookupData = new LookupData();
	constructor() {
    super();
	}
}

//#endregion types defination

export default class IAPWelcome extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, IAPWelcomeState> {

  protected iapDefFormService: services.IAPDefFormService = new services.IAPDefFormService(this.props.spfxContext, this.props.api);
  //protected periodService: services.GIAAPeriodService = new services.GIAAPeriodService(this.props.spfxContext, this.props.api);

  constructor(props: types.IWebPartComponentProps) {
		super(props);
    this.state = new IAPWelcomeState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return(
  
      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="Management Action Plans - Welcome">
          {this.renderWelcome()}
        </PivotItem> 

      </Pivot>
    );
  }

  private renderWelcome(): React.ReactElement<types.IWebPartComponentProps> {
    const { LookupData:lookups } = this.state;
    // let periodEndDate:string="";
    // if(lookups.CurrentPeriod){
    //   const endDate = lookups.CurrentPeriod.PeriodEndDate;
    //   periodEndDate = services.DateService.dateToUkDate(endDate);
    // }


    return (
      <div>
        <CrLoadingOverlayWelcome isLoading={this.state.Loading} />
        <h1 className='ms-font-xl'>{lookups.IAPDefForm && lookups.IAPDefForm.Title}</h1>        
        <div dangerouslySetInnerHTML={{ __html: lookups.IAPDefForm && lookups.IAPDefForm.Details }}></div>
        <br />
        <PrimaryButton
          text="Start / View"
          onClick={this.handleUpdatesClick}
        />
        <br /><br />
        {/* <div>
          Current period ends on the {periodEndDate}
        </div> */}
          

        
      </div>
    );
  }


  //#endregion Render

  
  //#region Data Load

  private welcomeAccess = () : void => {
    this.iapDefFormService.welcomeAccess().then((res: string): void => {
    
      console.log('welcome accessed');

  }, (err) => {

  });

  }
  protected loadDefForm = (): Promise<IIAPDefForm> => {
    return this.iapDefFormService.read(1).then((df: IIAPDefForm): IIAPDefForm => {
        this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'IAPDefForm', df) });
        return df;
    }, (err) => { if (this.onError) this.onError(`Error loading DefForm lookup data`, err.message); });
  }

  // protected loadCurrentPeriod = (): Promise<IGIAAPeriod> => {
  //   return this.periodService.readAll("?$filter=PeriodStatus eq 'Current Period'").then((pArr: IGIAAPeriod[]): IGIAAPeriod => {
  //     if(pArr.length>0){
  //       const period: IGIAAPeriod = pArr[0];
  //       this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'CurrentPeriod', period) });
  //       return period;
  //     }
  //     return null;
  //   }, (err) => { if (this.onError) this.onError(`Error loading Current Period lookup data`, err.message); });
  // }

  protected loadLookups(): Promise<any> {
    
    return Promise.all([
        this.welcomeAccess(),
        this.loadDefForm(),
        //this.loadCurrentPeriod(),
    ]);
  }

  //#endregion Data Load


  //#region event handlers

  private handleUpdatesClick = (): void => {
    const pageUrl = this.props.spfxContext.pageContext.web.absoluteUrl + "/SitePages/IAPUpdates.aspx";
    window.location.href = pageUrl;
    
  }

  //#endregion event handlers

}


