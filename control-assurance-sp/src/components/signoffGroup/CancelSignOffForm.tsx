import * as React from 'react';
import { IEntityFormProps, IFForm, FForm, IUser } from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '.././cr/FormButtons';
import { UpdateHeader } from '.././cr/UpdateHeader';
import { ConfirmDialog } from '.././cr/ConfirmDialog';

export interface ICancelSignOffFormProps extends IEntityFormProps {
    formId: number;
    form: IFForm;
    title?: string;
    cancelSignoffText?: string;
    onCancelSignOff: () => void;
}

export class CancelSignOffFormState {
    public ShowForm = false;
    public ShowConfirmDialog = false;
}

export default class CancelSignOffForm extends React.Component<ICancelSignOffFormProps, CancelSignOffFormState> {
    private formService: services.FormService = new services.FormService(this.props.spfxContext, this.props.api);
    constructor(props: ICancelSignOffFormProps, state: CancelSignOffFormState) {
        super(props);
        this.state = new CancelSignOffFormState();
    }
    public render(): React.ReactElement<ICancelSignOffFormProps> {
        const { title, cancelSignoffText } = this.props;
        const { ShowForm } = this.state;
        return (
            <div className={styles.cr}>
                <UpdateHeader title={title} isOpen={ShowForm}
                    hideRagIndicator={true}
                    rag={null}
                    onClick={this.toggleProgressUpdateForm} />

                {ShowForm && <div className={`ms-scaleDownIn100`}>
                    {this.renderFormFields(cancelSignoffText)}
                    <ConfirmDialog hidden={!this.state.ShowConfirmDialog} title="Cancel Sign-Offs Confirmation" content="Are you sure you want to cancel sign-offs for this form?" confirmButtonText="Cancel Sign-Off" handleConfirm={this.saveUpdate} handleCancel={() => this.setState({ ShowConfirmDialog: false })} />
                    <FormButtons
                        primaryText="Cancel Sign-Offs"
                        onPrimaryClick={this.displayConfirm}
                        primaryDisabled={!this.enableCancelSignOff()}
                    />
                </div>}

            </div>
        );
    }

    private renderFormFields(cancelSignoffText?: string) {
        return (
            <React.Fragment>
                {this.renderCancelSignOffText(cancelSignoffText)}
            </React.Fragment>
        );
    }
    private renderCancelSignOffText(cancelSignoffText: string) {

        if (cancelSignoffText != null && cancelSignoffText != "")
            return (
                <div style={{ marginTop: 10, marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: cancelSignoffText }}></div>
            );
    }

    private enableCancelSignOff(): boolean {
        if (this.props.form.LastSignOffFor === "Dir") {
            return true;
        }
        return false;
    }

    //#region Form initialisation

    public componentDidMount(): void {
    }

    public componentDidUpdate(prevProps: ICancelSignOffFormProps): void {
        if (prevProps.formId !== this.props.formId) {
        }
    }

    //#endregion

    //#region Validations

    protected validateEntityUpdate = (): boolean => {
        return true;
    }
    //#endregion

    //#region Form infrastructure


    protected displayConfirm = (): void => {
        this.setState({ ShowConfirmDialog: true });
    }

    protected onAfterSave(): void {
        this.props.onCancelSignOff();
    }

    protected saveUpdate = (): void => {

        this.setState({ ShowConfirmDialog: false });
        if (this.validateEntityUpdate()) {

            let formUpdate = new FForm();
            formUpdate.ID = this.props.form.ID;
            formUpdate.LastSignOffFor = "CLEAR_SIGN-OFFS"; //special value for just passing to the api, so api cancels sign-offs
            delete formUpdate.PeriodId;
            delete formUpdate.TeamId;
            delete formUpdate.DefFormId;
            delete formUpdate.Title;
            delete formUpdate.DDSignOffStatus;
            delete formUpdate.DDSignOffUserId;
            delete formUpdate.DDSignOffDate;
            delete formUpdate.DirSignOffStatus;
            delete formUpdate.DirSignOffUserId;
            delete formUpdate.DirSignOffDate;
            this.formService.update(formUpdate.ID, formUpdate).then((): void => {
                this.onAfterSave();
                if (this.props.onError)
                    this.props.onError(null);
                if (this.props.onSaved)
                    this.props.onSaved();
            }, (err) => {
                if (this.props.onError)
                    this.props.onError(`Error saving update`, err.message);
            });
        }
    }

    protected cancelUpdate = (): void => {
    }

    protected toggleProgressUpdateForm = (): void => {
        this.setState({ ShowForm: !this.state.ShowForm });
    }

    //#endregion
}
