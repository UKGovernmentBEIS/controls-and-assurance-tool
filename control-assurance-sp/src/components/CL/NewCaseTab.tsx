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
import EvidenceList from './EV/EvidenceList';
import { sp } from '@pnp/sp';
import EvidenceSaveForm from './EV/EvidenceSaveForm';
import styles from '../../styles/cr.module.scss';
import { CLCase, ClCaseInfo, ICLCase, ICLCaseEvidence, IClCaseInfo, IEntity, ILinkLocalType, ICLDefForm, IUser, ICLWorker, CLWorker } from '../../types';
import { getUploadFolder_CLEvidence } from '../../types/AppGlobals';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import EntityList from '../entity/EntityList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { CrDatePicker } from '../cr/CrDatePicker';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import { changeDatePicker, changeDatePickerV2 } from '../../types/AppGlobals';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import '../../styles/CustomFabric.scss';
import { IContextualMenuProps } from 'office-ui-fabric-react';



export interface INewCaseTabProps extends types.IBaseComponentProps {

    //filteredItems: any[];
    //naoRecommendationId: any;
    clWorkerId: number;
    clCaseId: number;
    stage: string;
    onShowList: (refreshCounters?: boolean) => void;
    currentUserId: number;
    currentUserName: string;
    superUserPermission: boolean;
    viewerPermission: boolean;
    defForm: ICLDefForm;

    onShowHistoricCase?: (workerId: number, caseId: number, stage: string) => void;
    historicCase?: boolean;
    onShowCaseTab?: () => void;

    //onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;



}

export interface ILookupData {
    CLStaffGrades: IEntity[];
    Directorates: IEntity[];
    CLProfessionalCats: IEntity[];
    CLWorkLocations: IEntity[];
    CLComFrameworks: IEntity[];
    CLIR35Scopes: IEntity[];
    CLSecurityClearances: IEntity[];
    CLDeclarationConflicts: IEntity[];
    PersonTitles: IEntity[];
    Users: IUser[];
}

export class LookupData implements ILookupData {

    public CLStaffGrades: IEntity[] = [];
    public Directorates: IEntity[] = [];
    public CLProfessionalCats: IEntity[] = [];
    public CLWorkLocations: IEntity[] = [];
    public CLComFrameworks: IEntity[] = [];
    public CLIR35Scopes: IEntity[] = [];
    public CLSecurityClearances: IEntity[] = [];
    public CLDeclarationConflicts: IEntity[] = [];
    public PersonTitles: IEntity[] = [];
    public Users = [];

}



export interface INewCaseTabState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: ICLCase;
    FormDataWorker: ICLWorker;
    CaseInfo: IClCaseInfo;
    FormIsDirty: boolean;
    Evidence_ListFilterText: string;
    ShowIR35EvidenceForm: boolean;
    ShowContractorSecurityCheckEvidenceForm: boolean;
    IR35Evidence: ICLCaseEvidence;
    ContractorSecurityCheckEvidence: ICLCaseEvidence;
    HideIR35EvDeleteDialog: boolean;
    HideContractorSecurityCheckEvDeleteDialog: boolean;
    HideFormValidationMessage: boolean;
    HideSubmitApprovalDoneMessage: boolean;
    HideSubmitEngagedDoneMessage: boolean;
    EvidenceChangesCounter: number;
    Engaged_MoveToChecksDoneBtn: boolean;
    Leaving_MoveToArchiveBtn: boolean;
    Stage: string;
    HideRequirementInfoSection: boolean;
    //DefForm: ICLDefForm;


}

export class NewCaseTabState implements INewCaseTabState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData;
    public FormDataWorker;
    public CaseInfo;
    public FormIsDirty = false;
    public Evidence_ListFilterText: string = null;
    public ShowIR35EvidenceForm: boolean = false;
    public ShowContractorSecurityCheckEvidenceForm: boolean = false;
    public IR35Evidence: ICLCaseEvidence = null;
    public ContractorSecurityCheckEvidence: ICLCaseEvidence = null;
    public HideIR35EvDeleteDialog: boolean = true;
    public HideContractorSecurityCheckEvDeleteDialog: boolean = true;
    public HideFormValidationMessage: boolean = true;
    public HideSubmitApprovalDoneMessage: boolean = true;
    public HideSubmitEngagedDoneMessage: boolean = true;
    public EvidenceChangesCounter: number = 0;
    public Engaged_MoveToChecksDoneBtn = false;
    public Leaving_MoveToArchiveBtn: boolean = false;
    public Stage: string = ""; //set in componentDidMount
    public HideRequirementInfoSection = false;
    //public DefForm: ICLDefForm = null;

    constructor(caseType: string) {
        this.FormData = new CLCase(caseType);
        this.CaseInfo = new ClCaseInfo();
        this.FormDataWorker = new CLWorker();

    }


}

export interface IExtHistroyLink {
    CaseId: number;
    WorkerId: number;
    Stage: string;
    Text: string;
}

export default class NewCaseTab extends React.Component<INewCaseTabProps, INewCaseTabState> {

    private clCaseService: services.CLCaseService = new services.CLCaseService(this.props.spfxContext, this.props.api);
    private clWorkerService: services.CLWorkerService = new services.CLWorkerService(this.props.spfxContext, this.props.api);
    private clCaseEvidenceService: services.CLCaseEvidenceService = new services.CLCaseEvidenceService(this.props.spfxContext, this.props.api);
    private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);
    private clStaffGradeService: services.CLStaffGradeService = new services.CLStaffGradeService(this.props.spfxContext, this.props.api);
    private directorateService: services.DirectorateService = new services.DirectorateService(this.props.spfxContext, this.props.api);
    private clProfessionalCatService: services.CLProfessionalCatService = new services.CLProfessionalCatService(this.props.spfxContext, this.props.api);
    private clWorkLocationService: services.CLWorkLocationService = new services.CLWorkLocationService(this.props.spfxContext, this.props.api);
    private clComFrameworkService: services.CLComFrameworkService = new services.CLComFrameworkService(this.props.spfxContext, this.props.api);
    private clSecurityClearanceService: services.CLSecurityClearanceService = new services.CLSecurityClearanceService(this.props.spfxContext, this.props.api);
    private clDeclarationConflictService: services.CLDeclarationConflictService = new services.CLDeclarationConflictService(this.props.spfxContext, this.props.api);
    private personTitleService: services.PersonTitleService = new services.PersonTitleService(this.props.spfxContext, this.props.api);
    private clIR35ScopeService: services.CLIR35ScopeService = new services.CLIR35ScopeService(this.props.spfxContext, this.props.api);
    //private clDefFormService: services.CLDefFormService = new services.CLDefFormService(this.props.spfxContext, this.props.api);

    private UploadFolder_Evidence: string = "";

    //IChoiceGroupOption
    private approvalDecisionItems: any[] = [
        { key: 'Approve', text: 'Approve', afterDecisionText: 'Approved' },
        { key: 'Reject', text: 'Reject', afterDecisionText: 'Rejected' },
        { key: 'RequireDetails', text: 'Require further details', afterDecisionText: 'Require further details' },
    ];

    private checkIconGreen: string = require('../../images/greentick1212.png');
    private checkIconRed: string = require('../../images/redtick1212.png');



    constructor(props: INewCaseTabProps, state: INewCaseTabState) {
        super(props);
        this.state = new NewCaseTabState('New Case');
        this.UploadFolder_Evidence = getUploadFolder_CLEvidence(props.spfxContext);

    }

    public render(): React.ReactElement<INewCaseTabProps> {

        //stages
        /*
            1: Draft
            2: Approval
            3: Onboarding
            4: Engaged
            5: Leaving
            6: Left
        
        */



        let isViewOnly: boolean = this.isViewOnlyPermission();

        const stage = this.state.Stage;
        const fdw = this.state.FormDataWorker;

        return (
            <React.Fragment>
                {this.renderSectionTitle()}
                {this.renderInfoTable()}
                {stage === "Draft" && isViewOnly === false && this.renderDetailsOfApplicant()}
                {stage === "Draft" && isViewOnly === false && this.renderRequirement()}
                {stage === "Draft" && isViewOnly === false && this.renderCommercial()}
                {stage === "Draft" && isViewOnly === false && this.renderResourcingJustification()}
                {stage === "Draft" && isViewOnly === false && this.renderFinance()}
                {stage === "Draft" && isViewOnly === false && this.renderOther()}
                {stage === "Draft" && isViewOnly === false && this.renderApprovers()}
                {stage === "Draft" && isViewOnly === false && this.renderFormButtons_DraftStage()}


                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || isViewOnly === true) && this.renderDetailsOfApplicant_info()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || isViewOnly === true) && this.renderRequirement_info()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || isViewOnly === true) && this.renderCommercial_info()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || isViewOnly === true) && this.renderResourcingJustification_info()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || isViewOnly === true) && this.renderFinance_info()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || isViewOnly === true) && this.renderOther_info()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || isViewOnly === true) && this.renderApprovers_info()}

                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || isViewOnly === true) && this.renderBudgetHolderApprovalDecision_info()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || isViewOnly === true) && this.renderFinanceBusinessPartnerApprovalDecision_info()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || isViewOnly === true) && this.renderHRBusinessPartnerApprovalDecision_info()}

                {(stage === "Approval") && this.renderBudgetHolderApprovalDecision()}
                {(stage === "Approval") && this.renderFinanceBusinessPartnerApprovalDecision()}
                {(stage === "Approval") && this.renderHRBusinessPartnerApprovalDecision()}
                {stage === "Approval" && this.renderFormButtons_ApprovalStage()}

                {stage === "Onboarding" && isViewOnly === false && this.renderOnboarding()}
                {stage === "Onboarding" && isViewOnly === false && this.renderFormButtons_OnboardingStage()}
                {((stage === "Onboarding" && isViewOnly === true) || (stage === "Engaged" || stage === "Leaving" || stage === "Left")) && this.renderOnboarding_info()}

                {stage === "Engaged" && isViewOnly === false && this.renderEngaged()}
                {stage === "Engaged" && isViewOnly === false && this.renderFormButtons_EngagedStage()}
                {((stage === "Engaged" || stage === "Leaving" || stage === "Left") && (isViewOnly === true || fdw.EngagedChecksDone === true)) && this.renderEngaged_info()}

                {stage === "Leaving" && isViewOnly === false && this.renderLeaving()}
                {stage === "Leaving" && isViewOnly === false && this.renderFormButtons_LeavingStage()}
                {((stage === "Left") || (stage === "Leaving" && isViewOnly === true)) && this.renderLeaving_info()}

                {this.renderListsMainTitle()}
                {this.renderEvidencesList()}
                {this.renderChangeLogs()}

                {this.props.historicCase === true && this.renderCloseButton_HistoricCase()}

                {this.state.ShowIR35EvidenceForm && this.renderIR35EvidenceForm()}
                <ConfirmDialog hidden={this.state.HideIR35EvDeleteDialog} title={`Are you sure you want to delete this IR35 assessment  evidence?`} content={`A deleted evidence cannot be un-deleted.`} confirmButtonText="Delete" handleConfirm={this.deleteIR35Evidence} handleCancel={this.toggleIR35EvDeleteConfirm} />

                {this.state.ShowContractorSecurityCheckEvidenceForm && this.renderContractorSecurityCheckEvidenceForm()}
                <ConfirmDialog hidden={this.state.HideContractorSecurityCheckEvDeleteDialog} title={`Are you sure you want to delete this security checks confirmation evidence?`} content={`A deleted evidence cannot be un-deleted.`} confirmButtonText="Delete" handleConfirm={this.deleteContractorSecurityCheckEvidence} handleCancel={this.toggleContractorSecurityCheckEvDeleteConfirm} />

                {/* validation */}
                <MessageDialog hidden={this.state.HideFormValidationMessage} title="Validation Failed" content="Failed validation checks. Please ensure all fields marked with a red asterisk are completed." handleOk={() => { this.setState({ HideFormValidationMessage: true }); }} />

                {/* submit for approval - done */}
                <MessageDialog hidden={this.state.HideSubmitApprovalDoneMessage} title="Validation Successful" content="Validation checks completed successfully. This case is being moved to the approvals stage." handleOk={() => { this.setState({ HideSubmitApprovalDoneMessage: true }, () => this.props.onShowList()); }} />

                {/* submit to engaged - done */}
                <MessageDialog hidden={this.state.HideSubmitEngagedDoneMessage} title="Validation Successful" content="Validation checks completed successfully. This case is being moved to the engaged stage." handleOk={() => { this.setState({ HideSubmitEngagedDoneMessage: true }, () => this.afterSubmitEngagedSuccessMsg()); }} />


            </React.Fragment>
        );
    }

    private renderSectionTitle() {
        return (
            <React.Fragment>
                <h1 style={{ fontFamily: 'Calibri', fontSize: '36px' }}>Contingent Labour Business Case</h1>

            </React.Fragment>
        );
    }

    private renderInfoTable() {

        const cInfo = this.state.CaseInfo;

        let arrLinks: IExtHistroyLink[] = [];
        //unpack publication links from single value
        if (this.props.historicCase !== true && cInfo.ExtensionHistory !== null && cInfo.ExtensionHistory !== '') {
            let arr1 = cInfo.ExtensionHistory.split('^');

            //console.log('arr1', arr1);

            for (let i = 0; i < arr1.length; i++) {

                let itemStr: string = arr1[i];
                //console.log('arr1 Loop itemStr', itemStr);
                if (itemStr.trim() === '') {
                    continue;
                }
                //console.log('after continue');
                let arr2 = itemStr.split('|');
                //console.log('after arr2 Split', arr2);
                let item: IExtHistroyLink = { CaseId: 0, WorkerId: 0, Stage: '', Text: '' };
                item.CaseId = Number(arr2[0]);
                item.WorkerId = Number(arr2[1]);
                item.Stage = arr2[2];
                item.Text = arr2[3];

                //console.log('item filled with data', item);

                arrLinks.push(item);

                arrLinks = arrLinks.reverse();

                console.log('item pushed to arrLinks', arrLinks);

            }
        }

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '50px' }} className={styles.sectionATitle}>Case Details</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>
                            {/* <tr>
                                <td style={{ width: '170px', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Stage
                                </td>
                                <td style={{ width: 'calc(100% - 50% - 170px - 170px)', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.Stage}
                                </td>
                                <td style={{ width: '170px', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Case Ref
                                </td>
                                <td style={{ width: 'calc(100% - 50% - 170px - 170px)', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.CaseRef}
                                </td>

                            </tr> */}

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Stage
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.Stage}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Case Ref
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.CaseRef}
                                </td>

                            </tr>



                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Created By
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', }}>
                                    {this.state.CaseInfo.CreatedBy}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Created On
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.CreatedOn}
                                </td>

                            </tr>
                            {
                                arrLinks.length > 0 &&
                                <tr>
                                    <td style={{ borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                        Extension History
                                    </td>
                                    <td colSpan={3} style={{ borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>


                                        {arrLinks.map((c, i) =>
                                            <span style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue', marginRight: '15px' }} key={`span_ExtHis_${i}`} onClick={() => this.onViewExtHistroyClick(c.CaseId, c.WorkerId, c.Stage)} >{c.Text}</span>

                                        )}

                                    </td>
                                </tr>
                            }


                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderDetailsOfApplicant() {
        const fd = this.state.FormData;

        const applHMUserIdValidationImg = this.state.FormData.ApplHMUserId !== null ? this.checkIconGreen : this.checkIconRed;

        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Details of Applicant</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>


                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Name of hiring manager</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={applHMUserIdValidationImg} />
                                    </div>
                                </div>





                            </div>

                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '100%', }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={this.state.FormData.ApplHMUserId && [this.state.FormData.ApplHMUserId]}
                                    onChange={(v) => this.changeUserPicker(v, 'ApplHMUserId')}
                                />



                            </div>

                        </div>
                    </div>


                </div>





            </div>
        );
    }

    private renderRequirement() {
        const fd = this.state.FormData;

        let numPositionsLength: number = 1; //default for hiring manager
        if (this.props.superUserPermission === true) {
            numPositionsLength = 2;
        }
        //dont show this section if user is viewer

        const reqVacancyTitleValidationImg = fd.ReqVacancyTitle !== null && fd.ReqVacancyTitle.length > 1 ? this.checkIconGreen : this.checkIconRed;
        const reqGradeIdValidationImg = fd.ReqGradeId !== null ? this.checkIconGreen : this.checkIconRed;
        const reqWorkPurposeValidationImg = fd.ReqWorkPurpose !== null && fd.ReqWorkPurpose.length > 9 ? this.checkIconGreen : this.checkIconRed;
        const reqCostCentreValidationImg = fd.ReqCostCentre !== null && fd.ReqCostCentre.length === 6 ? this.checkIconGreen : this.checkIconRed;
        const reqDirectorateIdValidationImg = fd.ReqDirectorateId !== null ? this.checkIconGreen : this.checkIconRed;
        const reqEstStartDateValidationImg = fd.ReqEstStartDate !== null ? this.checkIconGreen : this.checkIconRed;

        const reqEstEndDateValidationImg = fd.ReqEstEndDate !== null && fd.ReqEstEndDate > fd.ReqEstStartDate ? this.checkIconGreen : this.checkIconRed;


        const reqProfessionalCatIdValidationImg = fd.ReqProfessionalCatId !== null ? this.checkIconGreen : this.checkIconRed;
        const reqWorkLocationIdValidationImg = fd.ReqWorkLocationId !== null ? this.checkIconGreen : this.checkIconRed;
        const reqNumPositionsValidationImg = fd.ReqNumPositions !== null && fd.ReqNumPositions > 0 ? this.checkIconGreen : this.checkIconRed;


        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>
                    <span>Requirement</span>
                </div>
                {
                    <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                        <div className={styles.formField}>

                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>
                                    <div className={styles.flexContainerSectionQuestion}>
                                        <div className={styles.sectionQuestionCol1}><span>Title of vacancy</span></div>
                                        <div className={styles.sectionQuestionCol2}>
                                            <img src={reqVacancyTitleValidationImg} />
                                        </div>
                                    </div>

                                </div>
                                <div style={{ width: '50%', fontWeight: 'bold' }}>
                                    <div className={styles.flexContainerSectionQuestion}>
                                        <div className={styles.sectionQuestionCol1}><span>Grade of vacancy</span></div>
                                        <div className={styles.sectionQuestionCol2}>
                                            <img src={reqGradeIdValidationImg} />
                                        </div>
                                    </div>

                                </div>


                            </div>
                            <div style={{ display: 'flex', marginTop: '5px' }}>
                                <div style={{ width: '50%', paddingRight: '5px' }}>
                                    <CrTextField
                                        //className={styles.formField}
                                        onChanged={(v) => this.changeTextField(v, "ReqVacancyTitle")}
                                        value={fd.ReqVacancyTitle}

                                    />



                                </div>

                                <div style={{ width: '50%', }}>
                                    <CrDropdown
                                        placeholder="Select an Option"
                                        options={this.state.LookupData.CLStaffGrades.map((p) => { return { key: p.ID, text: p.Title }; })}
                                        selectedKey={fd.ReqGradeId}
                                        onChanged={(v) => this.changeDropdown(v, "ReqGradeId")}
                                    />

                                </div>




                            </div>
                        </div>

                        {/* 2nd row */}

                        <div className={styles.formField}>

                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '100%', fontWeight: 'bold' }}>

                                    <div className={styles.flexContainerSectionQuestion}>
                                        <div className={styles.sectionQuestionCol1}><span>Work proposal (what will they be doing? )</span></div>
                                        <div className={styles.sectionQuestionCol2}>
                                            <img src={reqWorkPurposeValidationImg} />
                                        </div>
                                    </div>

                                </div>


                            </div>
                            <div style={{ display: 'flex', marginTop: '5px' }}>
                                <div style={{ width: '100%' }}>
                                    <CrTextField
                                        multiline={true}
                                        rows={6}
                                        //className={styles.formField}
                                        onChanged={(v) => this.changeTextField(v, "ReqWorkPurpose")}
                                        value={fd.ReqWorkPurpose}

                                    />



                                </div>

                            </div>
                        </div>


                        {/* 3rd row */}

                        <div className={styles.formField}>

                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                    <div className={styles.flexContainerSectionQuestion}>
                                        <div className={styles.sectionQuestionCol1}><span>Cost Centre for this role</span></div>
                                        <div className={styles.sectionQuestionCol2}>
                                            <img src={reqCostCentreValidationImg} />
                                        </div>
                                    </div>

                                </div>
                                <div style={{ width: '50%', fontWeight: 'bold' }}>

                                    <div className={styles.flexContainerSectionQuestion}>
                                        <div className={styles.sectionQuestionCol1}><span>Directorate this role will be in</span></div>
                                        <div className={styles.sectionQuestionCol2}>
                                            <img src={reqDirectorateIdValidationImg} />
                                        </div>
                                    </div>

                                </div>


                            </div>
                            <div style={{ display: 'flex', marginTop: '5px' }}>
                                <div style={{ width: '50%', paddingRight: '5px' }}>
                                    <CrTextField
                                        //className={styles.formField}
                                        //numbersOnly={true}
                                        maxLength={6}
                                        //onChanged={(v) => this.changeTextField(v, "ReqCostCentre")}
                                        onChanged={(v) => this.changeTextField_number(v, "ReqCostCentre")}
                                        value={fd.ReqCostCentre}

                                    />



                                </div>

                                <div style={{ width: '50%', }}>
                                    <CrDropdown
                                        placeholder="Select an Option"
                                        options={this.state.LookupData.Directorates.map((p) => { return { key: p.ID, text: p.Title }; })}
                                        selectedKey={fd.ReqDirectorateId}
                                        onChanged={(v) => this.changeDropdown(v, "ReqDirectorateId")}
                                    />

                                </div>




                            </div>
                        </div>


                        {/* 4th row */}

                        <div className={styles.formField}>

                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                    <div className={styles.flexContainerSectionQuestion}>
                                        <div className={styles.sectionQuestionCol1}><span>Estimated start date</span></div>
                                        <div className={styles.sectionQuestionCol2}>
                                            <img src={reqEstStartDateValidationImg} />
                                        </div>
                                    </div>

                                </div>
                                <div style={{ width: '50%', fontWeight: 'bold' }}>

                                    <div className={styles.flexContainerSectionQuestion}>
                                        <div className={styles.sectionQuestionCol1}><span>Estimated end date</span></div>
                                        <div className={styles.sectionQuestionCol2}>
                                            <img src={reqEstEndDateValidationImg} />
                                        </div>
                                    </div>

                                </div>


                            </div>
                            <div style={{ display: 'flex', marginTop: '5px' }}>
                                <div style={{ width: '50%', paddingRight: '5px' }}>
                                    <CrDatePicker
                                        maxWidth='100%'
                                        value={fd.ReqEstStartDate}
                                        onSelectDate={(v) => changeDatePicker(this, v, "ReqEstStartDate")}

                                    />



                                </div>

                                <div style={{ width: '50%', }}>
                                    <CrDatePicker
                                        maxWidth='100%'
                                        value={fd.ReqEstEndDate}
                                        onSelectDate={(v) => changeDatePicker(this, v, "ReqEstEndDate")}
                                    />

                                </div>




                            </div>
                            {
                                (fd.ReqEstStartDate !== null && fd.ReqEstEndDate !== null && (fd.ReqEstEndDate <= fd.ReqEstStartDate)) &&
                                <div style={{ display: 'flex' }}>
                                    <div style={{ width: '50%' }}>&nbsp;</div>
                                    <div style={{ width: '50%', fontSize: '12px', fontStyle: 'italic', paddingTop: '5px', marginTop: '0px', paddingLeft: '0px' }}>
                                        End date should be greater than start date
                                    </div>
                                </div>
                            }
                        </div>

                        {/* 5th row */}

                        <div className={styles.formField}>

                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                    <div className={styles.flexContainerSectionQuestion}>
                                        <div className={styles.sectionQuestionCol1}><span>Professional Category</span></div>
                                        <div className={styles.sectionQuestionCol2}>
                                            <img src={reqProfessionalCatIdValidationImg} />
                                        </div>
                                    </div>

                                </div>
                                <div style={{ width: '50%', fontWeight: 'bold' }}>

                                    <div className={styles.flexContainerSectionQuestion}>
                                        <div className={styles.sectionQuestionCol1}><span>Work location</span></div>
                                        <div className={styles.sectionQuestionCol2}>
                                            <img src={reqWorkLocationIdValidationImg} />
                                        </div>
                                    </div>

                                </div>


                            </div>
                            <div style={{ display: 'flex', marginTop: '5px' }}>
                                <div style={{ width: '50%', paddingRight: '5px' }}>
                                    <CrDropdown
                                        placeholder="Select an Option"
                                        options={this.state.LookupData.CLProfessionalCats.map((p) => { return { key: p.ID, text: p.Title }; })}
                                        selectedKey={fd.ReqProfessionalCatId}
                                        onChanged={(v) => this.changeDropdown(v, "ReqProfessionalCatId")}
                                    />



                                </div>

                                <div style={{ width: '50%', }}>
                                    <CrDropdown
                                        placeholder="Select an Option"
                                        options={this.state.LookupData.CLWorkLocations.map((p) => { return { key: p.ID, text: p.Title }; })}
                                        selectedKey={fd.ReqWorkLocationId}
                                        onChanged={(v) => this.changeDropdown(v, "ReqWorkLocationId")}
                                    />

                                </div>




                            </div>
                        </div>



                        {/* 6th row */}

                        <div className={styles.formField}>

                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                    <div className={styles.flexContainerSectionQuestion}>
                                        <div className={styles.sectionQuestionCol1}><span>Number of positions</span></div>
                                        <div className={styles.sectionQuestionCol2}>
                                            <img src={reqNumPositionsValidationImg} />
                                        </div>
                                    </div>

                                </div>
                                <div style={{ width: '50%', fontWeight: 'bold' }}>
                                    <span>&nbsp;</span>

                                </div>


                            </div>
                            <div style={{ display: 'flex', marginTop: '5px' }}>
                                <div style={{ width: '50%', paddingRight: '5px' }}>
                                    <CrTextField
                                        onChanged={(v) => this.changeTextField(v, "ReqNumPositions")}
                                        value={String(fd.ReqNumPositions)}
                                        numbersOnly={true}
                                        maxLength={numPositionsLength}
                                        readOnly={fd.CaseType === "Extension" ? true : false}

                                    />



                                </div>

                                {
                                    fd.CaseType !== "Extension" &&
                                    <div style={{ width: '50%', }}>

                                        <div style={{ fontSize: '12px', fontStyle: 'italic', paddingTop: '0px', marginTop: '0px', paddingLeft: '10px' }}>
                                            Note: if case has multiple positions, the system will only show it as one case to the approvers. Once the case has been approved, it will create multiple records for onboarding each worker individually.
                                        </div>
                                    </div>
                                }






                            </div>
                        </div>



                    </div>

                }



            </div>
        );
    }

    private renderCommercial() {
        const fd = this.state.FormData;

        const comFrameworkIdValidationImg = fd.ComFrameworkId !== null ? this.checkIconGreen : this.checkIconRed;
        const comPSRAccountIdValidationImg = fd.ComPSRAccountId !== null ? this.checkIconGreen : this.checkIconRed;

        let comJustificationValidationImg: string = "";
        if (fd.ComFrameworkId > 1) {
            if (fd.ComJustification !== null && fd.ComJustification.length > 9) {
                comJustificationValidationImg = this.checkIconGreen;
            }
            else {
                comJustificationValidationImg = this.checkIconRed;
            }
        }

        let yesNoNaOptions: IDropdownOption[] = [];

        if (this.state.FormData.ComFrameworkId === 1) {
            //PSR
            yesNoNaOptions = [
                { key: 'Yes', text: 'Yes' },
                { key: 'No', text: 'No' },
            ];
        }
        else {
            yesNoNaOptions = [
                { key: 'NA', text: 'N/A' },
            ];
        }




        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Commercial</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Framework</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={comFrameworkIdValidationImg} />
                                    </div>
                                </div>

                            </div>
                            {fd.ComFrameworkId === 1 && <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Confirm if you have a Fieldglass account</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={comPSRAccountIdValidationImg} />
                                    </div>
                                </div>


                            </div>}


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrDropdown
                                    placeholder="Select an Option"
                                    options={this.state.LookupData.CLComFrameworks.map((p) => { return { key: p.ID, text: p.Title }; })}
                                    selectedKey={this.state.FormData.ComFrameworkId}
                                    onChanged={(v) => this.changeDropdown(v, "ComFrameworkId")}
                                />



                            </div>

                            {fd.ComFrameworkId === 1 && <div style={{ width: '50%', }}>
                                <CrDropdown
                                    placeholder="Select an Option"
                                    options={yesNoNaOptions}
                                    selectedKey={this.state.FormData.ComPSRAccountId}
                                    onChanged={(v) => this.changeDropdown(v, "ComPSRAccountId")}
                                />

                                {fd.ComPSRAccountId === 'No' && <div style={{ fontSize: '12px', fontStyle: 'italic', paddingTop: '5px', marginTop: '0px', paddingLeft: '0px' }}>
                                    Note: Please contact PSR help desk to have one arranged, you will have to raise a worker requirement on Fieldglass.
                                </div>}

                            </div>}




                        </div>
                    </div>

                    {/* 2nd row */}

                    {fd.ComFrameworkId > 1 && <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Justification if not PSR</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={comJustificationValidationImg} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '100%' }}>
                                <CrTextField
                                    multiline={true}
                                    rows={6}
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField(v, "ComJustification")}
                                    value={fd.ComJustification}

                                />



                            </div>

                        </div>
                    </div>}



                </div>





            </div>
        );
    }

    private renderResourcingJustification() {
        const fd = this.state.FormData;

        const justAltOptionsValidationImg = fd.JustAltOptions !== null && fd.JustAltOptions.length > 9 ? this.checkIconGreen : this.checkIconRed;
        const justSuccessionPlanningValidationImg = fd.JustSuccessionPlanning !== null && fd.JustSuccessionPlanning.length > 9 ? this.checkIconGreen : this.checkIconRed;


        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Resourcing Justification</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>


                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Alternative resourcing options: set out what other options have been considered and why these are not suitable</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={justAltOptionsValidationImg} />
                                    </div>
                                </div>


                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '100%' }}>
                                <CrTextField
                                    multiline={true}
                                    rows={6}
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField(v, "JustAltOptions")}
                                    value={fd.JustAltOptions}

                                />



                            </div>

                        </div>
                    </div>

                    {/* 2nd row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Succession planning: explain how you plan to manage knowledge transfer and reduce reliance on contingent labour</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={justSuccessionPlanningValidationImg} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '100%' }}>
                                <CrTextField
                                    multiline={true}
                                    rows={6}
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField(v, "JustSuccessionPlanning")}
                                    value={fd.JustSuccessionPlanning}

                                />



                            </div>

                        </div>
                    </div>



                </div>





            </div>
        );
    }

    private renderFinance() {
        const fd = this.state.FormData;

        const finMaxRateValidationImg = fd.FinMaxRate !== null && fd.FinMaxRate > 0 ? this.checkIconGreen : this.checkIconRed;
        const finEstCostValidationImg = fd.FinEstCost !== null && fd.FinEstCost > 0 ? this.checkIconGreen : this.checkIconRed;
        const finIR35ScopeIdValidationImg = fd.FinIR35ScopeId !== null ? this.checkIconGreen : this.checkIconRed;

        const iR35EvidenceValidationImg = this.state.IR35Evidence !== null ? this.checkIconGreen : this.checkIconRed;

        // const menuProps: IContextualMenuProps = {
        //     items: [
        //         {
        //             key: 'action1',
        //             text: 'Action 1',
        //             iconProps: { iconName: 'Add' },
        //             onClick: (ev) => alert('action 1 todo'),
        //             //onClick: (ev) => this.props.onShowList(),
        //         },
        //         {
        //             key: 'action2',
        //             text: 'Action2',
        //             iconProps: { iconName: 'Add' },
        //             onClick: (ev) => alert('action 2 todo'),
        //         },
        //     ],
        // };

        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Finance</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Expected daily rate including fee (excluding vat)</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={finMaxRateValidationImg} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Estimated cost</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={finEstCostValidationImg} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
                                    //numbersOnly={true}
                                    onBlur={(ev) => this.blurRateTextField(ev, "FinMaxRate")}
                                    onChanged={(v) => this.changeTextField_number(v, "FinMaxRate")}
                                    value={fd.FinMaxRate && String(fd.FinMaxRate)}
                                //value=''

                                />



                            </div>

                            <div style={{ width: 'calc(100% - 50% - 130px)', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
                                    //numbersOnly={true}
                                    onBlur={(ev) => this.blurRateTextField(ev, "FinEstCost")}
                                    onChanged={(v) => this.changeTextField_number(v, "FinEstCost")}
                                    value={fd.FinEstCost && String(fd.FinEstCost)}
                                //value=''

                                />

                            </div>
                            <div style={{ width: '130px', }}>

                                <DefaultButton text="Calculate"
                                    //className={styles.formButton} style={{ marginRight: '5px' }}
                                    //style={{ border: '1px solid rgb(138,136,134)' }}
                                    onClick={this.calculateRate}

                                />

                            </div>




                        </div>
                    </div>

                    {/* 2nd row */}


                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Confirm whether in-scope of IR35</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={finIR35ScopeIdValidationImg} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Attach IR35 assesment evidence</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={iR35EvidenceValidationImg} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrDropdown
                                    placeholder="Select an Option"
                                    options={this.state.LookupData.CLIR35Scopes.map((p) => { return { key: p.ID, text: p.Title }; })}
                                    selectedKey={this.state.FormData.FinIR35ScopeId}
                                    onChanged={(v) => this.changeDropdown(v, "FinIR35ScopeId")}
                                />



                            </div>

                            <div style={{ width: 'calc(100% - 50% - 130px)', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
                                    //onChanged={(v) => this.changeTextField(v, "TargetDate")}
                                    //value={fd.TargetDate}
                                    disabled={true}
                                    style={{ border: '1px solid gray' }}
                                    value={this.state.IR35Evidence && (this.state.IR35Evidence.AttachmentType === "Link" ? "Linked evidence available" : this.state.IR35Evidence.AttachmentType === "PDF" ? "PDF evidence available to download" : "")}

                                />

                            </div>
                            <div style={{ width: '130px', marginTop: '5px' }}>

                                {/* <DefaultButton text="Actions"
                                    disabled={this.props.clCaseId > 0 ? false : true}
                                    //className={styles.formButton} style={{ marginRight: '5px' }}
                                    //style={{ border: '1px solid rgb(138,136,134)' }}
                                    //onClick={this.props.onShowList}
                                    //primaryDisabled
                                    //split
                                    //splitButtonAriaLabel="See 2 options"
                                    //aria-roledescription="split button"
                                    //menuProps={menuProps}
                                
                                    
                                    //menuIconProps={menuProps}


                                /> */}

                                {
                                    this.props.clCaseId > 0 && <span>
                                        {this.state.IR35Evidence === null && <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={this.addIr35Evidence} >Add</span>}
                                        {this.state.IR35Evidence !== null && <span style={{ marginRight: '5px', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={this.viewIR35Evidence} >View</span>}
                                        {this.state.IR35Evidence !== null && <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={this.toggleIR35EvDeleteConfirm} >Delete</span>}
                                    </span>
                                }

                            </div>




                        </div>

                        {


                            this.state.IR35Evidence !== null &&

                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '50%' }}>&nbsp;</div>
                                <div style={{ width: '50%', fontSize: '12px', fontStyle: 'italic', paddingTop: '5px', marginTop: '0px', paddingLeft: '0px' }}>
                                    {this.state.IR35Evidence.Details}
                                </div>
                            </div>

                        }


                    </div>



                </div>





            </div>
        );
    }

    private renderOther() {
        const fd = this.state.FormData;


        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Other</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>


                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>
                                <span>Any additional comments</span>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '100%' }}>
                                <CrTextField
                                    multiline={true}
                                    rows={6}
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField(v, "OtherComments")}
                                    value={fd.OtherComments}

                                />



                            </div>

                        </div>
                    </div>



                </div>





            </div>
        );
    }

    private renderApprovers() {
        const fd = this.state.FormData;

        const bhUserIdValidationImg = this.state.FormData.BHUserId !== null ? this.checkIconGreen : this.checkIconRed;
        const fbpUserIdValidationImg = this.state.FormData.FBPUserId !== null ? this.checkIconGreen : this.checkIconRed;
        const hrbpUserIdValidationImg = this.state.FormData.HRBPUserId !== null ? this.checkIconGreen : this.checkIconRed;


        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Approvers</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Budget holder</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={bhUserIdValidationImg} />
                                    </div>
                                </div>


                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Finance business partner</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={fbpUserIdValidationImg} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    //label="Assigned To"
                                    //className={styles.formField}
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={this.state.FormData.BHUserId && [this.state.FormData.BHUserId]}
                                    onChange={(v) => this.changeUserPicker(v, 'BHUserId')}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrEntityPicker
                                    //label="Assigned To"
                                    //className={styles.formField}
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={this.state.FormData.FBPUserId && [this.state.FormData.FBPUserId]}
                                    onChange={(v) => this.changeUserPicker(v, 'FBPUserId')}
                                />

                            </div>




                        </div>
                    </div>

                    {/* 2nd row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>HR business partner</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={hrbpUserIdValidationImg} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <span></span>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    //label="Assigned To"
                                    //className={styles.formField}
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={this.state.FormData.HRBPUserId && [this.state.FormData.HRBPUserId]}
                                    onChange={(v) => this.changeUserPicker(v, 'HRBPUserId')}
                                />



                            </div>

                            <div style={{ width: '50%', }}>


                            </div>




                        </div>
                    </div>






                </div>





            </div>
        );
    }



    private renderFormButtons_DraftStage() {

        return (
            <div>

                {

                    <React.Fragment>
                        {<PrimaryButton text="Save as Draft" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.saveData(false, false)}
                        />}

                        <PrimaryButton text="Submit for Approval" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.saveData(true, false)}
                        />

                        <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.props.onShowList()}
                        />


                    </React.Fragment>
                }



            </div>
        );


    }

    private renderIR35EvidenceForm() {

        return (

            <EvidenceSaveForm
                showForm={this.state.ShowIR35EvidenceForm}
                parentId={this.state.FormData.ID}

                evidenceId={null}
                onSaved={this.ir35EvidenceSaved}
                onCancelled={this.closeIR35EvidencePanel}
                evidenceType="IR35"
                {...this.props}
            />
        );

    }

    private renderContractorSecurityCheckEvidenceForm() {

        return (

            <EvidenceSaveForm
                showForm={this.state.ShowContractorSecurityCheckEvidenceForm}
                parentId={this.props.clWorkerId}

                evidenceId={null}
                onSaved={this.contractorSecurityCheckEvidenceSaved}
                onCancelled={this.closeContractorSecurityCheckEvidencePanel}
                evidenceType="ContractorSecurityCheck"
                {...this.props}
            />
        );

    }

    private renderChangeLogs() {
        const fd = this.state.FormData;
        let changeLog = fd.CaseChangeLog ? fd.CaseChangeLog : "";
        let changeLogArr = changeLog.split(',');
        let changeLogs = "";

        changeLogArr.reverse().forEach(log => {
            if (log.length > 0) {
                changeLogs += `${log}<br />`;
            }
        });

        return (
            <React.Fragment>
                <div style={{ marginTop: "30px" }}>
                    <div style={{ fontWeight: 'bold' }}>Change Log:</div>
                    <div style={{ marginTop: "20px" }} dangerouslySetInnerHTML={{ __html: changeLogs }} />
                </div>
            </React.Fragment>
        );
    }

    private renderListsMainTitle() {
        return (
            <div style={{ marginBottom: '20px', marginTop: '50px' }} className={styles.sectionATitle}>
                Case Discussion, General Comments and File Attachments
            </div>
        );
    }

    private renderEvidencesList() {

        return (
            <React.Fragment>
                {/* <div style={{ marginTop: '30px', fontWeight: "bold", marginBottom: '10px' }}>Evidence</div> */}
                <div style={{ minHeight: '120px', border: '1px solid rgb(166,166,166)' }}>
                    <EvidenceList
                        parentId={this.state.FormData.ID}
                        isViewOnly={this.isViewOnlyPermission()}
                        filterText={this.state.Evidence_ListFilterText}
                        onChangeFilterText={this.handleEvidence_ChangeFilterText}
                        evChangesCounter={this.state.EvidenceChangesCounter}
                        {...this.props}
                        onError={this.props.onError}

                    />
                </div>

            </React.Fragment>
        );

    }







    private renderDetailsOfApplicant_info() {

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '50px' }} className={styles.sectionATitle}>Details of Applicant</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Name of hiring manager
                                </td>
                                <td style={{ width: '81%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.ApplHMUser}
                                </td>


                            </tr>




                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderRequirement_info() {

        return (

            <React.Fragment>

                {/* <div style={{ marginBottom: '10px', marginTop: '30px', display: 'flex', cursor: 'pointer' }} className={styles.sectionATitle} onClick={() => this.setState({ HideRequirementInfoSection: !this.state.HideRequirementInfoSection })} >
                    <div style={{ width: '40px', paddingTop: '3px' }}>
                        <Icon iconName={this.state.HideRequirementInfoSection === true ? 'ChevronRight' : 'ChevronDown'} />
                    </div>
                    <div>
                        Requirement
                    </div>
                </div> */}

                <div style={{ marginBottom: '10px', marginTop: '30px', }} className={styles.sectionATitle} >

                    Requirement
                </div>

                {(this.state.HideRequirementInfoSection === false) &&
                    <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                        <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                            <tbody>

                                <tr>
                                    <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                        Title of vacancy
                                </td>
                                    <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                        {this.state.FormData.ReqVacancyTitle}
                                    </td>
                                    <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                        Grade of vacancy
                                </td>
                                    <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                        {this.state.CaseInfo.ReqGrade}
                                    </td>

                                </tr>

                                <tr>
                                    <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                        Work proposal (what will they be doing? )
                                </td>
                                    <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                        <div dangerouslySetInnerHTML={{ __html: this.state.FormData.ReqWorkPurpose && this.state.FormData.ReqWorkPurpose.split('\n').join('<br/>') }} ></div>
                                    </td>


                                </tr>

                                <tr>
                                    <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                        Cost Centre for this role
                                </td>
                                    <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                        {this.state.FormData.ReqCostCentre}
                                    </td>
                                    <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                        Directorate this role will be in
                                </td>
                                    <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                        {this.state.CaseInfo.Directorate}
                                    </td>

                                </tr>

                                <tr>
                                    <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                        Estimated start date
                                </td>
                                    <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                        {this.state.CaseInfo.ReqEstStartDate}
                                    </td>
                                    <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                        Estimated end date
                                </td>
                                    <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                        {this.state.CaseInfo.ReqEstEndDate}
                                    </td>

                                </tr>

                                <tr>
                                    <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                        Professional Category
                                </td>
                                    <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                        {this.state.CaseInfo.ReqProfessionalCat}
                                    </td>
                                    <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                        Work location
                                </td>
                                    <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                        {this.state.CaseInfo.ReqWorkLocation}
                                    </td>

                                </tr>



                                <tr>
                                    <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                        Number of positions
                                </td>
                                    <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                        {this.state.FormData.ReqNumPositions}
                                    </td>

                                </tr>


                            </tbody>


                        </table>
                    </div>
                }
            </React.Fragment>
        );
    }

    private renderCommercial_info() {

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Commercial</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Framework
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.ComFramework}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Confirm if you have a Fieldglass account
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.ComPSRAccount}
                                </td>

                            </tr>


                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Justification if not PSR
                                </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <div dangerouslySetInnerHTML={{ __html: this.state.FormData.ComJustification && this.state.FormData.ComJustification.split('\n').join('<br/>') }} ></div>
                                </td>

                            </tr>


                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderResourcingJustification_info() {

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Resourcing Justification</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Alternative resourcing options: set out what other options have been considered and why these are not suitable
                                </td>
                                <td style={{ width: '81%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <div dangerouslySetInnerHTML={{ __html: this.state.FormData.JustAltOptions && this.state.FormData.JustAltOptions.split('\n').join('<br/>') }} ></div>

                                </td>

                            </tr>


                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Succession planning: explain how you plan to manage knowledge transfer and reduce reliance on contingent labour
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <div dangerouslySetInnerHTML={{ __html: this.state.FormData.JustSuccessionPlanning && this.state.FormData.JustSuccessionPlanning.split('\n').join('<br/>') }} ></div>
                                </td>

                            </tr>


                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderFinance_info() {

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Finance</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Expected daily rate including fee (excluding vat)
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {this.state.FormData.FinMaxRate}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Estimated cost
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.FormData.FinEstCost}
                                </td>

                            </tr>


                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Confirm whether in-scope of IR35
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', }}>
                                    {this.state.CaseInfo.FinIR35Scope}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Attach IR35 assesment evidence
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.IR35Evidence &&
                                        <div>
                                            <div>
                                                <span>{this.state.IR35Evidence.AttachmentType === "Link" ? "Linked evidence available" : "PDF evidence available to download"}&nbsp;<span style={{ marginLeft: '5px', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={this.viewIR35Evidence} >View</span></span>
                                            </div>
                                            <div style={{ fontSize: '12px', fontStyle: 'italic', paddingTop: '5px', }}>
                                                {this.state.IR35Evidence.Details}
                                            </div>
                                        </div>

                                    }
                                </td>

                            </tr>


                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderOther_info() {

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Other</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Any additional comments
                                </td>
                                <td style={{ width: '81%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>

                                    <div dangerouslySetInnerHTML={{ __html: this.state.FormData.OtherComments && this.state.FormData.OtherComments.split('\n').join('<br/>') }} ></div>
                                </td>


                            </tr>




                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderApprovers_info() {

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Approvers</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Budget holder
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.BHUser}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Finance business partner
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.FBPUser}
                                </td>

                            </tr>


                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    HR business partner
                                </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.HRBPUser}
                                </td>

                            </tr>


                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderBudgetHolderApprovalDecision_info() {

        //hide this section if user is BH
        if (this.props.superUserPermission === false && this.props.currentUserId === this.state.FormData.BHUserId) {
            console.log('user is BH, hide renderBudgetHolderApprovalDecision_info');
            return null;
        }



        let decision: string = "";
        if (this.state.FormData.BHApprovalDecision !== null) {
            const x1 = this.approvalDecisionItems.filter(x => x.key === this.state.FormData.BHApprovalDecision);
            if (x1.length > 0) {
                decision = x1[0].afterDecisionText;
            }
        }

        if (decision === "") {
            decision = "Decision not made yet";
        }

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Budget Holder Approval Decision</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Decision
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {decision}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    By/Date
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.BHDecisionByAndDate}
                                </td>

                            </tr>


                            {/* <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Comments
                                </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <div dangerouslySetInnerHTML={{ __html: this.state.FormData.BHApprovalComments && this.state.FormData.BHApprovalComments.split('\n').join('<br/>') }} ></div>
                                </td>

                            </tr> */}


                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderFinanceBusinessPartnerApprovalDecision_info() {

        //hide this section if user is FBP
        if (this.props.superUserPermission === false && this.props.currentUserId === this.state.FormData.FBPUserId) {
            console.log('user is FBP, hide renderFinanceBusinessPartnerApprovalDecision_info');
            return null;
        }

        let decision: string = "";
        if (this.state.FormData.FBPApprovalDecision !== null) {
            const x1 = this.approvalDecisionItems.filter(x => x.key === this.state.FormData.FBPApprovalDecision);
            if (x1.length > 0) {
                decision = x1[0].afterDecisionText;
            }
        }

        if (decision === "") {
            decision = "Decision not made yet";
        }

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Finance Business Partner Approval Decision</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Decision
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {decision}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    By/Date
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.FBPDecisionByAndDate}
                                </td>

                            </tr>


                            {/* <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Comments
                                </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <div dangerouslySetInnerHTML={{ __html: this.state.FormData.FBPApprovalComments && this.state.FormData.FBPApprovalComments.split('\n').join('<br/>') }} ></div>
                                </td>

                            </tr> */}


                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderHRBusinessPartnerApprovalDecision_info() {

        //hide this section if user is HRBP
        if (this.props.superUserPermission === false && this.props.currentUserId === this.state.FormData.HRBPUserId) {
            console.log('user is HRBP, hide renderHRBusinessPartnerApprovalDecision_info');
            return null;
        }

        let decision: string = "";
        if (this.state.FormData.HRBPApprovalDecision !== null) {
            const x1 = this.approvalDecisionItems.filter(x => x.key === this.state.FormData.HRBPApprovalDecision);
            if (x1.length > 0) {
                decision = x1[0].afterDecisionText;
            }
        }

        if (decision === "") {
            decision = "Decision not made yet";
        }

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>HR Business Partner Approval Decision</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Decision
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {decision}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    By/Date
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.HRBPDecisionByAndDate}
                                </td>

                            </tr>


                            {/* <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Comments
                                </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <div dangerouslySetInnerHTML={{ __html: this.state.FormData.HRBPApprovalComments && this.state.FormData.HRBPApprovalComments.split('\n').join('<br/>') }} ></div>
                                </td>

                            </tr> */}


                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }


    private renderBudgetHolderApprovalDecision() {

        //show this section if user is BH/super user
        if (this.props.superUserPermission === true || this.props.currentUserId === this.state.FormData.BHUserId) {
            console.log('user is BH/super user, show renderBudgetHolderApprovalDecision');
        }
        else {
            return null;
        }


        const fd = this.state.FormData;

        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Budget Holder Approval Decision</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div /*className={styles.formField}*/>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>
                                <span>Case Decision</span>

                            </div>

                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ minWidth: '50%', }}>
                                <CrChoiceGroup
                                    className="inlineflex"
                                    options={this.approvalDecisionItems}
                                    selectedKey={fd.BHApprovalDecision}
                                    onChange={(ev, option) => this.changeChoiceGroup(ev, option, "BHApprovalDecision")}
                                />



                            </div>
                            {fd.BHApprovalDecision === 'RequireDetails' && <div style={{ width: 'auto' }}>

                                <div style={{ textAlign: 'right', fontSize: '12px', fontStyle: 'italic', paddingTop: '0px', marginTop: '0px', paddingLeft: '10px', paddingRight: '10px' }}>
                                    Note: Please use the discussion box at the bottom of the page to specify what further information you require.
                                </div>

                            </div>}



                        </div>
                    </div>

                    {/* 2nd row */}

                    {/* <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>
                                <span>General comments or request for further details</span>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '100%' }}>
                                <CrTextField
                                    multiline={true}
                                    rows={6}
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField(v, "BHApprovalComments")}
                                    value={fd.BHApprovalComments}

                                />



                            </div>

                        </div>
                    </div> */}



                </div>





            </div>
        );
    }

    private renderFinanceBusinessPartnerApprovalDecision() {

        //show this section if user is FBP/super user
        if (this.props.superUserPermission === true || this.props.currentUserId === this.state.FormData.FBPUserId) {
            console.log('user is FBP/super user, show renderFinanceBusinessPartnerApprovalDecision');
        }
        else {
            return null;
        }

        const fd = this.state.FormData;
        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Finance Business Partner Approval Decision</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div /*className={styles.formField}*/>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>
                                <span>Case Decision</span>

                            </div>

                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ minWidth: '50%', }}>
                                <CrChoiceGroup
                                    className="inlineflex"
                                    options={this.approvalDecisionItems}
                                    selectedKey={fd.FBPApprovalDecision}
                                    onChange={(ev, option) => this.changeChoiceGroup(ev, option, "FBPApprovalDecision")}
                                />



                            </div>
                            {fd.FBPApprovalDecision === 'RequireDetails' && <div style={{ width: 'auto' }}>

                                <div style={{ textAlign: 'right', fontSize: '12px', fontStyle: 'italic', paddingTop: '0px', marginTop: '0px', paddingLeft: '10px', paddingRight: '10px' }}>
                                    Note: Please use the discussion box at the bottom of the page to specify what further information you require.
                                </div>

                            </div>}


                        </div>
                    </div>

                    {/* 2nd row */}

                    {/* <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>
                                <span>General comments or request for further details</span>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '100%' }}>
                                <CrTextField
                                    multiline={true}
                                    rows={6}
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField(v, "FBPApprovalComments")}
                                    value={fd.FBPApprovalComments}

                                />



                            </div>

                        </div>
                    </div> */}



                </div>





            </div>
        );
    }

    private renderHRBusinessPartnerApprovalDecision() {

        //show this section if user is HRBP/super user
        if (this.props.superUserPermission === true || this.props.currentUserId === this.state.FormData.HRBPUserId) {
            console.log('user is HRBP/super user, show renderFinanceBusinessPartnerApprovalDecision');
        }
        else {
            return null;
        }

        const fd = this.state.FormData;
        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>HR Business Partner Approval Decision</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div /*className={styles.formField}*/>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>
                                <span>Case Decision</span>

                            </div>

                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ minWidth: '50%', }}>
                                <CrChoiceGroup
                                    className="inlineflex"
                                    options={this.approvalDecisionItems}
                                    selectedKey={fd.HRBPApprovalDecision}
                                    onChange={(ev, option) => this.changeChoiceGroup(ev, option, "HRBPApprovalDecision")}
                                />



                            </div>
                            {fd.HRBPApprovalDecision === 'RequireDetails' && <div style={{ width: 'auto' }}>

                                <div style={{ textAlign: 'right', fontSize: '12px', fontStyle: 'italic', paddingTop: '0px', marginTop: '0px', paddingLeft: '10px', paddingRight: '10px' }}>
                                    Note: Please use the discussion box at the bottom of the page to specify what further information you require.
                                </div>

                            </div>}


                        </div>
                    </div>

                    {/* 2nd row */}

                    {/* <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>
                                <span>General comments or request for further details</span>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '100%' }}>
                                <CrTextField
                                    multiline={true}
                                    rows={6}
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField(v, "HRBPApprovalComments")}
                                    value={fd.HRBPApprovalComments}

                                />



                            </div>

                        </div>
                    </div> */}



                </div>





            </div>
        );
    }

    private renderFormButtons_ApprovalStage() {

        const isSuperUserOrApproverPermission: boolean = this.isSuperUserOrApprover();

        //show this section if user is HRBP/super user
        if (isSuperUserOrApproverPermission === true) {
            console.log('show renderFormButtons_ApprovalStage');
        }
        else {
            console.log('dont show renderFormButtons_ApprovalStage');
            return null;
        }

        return (
            <div>
                {

                    <React.Fragment>
                        {<PrimaryButton text="Submit Decision" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.saveData(false, true)}
                        />}

                        <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.props.onShowList()}
                        />


                    </React.Fragment>
                }



            </div>
        );


    }


    private renderOnboarding() {

        //if (this.state.Stage !== "Onboarding") return;
        if (this.props.defForm === null) return;

        const genderOptions: IDropdownOption[] = [
            { key: 'Male', text: 'Male' },
            { key: 'Female', text: 'Female' },
        ];

        const fd = this.state.FormDataWorker;



        const req_OnbContractorGender_Img = fd.OnbContractorGender !== null ? this.checkIconGreen : this.checkIconRed;
        const req_OnbContractorTitleId_Img = fd.OnbContractorTitleId !== null ? this.checkIconGreen : this.checkIconRed;
        const req_OnbContractorFirstname_Img = fd.OnbContractorFirstname !== null && fd.OnbContractorFirstname.length > 1 ? this.checkIconGreen : this.checkIconRed;
        const req_OnbContractorSurname_Img = fd.OnbContractorSurname !== null && fd.OnbContractorSurname.length > 1 ? this.checkIconGreen : this.checkIconRed;
        const req_OnbContractorDob_Img = fd.OnbContractorDob !== null ? this.checkIconGreen : this.checkIconRed;
        const req_OnbContractorNINum_Img = fd.OnbContractorNINum !== null && fd.OnbContractorNINum.length > 1 ? this.checkIconGreen : this.checkIconRed;
        const req_OnbContractorPhone_Img = fd.OnbContractorPhone !== null && fd.OnbContractorPhone.length > 1 ? this.checkIconGreen : this.checkIconRed;
        const req_OnbContractorEmail_Img = fd.OnbContractorEmail !== null && fd.OnbContractorEmail.length > 1 ? this.checkIconGreen : this.checkIconRed;
        const req_OnbContractorHomeAddress_Img = fd.OnbContractorHomeAddress !== null && fd.OnbContractorHomeAddress.length > 1 ? this.checkIconGreen : this.checkIconRed;
        const req_OnbContractorPostCode_Img = fd.OnbContractorPostCode !== null && fd.OnbContractorPostCode.length > 1 ? this.checkIconGreen : this.checkIconRed;

        const req_OnbStartDate_Img = fd.OnbStartDate !== null ? this.checkIconGreen : this.checkIconRed;
        const req_OnbEndDate_Img = fd.OnbEndDate !== null && fd.OnbEndDate > fd.OnbStartDate ? this.checkIconGreen : this.checkIconRed;

        const req_OnbDayRate_Img = fd.OnbDayRate !== null && fd.OnbDayRate > 0 ? this.checkIconGreen : this.checkIconRed;
        const req_OnbSecurityClearanceId_Img = fd.OnbSecurityClearanceId !== null ? this.checkIconGreen : this.checkIconRed;
        const req_ContractorSecurityCheckEvidence_Img = this.state.ContractorSecurityCheckEvidence !== null ? this.checkIconGreen : this.checkIconRed;

        //workdays
        let totalWorkingDays: number = 0;
        if (fd.OnbWorkingDayMon === true) totalWorkingDays++;
        if (fd.OnbWorkingDayTue === true) totalWorkingDays++;
        if (fd.OnbWorkingDayWed === true) totalWorkingDays++;
        if (fd.OnbWorkingDayThu === true) totalWorkingDays++;
        if (fd.OnbWorkingDayFri === true) totalWorkingDays++;
        if (fd.OnbWorkingDaySat === true) totalWorkingDays++;
        if (fd.OnbWorkingDaySun === true) totalWorkingDays++;

        const req_workDays_Img = totalWorkingDays > 0 ? this.checkIconGreen : this.checkIconRed;


        const req_OnbDecConflictId_Img = fd.OnbDecConflictId !== null ? this.checkIconGreen : this.checkIconRed;

        const req_OnbLineManagerUserId_Img = fd.OnbLineManagerUserId !== null ? this.checkIconGreen : this.checkIconRed;
        const req_OnbLineManagerGradeId_Img = fd.OnbLineManagerGradeId !== null ? this.checkIconGreen : this.checkIconRed;
        const req_OnbLineManagerEmployeeNum_Img = fd.OnbLineManagerEmployeeNum !== null && fd.OnbLineManagerEmployeeNum.length > 1 ? this.checkIconGreen : this.checkIconRed;
        const req_OnbLineManagerPhone_Img = fd.OnbLineManagerPhone !== null && fd.OnbLineManagerPhone.length > 1 ? this.checkIconGreen : this.checkIconRed;



        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Onboarding</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div className={styles.formField} dangerouslySetInnerHTML={{ __html: this.props.defForm.OnboardingStageFormText && this.props.defForm.OnboardingStageFormText }}></div>

                    <div style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'underline', paddingBottom: '25px' }}>
                        Contractor Details
                    </div>
                    {/* 1st row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor gender</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbContractorGender_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor title</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbContractorTitleId_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrDropdown
                                    placeholder="Select an Option"
                                    options={genderOptions}
                                    selectedKey={fd.OnbContractorGender}
                                    onChanged={(v) => this.changeDropdown_Worker(v, "OnbContractorGender")}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDropdown
                                    placeholder="Select an Option"
                                    options={this.state.LookupData.PersonTitles.map((p) => { return { key: p.ID, text: p.Title }; })}
                                    selectedKey={fd.OnbContractorTitleId}
                                    onChanged={(v) => this.changeDropdown_Worker(v, "OnbContractorTitleId")}
                                />

                            </div>




                        </div>
                    </div>

                    {/* 2nd row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor firstname</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbContractorFirstname_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor surname</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbContractorSurname_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField_Worker(v, "OnbContractorFirstname")}
                                    value={fd.OnbContractorFirstname}

                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrTextField
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField_Worker(v, "OnbContractorSurname")}
                                    value={fd.OnbContractorSurname}

                                />

                            </div>




                        </div>
                    </div>

                    {/* 3rd row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor date of birth</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbContractorDob_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor NI Number</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbContractorNINum_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    value={fd.OnbContractorDob}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "OnbContractorDob")}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrTextField
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField_Worker(v, "OnbContractorNINum")}
                                    value={fd.OnbContractorNINum}

                                />

                            </div>




                        </div>
                        {
                            
                            <div style={{ display: 'flex' }}>
                                {/* <div style={{ width: '50%' }}>&nbsp;</div> */}
                                <div style={{ width: '50%', fontSize: '12px', fontStyle: 'italic', paddingTop: '5px', marginTop: '0px', paddingLeft: '0px' }}>
                                    Enter manually as dd/mm/yyyy or use date picker
                                </div>
                            </div>
                        }
                    </div>

                    {/* 4th row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor telephone (personal)</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbContractorPhone_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor email (personal)</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbContractorEmail_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField_Worker(v, "OnbContractorPhone")}
                                    value={fd.OnbContractorPhone}

                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrTextField
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField_Worker(v, "OnbContractorEmail")}
                                    value={fd.OnbContractorEmail}

                                />

                            </div>




                        </div>
                    </div>

                    {/* 5th row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor home address (personal)</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbContractorHomeAddress_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor post code (personal)</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbContractorPostCode_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField_Worker(v, "OnbContractorHomeAddress")}
                                    value={fd.OnbContractorHomeAddress}

                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrTextField
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField_Worker(v, "OnbContractorPostCode")}
                                    value={fd.OnbContractorPostCode}

                                />

                            </div>




                        </div>
                    </div>

                    <div style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'underline', paddingBottom: '25px' }}>
                        Vacancy Details
                    </div>

                    {/* 1st row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Start date</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbStartDate_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>End date</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbEndDate_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    value={fd.OnbStartDate}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "OnbStartDate")}
                                //required={true}
                                //errorMessage={this.state.ErrMessages.CurrentPeriodStartDate}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    //className={styles.width100percent}
                                    value={fd.OnbEndDate}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "OnbEndDate")}
                                //required={true}
                                //errorMessage={this.state.ErrMessages.CurrentPeriodStartDate}
                                />

                            </div>




                        </div>

                        {
                            (fd.OnbStartDate !== null && fd.OnbEndDate !== null && (fd.OnbEndDate <= fd.OnbStartDate)) &&
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '50%' }}>&nbsp;</div>
                                <div style={{ width: '50%', fontSize: '12px', fontStyle: 'italic', paddingTop: '5px', marginTop: '0px', paddingLeft: '0px' }}>
                                    End date should be greater than start date
                                    </div>
                            </div>
                        }

                    </div>


                    {/* 2rd row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Daily rate (including fee) agreed</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbDayRate_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Purchase order number</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        {/* <img src={reqVacancyTitleValidationImg} /> */}
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
                                    //numbersOnly={true}
                                    onBlur={(ev) => this.blurRateTextField_Worker(ev, "OnbDayRate")}
                                    onChanged={(v) => this.changeTextField_number_Worker(v, "OnbDayRate")}
                                    value={fd.OnbDayRate && String(fd.OnbDayRate)}
                                //value=''

                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrTextField
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField_Worker(v, "PurchaseOrderNum")}
                                    value={fd.PurchaseOrderNum}

                                />

                            </div>




                        </div>
                    </div>


                    {/* 3rd row */}


                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Security clearance</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbSecurityClearanceId_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Security checks confirmation evidence</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_ContractorSecurityCheckEvidence_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrDropdown
                                    placeholder="Select an Option"
                                    options={this.state.LookupData.CLSecurityClearances.map((p) => { return { key: p.ID, text: p.Title }; })}
                                    selectedKey={fd.OnbSecurityClearanceId}
                                    onChanged={(v) => this.changeDropdown_Worker(v, "OnbSecurityClearanceId")}
                                />



                            </div>

                            <div style={{ width: 'calc(100% - 50% - 130px)', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
                                    //onChanged={(v) => this.changeTextField(v, "TargetDate")}
                                    //value={fd.TargetDate}
                                    disabled={true}
                                    style={{ border: '1px solid gray' }}
                                    value={this.state.ContractorSecurityCheckEvidence && (this.state.ContractorSecurityCheckEvidence.AttachmentType === "Link" ? "Linked evidence available" : this.state.ContractorSecurityCheckEvidence.AttachmentType === "PDF" ? "PDF evidence available to download" : "")}

                                />

                            </div>
                            <div style={{ width: '130px', marginTop: '5px' }}>

                                {
                                    <span>
                                        {this.state.ContractorSecurityCheckEvidence === null && <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={this.addContractorSecurityCheckEvidence} >Add</span>}
                                        {this.state.ContractorSecurityCheckEvidence !== null && <span style={{ marginRight: '5px', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={this.viewContractorSecurityCheckEvidence} >View</span>}
                                        {this.state.ContractorSecurityCheckEvidence !== null && <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={this.toggleContractorSecurityCheckEvDeleteConfirm} >Delete</span>}
                                    </span>
                                }

                            </div>




                        </div>

                        {


                            this.state.ContractorSecurityCheckEvidence !== null &&

                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '50%' }}>&nbsp;</div>
                                <div style={{ width: '50%', fontSize: '12px', fontStyle: 'italic', paddingTop: '5px', marginTop: '0px', paddingLeft: '0px' }}>
                                    {this.state.ContractorSecurityCheckEvidence.Details}
                                </div>
                            </div>

                        }


                    </div>

                    {/* 4th row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Work days</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_workDays_Img} />
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ paddingRight: '15px' }}>
                                <CrCheckbox
                                    //className={`${styles.formField} ${styles.checkbox}`}
                                    label="Monday"
                                    checked={fd.OnbWorkingDayMon}
                                    onChange={(ev, isChecked) => this.changeCheckbox_Worker(isChecked, "OnbWorkingDayMon")}
                                />
                            </div>

                            <div style={{ paddingRight: '15px' }}>
                                <CrCheckbox
                                    //className={`${styles.formField} ${styles.checkbox}`}
                                    label="Tuesday"
                                    checked={fd.OnbWorkingDayTue}
                                    onChange={(ev, isChecked) => this.changeCheckbox_Worker(isChecked, "OnbWorkingDayTue")}
                                />
                            </div>

                            <div style={{ paddingRight: '15px' }}>
                                <CrCheckbox
                                    //className={`${styles.formField} ${styles.checkbox}`}
                                    label="Wednesday"
                                    checked={fd.OnbWorkingDayWed}
                                    onChange={(ev, isChecked) => this.changeCheckbox_Worker(isChecked, "OnbWorkingDayWed")}
                                />
                            </div>

                            <div style={{ paddingRight: '15px' }}>
                                <CrCheckbox
                                    //className={`${styles.formField} ${styles.checkbox}`}
                                    label="Thursday"
                                    checked={fd.OnbWorkingDayThu}
                                    onChange={(ev, isChecked) => this.changeCheckbox_Worker(isChecked, "OnbWorkingDayThu")}
                                />
                            </div>

                            <div style={{ paddingRight: '15px' }}>
                                <CrCheckbox
                                    //className={`${styles.formField} ${styles.checkbox}`}
                                    label="Friday"
                                    checked={fd.OnbWorkingDayFri}
                                    onChange={(ev, isChecked) => this.changeCheckbox_Worker(isChecked, "OnbWorkingDayFri")}
                                />
                            </div>

                            <div style={{ paddingRight: '15px' }}>
                                <CrCheckbox
                                    //className={`${styles.formField} ${styles.checkbox}`}
                                    label="Saturday"
                                    checked={fd.OnbWorkingDaySat}
                                    onChange={(ev, isChecked) => this.changeCheckbox_Worker(isChecked, "OnbWorkingDaySat")}
                                />
                            </div>

                            <div style={{ paddingRight: '15px' }}>
                                <CrCheckbox
                                    //className={`${styles.formField} ${styles.checkbox}`}
                                    label="Sunday"
                                    checked={fd.OnbWorkingDaySun}
                                    onChange={(ev, isChecked) => this.changeCheckbox_Worker(isChecked, "OnbWorkingDaySun")}
                                />
                            </div>


                        </div>


                    </div>


                    {/* 5th row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Declaration of conflict of interest</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbDecConflictId_Img} />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '100%', }}>
                                <CrDropdown
                                    placeholder="Select an Option"
                                    options={this.state.LookupData.CLDeclarationConflicts.map((p) => { return { key: p.ID, text: p.Title }; })}
                                    selectedKey={fd.OnbDecConflictId}
                                    onChanged={(v) => this.changeDropdown_Worker(v, "OnbDecConflictId")}
                                />



                            </div>

                        </div>
                    </div>


                    <div style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'underline', paddingBottom: '25px' }}>
                        Line Manager
                    </div>



                    {/* 1st row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Name of Line Manager</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbLineManagerUserId_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Line Manager grade</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbLineManagerGradeId_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={fd.OnbLineManagerUserId && [fd.OnbLineManagerUserId]}
                                    onChange={(v) => this.changeUserPicker_Worker(v, 'OnbLineManagerUserId')}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDropdown
                                    placeholder="Select an Option"
                                    options={this.state.LookupData.CLStaffGrades.map((p) => { return { key: p.ID, text: p.Title }; })}
                                    selectedKey={fd.OnbLineManagerGradeId}
                                    onChanged={(v) => this.changeDropdown_Worker(v, "OnbLineManagerGradeId")}
                                />

                            </div>




                        </div>
                    </div>



                    {/* 2nd row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Line Manager Employee Number</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbLineManagerEmployeeNum_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Line Manager telephone number</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbLineManagerPhone_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField_Worker(v, "OnbLineManagerEmployeeNum")}
                                    value={fd.OnbLineManagerEmployeeNum}
                                    autoComplete='*'

                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrTextField
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField_Worker(v, "OnbLineManagerPhone")}
                                    value={fd.OnbLineManagerPhone}

                                />

                            </div>




                        </div>
                    </div>




                </div>





            </div>
        );
    }

    private renderFormButtons_OnboardingStage() {

        return (
            <div>

                {

                    <React.Fragment>
                        {<PrimaryButton text="Save as Draft" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.saveData_Worker(false, false, false, false, false)}
                        />}

                        <PrimaryButton text="Submit to Engaged" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.saveData_Worker(true, false, false, false, false)}
                        />

                        <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.props.onShowList()}
                        />


                    </React.Fragment>
                }



            </div>
        );


    }

    private renderOnboarding_info() {

        const fd = this.state.FormDataWorker;
        const caseInfo = this.state.CaseInfo;

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Onboarding</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor gender
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {fd.OnbContractorGender}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor title
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.OnbContractorTitle}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor firstname
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {fd.OnbContractorFirstname}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor surname
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {fd.OnbContractorSurname}
                                </td>


                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor date of birth
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {caseInfo.OnbContractorDobStr}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor NI Number
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {fd.OnbContractorNINum}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor telephone (personal)
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {fd.OnbContractorPhone}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor email (personal)
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {fd.OnbContractorEmail}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor home address (personal)
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {fd.OnbContractorHomeAddress}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor post code (personal)
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {fd.OnbContractorPostCode}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Start date
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {caseInfo.OnbStartDateStr}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    End date
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.OnbEndDateStr}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Daily rate (including fee) agreed
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {fd.OnbDayRate}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Purchase order number
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {fd.PurchaseOrderNum}
                                </td>

                            </tr>
                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Security clearance
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {caseInfo.OnbSecurityClearance}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Security checks confirmation evidence
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.ContractorSecurityCheckEvidence &&
                                        <div>
                                            <div>
                                                <span>{this.state.ContractorSecurityCheckEvidence.AttachmentType === "Link" ? "Linked evidence available" : "PDF evidence available to download"}&nbsp;<span style={{ marginLeft: '5px', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={this.viewContractorSecurityCheckEvidence} >View</span></span>
                                            </div>
                                            <div style={{ fontSize: '12px', fontStyle: 'italic', paddingTop: '5px', }}>
                                                {this.state.ContractorSecurityCheckEvidence.Details}
                                            </div>
                                        </div>

                                    }
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Work days
                                </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.WorkDays}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Declaration of conflict of interest
                                </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.OnbDecConflict}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Name of Line Manager
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {caseInfo.OnbLineManagerUser}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Line Manager grade
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.OnbLineManagerGrade}
                                </td>

                            </tr>
                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    Line Manager Employee Number
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    {fd.OnbLineManagerEmployeeNum}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    Line Manager telephone number
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    {fd.OnbLineManagerPhone}
                                </td>

                            </tr>



                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderEngaged() {

        //if (this.state.Stage !== "Onboarding") return;
        if (this.props.defForm === null) return;

        const fd = this.state.FormDataWorker;

        if (fd.EngagedChecksDone === true) return;

        const req_BPSSCheckedById_Img = fd.BPSSCheckedById !== null ? this.checkIconGreen : this.checkIconRed;
        const req_BPSSCheckedOn_Img = fd.BPSSCheckedOn !== null ? this.checkIconGreen : this.checkIconRed;

        const req_POCheckedById_Img = fd.POCheckedById !== null ? this.checkIconGreen : this.checkIconRed;
        const req_POCheckedOn_Img = fd.POCheckedOn !== null ? this.checkIconGreen : this.checkIconRed;

        const req_ITCheckedById_Img = fd.ITCheckedById !== null ? this.checkIconGreen : this.checkIconRed;
        const req_ITCheckedOn_Img = fd.ITCheckedOn !== null ? this.checkIconGreen : this.checkIconRed;

        const req_UKSBSCheckedById_Img = fd.UKSBSCheckedById !== null ? this.checkIconGreen : this.checkIconRed;
        const req_UKSBSCheckedByOn_Img = fd.UKSBSCheckedOn !== null ? this.checkIconGreen : this.checkIconRed;

        const req_PassCheckedById_Img = fd.PassCheckedById !== null ? this.checkIconGreen : this.checkIconRed;
        const req_PassCheckedOn_Img = fd.PassCheckedOn !== null ? this.checkIconGreen : this.checkIconRed;

        const req_ContractCheckedById_Img = fd.ContractCheckedById !== null ? this.checkIconGreen : this.checkIconRed;
        const req_ContractCheckedOn_Img = fd.ContractCheckedOn !== null ? this.checkIconGreen : this.checkIconRed;




        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Engaged</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div className={styles.formField} dangerouslySetInnerHTML={{ __html: this.props.defForm.EngagedStageFormText && this.props.defForm.EngagedStageFormText }}></div>

                    {/* 1st row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Security clearance checked by</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_BPSSCheckedById_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Security clearance checked on</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_BPSSCheckedOn_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={fd.BPSSCheckedById && [fd.BPSSCheckedById]}
                                    onChange={(v) => this.changeUserPicker_Worker(v, 'BPSSCheckedById', true)}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    value={fd.BPSSCheckedOn}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "BPSSCheckedOn", this.engaged_Checks)}
                                />
                            </div>




                        </div>
                    </div>

                    {/* 2nd row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>PO checked by</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_POCheckedById_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>PO checked on</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_POCheckedOn_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={fd.POCheckedById && [fd.POCheckedById]}
                                    onChange={(v) => this.changeUserPicker_Worker(v, 'POCheckedById', true)}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    value={fd.POCheckedOn}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "POCheckedOn", this.engaged_Checks)}
                                />

                            </div>




                        </div>
                    </div>

                    {/* 3rd row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>IT checked by</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_ITCheckedById_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>IT checked on</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_ITCheckedOn_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={fd.ITCheckedById && [fd.ITCheckedById]}
                                    onChange={(v) => this.changeUserPicker_Worker(v, 'ITCheckedById', true)}
                                />


                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    value={fd.ITCheckedOn}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "ITCheckedOn", this.engaged_Checks)}
                                />

                            </div>




                        </div>
                    </div>

                    {/* 4th row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>IT System Reference</span></div>
                                    <div className={styles.sectionQuestionCol2}>

                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>IT System notes</span></div>
                                    <div className={styles.sectionQuestionCol2}>

                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    onChanged={(v) => this.changeTextField_Worker(v, "ITSystemRef")}
                                    value={fd.ITSystemRef}

                                />


                            </div>

                            <div style={{ width: '50%', }}>
                                <CrTextField
                                    onChanged={(v) => this.changeTextField_Worker(v, "ITSystemNotes")}
                                    value={fd.ITSystemNotes}

                                />

                            </div>




                        </div>
                    </div>

                    {/* 5th row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>UKSBS/Oracle checked by</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_UKSBSCheckedById_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>UKSBS/Oracle checked on</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_UKSBSCheckedByOn_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={fd.UKSBSCheckedById && [fd.UKSBSCheckedById]}
                                    onChange={(v) => this.changeUserPicker_Worker(v, 'UKSBSCheckedById', true)}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    value={fd.UKSBSCheckedOn}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "UKSBSCheckedOn", this.engaged_Checks)}
                                />

                            </div>




                        </div>
                    </div>


                    {/* 6th row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>UKSBS Reference</span></div>
                                    <div className={styles.sectionQuestionCol2}>

                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>UKSBS notes</span></div>
                                    <div className={styles.sectionQuestionCol2}>

                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    onChanged={(v) => this.changeTextField_Worker(v, "UKSBSRef")}
                                    value={fd.UKSBSRef}

                                />


                            </div>

                            <div style={{ width: '50%', }}>
                                <CrTextField
                                    onChanged={(v) => this.changeTextField_Worker(v, "UKSBSNotes")}
                                    value={fd.UKSBSNotes}

                                />

                            </div>




                        </div>
                    </div>



                    {/* 7th row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Pass checked by</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_PassCheckedById_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Pass checked on</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_PassCheckedOn_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={fd.PassCheckedById && [fd.PassCheckedById]}
                                    onChange={(v) => this.changeUserPicker_Worker(v, 'PassCheckedById', true)}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    value={fd.PassCheckedOn}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "PassCheckedOn", this.engaged_Checks)}
                                />

                            </div>




                        </div>
                    </div>


                    {/* 8th row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contract checked by</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_ContractCheckedById_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contract checked on</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_ContractCheckedOn_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={fd.ContractCheckedById && [fd.ContractCheckedById]}
                                    onChange={(v) => this.changeUserPicker_Worker(v, 'ContractCheckedById', true)}
                                />


                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    value={fd.ContractCheckedOn}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "ContractCheckedOn", this.engaged_Checks)}
                                />

                            </div>




                        </div>
                    </div>




                </div>





            </div>
        );
    }

    private renderFormButtons_EngagedStage() {

        if (this.state.FormDataWorker.EngagedChecksDone === true) return;

        return (
            <div>

                {

                    <React.Fragment>
                        {<PrimaryButton text="Save" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.saveData_Worker(false, true, false, false, false)}
                        />}

                        <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.props.onShowList()}
                        />

                        {this.state.Engaged_MoveToChecksDoneBtn && <PrimaryButton text="Move to Checks Done" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.saveData_Worker(false, true, true, false, false)}
                        />}


                    </React.Fragment>
                }



            </div>
        );


    }

    private renderEngaged_info() {

        const caseInfo = this.state.CaseInfo;
        const fd = this.state.FormDataWorker;

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Engaged</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Security clearance checked by
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.BPSSCheckedBy}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Security clearance checked on
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.BPSSCheckedOn}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    PO checked by
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {caseInfo.POCheckedBy}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    PO checked on
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.POCheckedOn}
                                </td>


                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    IT checked by
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {caseInfo.ITCheckedBy}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    IT checked on
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.ITCheckedOn}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    IT System Reference
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {fd.ITSystemRef}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    IT System notes
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {fd.ITSystemNotes}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    UKSBS/Oracle checked by
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {caseInfo.UKSBSCheckedBy}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    UKSBS/Oracle checked on
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.UKSBSCheckedOn}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    UKSBS Reference
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {fd.UKSBSRef}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    UKSBS notes
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {fd.UKSBSNotes}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Pass checked by
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {caseInfo.PassCheckedBy}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Pass checked on
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.PassCheckedOn}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    Contract checked by
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.ContractCheckedBy}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    Contract checked on
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.ContractCheckedOn}
                                </td>

                            </tr>


                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderLeaving() {

        if (this.props.defForm === null) return;


        const fd = this.state.FormDataWorker;

        const req_LeEndDate_Img = fd.LeEndDate !== null ? this.checkIconGreen : this.checkIconRed;
        const req_LeContractorPhone_Img = fd.LeContractorPhone !== null && fd.LeContractorPhone.length > 1 ? this.checkIconGreen : this.checkIconRed;
        const req_LeContractorEmail_Img = fd.LeContractorEmail !== null && fd.LeContractorEmail.length > 1 ? this.checkIconGreen : this.checkIconRed;
        const req_LeContractorHomeAddress_Img = fd.LeContractorHomeAddress !== null && fd.LeContractorHomeAddress.length > 1 ? this.checkIconGreen : this.checkIconRed;
        const req_LeContractorPostCode_Img = fd.LeContractorPostCode !== null && fd.LeContractorPostCode.length > 1 ? this.checkIconGreen : this.checkIconRed;


        const req_LeContractorDetailsCheckedById_Img = fd.LeContractorDetailsCheckedById !== null ? this.checkIconGreen : this.checkIconRed;
        const req_LeContractorDetailsCheckedOn_Img = fd.LeContractorDetailsCheckedOn !== null ? this.checkIconGreen : this.checkIconRed;

        const req_LeITCheckedById_Img = fd.LeITCheckedById !== null ? this.checkIconGreen : this.checkIconRed;
        const req_LeITCheckedOn_Img = fd.LeITCheckedOn !== null ? this.checkIconGreen : this.checkIconRed;

        const req_LeUKSBSCheckedById_Img = fd.LeUKSBSCheckedById !== null ? this.checkIconGreen : this.checkIconRed;
        const req_LeUKSBSCheckedOn_Img = fd.LeUKSBSCheckedOn !== null ? this.checkIconGreen : this.checkIconRed;

        const req_LePassCheckedById_Img = fd.LePassCheckedById !== null ? this.checkIconGreen : this.checkIconRed;
        const req_LePassCheckedOn_Img = fd.LePassCheckedOn !== null ? this.checkIconGreen : this.checkIconRed;



        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Leaving</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div className={styles.formField} dangerouslySetInnerHTML={{ __html: this.props.defForm.LeavingStageFormText && this.props.defForm.LeavingStageFormText }}></div>

                    <div style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'underline', paddingBottom: '25px' }}>
                        Confirm Contractor Details
                    </div>

                    {/* 1st row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>End date</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LeEndDate_Img} />
                                    </div>
                                </div>

                            </div>



                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '100%', }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    value={fd.LeEndDate}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "LeEndDate")}

                                />



                            </div>


                        </div>
                    </div>

                    {/* 2nd row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor telephone (personal)</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LeContractorPhone_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor email (personal)</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LeContractorEmail_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    onChanged={(v) => this.changeTextField_Worker(v, "LeContractorPhone")}
                                    value={fd.LeContractorPhone}

                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrTextField
                                    onChanged={(v) => this.changeTextField_Worker(v, "LeContractorEmail")}
                                    value={fd.LeContractorEmail}

                                />

                            </div>




                        </div>
                    </div>

                    {/* 3rd row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor home address (personal)</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LeContractorHomeAddress_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor post code (personal)</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LeContractorPostCode_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    onChanged={(v) => this.changeTextField_Worker(v, "LeContractorHomeAddress")}
                                    value={fd.LeContractorHomeAddress}

                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrTextField
                                    onChanged={(v) => this.changeTextField_Worker(v, "LeContractorPostCode")}
                                    value={fd.LeContractorPostCode}

                                />

                            </div>




                        </div>
                    </div>

                    <div style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'underline', paddingBottom: '25px' }}>
                        Checks
                    </div>

                    {/* 1st row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor details above checked by</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LeContractorDetailsCheckedById_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor details above checked on</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LeContractorDetailsCheckedOn_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={fd.LeContractorDetailsCheckedById && [fd.LeContractorDetailsCheckedById]}
                                    onChange={(v) => this.changeUserPicker_Worker(v, 'LeContractorDetailsCheckedById', false, true)}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    value={fd.LeContractorDetailsCheckedOn}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "LeContractorDetailsCheckedOn", this.leaving_Checks)}
                                />
                            </div>




                        </div>
                    </div>

                    {/* 2nd row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>IT checked by</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LeITCheckedById_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>IT checked on</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LeITCheckedOn_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={fd.LeITCheckedById && [fd.LeITCheckedById]}
                                    onChange={(v) => this.changeUserPicker_Worker(v, 'LeITCheckedById', false, true)}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    value={fd.LeITCheckedOn}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "LeITCheckedOn", this.leaving_Checks)}
                                />

                            </div>




                        </div>
                    </div>

                    {/* 3rd row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>UKSBS/Oracle checked by</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LeUKSBSCheckedById_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>UKSBS/Oracle checked on</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LeUKSBSCheckedOn_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={fd.LeUKSBSCheckedById && [fd.LeUKSBSCheckedById]}
                                    onChange={(v) => this.changeUserPicker_Worker(v, 'LeUKSBSCheckedById', false, true)}
                                />


                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    value={fd.LeUKSBSCheckedOn}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "LeUKSBSCheckedOn", this.leaving_Checks)}
                                />

                            </div>




                        </div>
                    </div>

                    {/* 4th row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Pass checked by</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LePassCheckedById_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Pass checked on</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LePassCheckedOn_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.state.LookupData.Users}
                                    itemLimit={1}
                                    selectedEntities={fd.LePassCheckedById && [fd.LePassCheckedById]}
                                    onChange={(v) => this.changeUserPicker_Worker(v, 'LePassCheckedById', false, true)}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    value={fd.LePassCheckedOn}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "LePassCheckedOn", this.leaving_Checks)}
                                />

                            </div>




                        </div>
                    </div>






                </div>





            </div>
        );
    }

    private renderFormButtons_LeavingStage() {

        //if (this.state.FormDataWorker.EngagedChecksDone === true) return;

        return (
            <div>

                {

                    <React.Fragment>
                        {<PrimaryButton text="Save" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.saveData_Worker(false, false, false, true, false)}
                        />}

                        <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.props.onShowList()}
                        />

                        {this.state.Leaving_MoveToArchiveBtn && <PrimaryButton text="Move to Archive" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.saveData_Worker(false, false, false, true, true)}
                        />}


                    </React.Fragment>
                }



            </div>
        );


    }

    private renderLeaving_info() {

        const caseInfo = this.state.CaseInfo;
        const fd = this.state.FormDataWorker;

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Leaving</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    End Date
                                </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.LeEndDateStr}
                                </td>

                            </tr>
                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor telephone (personal)
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {fd.LeContractorPhone}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor email (personal)
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {fd.LeContractorEmail}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor home address (personal)
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {fd.LeContractorHomeAddress}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor post code (personal)
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {fd.LeContractorPostCode}
                                </td>


                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor details above checked by
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {caseInfo.LeContractorDetailsCheckedBy}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor details above checked on
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.LeContractorDetailsCheckedOn}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    IT checked by
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {caseInfo.LeITCheckedBy}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    IT checked on
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.LeITCheckedOn}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    UKSBS/Oracle checked by
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {caseInfo.LeUKSBSCheckedBy}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    UKSBS/Oracle checked on
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.LeUKSBSCheckedOn}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Pass checked by
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {caseInfo.LePassCheckedBy}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Pass checked on
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.LePassCheckedOn}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    Contract checked by
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.ContractCheckedBy}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    Contract checked on
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.ContractCheckedOn}
                                </td>

                            </tr>


                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderCloseButton_HistoricCase() {


        return (
            <div>
                {

                    <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
                        onClick={() => this.props.onShowCaseTab()}
                    />


                }



            </div>
        );


    }


    //#region Data Load/Save

    private validateEntity = (submitForApproval: boolean, submitDecision): boolean => {
        const fd = this.state.FormData;

        if (submitForApproval === true) {
            //details of application
            if (this.state.FormData.ApplHMUserId === null) return false;

            //requirement
            if (fd.ReqVacancyTitle !== null && fd.ReqVacancyTitle.length > 1) { } else { return false; }
            if (fd.ReqGradeId !== null) { } else { return false; }
            if (fd.ReqWorkPurpose !== null && fd.ReqWorkPurpose.length > 9) { } else { return false; }
            if (fd.ReqCostCentre !== null && fd.ReqCostCentre.length === 6) { } else { return false; }
            if (fd.ReqDirectorateId !== null) { } else { return false; }
            if (fd.ReqEstStartDate !== null) { } else { return false; }

            if (fd.ReqEstEndDate !== null && fd.ReqEstEndDate > fd.ReqEstStartDate) { } else { return false; }
            if (fd.ReqProfessionalCatId !== null) { } else { return false; }
            if (fd.ReqWorkLocationId !== null) { } else { return false; }
            if (fd.ReqNumPositions !== null && fd.ReqNumPositions > 0) { } else { return false; }

            //Commercial
            if (fd.ComFrameworkId !== null) { } else { return false; }
            if (fd.ComFrameworkId === 1 && fd.ComPSRAccountId === null) { return false; }

            if (fd.ComFrameworkId > 1) {
                if (fd.ComJustification !== null && fd.ComJustification.length > 9) {
                    //validation ok
                }
                else {
                    return false;
                }
            }

            //Resourcing Justification
            if (fd.JustAltOptions !== null && fd.JustAltOptions.length > 9) { } else { return false; }
            if (fd.JustSuccessionPlanning !== null && fd.JustSuccessionPlanning.length > 9) { } else { return false; }

            //Finance
            if (fd.FinMaxRate !== null && fd.FinMaxRate > 0) { } else { return false; }
            if (fd.FinEstCost !== null && fd.FinEstCost > 0) { } else { return false; }
            if (fd.FinIR35ScopeId !== null) { } else { return false; }
            if (this.state.IR35Evidence === null) { return false; }

            //Approvers
            if (this.state.FormData.BHUserId === null) return false;
            if (this.state.FormData.FBPUserId === null) return false;
            if (this.state.FormData.HRBPUserId === null) return false;

        }


        //at the end return true
        return true;
    }

    private validateEntity_Onboarding = (submitToEngaged: boolean): boolean => {
        if (submitToEngaged === true) {

            const fd = this.state.FormDataWorker;
            if (fd.OnbContractorGender === null) return false;
            if (fd.OnbContractorTitleId === null) return false;
            if (fd.OnbContractorFirstname !== null && fd.OnbContractorFirstname.length > 1) { } else return false;
            if (fd.OnbContractorSurname !== null && fd.OnbContractorSurname.length > 1) { } else return false;
            if (fd.OnbContractorDob === null) return false;
            if (fd.OnbContractorNINum !== null && fd.OnbContractorNINum.length > 1) { } else return false;
            if (fd.OnbContractorPhone !== null && fd.OnbContractorPhone.length > 1) { } else return false;
            if (fd.OnbContractorEmail !== null && fd.OnbContractorEmail.length > 1) { } else return false;
            if (fd.OnbContractorHomeAddress !== null && fd.OnbContractorHomeAddress.length > 1) { } else return false;
            if (fd.OnbContractorPostCode !== null && fd.OnbContractorPostCode.length > 1) { } else return false;

            if (fd.OnbStartDate === null) return false;
            if (fd.OnbEndDate !== null && fd.OnbEndDate > fd.OnbStartDate) { } else { return false; }
            if (fd.OnbDayRate !== null && fd.OnbDayRate > 0) { } else return false;
            if (fd.OnbSecurityClearanceId === null) return false;
            if (this.state.ContractorSecurityCheckEvidence === null) return false;

            //workdays
            let totalWorkingDays: number = 0;
            if (fd.OnbWorkingDayMon === true) totalWorkingDays++;
            if (fd.OnbWorkingDayTue === true) totalWorkingDays++;
            if (fd.OnbWorkingDayWed === true) totalWorkingDays++;
            if (fd.OnbWorkingDayThu === true) totalWorkingDays++;
            if (fd.OnbWorkingDayFri === true) totalWorkingDays++;
            if (fd.OnbWorkingDaySat === true) totalWorkingDays++;
            if (fd.OnbWorkingDaySun === true) totalWorkingDays++;

            if (totalWorkingDays === 0) return false;


            if (fd.OnbDecConflictId === null) return false;

            if (fd.OnbLineManagerUserId === null) return false;
            if (fd.OnbLineManagerGradeId === null) return false;
            if (fd.OnbLineManagerEmployeeNum !== null && fd.OnbLineManagerEmployeeNum.length > 1) { } else return false;
            if (fd.OnbLineManagerPhone !== null && fd.OnbLineManagerPhone.length > 1) { } else return false;



        }


        //at the end return true
        return true;

    }


    private saveData = (submitForApproval: boolean, submitDecision): void => {
        if (this.validateEntity(submitForApproval, submitDecision)) {
            console.log('in save data');
            if (this.props.onError) this.props.onError(null);
            let f: ICLCase = { ...this.state.FormData };
            //remove all the child and parent entities before sending post/patch
            //delete f.User; //parent entity

            if (this.isNumeric(f.FinMaxRate) === true) {
                f.FinMaxRate = Number(f.FinMaxRate);
            }
            else {
                f.FinMaxRate = null;
            }

            if (this.isNumeric(f.FinEstCost) === true) {
                f.FinEstCost = Number(f.FinEstCost);
            }
            else {
                f.FinEstCost = null;
            }

            //
            if (submitForApproval === true) {
                f.Title = "SubmitForApproval"; //for api to know its a request for approval
            }

            if (submitDecision === true) {
                f.Title = "SubmitDecision";
            }

            this.clCaseService.updatePut(f.ID, f).then((): void => {
                //console.log('saved..');

                if (this.props.onError)
                    this.props.onError(null);

                if (submitForApproval === true) {
                    //
                    console.log('submit for approval - done');
                    this.setState({ HideSubmitApprovalDoneMessage: false });
                }
                else {
                    this.props.onShowList();
                }



            }, (err) => {
                if (this.props.onError)
                    this.props.onError(`Error saving data`, err.message);
            });

        }
        else {
            //validation is false
            console.log('validations required');
            this.setState({ HideFormValidationMessage: false });
        }
    }

    private saveData_Worker = (submitToEngaged: boolean, saveEngaged: boolean, moveToChecksDone: boolean, saveLeaving: boolean, moveToArchive: boolean): void => {
        if (this.validateEntity_Onboarding(submitToEngaged)) {

            console.log('in saveData_Onboarding');
            if (this.props.onError) this.props.onError(null);
            let f: ICLWorker = { ...this.state.FormDataWorker };
            //remove all the child and parent entities before sending post/patch
            //delete f.User; //parent entity

            if (this.isNumeric(f.OnbDayRate) === true) {
                f.OnbDayRate = Number(f.OnbDayRate);
            }
            else {
                f.OnbDayRate = null;
            }



            //
            if (submitToEngaged === true) {
                f.Title = "SubmitToEngaged"; //for api to know its a request for SubmitToEngaged
            }
            else if (saveEngaged === true) {
                if (moveToChecksDone === true) {
                    f.Title = "SaveEngaged_MoveToChecksDone"; //for api to know its a request from Move to Checks Done button
                }
                else {
                    f.Title = "SaveEngaged"; //for api to know its a request for Save button from Engaged state
                }

            }
            else if (saveLeaving === true) {
                if (moveToArchive === true) {
                    f.Title = "SaveLeaving_MoveToArchive";
                }
                else {
                    f.Title = "SaveLeaving";
                }

            }


            this.clWorkerService.updatePut(f.ID, f).then((): void => {
                //console.log('saved..');

                if (this.props.onError)
                    this.props.onError(null);

                if (submitToEngaged === true) {
                    //
                    console.log('submitToEngaged - done');
                    this.setState({ HideSubmitEngagedDoneMessage: false });
                }
                else {
                    this.props.onShowList();
                }



            }, (err) => {
                if (this.props.onError)
                    this.props.onError(`Error saving data`, err.message);
            });

        }
        else {
            //validation is false
            console.log('validations required');
            this.setState({ HideFormValidationMessage: false });
        }
    }




    private loadUsers = (): void => {
        this.userService.readAll().then((data: IUser[]): IUser[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Users", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Users lookup data`, err.message); });
    }

    private loadCLStaffGrades = (): void => {
        this.clStaffGradeService.readAll().then((data: IUser[]): IUser[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "CLStaffGrades", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading CLStaffGrades lookup data`, err.message); });
    }
    private loadDirectorates = (): void => {
        this.directorateService.readAll().then((data: IUser[]): IUser[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Directorates", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Directorates lookup data`, err.message); });
    }
    private loadCLProfessionalCats = (): void => {
        this.clProfessionalCatService.readAll().then((data: IUser[]): IUser[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "CLProfessionalCats", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading CLProfessionalCats lookup data`, err.message); });
    }

    private loadCLWorkLocations = (): void => {
        this.clWorkLocationService.readAll().then((data: IUser[]): IUser[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "CLWorkLocations", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading CLWorkLocations lookup data`, err.message); });
    }
    private loadCLComFrameworks = (): void => {
        this.clComFrameworkService.readAll().then((data: IEntity[]): IEntity[] => {
            console.log('loadCLComFrameworks - data', data);
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "CLComFrameworks", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading CLWorkLocations lookup data`, err.message); });
    }
    private loadCLIR35Scopes = (): void => {
        this.clIR35ScopeService.readAll().then((data: IUser[]): IUser[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "CLIR35Scopes", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading CLIR35Scopes lookup data`, err.message); });
    }
    private loadCLSecurityClearances = (): void => {
        if (this.state.Stage !== "Onboarding") return;

        this.clSecurityClearanceService.readAll().then((data: IEntity[]): IEntity[] => {
            console.log('loadCLSecurityClearances - data', data);
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "CLSecurityClearances", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading CLSecurityClearances lookup data`, err.message); });
    }

    private loadCLDeclarationConflicts = (): void => {
        if (this.state.Stage !== "Onboarding") return;

        this.clDeclarationConflictService.readAll().then((data: IEntity[]): IEntity[] => {
            console.log('CLDeclarationConflicts - data', data);
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "CLDeclarationConflicts", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading CLDeclarationConflicts lookup data`, err.message); });
    }

    private loadPersonTitles = (): void => {
        if (this.state.Stage !== "Onboarding") return;

        this.personTitleService.readAll().then((data: IEntity[]): IEntity[] => {
            console.log('PersonTitles - data', data);
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "PersonTitles", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading PersonTitles lookup data`, err.message); });
    }

    protected loadLookups(): Promise<any> {

        return Promise.all([
            this.loadUsers(),
            this.loadCLStaffGrades(),
            this.loadDirectorates(),
            this.loadCLProfessionalCats(),
            this.loadCLWorkLocations(),
            this.loadCLComFrameworks(),
            this.loadCLIR35Scopes(),
            this.loadCLSecurityClearances(),
            this.loadPersonTitles(),
            this.loadCLDeclarationConflicts(),
            this.loadCaseInfo(),
            this.loadClCase(),
            this.loadIR35Evidence(),
            //this.loadDefForm(),
            this.loadCLWorker(),
            this.loadContractorSecurityCheckEvidence(),

        ]);
    }


    public componentDidMount(): void {
        //this.loadUpdates();

        this.setState({ Loading: true, Stage: this.props.stage }, this.callBackFirstLoad

        );
    }
    private callBackFirstLoad = (): void => {
        let loadingPromises = [this.loadLookups()];

        Promise.all(loadingPromises).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));

    }

    private loadClCase = (): void => {

        if (this.props.clCaseId > 0) {

            this.clCaseService.read(this.props.clCaseId).then((c: ICLCase) => {
                console.log('ClCase', c);



                this.setState({
                    FormData: c,
                }, () => {
                    this.blurRateTextField(null, "FinMaxRate");
                    setTimeout(() => {
                        this.blurRateTextField(null, "FinEstCost");


                    }, 2000);

                });




            }, (err) => {
                if (this.props.onError) this.props.onError(`Error loading case`, err.message);
            });

        }
        else {
            //set hiring manage to the current user as default for new case
            this.setState({ FormData: this.cloneObject(this.state.FormData, 'ApplHMUserId', this.props.currentUserId) });
        }
    }

    private loadCaseInfo = (): void => {

        if (this.props.clCaseId > 0) {
            this.clCaseService.getCaseInfo(this.props.clCaseId, this.props.clWorkerId).then((x: IClCaseInfo) => {
                console.log('Case Info', x);

                this.setState({
                    CaseInfo: x
                });


            }, (err) => {
                if (this.props.onError) this.props.onError(`Error loading Case info`, err.message);
            });
        }
        else {
            let x = { ...this.state.CaseInfo };
            x.Stage = "Draft";
            x.CreatedBy = this.props.currentUserName;
            x.CaseRef = "Available after creation";
            x.CreatedOn = "Available after creation";
            this.setState({ CaseInfo: x });
        }




    }

    private loadIR35Evidence = (): void => {

        if (this.props.clCaseId > 0) {
            const counter: number = this.state.EvidenceChangesCounter + 1;
            this.clCaseEvidenceService.readIR35Evidence(this.props.clCaseId).then((x: ICLCaseEvidence[]) => {
                console.log('IR35 EV', x);
                if (x.length > 0) {
                    const ir35Ev: ICLCaseEvidence = x[0];

                    this.setState({
                        IR35Evidence: ir35Ev,
                        EvidenceChangesCounter: counter,
                    });
                }
                else {
                    this.setState({
                        IR35Evidence: null,
                        EvidenceChangesCounter: counter,
                    });
                }




            }, (err) => {
                if (this.props.onError) this.props.onError(`Error loading Case IR35 Evidence`, err.message);
            });
        }
        else {
            // let x = {...this.state.CaseInfo};
            // x.Stage = "Draft";
            // x.CreatedBy = this.props.currentUserName;
            // x.CaseRef = "Available after creation";
            // x.CreatedOn = "Available after creation";
            // this.setState({ CaseInfo: x });
        }

    }

    // private loadDefForm = (): Promise<void> => {
    //     if (this.state.Stage === "Onboarding" || this.state.Stage === "Engaged") {
    //         //ok - load data
    //     }
    //     else {
    //         return;
    //     }

    //     console.log('loadDefForm');
    //     let x = this.clDefFormService.readDefForm().then((df: ICLDefForm): void => {
    //         console.log('df ', df);
    //         this.setState({ DefForm: df });

    //     }, (err) => { if (this.props.onError) this.props.onError(`Error loading df`, err.message); });
    //     return x;
    // }

    private loadCLWorker = (): void => {

        const stage = this.state.Stage;
        if (stage === "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left") {
            //ok - load data
        }
        else {
            return;
        }

        this.clWorkerService.read(this.props.clWorkerId).then((w: ICLWorker) => {
            console.log('CLWorker', w);
            this.setState({
                FormDataWorker: w,
            }, () => {
                this.blurRateTextField_Worker(null, "OnbDayRate");

                if (this.state.Stage === "Engaged") {
                    this.engaged_Checks();
                }


            });


        }, (err) => {
            if (this.props.onError) this.props.onError(`Error loading worker`, err.message);
        });
    }

    private loadContractorSecurityCheckEvidence = (): void => {

        const stage = this.state.Stage;
        if (stage === "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left") {
            //ok - load data
        }
        else {
            return;
        }

        //const counter: number = this.state.EvidenceChangesCounter + 1;
        this.clCaseEvidenceService.readContractorSecurityCheckEvidence(this.props.clWorkerId).then((x: ICLCaseEvidence[]) => {
            console.log('loadContractorSecurityCheckEvidence', x);
            if (x.length > 0) {
                const contractorSecurityCheckEvidence: ICLCaseEvidence = x[0];

                this.setState({
                    ContractorSecurityCheckEvidence: contractorSecurityCheckEvidence,
                    //EvidenceChangesCounter: counter,
                });
            }
            else {
                this.setState({
                    ContractorSecurityCheckEvidence: null,
                    //EvidenceChangesCounter: counter,
                });
            }




        }, (err) => {
            if (this.props.onError) this.props.onError(`Error loading Case ContractorSecurityCheckEvidence Evidence`, err.message);
        });

    }


    //#endregion Data Load/Save


    //#region Event Handlers


    private handleEvidence_ChangeFilterText = (value: string): void => {
        this.setState({ Evidence_ListFilterText: value });
    }



    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }

    protected changeTextField_number = (value: string, f: string): void => {

        if (value == null || value == '') {
            console.log('set value to null');
            this.setState({ FormData: this.cloneObject(this.state.FormData, f, null)/*, FormIsDirty: true*/ });
        }
        else {
            const isNum: boolean = this.isNumeric(value);
            console.log('isNumeric', isNum);
            if (isNum === true) {
                this.setState({ FormData: this.cloneObject(this.state.FormData, f, value)/*, FormIsDirty: true*/ });
            }
            else {
                this.setState({ FormData: this.cloneObject(this.state.FormData, f, this.state.FormData[f])/*, FormIsDirty: true*/ });
            }

        }

    }
    private changeTextField_number_Worker = (value: string, f: string): void => {

        if (value == null || value == '') {
            console.log('set value to null');
            this.setState({ FormDataWorker: this.cloneObject(this.state.FormDataWorker, f, null)/*, FormIsDirty: true*/ });
        }
        else {
            const isNum: boolean = this.isNumeric(value);
            console.log('isNumeric', isNum);
            if (isNum === true) {
                this.setState({ FormDataWorker: this.cloneObject(this.state.FormDataWorker, f, value)/*, FormIsDirty: true*/ });
            }
            else {
                this.setState({ FormDataWorker: this.cloneObject(this.state.FormDataWorker, f, this.state.FormDataWorker[f])/*, FormIsDirty: true*/ });
            }

        }

    }

    protected changeTextField = (value: string, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value)/*, FormIsDirty: true*/ });
    }

    private changeTextField_Worker = (value: string, f: string): void => {
        this.setState({ FormDataWorker: this.cloneObject(this.state.FormDataWorker, f, value)/*, FormIsDirty: true*/ });
    }


    private changeCheckbox_Worker = (value: boolean, f: string): void => {
        this.setState({ FormDataWorker: this.cloneObject(this.state.FormDataWorker, f, value)/*, FormIsDirty: true*/ });
    }
    private changeDropdown = (option: IDropdownOption, f: string, index?: number): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, option.key), /*FormIsDirty: true*/ });
    }
    private changeDropdown_Worker = (option: IDropdownOption, f: string, index?: number): void => {
        this.setState({ FormDataWorker: this.cloneObject(this.state.FormDataWorker, f, option.key), /*FormIsDirty: true*/ });
    }
    protected changeChoiceGroup = (ev, option: IChoiceGroupOption, f: string): void => {
        const selectedKey = option.key;
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, selectedKey)/*, FormIsDirty: true*/ });

    }
    private changeUserPicker = (value: number[], f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value.length === 1 ? value[0] : null), });
    }
    private changeUserPicker_Worker = (value: number[], f: string, engagedChecks?: boolean, leavingChecks?: boolean): void => {
        this.setState({
            FormDataWorker: this.cloneObject(this.state.FormDataWorker, f, value.length === 1 ? value[0] : null),
        },
            () => {
                if (engagedChecks === true) {
                    this.engaged_Checks();
                }
            }
        );
    }

    private engaged_Checks = (): void => {
        const fd = this.state.FormDataWorker;
        if (fd.BPSSCheckedById !== null && fd.BPSSCheckedOn !== null &&
            fd.POCheckedById !== null && fd.POCheckedOn !== null &&
            fd.ITCheckedById !== null && fd.ITCheckedOn !== null &&
            fd.UKSBSCheckedById !== null && fd.UKSBSCheckedOn !== null &&
            fd.PassCheckedById !== null && fd.PassCheckedOn !== null &&
            fd.ContractCheckedById !== null && fd.ContractCheckedOn !== null) {
            console.log('engaged all checks ok');
            this.setState({ Engaged_MoveToChecksDoneBtn: true });
        }
        else {
            console.log('all engaged checks not done');
            this.setState({ Engaged_MoveToChecksDoneBtn: false });
        }
    }

    private leaving_Checks = (): void => {
        const fd = this.state.FormDataWorker;

        if (fd.LeEndDate !== null &&
            fd.LeContractorPhone !== null && fd.LeContractorPhone.length > 1 &&
            fd.LeContractorEmail !== null && fd.LeContractorEmail.length > 1 &&
            fd.LeContractorHomeAddress !== null && fd.LeContractorHomeAddress.length > 1 &&
            fd.LeContractorPostCode !== null && fd.LeContractorPostCode.length > 1 &&

            fd.LeContractorDetailsCheckedById !== null && fd.LeContractorDetailsCheckedOn !== null &&
            fd.LeITCheckedById !== null && fd.LeITCheckedOn !== null &&
            fd.LeUKSBSCheckedById !== null && fd.LeUKSBSCheckedOn !== null &&
            fd.LePassCheckedById !== null && fd.LePassCheckedOn !== null) {
            console.log('leaving all checks ok');
            this.setState({ Leaving_MoveToArchiveBtn: true });
        }
        else {
            console.log('all leaving checks not done');
            this.setState({ Leaving_MoveToArchiveBtn: false });
        }

    }

    private isNumeric(str: any) {
        const tempNum = Number(str);
        //if (typeof str != "string") return false; // we only process strings!  
        return !isNaN(tempNum) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
    }

    private blurRateTextField = (ev, f: string): void => {
        console.log('blur', f);
        if (Number(this.state.FormData[f]) > 0) {
            const rateStr = Number(this.state.FormData[f]).toFixed(2);
            this.setState({ FormData: this.cloneObject(this.state.FormData, f, rateStr)/*, FormIsDirty: true*/ });
        }
        else {
            console.log('value is less than 0');
        }

    }
    private blurRateTextField_Worker = (ev, f: string): void => {
        console.log('blur', f);
        if (Number(this.state.FormDataWorker[f]) > 0) {
            const rateStr = Number(this.state.FormDataWorker[f]).toFixed(2);
            this.setState({ FormDataWorker: this.cloneObject(this.state.FormDataWorker, f, rateStr)/*, FormIsDirty: true*/ });
        }
        else {
            console.log('value is less than 0');
        }

    }

    private calculateRate = (): void => {
        if (this.state.FormData.ReqEstStartDate != null && this.state.FormData.ReqEstEndDate != null && this.state.FormData.ReqNumPositions > 0 && this.state.FormData.FinMaxRate > 0) {
            const startDate: Date = new Date(this.state.FormData.ReqEstStartDate.getTime());
            const endDate: Date = new Date(this.state.FormData.ReqEstEndDate.getTime());
            const days: number = this.getBusinessDatesCount(startDate, endDate);
            console.log('days', days);

            const numPositions: number = this.state.FormData.ReqNumPositions;
            const dayRate: number = this.state.FormData.FinMaxRate;

            const totalCost: string = (numPositions * dayRate * days).toFixed(2);
            console.log('totalCost', totalCost);

            //const fd: ICLCase = this.cloneObject(this.state.FormData);
            //fd.FinEstCost = Number(totalCost);

            //this.setState({ FormData: fd });


            this.setState({ FormData: this.cloneObject(this.state.FormData, 'FinEstCost', totalCost) });
            //this.setState({ FormData: this.cloneObject(this.state.FormData, 'FinEstCost', totalCost) });





        }
        else {
            console.log('both dates and other values are not provided');
        }
    }
    private addIr35Evidence = () => {
        console.log('in addIr35Evidence');
        this.setState({ ShowIR35EvidenceForm: true });

    }
    private addContractorSecurityCheckEvidence = () => {
        console.log('in addContractorSecurityCheckEvidence');
        this.setState({ ShowContractorSecurityCheckEvidenceForm: true });

    }

    private ir35EvidenceSaved = (): void => {
        //this.loadEvidences();
        this.closeIR35EvidencePanel();
        this.loadIR35Evidence();

    }

    private contractorSecurityCheckEvidenceSaved = (): void => {
        //this.loadEvidences();
        this.closeContractorSecurityCheckEvidencePanel();
        this.loadContractorSecurityCheckEvidence();

    }

    private closeIR35EvidencePanel = (): void => {
        this.setState({ ShowIR35EvidenceForm: false });
    }
    private closeContractorSecurityCheckEvidencePanel = (): void => {
        this.setState({ ShowContractorSecurityCheckEvidenceForm: false });
    }

    //#endregion Event Handlers


    //     var startDate = new Date('05/03/2016');
    // var endDate = new Date('05/10/2016');
    // var numOfDates = getBusinessDatesCount(startDate,endDate);

    private getBusinessDatesCount = (startDate: Date, endDate: Date): number => {
        var count = 0;
        var curDate = startDate;
        while (curDate <= endDate) {
            var dayOfWeek = curDate.getDay();
            if (!((dayOfWeek == 6) || (dayOfWeek == 0)))
                count++;
            curDate.setDate(curDate.getDate() + 1);
        }
        //alert(count)
        return count;
    }

    private viewIR35Evidence = (): void => {
        console.log('in view.');
        const fileName: string = this.state.IR35Evidence.Title;
        if (this.state.IR35Evidence.AttachmentType === "Link") {
            console.log('selected evidence is a link');

            const a = document.createElement('a');
            //document.body.appendChild(a);
            a.href = fileName;
            a.target = "_blank";
            //a.download = fileName;

            document.body.appendChild(a);
            console.log(a);
            //a.click();
            //document.body.removeChild(a);


            setTimeout(() => {
                window.URL.revokeObjectURL(fileName);
                window.open(fileName, '_blank');
                document.body.removeChild(a);
            }, 1);




        }
        else {
            const f = sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Evidence).files.getByName(fileName);

            f.get().then(t => {
                console.log(t);
                const serverRelativeUrl = t["ServerRelativeUrl"];
                console.log(serverRelativeUrl);

                const a = document.createElement('a');
                //document.body.appendChild(a);
                a.href = serverRelativeUrl;
                a.target = "_blank";
                a.download = fileName;

                document.body.appendChild(a);
                console.log(a);
                //a.click();
                //document.body.removeChild(a);


                setTimeout(() => {
                    window.URL.revokeObjectURL(serverRelativeUrl);
                    window.open(serverRelativeUrl, '_blank');
                    document.body.removeChild(a);
                }, 1);


            });
        }




    }

    private viewContractorSecurityCheckEvidence = (): void => {
        console.log('in viewContractorSecurityCheckEvidence.');
        const fileName: string = this.state.ContractorSecurityCheckEvidence.Title;
        if (this.state.ContractorSecurityCheckEvidence.AttachmentType === "Link") {
            console.log('selected evidence is a link');

            const a = document.createElement('a');
            //document.body.appendChild(a);
            a.href = fileName;
            a.target = "_blank";
            //a.download = fileName;

            document.body.appendChild(a);
            console.log(a);
            //a.click();
            //document.body.removeChild(a);


            setTimeout(() => {
                window.URL.revokeObjectURL(fileName);
                window.open(fileName, '_blank');
                document.body.removeChild(a);
            }, 1);




        }
        else {
            const f = sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Evidence).files.getByName(fileName);

            f.get().then(t => {
                console.log(t);
                const serverRelativeUrl = t["ServerRelativeUrl"];
                console.log(serverRelativeUrl);

                const a = document.createElement('a');
                //document.body.appendChild(a);
                a.href = serverRelativeUrl;
                a.target = "_blank";
                a.download = fileName;

                document.body.appendChild(a);
                console.log(a);
                //a.click();
                //document.body.removeChild(a);


                setTimeout(() => {
                    window.URL.revokeObjectURL(serverRelativeUrl);
                    window.open(serverRelativeUrl, '_blank');
                    document.body.removeChild(a);
                }, 1);


            });
        }




    }

    private toggleIR35EvDeleteConfirm = (): void => {
        this.setState({ HideIR35EvDeleteDialog: !this.state.HideIR35EvDeleteDialog });
    }

    private toggleContractorSecurityCheckEvDeleteConfirm = (): void => {
        this.setState({ HideContractorSecurityCheckEvDeleteDialog: !this.state.HideContractorSecurityCheckEvDeleteDialog });
    }


    private deleteIR35Evidence = (): void => {
        if (this.props.onError) this.props.onError(null);
        this.setState({ HideIR35EvDeleteDialog: true });

        const fileName: string = this.state.IR35Evidence.Title;
        //console.log(fileName);

        if (this.state.IR35Evidence.AttachmentType === "Link") {

            console.log('deleting eveidence (link)');
            this.clCaseEvidenceService.delete(this.state.IR35Evidence.ID).then(this.loadIR35Evidence, (err) => {
                if (this.props.onError) this.props.onError(`Cannot delete this evidence. `, err.message);
            });
        }
        else {

            sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Evidence).files.getByName(fileName).delete().then(df => {
                //console.log('file deleted', df);

                this.clCaseEvidenceService.delete(this.state.IR35Evidence.ID).then(this.loadIR35Evidence, (err) => {
                    if (this.props.onError) this.props.onError(`Cannot delete this evidence. `, err.message);
                });
            });
        }
    }

    private deleteContractorSecurityCheckEvidence = (): void => {
        if (this.props.onError) this.props.onError(null);
        this.setState({ HideContractorSecurityCheckEvDeleteDialog: true });

        const fileName: string = this.state.ContractorSecurityCheckEvidence.Title;
        //console.log(fileName);

        if (this.state.ContractorSecurityCheckEvidence.AttachmentType === "Link") {

            console.log('deleting eveidence (link)');
            this.clCaseEvidenceService.delete(this.state.ContractorSecurityCheckEvidence.ID).then(this.loadContractorSecurityCheckEvidence, (err) => {
                if (this.props.onError) this.props.onError(`Cannot delete this evidence. `, err.message);
            });
        }
        else {

            sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Evidence).files.getByName(fileName).delete().then(df => {
                //console.log('file deleted', df);

                this.clCaseEvidenceService.delete(this.state.ContractorSecurityCheckEvidence.ID).then(this.loadContractorSecurityCheckEvidence, (err) => {
                    if (this.props.onError) this.props.onError(`Cannot delete this evidence. `, err.message);
                });
            });
        }
    }

    private isSuperUserOrApprover = (): boolean => {
        if (this.props.superUserPermission === true
            || this.props.currentUserId === this.state.FormData.BHUserId
            || this.props.currentUserId === this.state.FormData.FBPUserId
            || this.props.currentUserId === this.state.FormData.HRBPUserId) {
            console.log('isSuperUserOrApprover - true');
            return true;
        }
        else {
            console.log('isSuperUserOrApprover - false');
            return false;
        }
    }

    private isViewOnlyPermission = (): boolean => {

        let isViewOnly: boolean = false;
        if (this.props.viewerPermission === true && this.isSuperUserOrApprover() === false
            && this.state.FormData.ApplHMUserId !== this.props.currentUserId
            && this.state.FormData.CreatedById !== this.props.currentUserId) {
            isViewOnly = true;

        }

        return isViewOnly;
    }

    private afterSubmitEngagedSuccessMsg = (): void => {
        console.log('afterSubmitEngagedSuccessMsg');

        if (this.state.FormData.CaseType === "Extension") {
            console.log('case type is extension, go to the next stage directly');
            this.setState({
                Stage: 'Engaged'
            }, () => {
                this.loadCLWorker();

            });
        }
        else {
            this.props.onShowList(true);
        }


    }

    private onViewExtHistroyClick = (caseId: number, workerId: number, stage: string): void => {
        console.log('onViewExtHistroyClick', caseId, workerId, stage);
        this.props.onShowHistoricCase(workerId, caseId, stage);
    }

}