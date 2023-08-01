import * as React from 'react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as types from '../../../types';
import BaseUserContextWebPartComponent from '../../../components/BaseUserContextWebPartComponent';
import * as services from '../../../services';
import { ICLDefForm } from '../../../types';
import { CrLoadingOverlayWelcome } from '../../../components/cr/CrLoadingOverlayWelcome';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

//#region types defination

export interface ILookupData {
  CLDefForm: ICLDefForm;
}

export class LookupData implements ILookupData {
  public CLDefForm: ICLDefForm;
}

export interface ICLWelcomeState extends types.IUserContextWebPartState {
  LookupData: ILookupData;
}
export class CLWelcomeState extends types.UserContextWebPartState {
  public LookupData = new LookupData();
  constructor() {
    super();
  }
}

//#endregion types defination

export default class CLWelcome extends BaseUserContextWebPartComponent<types.IWebPartComponentProps, CLWelcomeState> {

  protected CLDefFormService: services.CLDefFormService = new services.CLDefFormService(this.props.spfxContext, this.props.api);

  constructor(props: types.IWebPartComponentProps) {
    super(props);
    this.state = new CLWelcomeState();
  }

  //#region Render

  public renderWebPart(): React.ReactElement<types.IWebPartComponentProps> {

    return (
      <Pivot onLinkClick={this.clearErrors}>
        <PivotItem headerText="CL Actions - Welcome">
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
        <h1 className='ms-font-xl'>{lookups.CLDefForm && lookups.CLDefForm.Title}</h1>
        <div dangerouslySetInnerHTML={{ __html: lookups.CLDefForm && lookups.CLDefForm.Details }}></div>
        <br />
        <PrimaryButton
          text="Start / View Updates"
          onClick={this.handleUpdatesClick}
        />
      </div>
    );
  }

  //#endregion Render


  //#region Data Load

  private welcomeAccess = (): void => {
    this.CLDefFormService.welcomeAccess().then((res: string): void => {
      console.log('welcome accessed');
    }, (err) => {
    });
  }

  protected loadDefForm = (): Promise<ICLDefForm> => {
    return this.CLDefFormService.read(1)
      .then((df: ICLDefForm): ICLDefForm => {
        this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'CLDefForm', df) });
        return df;
      })
      .catch(err => {
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
    const pageUrl = this.props.spfxContext.pageContext.web.absoluteUrl + "/SitePages/ContingentLabourProcesses.aspx";
    window.location.href = pageUrl;
  }

  //#endregion event handlers
}


