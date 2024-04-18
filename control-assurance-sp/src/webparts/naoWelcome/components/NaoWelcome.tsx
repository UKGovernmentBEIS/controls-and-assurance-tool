import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import { INAODefForm, } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination

export interface ILookupData {
  NAODefForm: INAODefForm;
}

export class LookupData implements ILookupData {
  public NAODefForm: INAODefForm;
}

export interface INAOWelcomeState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
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

    return (
      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="NAO/PAC Tracker - Welcome">
          {this.renderWelcome()}
        </PivotItem>
      </Pivot>
    );
  }

  private renderWelcome(): React.ReactElement<types.IWebPartComponentProps> {
    const { LookupData: lookups } = this.state;
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
      </div>
    );
  }

  //#endregion Render


  //#region Data Load

  private welcomeAccess = (): void => {
    this.naoDefFormService.welcomeAccess().then((res: string): void => {
      console.log('welcome accessed');
    }, (err) => {
    });
  }

  protected loadDefForm = (): Promise<INAODefForm> => {
    return this.naoDefFormService.read(1)
      .then((df: INAODefForm): INAODefForm => {
        this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'NAODefForm', df) });
        return df;
      })
      .catch((err) => {
        if (this.onError) this.onError(`Error loading DefForm lookup data`, err.message);
        return null;
      });
  }

  protected loadLookups(): Promise<any> {
    return Promise.all([
      this.welcomeAccess(),
      this.loadDefForm(),
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


