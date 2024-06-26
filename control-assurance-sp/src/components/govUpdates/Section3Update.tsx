import * as React from 'react';
import { IEntityFormProps, IUser, IGoDefForm, IGoForm } from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '.././cr/FormButtons';
import { UpdateHeader2 } from '.././cr/UpdateHeader2';
import { ConfirmDialog } from '.././cr/ConfirmDialog';

export interface ISection3UpdateProps extends IEntityFormProps {
    goDefForm: IGoDefForm;
    goForm: IGoForm;
    onSignOff: () => void;
    canSignOff: boolean;
    canUnSign: boolean;
}

export class Section3UpdateState {
    public ShowForm = false;
    public ShowSignOffConfirmDialog = false;
    public ShowUnSignConfirmDialog = false;
    public DGSignOffName: string = null;
}

export default class Section3Update extends React.Component<ISection3UpdateProps, Section3UpdateState> {
    private goformService: services.GoFormService = new services.GoFormService(this.props.spfxContext, this.props.api);
    private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);
    constructor(props: ISection3UpdateProps, state: Section3UpdateState) {
        super(props);
        this.state = new Section3UpdateState();
    }

    public render(): React.ReactElement<ISection3UpdateProps> {

        const { Section3Title, DGSignOffText } = this.props.goDefForm;
        const { ShowForm } = this.state;
        console.log("can unsign", this.props.canUnSign);
        return (
            <div className={styles.cr}>
                <UpdateHeader2 title={Section3Title} isOpen={ShowForm}
                    leadUser=""
                    rag={this.getRag()}
                    ragLabel={this.getRagLabel()}
                    onClick={this.toggleProgressUpdateForm} />

                {ShowForm && <div className={`ms-scaleDownIn100`}>
                    <div>
                        {this.renderSignOffText(DGSignOffText)}
                        <ConfirmDialog hidden={!this.state.ShowSignOffConfirmDialog} title="Sign-Off Confirmation" content="Are you sure you want to sign-off this form?" confirmButtonText="Sign-Off" handleConfirm={this.saveSignOff} handleCancel={() => this.setState({ ShowSignOffConfirmDialog: false })} />
                        <ConfirmDialog hidden={!this.state.ShowUnSignConfirmDialog} title="Un-Sign Confirmation" content="Are you sure you want to un-sign this form?" confirmButtonText="Un-Sign" handleConfirm={this.saveUnSign} handleCancel={() => this.setState({ ShowUnSignConfirmDialog: false })} />
                        <FormButtons
                            primaryText="Sign off as Director General"
                            onPrimaryClick={() => { this.setState({ ShowSignOffConfirmDialog: true }); }}
                            primaryDisabled={!this.enableSignOff()}
                            primary2Text="Un-Sign"
                            onPrimary2Click={(this.props.canUnSign === false || this.props.goForm.DGSignOffStatus !== "Completed") ? null : () => { this.setState({ ShowUnSignConfirmDialog: true }); }}
                        />
                    </div>
                </div>}

            </div>
        );
    }

    private renderSignOffText(signoffText: string) {
        let signedOffBy = "";
        if (this.state.DGSignOffName != null) {
            signedOffBy = `<br/><br/>Signed off by ${this.state.DGSignOffName} on ${services.DateService.dateToUkDate(this.props.goForm.DGSignOffDate)} at ${services.DateService.dateToUkTime(this.props.goForm.DGSignOffDate)}`;
        }

        if (signoffText != null && signoffText != "")
            return (
                <div style={{ marginTop: 10, marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: signoffText + signedOffBy }}></div>
            );
    }

    private enableSignOff(): boolean {
        if (this.props.goForm.DGSignOffStatus === "WaitingSignOff") {
            if (this.props.canSignOff === true)
                return true;
        }
        return false;
    }

    private saveSignOff = (): void => {

        this.setState({ ShowSignOffConfirmDialog: false });
        const goFormId = this.props.goForm.ID;
        this.goformService.signOffForm(goFormId).then((res: string): void => {

            console.log('signed-off');
            this.props.onSignOff();

        }, (err) => {
            if (this.props.onError)
                this.props.onError(`Error saving sign-off`, err.message);
        });
    }

    private saveUnSign = (): void => {

        this.setState({ ShowUnSignConfirmDialog: false });
        const goFormId = this.props.goForm.ID;
        this.goformService.unSignForm(goFormId).then((res: string): void => {

            console.log('un-signed');
            this.props.onSignOff();

        }, (err) => {
            if (this.props.onError)
                this.props.onError(`Error saving unsign`, err.message);
        });
    }

    private getRagLabel(): string {

        if (this.props.goForm.DGSignOffStatus === "WaitingSignOff") {
            return "Require SignOff";
        }
        else if (this.props.goForm.DGSignOffStatus === "Completed") {
            return "Signed Off";
        }
        else {
            return "N/A";
        }
    }

    private getRag(): number {

        if (this.props.goForm.DGSignOffStatus === "WaitingSignOff") {
            return 3;
        }
        else if (this.props.goForm.DGSignOffStatus === "Completed") {
            return 5;
        }
        else {
            return null;
        }
    }

    //#region Form initialisation

    public componentDidMount(): void {
        this.loadUserInfo();
    }

    public componentDidUpdate(prevProps: ISection3UpdateProps): void {
        if (prevProps.goForm !== this.props.goForm) {
            console.log("section3-componentDidUpdate called");
            this.loadUserInfo();
        }
    }

    private loadUserInfo = (): void => {

        if (this.props.goForm.DGSignOffStatus === "Completed") {

            this.userService.read(this.props.goForm.DGSignOffUserId).then((u: IUser): void => {
                this.setState({ DGSignOffName: u.Title });
            }, (err) => { });
        }
        else {
            this.setState({ DGSignOffName: null });
        }
    }


    //#endregion

    //#region Validations

    protected validateEntityUpdate = (): boolean => {
        return true;
    }

    //#endregion

    //#region Form infrastructure

    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }

    protected toggleProgressUpdateForm = (): void => {
        this.setState({ ShowForm: !this.state.ShowForm });
    }

    //#endregion
}
