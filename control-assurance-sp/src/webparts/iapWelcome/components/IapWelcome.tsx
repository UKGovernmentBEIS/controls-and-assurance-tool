import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import { IIAPDefForm } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination

export interface ILookupData {
  IAPDefForm: IIAPDefForm;
}

export class LookupData implements ILookupData {
  public IAPDefForm: IIAPDefForm;
}

export interface IIAPWelcomeState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
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

  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new IAPWelcomeState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (
      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="Management Actions - Welcome">
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
        <h1 className='ms-font-xl'>{lookups.IAPDefForm && lookups.IAPDefForm.Title}</h1>
        <div dangerouslySetInnerHTML={{ __html: lookups.IAPDefForm && lookups.IAPDefForm.Details }}></div>
        <br />
        <PrimaryButton
          text="Start / View"
          onClick={this.handleUpdatesClick}
        />
        <br /><br />
      </div>
    );
  }

  //#endregion Render


  //#region Data Load

  private welcomeAccess = (): void => {
    this.iapDefFormService.welcomeAccess().then((res: string): void => {
      console.log('welcome accessed');
    }, (err) => {
    });
  }

  protected loadDefForm = (): Promise<IIAPDefForm> => {
    return this.iapDefFormService.read(1)
      .then((df: IIAPDefForm): IIAPDefForm => {
        this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'IAPDefForm', df) });
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
    const pageUrl = this.props.spfxContext.pageContext.web.absoluteUrl + "/SitePages/IAPUpdates.aspx";
    window.location.href = pageUrl;
  }

  //#endregion event handlers

}


