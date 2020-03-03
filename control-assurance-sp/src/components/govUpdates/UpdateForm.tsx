import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup, IChoiceGroupOption } from '../cr/CrChoiceGroup';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { CrCheckbox } from '../cr/CrCheckbox';
import { FormButtons } from '../cr/FormButtons';
import { MessageDialog } from '../cr/MessageDialog';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import styles from '../../styles/cr.module.scss';
import { IGoElement, GoElement, IGoDefElement } from '../../types';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import EntityList from '../entity/EntityList';
import { ElementStatuses } from '../../types/AppGlobals';

export interface IUpdateFormProps extends types.IBaseComponentProps {
    //policyID: number;
    //onShowList: () => void;
    //filteredItems: any[];
    goDefElementId: number;
    goElementId: number;
    goFormId: number;
    defElementTitle: string;
    onShowList: () => void;
}

export interface IUpdateFormState {
    Loading: boolean;
    FormData: IGoElement;
    //FormData: IPolicy;
    //LookupData: IPolicyLookupData;
    //FormIsDirty: boolean;
}

export class UpdateFormState implements IUpdateFormState {
    public Loading = false;
    public FormData: IGoElement;

    constructor(goFormId: number, goDefElementId: number) {
        this.FormData = new GoElement(goFormId, goDefElementId);
    }
    //public FormData = null;
    //public LookupData = null;
    //public FormIsDirty = false;

}

export default class UpdateForm extends React.Component<IUpdateFormProps, IUpdateFormState> {

    private goElementService: services.GoElementService = new services.GoElementService(this.props.spfxContext, this.props.api);
    private goDefElementService: services.GoDefElementService = new services.GoDefElementService(this.props.spfxContext, this.props.api);

    private redIcon: string = require('../../images/Red4340.png');
    private amberIcon: string = require('../../images/Amber4340.png');
    private yellowIcon: string = require('../../images/Yellow4340.png');
    private greenIcon: string = require('../../images/Green4340.png');

    constructor(props: IUpdateFormProps, state: IUpdateFormState) {
        super(props);
        this.state = new UpdateFormState(this.props.goFormId, this.props.goDefElementId);
    }

    public render(): React.ReactElement<IUpdateFormProps> {

        return (
            <React.Fragment>
                {
                    //true
                    (this.state.FormData.ID > 0) && this.state.FormData.GoDefElement
                    && <div className={styles.cr}>
                        {this.renderSectionTitle()}
                        {this.renderInstructions()}
                        {this.renderEvidenceStatement()}
                        {this.renderRatingRadioChoices()}
                        {this.renderActionsList()}
                        {this.renderFeedbacksList()}
                        {this.renderMarkAsReadyCheckbox()}
                        {this.renderFormButtons()}

                    </div>}



            </React.Fragment>
        );
    }


    private renderSectionTitle() {
        return (
            <React.Fragment>
                <h1 style={{  fontSize: '48px' }}>{this.props.defElementTitle}</h1>
            </React.Fragment>
        );
    }
    private renderInstructions() {

        const shortInstructions: string = this.state.FormData.GoDefElement.Instructions;
        return (
            <React.Fragment>
                <div style={{ marginBottom: '30px' }} className={styles.sectionATitle}>Instructions</div>
                <div>{shortInstructions}</div>
                <div>
                    <span style={{ textDecoration: 'underline', color: 'rgb(0,162,232)', cursor: 'pointer' }}
                    // onClick={() => this.showHelpPanel(detailedInstructions)}
                    >Show Detailed Instructions</span>
                </div>
            </React.Fragment>
        );
    }
    private renderEvidenceStatement() {

        return (
            <React.Fragment>
                <div style={{ marginTop: '30px', marginBottom: '15px' }} className={styles.sectionATitle}>Evidence</div>
                <div style={{ fontWeight: "bold", marginBottom: '10px' }}>Please provide your statement of evidence below</div>
                <CrTextField
                    multiline
                    placeholder="Enter details ..."
                    rows={10}
                    maxLength={2000}
                    charCounter={true}
                    onChanged={(v) => this.changeTextField(v, "EvidenceStatement")}
                    value={this.state.FormData.EvidenceStatement}
                />
            </React.Fragment>
        );
    }

    private renderRatingRadioChoices() {

        return (
            <React.Fragment>

                <div style={{ fontWeight: "bold", marginBottom: '10px' }}>Assurance Rating</div>
                <CrChoiceGroup
                    options={[
                        { key: '1', imageSrc: this.redIcon, selectedImageSrc: this.redIcon, text: 'Unsatisfactory', imageSize: { width: 44, height: 40 } },
                        { key: '2', imageSrc: this.yellowIcon, selectedImageSrc: this.yellowIcon, text: 'Limited', imageSize: { width: 44, height: 40 } },
                        { key: '3', imageSrc: this.amberIcon, selectedImageSrc: this.amberIcon, text: 'Moderate', imageSize: { width: 44, height: 40 } },
                        { key: '4', imageSrc: this.greenIcon, selectedImageSrc: this.greenIcon, text: 'Substantial', imageSize: { width: 44, height: 40 } },

                    ]}
                    selectedKey={this.state.FormData.Rating}
                    onChange={(ev, option) => this.changeChoiceGroup(ev, option, "Rating")}
                />

            </React.Fragment>
        );
    }

    private renderActionsList() {
        const listColumns: IGenColumn[] = [
            {
                key: 'GoElementId',
                columnDisplayType: ColumnDisplayType.FormOnly,
                fieldDisabled: true,
                fieldHiddenInForm: true,
                fieldDefaultValue: this.state.FormData.ID,
                columnType: ColumnType.TextBox,
                name: 'GoElementId',
                fieldName: 'GoElementId',
                minWidth: 1,
                isResizable: true,
                isRequired: true,
            },
            {
                key: 'Title',
                columnType: ColumnType.TextBox,
                isMultiline: true,
                name: 'Action',
                fieldName: 'Title',
                minWidth: 120,
                maxWidth: 120,
                isResizable: true,
                isRequired: true,
                fieldMaxLength: 500,
                headerClassName: styles.bold,
            },

            {
                key: 'Timescale',
                columnType: ColumnType.TextBox,
                isMultiline: true,
                name: 'Timescale',
                fieldName: 'Timescale',
                minWidth: 120,
                maxWidth: 120,
                isResizable: true,
                isRequired: true,
                fieldMaxLength: 100,
                headerClassName: styles.bold,
            },
            {
                key: 'Owner',
                columnType: ColumnType.TextBox,
                isMultiline: true,
                name: 'Owner',
                fieldName: 'Owner',
                minWidth: 120,
                maxWidth: 120,
                isResizable: true,
                isRequired: true,
                fieldMaxLength: 100,
                headerClassName: styles.bold,
            },
            {
                key: 'Progress',
                columnType: ColumnType.TextBox,
                isMultiline: true,
                numRows: 5,
                name: 'Progress',
                fieldName: 'Progress',
                minWidth: 120,
                isResizable: true,
                isRequired: true,
                fieldMaxLength: 2000,
                headerClassName: styles.bold,
            },



        ];

        return (
            <React.Fragment>
                <div style={{ marginTop: '30px', fontWeight: "bold", marginBottom: '10px' }}>Action Plan</div>
                <div style={{ minHeight: '120px', border: '1px solid rgb(166,166,166)' }}>
                    <EntityList
                        entityReadAllWithArg1={this.state.FormData.ID}
                        allowAdd={true}
                        columns={listColumns}
                        {...this.props}
                        onError={this.props.onError}
                        entityService={new services.GoElementActionService(this.props.spfxContext, this.props.api)}
                        entityNamePlural="Actions"
                        entityNameSingular="Action"
                        childEntityNameApi=""
                        childEntityNamePlural=""
                        childEntityNameSingular=""
                        zeroMarginTop={true}
                        hideTitleBelowCommandBar={true}
                    />
                </div>

            </React.Fragment>
        );

    }


    private renderFeedbacksList() {
        const listColumns: IGenColumn[] = [
            {
                key: 'GoElementId',
                columnDisplayType: ColumnDisplayType.FormOnly,
                fieldDisabled: true,
                fieldHiddenInForm: true,
                fieldDefaultValue: this.state.FormData.ID,
                columnType: ColumnType.TextBox,
                name: 'GoElementId',
                fieldName: 'GoElementId',
                minWidth: 1,
                isResizable: true,
                isRequired: true,
            },
            {
                key: 'UserUsername',
                columnType: ColumnType.DisplayInListOnly,
                name: 'Comment By',
                fieldName: 'UserUsername',
                isParent: true,
                parentEntityName: 'User',
                parentColumnName: 'Title',
                minWidth: 120,
                maxWidth: 120,
                isResizable: true,
                isRequired: true,
                headerClassName: styles.bold,
            },
            {
                key: 'CommentDate',
                columnType: ColumnType.DatePicker,
                showDateAndTimeInList: true,
                columnDisplayType: ColumnDisplayType.ListOnly,
                name: 'Date/Time',
                fieldName: 'CommentDate',
                minWidth: 120,
                maxWidth: 120,
                isResizable: true,
                fieldMaxLength: 100,
                headerClassName: styles.bold,
            },

            {
                key: 'Comment',
                columnType: ColumnType.TextBox,
                name: 'Comment',
                fieldName: 'Comment',
                minWidth: 300,
                isResizable: true,
                isRequired: true,
                fieldMaxLength: 1000,
                headerClassName: styles.bold,
            },



        ];

        return (
            <React.Fragment>
                <div style={{ marginTop: '30px', fontWeight: "bold", marginBottom: '10px' }}>Feedback and General Comments</div>
                <div style={{ minHeight: '120px', border: '1px solid rgb(166,166,166)' }}>
                    <EntityList
                        entityReadAllWithArg1={this.state.FormData.ID}
                        allowAdd={true}
                        columns={listColumns}
                        {...this.props}
                        onError={this.props.onError}
                        entityService={new services.GoElementFeedbackService(this.props.spfxContext, this.props.api)}
                        entityNamePlural="Comments"
                        entityNameSingular="Comment"
                        childEntityNameApi=""
                        childEntityNamePlural=""
                        childEntityNameSingular=""
                        zeroMarginTop={true}
                        hideTitleBelowCommandBar={true}
                    />
                </div>

            </React.Fragment>
        );

    }

    private renderMarkAsReadyCheckbox() {

        return (
            <div>

                <CrCheckbox
                    className={`${styles.formField} ${styles.checkbox}`}
                    label="Mark as ready for approval"
                    checked={this.state.FormData.MarkReadyForApproval}
                    onChange={(ev, isChecked) => this.changeCheckbox(isChecked, "MarkReadyForApproval")}
                    disabled={!this.validateForStatus()}

                />

            </div>
        );
    }

    private renderFormButtons() {

        return (
            <div>
                <PrimaryButton text="Save &amp; Close" className={styles.formButton} style={{ marginRight: '5px' }}
                    onClick={() => this.onBeforeSave(false)}
                />

                {/* <DefaultButton text="Cancel" className={styles.formButton} style={{ marginRight: '40px' }}
                    onClick={this.handleCancel}
                />

                <PrimaryButton text="Save/Next" className={styles.formButton} style={{ marginRight: '5px' }}
                    onClick={() => this.handleSave(true)}
                />

                <DefaultButton text="Cancel/Next" className={styles.formButton}
                    onClick={() => this.showNextPolicy()}
                /> */}

            </div>
        );


    }


    //#region Data Load/Save



    private loadGoElement = (): Promise<IGoElement> => {
        if (this.props.goElementId > 0) {
            //console.log('in if');
            return this.goElementService.readWithExpandDefElement(this.props.goElementId).then((e: IGoElement) => {
                console.log('GoElement: ', e);
                this.setState({ FormData: e });
                return e;

            }, (err) => {
                if (this.props.onError) this.props.onError(`Error loading GoElement`, err.message);
            });
        }
        else {

            //console.log('in else');
            //add record in db
            const formData: IGoElement = this.state.FormData;
            delete formData.ID;
            delete formData.GoDefElement;
            delete formData.GoForm;

            this.goElementService.create(formData).then((fdAfterSave: IGoElement): void => {

                this.goElementService.readWithExpandDefElement(fdAfterSave.ID).then((e: IGoElement) => {
                    console.log('GoElement after create new: ', e);
                    this.setState({ FormData: e });

                }, (err) => { });

            }, (err) => {
            });

            return null;
        }

    }

    private loadLookups(): Promise<any> {

        return Promise.all([
            this.loadGoElement(),
        ]);
    }

    private loadUpdates = (): void => {
        this.setState({ Loading: true });
        let loadingPromises = [this.loadLookups()];

        Promise.all(loadingPromises).then(this.onLoaded, this.onErrorLoading);
    }

    private onLoaded = (loadedData: any[]): void => {
        this.setState({ Loading: false });
    }

    private onErrorLoading = (): void => {
        this.setState({ Loading: false });
    }
    public componentDidMount(): void {
        this.loadUpdates();
    }
    protected validateForStatus = (): boolean => {
        if (this.state.FormData.Rating === null) {
            return false;
        }
        if (this.state.FormData.EvidenceStatement && this.state.FormData.EvidenceStatement.length >= 10) {
            //true
        }
        else {
            return false;
        }
        return true;
    }

    protected onBeforeSave = (showNext: boolean): void => {

        let completionStatus: string = ElementStatuses.InProgress; //taking as default
        let markReadyForApproval: boolean = this.state.FormData.MarkReadyForApproval;

        const completed: boolean = this.validateForStatus();
        if (completed === true) {
            if (markReadyForApproval === true) {
                completionStatus = ElementStatuses.Completed;
            }

        }
        else {
            completionStatus = ElementStatuses.InProgress;
            //also uncheck the mark as ready checkbox
            markReadyForApproval = false;
        }


        const newFormData = { ...this.state.FormData, "CompletionStatus": completionStatus, "MarkReadyForApproval": markReadyForApproval };

        this.setState({ FormData: newFormData }, () => this.saveUpdate(showNext));

    }

    protected saveUpdate = (showNext: boolean): void => {

        if (this.validateEntityUpdate()) {
            //this.setState({ FormSaveStatus: SaveStatus.Pending });
            //this.onBeforeSave(this.state.FormData);
            const formData: IGoElement = { ...this.state.FormData };

            delete formData.GoDefElement;
            delete formData.GoForm;

            this.goElementService.update(formData.ID, formData).then((): void => {
                //console.log('saved..');

                if (this.props.onError)
                    this.props.onError(null);

                if (showNext === true) {
                    //this.showNext();
                }
                else {
                    //console.log('calling on show list ..');
                    this.props.onShowList();
                }


            }, (err) => {
                if (this.props.onError)
                    this.props.onError(`Error saving Element update`, err.message);
            });


        }
    }

    protected validateEntityUpdate = (): boolean => {
        return true;
    }

    //#endregion Data Load/Save


    //#region Event Handlers

    protected changeChoiceGroup = (ev, option: IChoiceGroupOption, f: string): void => {
        const selectedKey = option.key;
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, selectedKey)/*, FormIsDirty: true*/ });

    }
    protected changeTextField = (value: string, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value)/*, FormIsDirty: true*/ });
    }
    protected changeCheckbox = (value: boolean, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value)/*, FormIsDirty: true*/ });
    }

    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }

    //#endregion Event Handlers

}
