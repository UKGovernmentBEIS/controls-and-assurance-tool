import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import { IDefForm, IPeriod } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination

export interface ILookupData {
  DefForm: IDefForm;
  CurrentPeriod: IPeriod;
}

export class LookupData implements ILookupData {
  public DefForm: IDefForm;
  public CurrentPeriod: IPeriod;
}

export interface IWelcomeState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
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

    return (

      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="Controls Assurance - Welcome">
          {this.renderWelcome()}
        </PivotItem>
      </Pivot>
    );
  }

  private renderWelcome(): React.ReactElement<types.IWebPartComponentProps> {
    const { LookupData: lookups } = this.state;
    let periodEndDate: string = "";
    if (lookups.CurrentPeriod) {
      const endDate = lookups.CurrentPeriod.PeriodEndDate;
      periodEndDate = services.DateService.dateToUkDate(endDate);
    }

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
    }).catch((err) => {
      if (this.onError) this.onError(`Error loading DefForm lookup data`, err.message);
      return null; // Return null or appropriate default value when there's an error
    }) as Promise<IDefForm>; // Cast the Promise type to the expected type
  }

  protected loadCurrentPeriod = (): Promise<IPeriod> => {
    return this.periodService.readAll("?$filter=PeriodStatus eq 'Current Period'").then((pArr: IPeriod[]): IPeriod => {
      if (pArr.length > 0) {
        const period: IPeriod = pArr[0];
        this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'CurrentPeriod', period) });
        return period;
      } else {
        return null; // Return null or appropriate default value when there's no current period
      }
    }).catch((err) => {
      if (this.onError) this.onError(`Error loading Current Period lookup data`, err.message);
      return null; // Return null or appropriate default value when there's an error
    }) as Promise<IPeriod>; // Cast the Promise type to the expected type
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
    const pageUrl = this.props.spfxContext.pageContext.web.absoluteUrl + "/SitePages/ControlsAssuranceUpdates.aspx";
    window.location.href = pageUrl;
  }

  //#endregion event handlers

}


