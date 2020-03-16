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
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import styles from '../../styles/cr.module.scss';
import { IGoElement, GoElement, IGoDefElement } from '../../types';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import EntityList from '../entity/EntityList';
import EvidenceList from './section2/EvidenceList';
import { ElementStatuses } from '../../types/AppGlobals';

export interface IUpdateFormProps extends types.IBaseComponentProps {

    filteredItems: any[];
    goElementId: number;
    onShowList: () => void;
    isViewOnly: boolean;
}

export interface IUpdateFormState {
    Loading: boolean;
    FormData: IGoElement;
    Evidence_ListFilterText: string;
    UserHelpText: string;
    ShowHelpPanel: boolean;
    GoElementId: number;
    HideNoElementsMessage: boolean;
    HideNextButton:boolean;
    //LookupData: IPolicyLookupData;
    //FormIsDirty: boolean;
}

export class UpdateFormState implements IUpdateFormState {
    public Loading = false;
    public FormData: IGoElement;
    public Evidence_ListFilterText: string = null;
    public UserHelpText: string = null;
    public ShowHelpPanel: boolean = false;
    public GoElementId: number = 0;
    public HideNoElementsMessage: boolean = true;
    public HideNextButton:boolean = false;

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

    private ratingIcon1: string = require('../../images/goelement/form/1.png');
    private ratingIcon2: string = require('../../images/goelement/form/2.png');
    private ratingIcon3: string = require('../../images/goelement/form/3.png');
    private ratingIcon4: string = require('../../images/goelement/form/4.png');
    private ratingIcon5: string = require('../../images/goelement/form/5.png');
    private ratingIcon6: string = require('../../images/goelement/form/6.png');
    private ratingIcon7: string = require('../../images/goelement/form/7.png');
    private ratingIcon8: string = require('../../images/goelement/form/8.png');
    private ratingIcon9: string = require('../../images/goelement/form/9.png');


    constructor(props: IUpdateFormProps, state: IUpdateFormState) {
        super(props);
        //this.state = new UpdateFormState(this.props.goFormId, this.props.goDefElementId);
        this.state = new UpdateFormState(0, 0);

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
                        {this.renderEvidencesList()}
                        {this.renderActionsList()}
                        {this.renderFeedbacksList()}
                        {this.renderMarkAsReadyCheckbox()}
                        {this.renderFormButtons()}

                        <Panel isOpen={this.state.ShowHelpPanel} headerText="" type={PanelType.medium} onDismiss={this.hideHelpPanel} >
                            <div dangerouslySetInnerHTML={{ __html: this.state.UserHelpText }}></div>
                        </Panel>

                        <MessageDialog hidden={this.state.HideNoElementsMessage} title="Information" content="This is the last specific area in your list." handleOk={() => { this.setState({ HideNoElementsMessage: true }); }} />

                    </div>}



            </React.Fragment>
        );
    }


    private renderSectionTitle() {
        return (
            <React.Fragment>
                <h1 style={{ fontFamily: 'Calibri', fontSize: '36px' }}>{this.state.FormData.GoDefElement.Title}</h1>
            </React.Fragment>
        );
    }
    private renderInstructions() {

        const { Instructions: shortInstructions, FullInstructions: detailedInstructions } = this.state.FormData.GoDefElement;
        return (
            <React.Fragment>
                <div style={{ marginBottom: '30px' }} className={styles.sectionATitle}>Instructions</div>
                <div>{shortInstructions}</div>
                <div>
                    <span style={{ textDecoration: 'underline', color: 'rgb(0,162,232)', cursor: 'pointer' }}
                        onClick={() => this.showHelpPanel(detailedInstructions)}
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

        const ragRatingStyle: number = this.state.FormData.GoDefElement.RagRatingStyle;
        console.log('rag rating style ', ragRatingStyle);
        let options: IChoiceGroupOption[] = [];

        if (ragRatingStyle === 2) {
            options = [
                { key: '5', imageSrc: this.ratingIcon5, selectedImageSrc: this.ratingIcon5, text: 'Red', imageSize: { width: 44, height: 40 } },
                { key: '6', imageSrc: this.ratingIcon6, selectedImageSrc: this.ratingIcon6, text: 'Red/Amber', imageSize: { width: 44, height: 40 } },
                { key: '7', imageSrc: this.ratingIcon7, selectedImageSrc: this.ratingIcon7, text: 'Amber', imageSize: { width: 44, height: 40 } },
                { key: '8', imageSrc: this.ratingIcon8, selectedImageSrc: this.ratingIcon8, text: 'Amber/Green', imageSize: { width: 44, height: 40 } },
                { key: '9', imageSrc: this.ratingIcon9, selectedImageSrc: this.ratingIcon9, text: 'Green', imageSize: { width: 44, height: 40 } },

            ];

        }
        else {
            //1 or default
            options = [
                { key: '1', imageSrc: this.ratingIcon1, selectedImageSrc: this.ratingIcon1, text: 'Unsatisfactory', imageSize: { width: 44, height: 40 } },
                { key: '2', imageSrc: this.ratingIcon2, selectedImageSrc: this.ratingIcon2, text: 'Limited', imageSize: { width: 44, height: 40 } },
                { key: '3', imageSrc: this.ratingIcon3, selectedImageSrc: this.ratingIcon3, text: 'Moderate', imageSize: { width: 44, height: 40 } },
                { key: '4', imageSrc: this.ratingIcon4, selectedImageSrc: this.ratingIcon4, text: 'Substantial', imageSize: { width: 44, height: 40 } },

            ];
        }



        return (
            <React.Fragment>

                <div style={{ fontWeight: "bold", marginBottom: '10px' }}>Assurance Rating</div>
                <CrChoiceGroup
                    options={options}
                    selectedKey={this.state.FormData.Rating}
                    onChange={(ev, option) => this.changeChoiceGroup(ev, option, "Rating")}
                />

            </React.Fragment>
        );
    }

    private renderEvidencesList() {

        return (
            <React.Fragment>
                <div style={{ marginTop: '30px', fontWeight: "bold", marginBottom: '10px' }}>List evidence documents</div>
                <div style={{ minHeight: '120px', border: '1px solid rgb(166,166,166)' }}>
                    <EvidenceList
                        isViewOnlyGoForm={this.props.isViewOnly}
                        goElementId={this.state.FormData.ID}
                        filterText={this.state.Evidence_ListFilterText}
                        onChangeFilterText={this.handleEvidence_ChangeFilterText}
                        {...this.props}
                        onError={this.props.onError}

                    />
                </div>

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
                minWidth: 220,
                maxWidth: 220,
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
                        allowAdd={!this.props.isViewOnly}
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
                isMultiline: true,
                numRows: 5,
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

        if (this.props.isViewOnly === false) {

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
        else
            return null;

    }

    private renderFormButtons() {

        return (
            <div>

                {(this.props.isViewOnly === false) &&
                    <React.Fragment>
                        { (this.state.HideNextButton === false) && <PrimaryButton text="Save &amp; Next" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.onBeforeSave(true)}
                        />}

                        <PrimaryButton text="Save &amp; Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.onBeforeSave(false)}
                        />

                        <DefaultButton text="Cancel" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={this.props.onShowList}
                        />


                    </React.Fragment>
                }

                {(this.props.isViewOnly === true) &&
                    <div style={{ marginTop: '20px' }}>
                        { (this.state.HideNextButton === false) && <PrimaryButton text="Next" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.showNext()}
                        />}

                        <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={this.props.onShowList}
                        />
                    </div>
                }

            </div>
        );


    }


    //#region Data Load/Save



    // private loadGoElement = (): Promise<IGoElement> => {
    //     if (this.props.goElementId > 0) {
    //         //console.log('in if');
    //         return this.goElementService.readWithExpandDefElement(this.props.goElementId).then((e: IGoElement) => {
    //             console.log('GoElement: ', e);
    //             this.setState({ FormData: e });
    //             return e;

    //         }, (err) => {
    //             if (this.props.onError) this.props.onError(`Error loading GoElement`, err.message);
    //         });
    //     }
    //     else {

    //         //console.log('in else');
    //         //add record in db
    //         const formData: IGoElement = this.state.FormData;
    //         delete formData.ID;
    //         delete formData.GoDefElement;
    //         delete formData.GoForm;
    //         delete formData.GoAssignments;

    //         this.goElementService.create(formData).then((fdAfterSave: IGoElement): void => {

    //             this.goElementService.readWithExpandDefElement(fdAfterSave.ID).then((e: IGoElement) => {
    //                 console.log('GoElement after create new: ', e);
    //                 this.setState({ FormData: e });

    //             }, (err) => { });

    //         }, (err) => {
    //         });

    //         return null;
    //     }

    // }

    private loadGoElement = (firstLoad: boolean): Promise<IGoElement> => {

        return this.goElementService.readWithExpandDefElement(this.state.GoElementId).then((e: IGoElement) => {
            console.log('GoElement: ', e);
            if (firstLoad === false) {
                //if we need to send info to parent component after loading next goElement- do it here
            }

            //check if this is the last record or not in the props.filteredItems
            const lastGoElementId_FilteredItems:number = Number(this.props.filteredItems[this.props.filteredItems.length-1]["GoElementId"]);
            const goElementId_Current:number = Number(this.state.GoElementId);
            let hideNextButton:boolean = false;
            if(goElementId_Current === lastGoElementId_FilteredItems){
                //console.log("This is the last one...");
                hideNextButton = true;

            }


            this.setState({ FormData: e, HideNextButton: hideNextButton });
            return e;

        }, (err) => {
            if (this.props.onError) this.props.onError(`Error loading GoElement`, err.message);
        });




    }

    private loadLookups(): Promise<any> {

        return Promise.all([
            //any data load should go here before loading the GoElement
        ]);

        // return Promise.all([
        //     this.loadGoElement(),
        // ]);
    }




    public componentDidMount(): void {
        //this.loadUpdates();
        this.setState({ Loading: true, GoElementId: this.props.goElementId }, this.callBackFirstLoad

        );
    }
    private callBackFirstLoad = (): void => {
        let loadingPromises = [this.loadLookups()];
        if (this.state.GoElementId > 0) {
            loadingPromises.push(this.loadGoElement(true));
        }
        Promise.all(loadingPromises).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));
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
            delete formData.GoAssignments;

            this.goElementService.update(formData.ID, formData).then((): void => {
                //console.log('saved..');

                if (this.props.onError)
                    this.props.onError(null);

                if (showNext === true) {
                    this.showNext();
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

    private showNext = (): void => {

        const currentGoElementID: number = Number(this.state.GoElementId);
        //console.log("filtered items", this.props.filteredItems);
        //console.log("current GoElementId", currentGoElementID);
        let currentIDFound: boolean = false;
        let nextGoElementID: number = 0;




        for (let i = 0; i < this.props.filteredItems.length; i++) {
            let e: any = this.props.filteredItems[i];
            const id: number = Number(e["GoElementId"]);

            if (id === currentGoElementID) {
                currentIDFound = true;
                //console.log("if condition", id, currentGoElementID);
                continue;

            }
            if (currentIDFound === true) {
                nextGoElementID = id;
                console.log("nextGoElementID", nextGoElementID);
                break;
            }

        }

        if (nextGoElementID > 0) {
            this.setState({
                GoElementId: nextGoElementID,
            }, () => this.loadGoElement(false));
        }
        else {

            //this condition will not run cause we are already hiding next buttons
            this.setState({
                HideNoElementsMessage: false,
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

    private handleEvidence_ChangeFilterText = (value: string): void => {
        this.setState({ Evidence_ListFilterText: value });
    }

    //#endregion Event Handlers

    //#region Class Methods

    private showHelpPanel = (helpText: string) => {
        this.setState({ UserHelpText: helpText, ShowHelpPanel: true });
    }

    private hideHelpPanel = () => {
        this.setState({ ShowHelpPanel: false });
    }



    //#endregion Class Methods
}
