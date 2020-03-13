import * as React from 'react';
import { IEntityFormProps, IUser, IGoDefForm, GoForm, IGoForm, SectionStatus } from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '.././cr/FormButtons';
import { UpdateHeader2 } from '.././cr/UpdateHeader2';

import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup, IChoiceGroupOption } from '../cr/CrChoiceGroup';
import { CrCheckbox } from '../cr/CrCheckbox';

import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { ConfirmDialog } from '.././cr/ConfirmDialog';


export interface ISection1UpdateProps extends IEntityFormProps {
    //signoffFor: string;
    //formId: number;
    //form: IFForm;
    //title?: string;
    //signoffText?: string;
    //onSignOff: ()=> void;
    //canSignOffDDSection: boolean;
    //canSignOffDirSection: boolean;
    goDefForm: IGoDefForm;
    goForm: IGoForm;
    isViewOnly:boolean;
    //periodId: number;
    //directorateGroupId: number;
}

export class Section1UpdateState {
    public ShowForm = false;
    public ShowHelpPanel: boolean = false;
    public UserHelpText: string = null;
    public FormData:IGoForm;
    public Loading:boolean = false;

    constructor(periodId: number, directorateGroupId:number) {
        this.FormData = new GoForm(periodId, directorateGroupId);
    }

    //public ShowConfirmDialog = false;
    //public DDSignOffName: string = null;
    //public DirSignOffName: string = null;
}

export default class Section1Update extends React.Component<ISection1UpdateProps, Section1UpdateState> {
    private goFormService: services.GoFormService = new services.GoFormService(this.props.spfxContext, this.props.api);
    //private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);
    private redIcon: string = require('../../images/Red4340.png');
    private amberIcon: string = require('../../images/Amber4340.png');
    private yellowIcon: string = require('../../images/Yellow4340.png');
    private greenIcon: string = require('../../images/Green4340.png');

    constructor(props: ISection1UpdateProps, state: Section1UpdateState) {
        super(props);
        //this.state = new Section1UpdateState(this.props.periodId, this.props.directorateGroupId);
        this.state = new Section1UpdateState(this.props.goForm.PeriodId, this.props.goForm.DirectorateGroupId);
        //console.log("in constructor", this.props.formId);
    }

    public render(): React.ReactElement<ISection1UpdateProps> {

        //const {title, signoffText} = this.props;

        const { Section1Title } = this.props.goDefForm;

        const { ShowForm } = this.state;

        return (
            <div className={styles.cr}>
                <UpdateHeader2 title={Section1Title} isOpen={ShowForm}
                    leadUser=""
                    rag={ this.state.FormData.SummaryCompletionStatus === SectionStatus.Completed ? 5 : this.state.FormData.SummaryCompletionStatus === SectionStatus.InProgress ? 3 : null }
                    ragLabel={ this.state.FormData.SummaryCompletionStatus === SectionStatus.Completed ? "Completed" : this.state.FormData.SummaryCompletionStatus === SectionStatus.InProgress ? "In Progress" : null }
                    onClick={this.toggleProgressUpdateForm} />

                {ShowForm && <div className={`ms-scaleDownIn100`}>
                    {this.renderFormFields()}
                    { (this.props.isViewOnly===false) &&  <FormButtons
                        onPrimaryClick={() => this.onBeforeSave()}
                        primaryText="Save"
                        //primaryDisabled={(this.props.form.LastSignOffFor === "Dir" && this.props.form.DirSignOffStatus === true) ? true: (externalUserLoggedIn === true) ? true : (isArchivedPeriod === true) ? true : false}


                        onSecondaryClick={() => { }}

                    />}
                    <br /><br />
                    <Panel isOpen={this.state.ShowHelpPanel} headerText="" type={PanelType.medium} onDismiss={this.hideHelpPanel} >
                        <div dangerouslySetInnerHTML={{ __html: this.state.UserHelpText }}></div>
                    </Panel>
                </div>}


            </div>
        );
    }


    public renderFormFields() {

        const { SummaryShortInstructions, SummaryFullInstructions, SummaryFormRatingText } = this.props.goDefForm;

        return (
            <React.Fragment>
                {this.renderSectionTitle("Instructions", null)}
                {this.renderInstructions(SummaryShortInstructions, SummaryFullInstructions)}
                {this.renderSectionTitle("Evidence", null)}
                {this.renderFormRatingText(SummaryFormRatingText)}
                {this.renderRatingRadioChoices()}
                {this.renderEvidenceStatement()}
                {this.renderMarkAsReadyCheckbox()}
            </React.Fragment>
        );

    }

    private renderSectionTitle(title: string, userHelpId?: number) {
        if (title != null && title != "") {
            return (
                <React.Fragment>
                    <div style={{ marginTop: 30, marginBottom: 30 }} className={styles.flexContainerSectionQuestion}>
                        <div className={styles.sectionATitle}>{title}</div>
                        <div className={styles.sectionQuestionCol2}>
                            {/* { (userHelpId && userHelpId > 0) && <a style={{cursor: "pointer"}} onClick={()=> this.showHelpPanel(userHelpId)}><img src={this.helpIcon} /></a> } */}
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }

    private renderInstructions(shortInstructions: string, detailedInstructions) {

        return (
            <React.Fragment>
                <div>{shortInstructions}</div>
                <div>
                    <span style={{ textDecoration: 'underline', color: 'rgb(0,162,232)', cursor: 'pointer' }}
                        onClick={() => this.showHelpPanel(detailedInstructions)}
                    >Show Detailed Instructions</span>
                </div>
            </React.Fragment>
        );
    }

    private renderFormRatingText(textOrHtml: string) {

        return (
            <React.Fragment>
                <div style={{ fontWeight: "bold", marginBottom: '10px' }}>Assurance Rating</div>
                <div style={{ marginBottom: '10px' }} dangerouslySetInnerHTML={{ __html: textOrHtml }}></div>
            </React.Fragment>
        );
    }

    private renderRatingRadioChoices() {

        return (
            <React.Fragment>

                <CrChoiceGroup
                    options={[
                        { key: '1', imageSrc: this.redIcon, selectedImageSrc: this.redIcon, text: 'Unsatisfactory', imageSize: { width: 44, height: 40 } },
                        { key: '2', imageSrc: this.yellowIcon, selectedImageSrc: this.yellowIcon, text: 'Limited', imageSize: { width: 44, height: 40 } },
                        { key: '3', imageSrc: this.amberIcon, selectedImageSrc: this.amberIcon, text: 'Moderate', imageSize: { width: 44, height: 40 } },
                        { key: '4', imageSrc: this.greenIcon, selectedImageSrc: this.greenIcon, text: 'Substantial', imageSize: { width: 44, height: 40 } },

                    ]}
                selectedKey={this.state.FormData.SummaryRagRating}
                onChange={(ev, option) => this.changeChoiceGroup(ev, option, "SummaryRagRating")}
                />

            </React.Fragment>
        );



    }

    private renderEvidenceStatement() {

        return (
            <React.Fragment>
                <div style={{ fontWeight: "bold", marginBottom: '10px', marginTop: '20px' }}>Please provide your statement of evidence below</div>
                <CrTextField
                    multiline
                    placeholder="Enter details ..."
                    rows={10}
                    maxLength={2000}
                    charCounter={true}
                    onChanged={(v) => this.changeTextField(v, "SummaryEvidenceStatement")}
                    value={this.state.FormData.SummaryEvidenceStatement}
                />
            </React.Fragment>
        );
    }

    private renderMarkAsReadyCheckbox() {

        if(this.props.isViewOnly === false){

            return (
                <div>
    
                    <CrCheckbox
                        className={`${styles.formField} ${styles.checkbox}`}
                        label="Mark as ready for approval"
                        checked={this.state.FormData.SummaryMarkReadyForApproval}
                        onChange={(ev, isChecked) => this.changeCheckbox(isChecked, "SummaryMarkReadyForApproval")}
                        disabled={!this.validateForStatus()}
                    //disabled={(this.props.form.LastSignOffFor === "Dir" && this.props.form.DirSignOffStatus === true) === true}
                    />
    
                </div>
            );
        }
        else
            return null;

    }


    //#region Form initialisation

    public componentDidMount(): void {
        //console.log('section1 componentDidMount');
        console.log("section 1 componentDidMount");
        console.log("goForm", this.props.goForm);
        //this.loadUpdates();
        const fd = this.props.goForm;
        this.setState({ FormData: fd });
    }

    public componentDidUpdate(prevProps: ISection1UpdateProps): void {
        if(prevProps.goForm !== this.props.goForm){
            console.log("section 1 componentDidUpdate");
            console.log("goForm", this.props.goForm);
            const fd = {...this.props.goForm};
            this.setState({ FormData: fd });

        }
        // if (prevProps.PeriodId !== this.props.PeriodId || prevProps.DirectorateGroupId !== this.props.DirectorateGroupId){
        //     this.loadUpdates();
        // }
    }




    //#endregion



    //#region Validations

    protected validateEntityUpdate = (): boolean => {
        return true;
    }



    //#endregion

    //#region Form infrastructure

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

    protected toggleProgressUpdateForm = (): void => {
        this.setState({ ShowForm: !this.state.ShowForm });
    }

    protected showHelpPanel = (helpText: string) => {
        this.setState({ UserHelpText: helpText, ShowHelpPanel: true });
    }

    protected hideHelpPanel = () => {
        this.setState({ ShowHelpPanel: false });
    }

    //#endregion


    //#region Data Load

    // private loadGoForm = (): Promise<IGoForm> => {
    //     return this.goFormService.readGoForm(this.props.PeriodId, this.props.DirectorateGroupId).then((arrGF: IGoForm[]) => {
    //         console.log('reading GoForm: ', arrGF);
    //         if(arrGF.length > 0){
    //             const formData: IGoDefForm = arrGF[0];
    //             this.setState({ FormData: formData });
    //             return formData;
    //         }
    //         else{
    //             //GoForm doesn't exist in db, reset FormData, so all the fields are empty, request may come from componentDidUpdate
    //             const fd = new GoForm(this.props.PeriodId, this.props.DirectorateGroupId);
    //             this.setState({ FormData: fd });
    //             return null;
    //         }

    //     }, (err) => {
    //         if (this.props.onError) this.props.onError(`Error loading progress update`, err.message);
    //     });
    // }

    // private loadUpdates = (): void => {
    //     this.setState({ Loading: true });
    //     let loadingPromises = [this.loadLookups()];

    //     Promise.all(loadingPromises).then(this.onLoaded, this.onErrorLoading);
    // }
    // private loadLookups(): Promise<any> {
    
    //     return Promise.all([
    //         this.loadGoForm(),    
    //     ]);
    // }
    // protected onLoaded = (loadedData: any[]): void => {
    //     this.setState({ Loading: false });
    // }

    // protected onErrorLoading = (): void => {
    //     this.setState({ Loading: false });
    // }

    //#endregion Data Load

    //#region Save Data

    protected onBeforeSave = (): void => { 
        
        let summaryCompletionStatus: string = SectionStatus.InProgress; //taking as default
        let summaryMarkReadyForApproval: boolean = this.state.FormData.SummaryMarkReadyForApproval;

        const completed: boolean = this.validateForStatus(); 
        if(completed === true){
            if(summaryMarkReadyForApproval === true){
                summaryCompletionStatus = SectionStatus.Completed;
            }
            
        }
        else{
            summaryCompletionStatus = SectionStatus.InProgress;
            //also uncheck the mark as ready checkbox
            summaryMarkReadyForApproval = false;
            //this.changeCheckbox(false, "SummaryMarkReadyForApproval");
        }


        //const newFormData = this.cloneObject(this.state.FormData, "SummaryCompletionStatus", summaryCompletionStatus);
        const newFormData = { ...this.state.FormData, "SummaryCompletionStatus": summaryCompletionStatus, "SummaryMarkReadyForApproval" : summaryMarkReadyForApproval };

        this.setState({ FormData: newFormData }, ()=> this.saveUpdate());

    }

    protected saveUpdate = (): void => {

        if (this.validateEntityUpdate()) {
            //this.setState({ FormSaveStatus: SaveStatus.Pending });
            //this.onBeforeSave(this.state.FormData);
            const formData: IGoForm = this.state.FormData;
            
            delete formData.ID;
            //delete u['Id'];

            this.goFormService.create(formData).then((fdAfterSave: IGoForm): void => {
                this.setState({ /*FormSaveStatus: SaveStatus.Success, */FormData: fdAfterSave/*, FormIsDirty: false*/ }, ()=> this.onAfterSave());
                if (this.props.onError)
                    this.props.onError(null);
                if (this.props.onSaved)
                    this.props.onSaved();
            }, (err) => {
                this.setState({ /*FormSaveStatus: SaveStatus.Error*/ });
                if (this.props.onError)
                    this.props.onError(`Error saving section1 update`, err.message);
            });
        }
    }

    protected onAfterSave(): void {
        // if(saveForLater === false)
        //     this.setState({ ShowSaveConfirmation: true });
            
        //this.props.onElementSave();
     }

    protected validateForStatus = (): boolean => { 
        if(this.state.FormData.SummaryRagRating === null){
            return false;
        }
        if(this.state.FormData.SummaryEvidenceStatement && this.state.FormData.SummaryEvidenceStatement.length >= 10){
            //true
        }
        else{
            return false;
        }
        return true;
    }

    //#endregion Save Data
}
