import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup, IChoiceGroupOption } from '../cr/CrChoiceGroup';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { CrCheckbox } from '../cr/CrCheckbox';
import { FormButtons } from '../cr/FormButtons';
import { MessageDialog, MessageDialogCreateSPFolderWait } from '../cr/MessageDialog';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import EvidenceList from './EV/EvidenceList';
import { SharePointQueryableSecurable, sp } from '@pnp/sp';
import EvidenceSaveForm from './EV/EvidenceSaveForm';
import styles from '../../styles/cr.module.scss';
import { CLCase, ClCaseInfo, ICLCase, ICLCaseEvidence, IClCaseInfo, IEntity, ILinkLocalType, ICLDefForm, IUser, ICLWorker, CLWorker, CLHiringMember, ICLHiringMember } from '../../types';
import { getUploadFolder_CLEvidence } from '../../types/AppGlobals';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import EntityList from '../entity/EntityList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { CrDatePicker } from '../cr/CrDatePicker';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import { changeDatePicker, changeDatePickerV2 } from '../../types/AppGlobals';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import '../../styles/CustomFabric.scss';
import { findScrollableParent, IContextualMenuProps } from 'office-ui-fabric-react';
import { getUploadFolder_CLRoot } from '../../types/AppGlobals';





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
    afterSaveFolderProcess?: (newCase: boolean, caseData: ICLCase, caseDataBeforeChanges: ICLCase) => void;

    users: IUser[];
    superUsersAndViewers: IUser[];
    fullControlFolderRoleId: number;
    currentUserPrincipalId: number;

    //onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;

}

export interface ILookupData {
    CLGenders: IEntity[];
    CLStaffGrades: IEntity[];
    Directorates: IEntity[];
    CLProfessionalCats: IEntity[];
    CLWorkLocations: IEntity[];
    CLComFrameworks: IEntity[];
    CLIR35Scopes: IEntity[];
    CLSecurityClearances: IEntity[];
    CLDeclarationConflicts: IEntity[];
    PersonTitles: IEntity[];
}

export class LookupData implements ILookupData {

    public CLGenders: IEntity[] = [];
    public CLStaffGrades: IEntity[] = [];
    public Directorates: IEntity[] = [];
    public CLProfessionalCats: IEntity[] = [];
    public CLWorkLocations: IEntity[] = [];
    public CLComFrameworks: IEntity[] = [];
    public CLIR35Scopes: IEntity[] = [];
    public CLSecurityClearances: IEntity[] = [];
    public CLDeclarationConflicts: IEntity[] = [];
    public PersonTitles: IEntity[] = [];

}



export interface INewCaseTabState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: ICLCase;
    FormDataBeforeChanges: ICLCase;
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
    ShowAllowChangeHM: boolean;
    ShowAllowChangeRequirement: boolean;
    ShowAllowChangeCommercial: boolean;
    ShowAllowChangeResourcingJustification: boolean;
    ShowAllowChangeFinance: boolean;
    ShowAllowChangeOther: boolean;
    ShowAllowChangeApprovers: boolean;
    ShowAllowChangeOnboarding: boolean;
    //DefForm: ICLDefForm;

    ShowHelpPanel: boolean;
    UserHelpText: string;
    ShowWaitMessage: boolean;
    DisableFinEstCost: boolean;
    CreateFolderWaitMessage: string;


}

export class NewCaseTabState implements INewCaseTabState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData;
    public FormDataBeforeChanges;
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
    public ShowAllowChangeHM: boolean = true;
    public ShowAllowChangeRequirement: boolean = true;
    public ShowAllowChangeCommercial: boolean = true;
    public ShowAllowChangeResourcingJustification: boolean = true;
    public ShowAllowChangeFinance: boolean = true;
    public ShowAllowChangeOther: boolean = true;
    public ShowAllowChangeApprovers: boolean = true;
    public ShowAllowChangeOnboarding: boolean = true;


    public ShowHelpPanel = false;
    public UserHelpText = "";
    public ShowWaitMessage: boolean = false;
    public DisableFinEstCost: boolean = true;
    public CreateFolderWaitMessage: string = "";

    //public DefForm: ICLDefForm = null;

    constructor(caseType: string) {
        this.FormData = new CLCase(caseType);
        this.FormDataBeforeChanges = new CLCase(caseType);
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
    private clGenderService: services.CLGenderService = new services.CLGenderService(this.props.spfxContext, this.props.api);
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
    private clHiringMemberService: services.CLHiringMemberService = new services.CLHiringMemberService(this.props.spfxContext, this.props.api);
    //private clDefFormService: services.CLDefFormService = new services.CLDefFormService(this.props.spfxContext, this.props.api);

    private UploadFolder_Evidence: string = "";
    //private UploadFolder_Report: string = "";
    private UploadFolder_CLRoot: string = "";
    private RoleAssignmentsToAdd: string[] = [];
    private consoleLogFlag: boolean = true;
    private roleAssignmentAdded: boolean = false;
    private RoleAssignmentsToRemove: number[] = [];
    private roleAssignmentRemoved: boolean = false;
    private StayOnNewCaseTab: boolean = false;

    //IChoiceGroupOption
    private approvalDecisionItems: any[] = [
        { key: 'Approve', text: 'Approve', afterDecisionText: 'Approved' },
        { key: 'Reject', text: 'Reject', afterDecisionText: 'Rejected' },
        { key: 'RequireDetails', text: 'Require further details', afterDecisionText: 'Require further details' },
    ];

    private checkIconGreen: string = require('../../images/greentick1212.png');
    private checkIconRed: string = require('../../images/redtick1212.png');
    private helpIcon: string = require('../../images/help2.png');


    private childEntities: types.IFormDataChildEntities[] = [
        { ObjectParentProperty: 'CLHiringMembers', ParentIdProperty: 'CLCaseId', ChildIdProperty: 'UserId', ChildService: this.clHiringMemberService },
    ];



    constructor(props: INewCaseTabProps, state: INewCaseTabState) {
        super(props);
        this.state = new NewCaseTabState('New Case');
        //this.UploadFolder_Evidence = getUploadFolder_CLEvidence(props.spfxContext);
        //this.UploadFolder_Report = getUploadFolder_Report(props.spfxContext);
        this.UploadFolder_CLRoot = getUploadFolder_CLRoot(props.spfxContext);

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
            7: Extended
        
        */



        let isViewOnly: boolean = this.isViewOnlyPermission();

        const stage = this.state.Stage;
        const fdw = this.state.FormDataWorker;

        let archived: boolean = false;
        if (fdw.Archived === true) {
            archived = true;
        }

        const caseCreated = this.checkCaseCreated();


        return (
            <React.Fragment>
                {this.renderSectionTitle()}
                {this.renderInfoTable()}


                {isViewOnly === false && this.renderDetailsOfApplicant()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended" || isViewOnly === true) && this.renderDetailsOfApplicant_info()}

                {isViewOnly === false && this.renderRequirement()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended" || isViewOnly === true) && this.renderRequirement_info()}


                {isViewOnly === false && this.renderCommercial()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended" || isViewOnly === true) && this.renderCommercial_info()}


                {isViewOnly === false && this.renderResourcingJustification()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended" || isViewOnly === true) && this.renderResourcingJustification_info()}


                {isViewOnly === false && this.renderFinance()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended" || isViewOnly === true) && this.renderFinance_info()}


                {isViewOnly === false && this.renderOther()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended" || isViewOnly === true) && this.renderOther_info()}


                {isViewOnly === false && this.renderApprovers()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended" || isViewOnly === true) && this.renderApprovers_info()}


                {stage === "Draft" && isViewOnly === false && this.renderFormButtons_DraftStage()}











                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended" || isViewOnly === true) && this.renderBudgetHolderApprovalDecision_info()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended" || isViewOnly === true) && this.renderFinanceBusinessPartnerApprovalDecision_info()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended" || isViewOnly === true) && this.renderHRBusinessPartnerApprovalDecision_info()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended" || isViewOnly === true) && this.renderCommercialPartnerApprovalDecision_info()}
                {(stage === "Approval" || stage == "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended" || isViewOnly === true) && this.renderCLApprovalDecision_info()}

                {archived === false && (stage === "Approval") && this.renderBudgetHolderApprovalDecision()}
                {archived === false && (stage === "Approval") && this.renderFinanceBusinessPartnerApprovalDecision()}
                {archived === false && (stage === "Approval") && this.renderHRBusinessPartnerApprovalDecision()}
                {archived === false && (stage === "Approval") && this.renderCommercialBusinessPartnerApprovalDecision()}
                {archived === false && (stage === "Approval") && this.renderCLApprovalDecision()}
                {archived === false && stage === "Approval" && this.renderFormButtons_ApprovalStage()}

                {/*stage === "Onboarding" && */isViewOnly === false && this.renderOnboarding()}



                {stage === "Onboarding" && isViewOnly === false && this.renderFormButtons_OnboardingStage()}
                {((stage === "Onboarding" && isViewOnly === true) || (stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended")) && this.renderOnboarding_info()}

                {stage === "Engaged" && isViewOnly === false && this.renderEngaged()}
                {stage === "Engaged" && isViewOnly === false && this.renderFormButtons_EngagedStage()}

                {((stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended") && (isViewOnly === true || fdw.EngagedChecksDone === true)) && this.renderEngaged_info()}


                {stage === "Leaving" && isViewOnly === false && this.renderLeaving()}
                {stage === "Leaving" && isViewOnly === false && this.renderFormButtons_LeavingStage()}
                {((stage === "Left") || (stage === "Leaving" && isViewOnly === true)) && this.renderLeaving_info()}

                <MessageDialogCreateSPFolderWait hidden={!this.state.ShowWaitMessage} title="Please wait" content={this.state.CreateFolderWaitMessage} hideOKButton={true} handleOk={() => { }} />
                {this.renderWaitMessage()}

                {(caseCreated === true) && this.renderListsMainTitle()}

                {(caseCreated === true) && this.renderEvidencesList()}
                {(caseCreated === true) && this.renderChangeLogs()}

                {this.props.historicCase === true && this.renderCloseButton_HistoricCase()}

                {this.state.ShowIR35EvidenceForm && this.renderIR35EvidenceForm()}
                <ConfirmDialog hidden={this.state.HideIR35EvDeleteDialog} title={`Are you sure you want to delete this IR35 assessment  evidence?`} content={`A deleted evidence cannot be un-deleted.`} confirmButtonText="Delete" handleConfirm={this.deleteIR35Evidence} handleCancel={this.toggleIR35EvDeleteConfirm} />

                {this.state.ShowContractorSecurityCheckEvidenceForm && this.renderContractorSecurityCheckEvidenceForm()}
                <ConfirmDialog hidden={this.state.HideContractorSecurityCheckEvDeleteDialog} title={`Are you sure you want to delete this security checks confirmation evidence?`} content={`A deleted evidence cannot be un-deleted.`} confirmButtonText="Delete" handleConfirm={this.deleteContractorSecurityCheckEvidence} handleCancel={this.toggleContractorSecurityCheckEvDeleteConfirm} />

                {/* validation */}
                <MessageDialog hidden={this.state.HideFormValidationMessage} title="Validation Failed" content="Failed validation checks. Please ensure all fields marked with a red asterisk are completed." handleOk={() => { this.setState({ HideFormValidationMessage: true }); }} />

                {/* submit for approval - done */}
                <MessageDialog hidden={this.state.HideSubmitApprovalDoneMessage} title="Validation Successful" content="Validation checks completed successfully. This case is being moved to the approvals stage." handleOk={() => { this.setState({ HideSubmitApprovalDoneMessage: true }, () => this.handleAfterSaveFolderProcess(this.state.FormData, this.state.FormDataBeforeChanges)); }} />

                {/* submit to engaged - done */}
                <MessageDialog hidden={this.state.HideSubmitEngagedDoneMessage} title="Validation Successful" content="Validation checks completed successfully. This case is being moved to the engaged stage." handleOk={() => { this.setState({ HideSubmitEngagedDoneMessage: true }, () => this.afterSubmitEngagedSuccessMsg()); }} />


                <Panel isOpen={this.state.ShowHelpPanel} headerText="" type={PanelType.medium} onDismiss={this.hideHelpPanel} >
                    <div dangerouslySetInnerHTML={{ __html: this.state.UserHelpText }}></div>
                </Panel>

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

                <div style={{ marginBottom: '10px', marginTop: '50px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Case Details</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.CaseDetailsHelpText && this.props.defForm.CaseDetailsHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.CaseDetailsHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>

                </div>

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
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Case ID
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {this.state.FormDataWorker && (this.state.FormDataWorker.ID > 0) && this.state.FormData.ID}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Worker ID
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.FormDataWorker && (this.state.FormDataWorker.ID > 0) && this.state.FormDataWorker.ID}
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
        //if(this.state.FormDataWorker.Archived === true) return;


        if (this.props.stage === "Draft" || (this.state.ShowAllowChangeHM === false)) {
            console.log('renderDetailsOfApplicant - 1');
        }
        else return null;




        const fd_users: ICLHiringMember[] = this.state.FormData['CLHiringMembers'];

        const applHMUserIdValidationImg = this.state.FormData.ApplHMUserId !== null ? this.checkIconGreen : this.checkIconRed;

        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Details of Applicant</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.DetailsOfApplicantEditHelpText && this.props.defForm.DetailsOfApplicantEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.DetailsOfApplicantEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Dept transferring to</span></div>
                                    <div className={styles.sectionQuestionCol2}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '100%', }}>
                                <CrChoiceGroup
                                    className="inlineflex"
                                    options={[
                                        {
                                            key: 'Unknown',
                                            text: 'Unknown',
                                        },
                                        {
                                            key: 'DESNZ',
                                            text: 'DESNZ'
                                        },
                                        {
                                            key: 'DSIT',
                                            text: 'DSIT'
                                        },
                                        {
                                            key: 'DBAT',
                                            text: 'DBAT'
                                        }
                                    ]}
                                    selectedKey={fd.DeptTransferringTo}
                                    onChange={(ev, option) => this.changeChoiceGroup(ev, option, "DeptTransferringTo")}
                                />

                            </div>

                        </div>
                    </div>
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
                                    entities={this.props.users}
                                    itemLimit={1}
                                    selectedEntities={this.state.FormData.ApplHMUserId && [this.state.FormData.ApplHMUserId]}
                                    onChange={(v) => this.changeUserPicker(v, 'ApplHMUserId')}
                                />



                            </div>

                        </div>
                    </div>


                    {/* 2nd row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>


                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Hiring team member</span></div>
                                    <div className={styles.sectionQuestionCol2}>

                                    </div>
                                </div>





                            </div>

                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '100%', }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.props.users}
                                    itemLimit={10}
                                    selectedEntities={fd_users && fd_users.map((owner) => { return owner.UserId; })}
                                    onChange={(v) => this.changeMultiUserPicker(v, 'CLHiringMembers', new CLHiringMember(), 'UserId')}

                                />



                            </div>

                        </div>


                        <div style={{ fontSize: '14px', color: 'navy', fontStyle: 'italic', paddingTop: '0px', marginTop: '2px' }}>
                            Include only essential team members as this form contains personal information.
                        </div>

                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        {this.state.ShowAllowChangeHM === false &&
                            <div>
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => {
                                    this.toggleAllowChangeHM();
                                    this.saveData(false, false, true);
                                }}>Save</span>&nbsp;&nbsp;
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeHM}>Cancel</span>
                            </div>
                        }
                    </div>



                </div>





            </div>
        );
    }

    private renderRequirement() {

        if (this.props.defForm === null) return;

        const fd = this.state.FormData;


        if (this.props.stage === "Draft" || (this.state.ShowAllowChangeRequirement === false)) {
            console.log('renderRequirement - 1');
        }
        else return null;



        // let numPositionsLength: number = 1; //default for hiring manager
        // if (this.props.superUserPermission === true) {
        //     numPositionsLength = 2;
        // }
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
                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Requirement</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.RequirementEditHelpText && this.props.defForm.RequirementEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.RequirementEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
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

                                            {/* inner flex to line 2 images */}
                                            <div style={{ display: 'flex' }}>
                                                <div><img src={reqWorkPurposeValidationImg} /></div>
                                                {/* <div style={{ paddingLeft: '10px', paddingTop: '2px' }} >{(this.props.defForm.WorkProposalHelpText && this.props.defForm.WorkProposalHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.WorkProposalHelpText)}><img src={this.helpIcon} /></a>}</div> */}
                                            </div>


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
                                        //onSelectDate={(v) => changeDatePicker(this, v, "ReqEstStartDate")}
                                        onSelectDate={(v) => changeDatePickerV2(this, 'FormData', v, "ReqEstStartDate", this.calculateTotalDays)}

                                    />



                                </div>

                                <div style={{ width: '50%', }}>
                                    <CrDatePicker
                                        maxWidth='100%'
                                        value={fd.ReqEstEndDate}
                                        //onSelectDate={(v) => changeDatePicker(this, v, "ReqEstEndDate")}
                                        onSelectDate={(v) => changeDatePickerV2(this, 'FormData', v, "ReqEstEndDate", this.calculateTotalDays)}
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
                                        onChanged={(v) => this.changeTextField_ReqNumPositions(v, "ReqNumPositions")}
                                        value={String(fd.ReqNumPositions)}
                                        onBlur={(ev) => this.blurFinBillableRate(ev, "FinBillableRate")}
                                        //numbersOnly={true}
                                        //maxLength={numPositionsLength}
                                        maxLength={2}
                                        readOnly={fd.CaseType === "Extension" ? true : false}

                                    />



                                </div>

                                {
                                    fd.CaseType !== "Extension" &&
                                    <div style={{ width: '50%', }}>

                                        <div style={{ fontSize: '14px', color: 'navy', fontStyle: 'italic', paddingTop: '0px', marginTop: '0px', paddingLeft: '10px' }}>
                                            Note: if case has multiple positions, the system will only show it as one case to the approvers. Once the case has been approved, it will create multiple records for onboarding each worker individually. Max limit is set to 30. Contact Internal Controls if you require more.
                                        </div>
                                    </div>
                                }






                            </div>
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            {this.state.ShowAllowChangeRequirement === false &&
                                <div>
                                    <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => {
                                        this.toggleAllowChangeRequirement();
                                        this.saveData(false, false, true);

                                    }}>Save</span>&nbsp;&nbsp;
                                    <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeRequirement}>Cancel</span>
                                </div>
                            }
                        </div>



                    </div>

                }



            </div>
        );
    }

    private renderCommercial() {


        if (this.props.stage === "Draft" || (this.state.ShowAllowChangeCommercial === false)) {
            console.log('renderCommercial - 1');
        }
        else return null;

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
                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Commercial</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.CommercialEditHelpText && this.props.defForm.CommercialEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.CommercialEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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

                                {fd.ComPSRAccountId === 'No' && <div style={{ color: 'navy', fontSize: '14px', fontStyle: 'italic', paddingTop: '5px', marginTop: '0px', paddingLeft: '0px' }}>
                                    Note: Please contact PSR help desk to have one arranged, you will have to raise a worker requirement on Fieldglass. Email: helpdesk@publicsectorresourcing.co.uk  Phone: 0203 862 2487"
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


                    <div style={{ marginBottom: '10px' }}>
                        {this.state.ShowAllowChangeCommercial === false &&
                            <div>
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => {
                                    this.toggleAllowChangeCommercial();
                                    this.saveData(false, false, true);

                                }}>Save</span>&nbsp;&nbsp;
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeCommercial}>Cancel</span>
                            </div>
                        }
                    </div>



                </div>





            </div>
        );
    }

    private renderResourcingJustification() {

        if (this.props.stage === "Draft" || (this.state.ShowAllowChangeResourcingJustification === false)) {
            console.log('renderCommercial - 1');
        }
        else return null;

        const fd = this.state.FormData;

        const justAltOptionsValidationImg = fd.JustAltOptions !== null && fd.JustAltOptions.length > 9 ? this.checkIconGreen : this.checkIconRed;
        const justSuccessionPlanningValidationImg = fd.JustSuccessionPlanning !== null && fd.JustSuccessionPlanning.length > 9 ? this.checkIconGreen : this.checkIconRed;


        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} >
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Resourcing Justification</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.ResourcingJustificationEditHelpText && this.props.defForm.ResourcingJustificationEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.ResourcingJustificationEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>

                </div>

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


                    <div style={{ marginBottom: '10px' }}>
                        {this.state.ShowAllowChangeResourcingJustification === false &&
                            <div>
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => {
                                    this.toggleAllowChangeResourcingJustification();
                                    this.saveData(false, false, true);

                                }}>Save</span>&nbsp;&nbsp;
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeResourcingJustification}>Cancel</span>
                            </div>
                        }
                    </div>



                </div>





            </div>
        );
    }

    private renderFinance() {

        if (this.props.stage === "Draft" || (this.state.ShowAllowChangeFinance === false)) {
            console.log('renderFinance - 1');
        }
        else return null;

        const caseCreated = this.checkCaseCreated();

        const fd = this.state.FormData;

        const finBillableRateValidationImg = fd.FinBillableRate !== null && fd.FinBillableRate > 0 ? this.checkIconGreen : this.checkIconRed;
        const finTotalDaysValidationImg = fd.FinTotalDays !== null && fd.FinTotalDays > 0 ? this.checkIconGreen : this.checkIconRed;
        const finMaxRateValidationImg = fd.FinMaxRate !== null && fd.FinMaxRate > 0 ? this.checkIconGreen : this.checkIconRed;
        const finEstCostValidationImg = fd.FinEstCost !== null && fd.FinEstCost > 0 ? this.checkIconGreen : this.checkIconRed;
        const finCostPerWorkerValidationImg = fd.FinCostPerWorker !== null && fd.FinCostPerWorker > 0 ? this.checkIconGreen : this.checkIconRed;
        const finIR35ScopeIdValidationImg = fd.FinIR35ScopeId !== null ? this.checkIconGreen : this.checkIconRed;
        const finCalcTypeValidationImg = fd.FinCalcType !== null ? this.checkIconGreen : this.checkIconRed;

        const iR35EvidenceValidationImg = this.state.IR35Evidence !== null ? this.checkIconGreen : this.checkIconRed;
        const approachToAgreeingRateValidationImg = fd.FinApproachAgreeingRate !== null && fd.FinApproachAgreeingRate.length > 9 ? this.checkIconGreen : this.checkIconRed;
        const summaryIR35JustificatValidationImg = fd.FinSummaryIR35Just !== null && fd.FinSummaryIR35Just.length > 9 ? this.checkIconGreen : this.checkIconRed;

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
                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Finance</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.FinanceEditHelpText && this.props.defForm.FinanceEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.FinanceEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>

                </div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Billable day rate (pay rate plus fees)</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={finBillableRateValidationImg} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}>
                                        <span>Rate for approval (billable day rate plus non-recoverable VAT)</span>
                                        {this.state.FormData.FinMaxRate >= 750 && <span style={{ color: 'rgb(254,138,53)', fontStyle: 'italic', paddingLeft: '15px' }}>Additional approval required</span>}
                                    </div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={finMaxRateValidationImg} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
                                    //numbersOnly={true}
                                    onBlur={(ev) => this.blurFinBillableRate(ev, "FinBillableRate")}
                                    onChanged={(v) => this.changeTextField_number(v, "FinBillableRate")}
                                    value={fd.FinBillableRate && String(fd.FinBillableRate)}
                                //value=''

                                />



                            </div>

                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    disabled={true}
                                    onChanged={(v) => this.changeTextField_number(v, "FinMaxRate")}
                                    value={fd.FinMaxRate && String(fd.FinMaxRate)}
                                    style={{ border: '1px solid gray' }}


                                />


                            </div>





                        </div>
                    </div>

                    {/* 2nd row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Total days (Will be taken from start and end dates. Change if required)</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={finTotalDaysValidationImg} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Total assignment cost per worker calculation</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={finCalcTypeValidationImg} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
                                    //numbersOnly={true}
                                    onBlur={(ev) => this.blurFinBillableRate(ev, "FinBillableRate")}
                                    onChanged={(v) => this.changeTextField_number(v, "FinTotalDays")}
                                    value={fd.FinTotalDays && String(fd.FinTotalDays)}
                                //value=''

                                />



                            </div>

                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrDropdown
                                    options={[{ key: 'Automatic', text: 'Automatic' }, { key: 'Manual', text: 'Manual' }]}
                                    onChanged={(v) => this.changeDropdown_FinCalcType(v, "FinCalcType")}
                                    selectedKey={this.state.FormData.FinCalcType}
                                />

                            </div>

                        </div>
                    </div>

                    {/* 3rd row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Total assignment cost</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={finEstCostValidationImg} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Total assignment cost per worker</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={finCostPerWorkerValidationImg} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    onBlur={(ev) => this.blurRateTextField(ev, "FinEstCost")}
                                    onChanged={(v) => this.changeTextField_number(v, "FinEstCost")}
                                    value={fd.FinEstCost && String(fd.FinEstCost)}
                                    disabled={this.state.DisableFinEstCost}
                                    style={{ border: '1px solid gray' }}

                                />



                            </div>

                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    onChanged={(v) => this.changeTextField_number(v, "FinCostPerWorker")}
                                    value={fd.FinCostPerWorker && String(fd.FinCostPerWorker)}
                                    disabled={this.state.DisableFinEstCost}
                                    style={{ border: '1px solid gray' }}

                                />

                            </div>



                        </div>
                    </div>




                    {/* 4th row */}

                    <div className={styles.formField}>


                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Approach to agreeing rate</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={approachToAgreeingRateValidationImg} />
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
                                    onChanged={(v) => this.changeTextField(v, "FinApproachAgreeingRate")}
                                    value={fd.FinApproachAgreeingRate}

                                />



                            </div>

                        </div>
                    </div>



                    {/* 3rd row */}


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
                            {(caseCreated === true) && <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Attach IR35 evidence</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={iR35EvidenceValidationImg} />
                                    </div>
                                </div>

                            </div>}


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

                            {(caseCreated === true) && <div style={{ width: 'calc(100% - 50% - 130px)', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
                                    //onChanged={(v) => this.changeTextField(v, "TargetDate")}
                                    //value={fd.TargetDate}
                                    disabled={true}
                                    style={{ border: '1px solid gray' }}
                                    value={this.state.IR35Evidence && (this.state.IR35Evidence.AttachmentType === "Link" ? "Linked evidence available" : this.state.IR35Evidence.AttachmentType === "PDF" ? "PDF evidence available to download" : "")}

                                />

                            </div>}
                            {(caseCreated === true) && <div style={{ width: '130px', marginTop: '5px' }}>

                                {
                                    <span>
                                        {this.state.IR35Evidence === null && <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={this.addIr35Evidence} >Add</span>}
                                        {this.state.IR35Evidence !== null && <span style={{ marginRight: '5px', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={this.viewIR35Evidence} >View</span>}
                                        {this.state.IR35Evidence !== null && <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={this.toggleIR35EvDeleteConfirm} >Delete</span>}
                                    </span>
                                }

                            </div>}




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


                    {/* 4th row */}

                    <div className={styles.formField}>


                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Summary IR35 justification</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={summaryIR35JustificatValidationImg} />
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
                                    onChanged={(v) => this.changeTextField(v, "FinSummaryIR35Just")}
                                    value={fd.FinSummaryIR35Just}

                                />



                            </div>

                        </div>
                    </div>


                    <div style={{ marginBottom: '10px' }}>
                        {this.state.ShowAllowChangeFinance === false &&
                            <div>
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => {
                                    this.toggleAllowChangeFinance();
                                    this.saveData(false, false, true);

                                }}>Save</span>&nbsp;&nbsp;
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeFinance}>Cancel</span>
                            </div>
                        }
                    </div>


                </div>





            </div>
        );
    }

    private renderOther() {

        if (this.props.stage === "Draft" || (this.state.ShowAllowChangeOther === false)) {
            console.log('renderOther - 1');
        }
        else return null;


        const fd = this.state.FormData;


        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Other</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.OtherEditHelpText && this.props.defForm.OtherEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.OtherEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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


                    <div style={{ marginBottom: '10px' }}>
                        {this.state.ShowAllowChangeOther === false &&
                            <div>
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => {
                                    this.toggleAllowChangeOther();
                                    this.saveData(false, false, true);

                                }}>Save</span>&nbsp;&nbsp;
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeOther}>Cancel</span>
                            </div>
                        }
                    </div>



                </div>





            </div>
        );
    }

    private renderApprovers() {

        if (this.props.stage === "Draft" || (this.state.ShowAllowChangeApprovers === false)) {
            console.log('renderApprovers - 1');
        }
        else return null;

        const fd = this.state.FormData;

        const bhUserIdValidationImg = this.state.FormData.BHUserId !== null ? this.checkIconGreen : this.checkIconRed;
        const fbpUserIdValidationImg = this.state.FormData.FBPUserId !== null ? this.checkIconGreen : this.checkIconRed;
        const hrbpUserIdValidationImg = this.state.FormData.HRBPUserId !== null ? this.checkIconGreen : this.checkIconRed;
        const cbpUserIdValidationImg = this.state.FormData.CBPUserId !== null ? this.checkIconGreen : this.checkIconRed;


        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Approvers</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.ApproversEditHelpText && this.props.defForm.ApproversEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.ApproversEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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
                                    entities={this.props.users}
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
                                    entities={this.props.users}
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
                            {(this.state.FormData.ComFrameworkId === 1) === false &&
                                <div style={{ width: '50%', fontWeight: 'bold' }}>
                                    <div className={styles.flexContainerSectionQuestion}>
                                        <div className={styles.sectionQuestionCol1}><span>Commercial business partner</span></div>
                                        <div className={styles.sectionQuestionCol2}>
                                            <img src={cbpUserIdValidationImg} />
                                        </div>
                                    </div>

                                </div>
                            }


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    //label="Assigned To"
                                    //className={styles.formField}
                                    displayForUser={true}
                                    entities={this.props.users}
                                    itemLimit={1}
                                    selectedEntities={this.state.FormData.HRBPUserId && [this.state.FormData.HRBPUserId]}
                                    onChange={(v) => this.changeUserPicker(v, 'HRBPUserId')}
                                />

                            </div>

                            {(this.state.FormData.ComFrameworkId === 1) === false &&
                                <div style={{ width: '50%', }}>
                                    <CrEntityPicker
                                        displayForUser={true}
                                        entities={this.props.users}
                                        itemLimit={1}
                                        selectedEntities={this.state.FormData.CBPUserId && [this.state.FormData.CBPUserId]}
                                        onChange={(v) => this.changeUserPicker(v, 'CBPUserId')}
                                    />
                                </div>
                            }
                        </div>
                    </div>


                    <div style={{ marginBottom: '10px' }}>
                        {this.state.ShowAllowChangeApprovers === false &&
                            <div>
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => {
                                    this.toggleAllowChangeApprovers();
                                    this.saveData(false, false, true);

                                }}>Save</span>&nbsp;&nbsp;
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeApprovers}>Cancel</span>
                            </div>
                        }
                    </div>






                </div>





            </div>
        );
    }



    private renderFormButtons_DraftStage() {

        const caseCreated = this.checkCaseCreated();

        return (
            <div>

                {

                    <React.Fragment>
                        {<PrimaryButton text="Save as Draft" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.saveData(false, false)}
                        />}

                        {(caseCreated === true) && <PrimaryButton text="Submit for Approval" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.saveData(true, false)}
                        />}

                        <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.props.onShowList()}
                        />


                    </React.Fragment>
                }



            </div>
        );


    }

    private renderIR35EvidenceForm() {

        if (this.state.FormData === null || this.state.FormData.ID === 0) return null;

        return (

            <EvidenceSaveForm
                showForm={this.state.ShowIR35EvidenceForm}
                parentId={this.state.FormData.ID}
                caseId={this.state.FormData.ID}
                evidenceId={null}
                onSaved={this.ir35EvidenceSaved}
                onCancelled={this.closeIR35EvidencePanel}
                evidenceType="IR35"
                {...this.props}
            />
        );

    }

    private renderContractorSecurityCheckEvidenceForm() {

        if (this.state.FormData === null || this.state.FormData.ID === 0) return null;

        return (

            <EvidenceSaveForm
                showForm={this.state.ShowContractorSecurityCheckEvidenceForm}
                parentId={this.props.clWorkerId}
                caseId={this.state.FormData.ID}
                evidenceId={null}
                onSaved={this.contractorSecurityCheckEvidenceSaved}
                onCancelled={this.closeContractorSecurityCheckEvidencePanel}
                evidenceType="ContractorSecurityCheck"
                {...this.props}
            />
        );

    }

    private renderChangeLogs() {
        const fdw = this.state.FormDataWorker;
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


                {this.props.superUserPermission === true && <div style={{ marginTop: '30px' }}>
                    {fdw.CasePdfStatus !== "Working... Please Wait" && <div style={{ color: 'blue', cursor: 'pointer' }} onClick={() => this.createCasePdf()}>Create Case PDF</div>}
                    {fdw.CasePdfStatus === "Working... Please Wait" && <div>Creating Case PDF... Please Wait.. To refresh status <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => this.refreshCasePdfStatus()}>Click Here</span></div>}
                    {fdw.CasePdfStatus === "Cr" && <div>Last PDF created by {fdw.CasePdfLastActionUser} on {services.DateService.dateToUkDateTime(fdw.CasePdfDate)} <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => this.downloadCasePdf()}>Download</span>  </div>}

                    {fdw.CasePdfStatus && fdw.CasePdfStatus.search("Err:") === 0 && <div>Last PDF creation error. Attempted by {fdw.CasePdfLastActionUser} on {services.DateService.dateToUkDateTime(fdw.CasePdfDate)} <br />{fdw.CasePdfStatus}  </div>}

                </div>}



                <div style={{ marginTop: "30px" }}>
                    <div style={{ fontWeight: 'bold' }}>Change Log:</div>
                    <div style={{ marginTop: "20px" }} dangerouslySetInnerHTML={{ __html: changeLogs }} />
                </div>
            </React.Fragment>
        );
    }

    private renderWaitMessage() {
        if (this.state.ShowWaitMessage === true) {
            return (
                <React.Fragment>

                    <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ padding: '10px 5px', color: 'green', fontWeight: 'bold', backgroundColor: 'rgb(240,240,240)' }}>Please wait we are processing, you will be redirected to list after its done</div>
                        </div>
                    </div>

                </React.Fragment>

            );
        }
        else {
            return null;
        }

    }

    private renderListsMainTitle() {
        return (
            <div style={{ marginBottom: '20px', marginTop: '50px' }}>
                <div style={{ display: 'flex' }}>
                    <div className={styles.sectionATitle}>Case Discussion, General Comments and File Attachments</div>
                    <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.CaseDiscussionHelpText && this.props.defForm.CaseDiscussionHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.CaseDiscussionHelpText)}><img src={this.helpIcon} /></a>}</div>
                </div>
            </div>
        );
    }

    private renderEvidencesList() {

        if (this.state.FormData === null || this.state.FormData.ID === 0) return null;

        return (
            <React.Fragment>
                {/* <div style={{ marginTop: '30px', fontWeight: "bold", marginBottom: '10px' }}>Evidence</div> */}
                <div style={{ minHeight: '120px', border: '1px solid rgb(166,166,166)' }}>
                    <EvidenceList
                        parentId={this.state.FormData.ID}
                        workerId={this.state.FormDataWorker.ID}
                        currentUserId={this.props.currentUserId}
                        superUserPermission={this.props.superUserPermission}
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

        const fd = this.state.FormData;

        let allowChange: boolean = false;
        if (this.props.superUserPermission === true || fd.ApplHMUserId === this.props.currentUserId) {
            allowChange = true;
        }
        else {

            console.log('renderDetailsOfApplicant - 3');
            let isHiringMember: boolean = false;
            if (fd['CLHiringMembers']) {
                //loop array
                const arrM: any[] = fd['CLHiringMembers'];
                console.log(arrM);
                for (let i = 0; i < arrM.length; i++) {
                    console.log(arrM[i]);
                    console.log(arrM[i]['UserId']);
                    if (Number(arrM[i]['UserId']) === this.props.currentUserId) {
                        isHiringMember = true;
                        allowChange = true;
                        break;
                    }
                }


            }
        }


        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '50px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Details of Applicant</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.DetailsOfApplicantViewHelpText && this.props.defForm.DetailsOfApplicantViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.DetailsOfApplicantViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>


                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>
                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Dept transferring to
                                </td>
                                <td style={{ width: '81%', borderTop: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.FormData.DeptTransferringTo}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: '19%', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Name of hiring manager
                                </td>
                                <td style={{ width: '81%', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.ApplHMUser}
                                </td>


                            </tr>

                            <tr>
                                <td style={{ width: '19%', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Hiring team member
                                </td>
                                <td style={{ width: '81%', borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.ApplHMembers}
                                </td>


                            </tr>




                        </tbody>


                    </table>
                </div>

                <div style={{ paddingTop: '5px' }}>
                    {this.isViewOnlyPermission() === false && this.state.ShowAllowChangeHM === true && allowChange === true && <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeHM}>Change hiring manager/team member(s) </span>}
                </div>
            </React.Fragment>
        );
    }

    private renderRequirement_info() {

        let allowChange: boolean = false;
        if (this.props.superUserPermission === true) {
            allowChange = true;
        }

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

                <div style={{ marginBottom: '10px', marginTop: '30px', }}>

                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Requirement</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.RequirementViewHelpText && this.props.defForm.RequirementViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.RequirementViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
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




                <div style={{ paddingTop: '5px' }}>
                    {this.isViewOnlyPermission() === false && this.state.ShowAllowChangeRequirement === true && allowChange === true && <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeRequirement}>Change Requirement</span>}
                </div>
            </React.Fragment>
        );
    }

    private renderCommercial_info() {

        let allowChange: boolean = false;
        if (this.props.superUserPermission === true) {
            allowChange = true;
        }

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }}>

                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Commercial</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.CommercialViewHelpText && this.props.defForm.CommercialViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.CommercialViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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

                <div style={{ paddingTop: '5px' }}>
                    {this.isViewOnlyPermission() === false && this.state.ShowAllowChangeCommercial === true && allowChange === true && <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeCommercial}>Change Commercial</span>}
                </div>

            </React.Fragment>
        );
    }

    private renderResourcingJustification_info() {

        let allowChange: boolean = false;
        if (this.props.superUserPermission === true) {
            allowChange = true;
        }

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Resourcing Justification</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.ResourcingJustificationViewHelpText && this.props.defForm.ResourcingJustificationViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.ResourcingJustificationViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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


                <div style={{ paddingTop: '5px' }}>
                    {this.isViewOnlyPermission() === false && this.state.ShowAllowChangeResourcingJustification === true && allowChange === true && <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeResourcingJustification}>Change Resourcing Justification</span>}
                </div>

            </React.Fragment>
        );
    }

    private renderFinance_info() {

        let allowChange: boolean = false;
        if (this.props.superUserPermission === true) {
            allowChange = true;
        }
        const caseCreated = this.checkCaseCreated();

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Finance</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.FinanceViewHelpText && this.props.defForm.FinanceViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.FinanceViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Billable day rate (pay rate plus fees)
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {this.state.FormData.FinBillableRate}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    <span>Rate for approval (billable day rate plus non-recoverable VAT)</span>
                                    {this.state.FormData.FinMaxRate >= 750 && <span style={{ color: 'rgb(254,138,53)', fontStyle: 'italic', paddingLeft: '15px' }}>Additional approval required</span>}
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)', backgroundColor: this.state.FormData.FinMaxRate >= 750 ? 'rgb(255,242,230)' : 'white' }}>
                                    {this.state.FormData.FinMaxRate}
                                </td>

                            </tr>
                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Total days
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {this.state.FormData.FinTotalDays}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Total assignment cost per worker calculation
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.FormData.FinCalcType}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Total assignment cost
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {this.state.FormData.FinEstCost}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Total assignment cost per worker
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {this.state.FormData.FinCostPerWorker}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ width: '19%', borderLeft: '1px solid rgb(166,166,166)', borderTop: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Approach to agreeing rate
                                </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>

                                    <div dangerouslySetInnerHTML={{ __html: this.state.FormData.FinApproachAgreeingRate && this.state.FormData.FinApproachAgreeingRate.split('\n').join('<br/>') }} ></div>
                                </td>


                            </tr>


                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Confirm whether in-scope of IR35
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', }}>
                                    {this.state.CaseInfo.FinIR35Scope}
                                </td>
                                {(caseCreated === true) && <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Attach IR35 evidence
                                </td>}
                                {(caseCreated === true) && <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
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
                                </td>}

                            </tr>


                            <tr>
                                <td style={{ width: '19%', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Summary IR35 justification
                                </td>
                                <td colSpan={3} style={{ borderBottom: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>

                                    <div dangerouslySetInnerHTML={{ __html: this.state.FormData.FinSummaryIR35Just && this.state.FormData.FinSummaryIR35Just.split('\n').join('<br/>') }} ></div>
                                </td>


                            </tr>



                        </tbody>


                    </table>
                </div>

                <div style={{ paddingTop: '5px' }}>
                    {this.isViewOnlyPermission() === false && this.state.ShowAllowChangeFinance === true && allowChange === true && <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeFinance}>Change Finance</span>}
                </div>

            </React.Fragment>
        );
    }

    private renderOther_info() {

        let allowChange: boolean = false;
        if (this.props.superUserPermission === true) {
            allowChange = true;
        }

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Other</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.OtherViewHelpText && this.props.defForm.OtherViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.OtherViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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


                <div style={{ paddingTop: '5px' }}>
                    {this.isViewOnlyPermission() === false && this.state.ShowAllowChangeOther === true && allowChange === true && <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeOther}>Change Other</span>}
                </div>

            </React.Fragment>
        );
    }

    private renderApprovers_info() {

        let allowChange: boolean = false;
        if (this.props.superUserPermission === true) {
            allowChange = true;
        }


        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Approvers</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.ApproversViewHelpText && this.props.defForm.ApproversViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.ApproversViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    {this.state.CaseInfo.HRBPUser}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    {(this.state.FormData.ComFrameworkId === 1) === false && <span>Commercial business partner</span>}
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    {(this.state.FormData.ComFrameworkId === 1) === false && <span>{this.state.CaseInfo.CBPUser}</span>}
                                </td>

                            </tr>


                        </tbody>


                    </table>
                </div>

                <div style={{ paddingTop: '5px' }}>
                    {this.isViewOnlyPermission() === false && this.state.ShowAllowChangeApprovers === true && allowChange === true && <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeApprovers}>Change Approvers</span>}
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

                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Budget Holder Approval Decision</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.BHApprovalDecisionViewHelpText && this.props.defForm.BHApprovalDecisionViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.BHApprovalDecisionViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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

                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Finance Business Partner Approval Decision</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.FBPApprovalDecisionViewHelpText && this.props.defForm.FBPApprovalDecisionViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.FBPApprovalDecisionViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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

                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>HR Business Partner Approval Decision</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.HRBPApprovalDecisionViewHelpText && this.props.defForm.HRBPApprovalDecisionViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.HRBPApprovalDecisionViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>

                </div>

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

    private renderCommercialPartnerApprovalDecision_info() {

        if (this.state.FormData.ComFrameworkId === 1)
            return null;

        //hide this section if user is HRBP
        if (this.props.superUserPermission === false && this.props.currentUserId === this.state.FormData.CBPUserId) {
            console.log('user is CBP, hide renderCommercialPartnerApprovalDecision_info');
            return null;
        }

        let decision: string = "";
        if (this.state.FormData.CBPApprovalDecision !== null) {
            const x1 = this.approvalDecisionItems.filter(x => x.key === this.state.FormData.CBPApprovalDecision);
            if (x1.length > 0) {
                decision = x1[0].afterDecisionText;
            }
        }

        if (decision === "") {
            decision = "Decision not made yet";
        }

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Commercial Business Partner Approval Decision</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.CBPApprovalDecisionViewHelpText && this.props.defForm.HRBPApprovalDecisionViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.CBPApprovalDecisionViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>

                </div>

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
                                    {this.state.CaseInfo.CBPDecisionByAndDate}
                                </td>

                            </tr>


                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderCLApprovalDecision_info() {

        // //hide this section if user is SU
        // if (this.props.superUserPermission === false && this.props.currentUserId === this.state.FormData.HRBPUserId) {
        //     console.log('user is HRBP, hide renderHRBusinessPartnerApprovalDecision_info');
        //     return null;
        // }

        let decision: string = "";
        if (this.state.FormData.CLApprovalDecision !== null) {
            const x1 = this.approvalDecisionItems.filter(x => x.key === this.state.FormData.CLApprovalDecision);
            if (x1.length > 0) {
                decision = x1[0].afterDecisionText;
            }
        }

        if (decision === "") {
            decision = "Decision not made yet";
        }

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Internal Controls Approval Decision</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.ICApprovalDecisionViewHelpText && this.props.defForm.ICApprovalDecisionViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.ICApprovalDecisionViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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
                                    {this.state.CaseInfo.CLDecisionByAndDate}
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
                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Budget Holder Approval Decision</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.BHApprovalDecisionEditHelpText && this.props.defForm.BHApprovalDecisionEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.BHApprovalDecisionEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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

                                <div style={{ textAlign: 'right', color: 'navy', fontSize: '14px', fontStyle: 'italic', paddingTop: '0px', marginTop: '0px', paddingLeft: '0px', paddingRight: '10px' }}>
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
                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Finance Business Partner Approval Decision</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.FBPApprovalDecisionEditHelpText && this.props.defForm.FBPApprovalDecisionEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.FBPApprovalDecisionEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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

                                <div style={{ textAlign: 'right', color: 'navy', fontSize: '14px', fontStyle: 'italic', paddingTop: '0px', marginTop: '0px', paddingLeft: '0px', paddingRight: '10px' }}>
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
                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>HR Business Partner Approval Decision</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.HRBPApprovalDecisionEditHelpText && this.props.defForm.HRBPApprovalDecisionEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.HRBPApprovalDecisionEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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

                                <div style={{ textAlign: 'right', color: 'navy', fontSize: '14px', fontStyle: 'italic', paddingTop: '0px', marginTop: '0px', paddingLeft: '0px', paddingRight: '10px' }}>
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

    private renderCommercialBusinessPartnerApprovalDecision() {

        if (this.state.FormData.ComFrameworkId === 1)
            return null;
            
        //show this section if user is HRBP/super user
        if (this.props.superUserPermission === true || this.props.currentUserId === this.state.FormData.CBPUserId) {
            console.log('user is CBP/super user, show renderCommercialBusinessPartnerApprovalDecision');
        }
        else {
            return null;
        }

        const fd = this.state.FormData;
        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Commercial Business Partner Approval Decision</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.CBPApprovalDecisionEditHelpText && this.props.defForm.HRBPApprovalDecisionEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.CBPApprovalDecisionEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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
                                    selectedKey={fd.CBPApprovalDecision}
                                    onChange={(ev, option) => this.changeChoiceGroup(ev, option, "CBPApprovalDecision")}
                                />



                            </div>
                            {fd.CBPApprovalDecision === 'RequireDetails' && <div style={{ width: 'auto' }}>

                                <div style={{ textAlign: 'right', color: 'navy', fontSize: '14px', fontStyle: 'italic', paddingTop: '0px', marginTop: '0px', paddingLeft: '0px', paddingRight: '10px' }}>
                                    Note: Please use the discussion box at the bottom of the page to specify what further information you require.
                                </div>

                            </div>}


                        </div>
                    </div>


                </div>


            </div>
        );
    }

    private renderCLApprovalDecision() {

        //show this section if user is super user
        if (this.props.superUserPermission === true) {
            console.log('user is super user, show renderCLApprovalDecision');
        }
        else {
            return null;
        }

        const fd = this.state.FormData;
        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Internal Controls Approval Decision</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.ICApprovalDecisionEditHelpText && this.props.defForm.ICApprovalDecisionEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.ICApprovalDecisionEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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
                                    selectedKey={fd.CLApprovalDecision}
                                    onChange={(ev, option) => this.changeChoiceGroup(ev, option, "CLApprovalDecision")}
                                />



                            </div>
                            {fd.CLApprovalDecision === 'RequireDetails' && <div style={{ width: 'auto' }}>

                                <div style={{ textAlign: 'right', color: 'navy', fontSize: '14px', fontStyle: 'italic', paddingTop: '0px', marginTop: '0px', paddingLeft: '0px', paddingRight: '10px' }}>
                                    Note: Please use the discussion box at the bottom of the page to specify what further information you require.
                                </div>

                            </div>}


                        </div>
                    </div>





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


        if (this.props.stage === "Onboarding" || (this.state.ShowAllowChangeOnboarding === false)) {
            console.log('renderOnboarding - 1');
        }
        else return null;



        // const genderOptions: IDropdownOption[] = [
        //     { key: 'Male', text: 'Male' },
        //     { key: 'Female', text: 'Female' },
        // ];

        const fd = this.state.FormDataWorker;



        const req_OnbContractorGender_Img = fd.OnbContractorGenderId !== null ? this.checkIconGreen : this.checkIconRed;
        const req_OnbContractorTitleId_Img = fd.OnbContractorTitleId !== null ? this.checkIconGreen : this.checkIconRed;
        const req_OnbContractorFirstname_Img = fd.OnbContractorFirstname !== null && fd.OnbContractorFirstname.length > 1 ? this.checkIconGreen : this.checkIconRed;
        const req_OnbContractorSurname_Img = fd.OnbContractorSurname !== null && fd.OnbContractorSurname.length > 1 ? this.checkIconGreen : this.checkIconRed;
        //const req_OnbContractorDob_Img = fd.OnbContractorDob !== null ? this.checkIconGreen : this.checkIconRed;
        //const req_OnbContractorNINum_Img = fd.OnbContractorNINum !== null && fd.OnbContractorNINum.length > 1 ? this.checkIconGreen : this.checkIconRed;
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

        /*
        const req_OnbLineManagerGradeId_Img = fd.OnbLineManagerGradeId !== null ? this.checkIconGreen : this.checkIconRed;
        const req_OnbLineManagerEmployeeNum_Img = fd.OnbLineManagerEmployeeNum !== null && fd.OnbLineManagerEmployeeNum.length > 1 ? this.checkIconGreen : this.checkIconRed;
        const req_OnbLineManagerPhone_Img = fd.OnbLineManagerPhone !== null && fd.OnbLineManagerPhone.length > 1 ? this.checkIconGreen : this.checkIconRed;
        */

        const req_OnbWorkOrderNumber_Img = fd.OnbWorkOrderNumber !== null && fd.OnbWorkOrderNumber.length > 1 ? this.checkIconGreen : this.checkIconRed;
        const req_OnbRecruitersEmail_Img = fd.OnbRecruitersEmail !== null && fd.OnbRecruitersEmail.length > 1 ? this.checkIconGreen : this.checkIconRed;

        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Onboarding</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.OnboardingEditHelpText && this.props.defForm.OnboardingEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.OnboardingEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>

                </div>

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
                                    options={this.state.LookupData.CLGenders.map((p) => { return { key: p.ID, text: p.Title }; })}
                                    selectedKey={fd.OnbContractorGenderId}
                                    onChanged={(v) => this.changeDropdown_Worker(v, "OnbContractorGenderId")}
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
                                    <div className={styles.sectionQuestionCol1}><span>Contractor first name</span></div>
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
                                    {/*
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbContractorDob_Img} />
                                    </div>
                                    */}
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Contractor NI Number</span></div>
                                    {/*
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbContractorNINum_Img} />
                                    </div>
                                    */}
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
                                    {/*
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbLineManagerGradeId_Img} />
                                    </div>
                                    */}
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.props.users}
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
                                    {/*
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbLineManagerEmployeeNum_Img} />
                                    </div>
                                    */}
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Line Manager telephone number</span></div>
                                    {/*
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbLineManagerPhone_Img} />
                                    </div>
                                    */}
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


                    <div style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'underline', paddingBottom: '25px' }}>
                        Recruitment
                    </div>

                    {/* 1st row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Work Order Number</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbWorkOrderNumber_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Recruiters email</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_OnbRecruitersEmail_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField_Worker(v, "OnbWorkOrderNumber")}
                                    value={fd.OnbWorkOrderNumber}
                                    autoComplete='*'

                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrTextField
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField_Worker(v, "OnbRecruitersEmail")}
                                    value={fd.OnbRecruitersEmail}

                                />

                            </div>




                        </div>

                        <div style={{ display: 'flex' }}>

                            <div style={{ width: '50%', fontSize: '14px', fontStyle: 'italic', paddingTop: '10px', marginTop: '0px', paddingLeft: '10px' }}>
                                - If your contractor is from PSR, the work order number will begin with “PSR1WO” followed by 8 digits. Please insert this into this field. Please do not use any other order number such as “PSR1JP. This will not be accepted.
                                <br /> <br />
                                -  If you are using RM6160 framework, please type on the initials of the worker e.g. for example, joe blogs, worker order number will be “JB”.
                            </div>
                            <div style={{ width: '50%', fontSize: '14px', fontStyle: 'italic', paddingTop: '10px', marginTop: '0px', paddingLeft: '10px' }}>
                                - Please inform us of your recruiters email address from the agency. We will need this email address to send the SDS letter to. The recruiter will be the person who deals with your candidate/CV short listing, interview set up, candidate set up, etc.
                                <br /> <br />
                                - If you are extending a current contractor on PSR, please type in “Extensions@publicsectorresourcing.co.uk”, else please refer to the step above for all other instances.

                            </div>
                        </div>

                    </div>





                    <div style={{ marginBottom: '10px' }}>
                        {this.state.ShowAllowChangeOnboarding === false &&
                            <div>
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => {
                                    this.toggleAllowChangeOnboarding();
                                    this.saveData_Worker(false, false, false, false, false, true);

                                }}>Save</span>&nbsp;&nbsp;
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeOnboarding}>Cancel</span>
                            </div>
                        }
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

        let allowChange: boolean = false;
        if (this.props.superUserPermission === true) {
            allowChange = true;
        }

        const fd = this.state.FormDataWorker;
        const caseInfo = this.state.CaseInfo;

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Onboarding</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.OnboardingViewHelpText && this.props.defForm.OnboardingViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.OnboardingViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>

                </div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>

                            <tr>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contractor gender
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.OnbContractorGender}
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
                                    Contractor first name
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

                            {/* <tr>
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

                            </tr> */}

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
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)', }}>
                                    Line Manager Employee Number
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {fd.OnbLineManagerEmployeeNum}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)', }}>
                                    Line Manager telephone number
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)', }}>
                                    {fd.OnbLineManagerPhone}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    Work Order Number
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.OnbWorkOrderNumber}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    Recruiters email
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.OnbRecruitersEmail}
                                </td>

                            </tr>



                        </tbody>


                    </table>
                </div>


                <div style={{ paddingTop: '5px' }}>
                    {this.isViewOnlyPermission() === false && this.state.ShowAllowChangeOnboarding === true && allowChange === true && <span style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleAllowChangeOnboarding}>Change Onboarding</span>}
                </div>
                <div style={{ marginTop: '5px' }}>
                    {fd.SDSPdfStatus !== "Working... Please Wait" && <div style={{ color: 'blue', cursor: 'pointer' }} onClick={() => this.createSDSPdf()}>Create SDS PDF</div>}
                    {fd.SDSPdfStatus === "Working... Please Wait" && <div>Creating SDS... Please Wait.. To refresh status <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => this.refreshSDSPdfStatus()}>Click Here</span></div>}
                    {fd.SDSPdfStatus === "Cr" && <div>Last PDF created by {fd.SDSPdfLastActionUser} on {services.DateService.dateToUkDateTime(fd.SDSPdfDate)} <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => this.downloadSDSPdf()}>Download</span>  </div>}
                    {fd.SDSPdfStatus && fd.SDSPdfStatus.search("Err:") === 0 && <div>Last PDF creation error. Attempted by {fd.SDSPdfLastActionUser} on {services.DateService.dateToUkDateTime(fd.SDSPdfDate)} <br />{fd.SDSPdfStatus}  </div>}
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

        const req_SDSCheckedById_Img = fd.SDSCheckedById !== null ? this.checkIconGreen : this.checkIconRed;
        const req_SDSCheckedOn_Img = fd.SDSCheckedOn !== null ? this.checkIconGreen : this.checkIconRed;
        const req_SDSNotes_Img = fd.SDSNotes !== null && fd.SDSNotes.length > 5 ? this.checkIconGreen : this.checkIconRed;

        /*
        const req_PassCheckedById_Img = fd.PassCheckedById !== null ? this.checkIconGreen : this.checkIconRed;
        const req_PassCheckedOn_Img = fd.PassCheckedOn !== null ? this.checkIconGreen : this.checkIconRed;

        const req_ContractCheckedById_Img = fd.ContractCheckedById !== null ? this.checkIconGreen : this.checkIconRed;
        const req_ContractCheckedOn_Img = fd.ContractCheckedOn !== null ? this.checkIconGreen : this.checkIconRed;
        */




        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Engaged</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.EngagedEditHelpText && this.props.defForm.EngagedEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.EngagedEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>

                </div>

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
                                    entities={this.props.users}
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
                                    entities={this.props.users}
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
                                    <div className={styles.sectionQuestionCol1}><span>PO Number</span></div>
                                    <div className={styles.sectionQuestionCol2}>

                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>PO Note</span></div>
                                    <div className={styles.sectionQuestionCol2}>

                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    onChanged={(v) => this.changeTextField_Worker(v, "EngPONumber")}
                                    value={fd.EngPONumber}
                                    autoComplete='*'

                                />


                            </div>

                            <div style={{ width: '50%', }}>
                                <CrTextField
                                    onChanged={(v) => this.changeTextField_Worker(v, "EngPONote")}
                                    value={fd.EngPONote}

                                />

                            </div>




                        </div>
                    </div>

                    {/* 4th row */}
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
                                    entities={this.props.users}
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

                    {/* 5th row */}
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

                    {/* 6th row */}
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
                                    entities={this.props.users}
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


                    {/* 7th row */}
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

                    {/* 8th row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Pass checked by</span></div>
                                    {/*
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_PassCheckedById_Img} />
                                    </div>
                                    */}
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Pass checked on</span></div>
                                    {/*
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_PassCheckedOn_Img} />
                                    </div>
                                    */}
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.props.users}
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

                    {/* 9th row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>SDS checked by</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_SDSCheckedById_Img} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>SDS checked on</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_SDSCheckedOn_Img} />
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.props.users}
                                    itemLimit={1}
                                    selectedEntities={fd.SDSCheckedById && [fd.SDSCheckedById]}
                                    onChange={(v) => this.changeUserPicker_Worker(v, 'SDSCheckedById', true)}
                                />


                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    value={fd.SDSCheckedOn}
                                    onSelectDate={(v) => changeDatePickerV2(this, 'FormDataWorker', v, "SDSCheckedOn", this.engaged_Checks)}
                                />

                            </div>




                        </div>
                    </div>



                    {/* 10th row */}
                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>SDS notes</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_SDSNotes_Img} />
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '100%', }}>
                                <CrTextField
                                    onChanged={(v) => this.changeTextField_Worker(v, "SDSNotes", true)}
                                    value={fd.SDSNotes}

                                />


                            </div>


                        </div>
                    </div>



                    {/* 8th row - remove for now - Tas 28 Mar 2021

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
                                    entities={this.props.users}
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
                    */}




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

        console.log('in renderEngaged_info');
        const caseInfo = this.state.CaseInfo;
        const fd = this.state.FormDataWorker;

        console.log('in renderEngaged_info 2', fd.EngagedChecksDone);

        return (

            <React.Fragment>

                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Engaged</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.EngagedViewHelpText && this.props.defForm.EngagedViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.EngagedViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>

                </div>

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
                                    PO Number
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {caseInfo.EngPONumber}
                                </td>
                                <td style={{ width: '19%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    PO Note
                                </td>
                                <td style={{ width: '31%', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.EngPONote}
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
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
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
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    SDS checked by
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.SDSCheckedBy}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    SDS checked on
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.SDSCheckedOn}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    SDS notes
                                </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.SDSNotes}
                                </td>


                            </tr>

                            {/*

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
                            */}


                        </tbody>


                    </table>
                </div>

                {/* <div style={{ marginTop: '5px' }}>
                    {fd.SDSPdfStatus !== "Working... Please Wait" && <div style={{ color: 'blue', cursor: 'pointer' }} onClick={() => this.createSDSPdf()}>Create SDS PDF</div>}
                    {fd.SDSPdfStatus === "Working... Please Wait" && <div>Creating SDS... Please Wait.. To refresh status <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => this.refreshSDSPdfStatus()}>Click Here</span></div>}
                    {fd.SDSPdfStatus === "Cr" && <div>Last PDF created by {fd.SDSPdfLastActionUser} on {services.DateService.dateToUkDateTime(fd.SDSPdfDate)} <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => this.downloadSDSPdf()}>Download</span>  </div>}
                    {fd.SDSPdfStatus && fd.SDSPdfStatus.search("Err:") === 0 && <div>Last PDF creation error. Attempted by {fd.SDSPdfLastActionUser} on {services.DateService.dateToUkDateTime(fd.SDSPdfDate)} <br />{fd.SDSPdfStatus}  </div>}
                </div> */}


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

        /*
        const req_LePassCheckedById_Img = fd.LePassCheckedById !== null ? this.checkIconGreen : this.checkIconRed;
        const req_LePassCheckedOn_Img = fd.LePassCheckedOn !== null ? this.checkIconGreen : this.checkIconRed;
        */


        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Leaving</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.LeavingEditHelpText && this.props.defForm.LeavingEditHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.LeavingEditHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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
                                    entities={this.props.users}
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
                                    entities={this.props.users}
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
                                    entities={this.props.users}
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
                                    {/*
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LePassCheckedById_Img} />
                                    </div>
                                    */}
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>

                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Pass checked on</span></div>
                                    {/*
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={req_LePassCheckedOn_Img} />
                                    </div>
                                    */}
                                </div>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrEntityPicker
                                    displayForUser={true}
                                    entities={this.props.users}
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

                <div style={{ marginBottom: '10px', marginTop: '30px' }}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.sectionATitle}>Leaving</div>
                        <div style={{ paddingLeft: '10px', paddingTop: '12px' }} >{(this.props.defForm.LeavingViewHelpText && this.props.defForm.LeavingViewHelpText.length > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(this.props.defForm.LeavingViewHelpText)}><img src={this.helpIcon} /></a>}</div>
                    </div>
                </div>

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
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    Pass checked by
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.LePassCheckedBy}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    Pass checked on
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)' }}>
                                    {caseInfo.LePassCheckedOn}
                                </td>

                            </tr>

                            {/*
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
                            */}

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
            if (fd.FinBillableRate !== null && fd.FinBillableRate > 0) { } else { return false; }
            if (fd.FinMaxRate !== null && fd.FinMaxRate > 0) { } else { return false; }
            if (fd.FinTotalDays !== null && fd.FinTotalDays > 0) { } else { return false; }
            if (fd.FinCalcType !== null) { } else { return false; }
            if (fd.FinEstCost !== null && fd.FinEstCost > 0) { } else { return false; }
            if (fd.FinCostPerWorker !== null && fd.FinCostPerWorker > 0) { } else { return false; }
            if (fd.FinIR35ScopeId !== null) { } else { return false; }
            if (this.state.IR35Evidence === null) { return false; }
            if (fd.FinApproachAgreeingRate !== null && fd.FinApproachAgreeingRate.length > 9) { } else { return false; }
            if (fd.FinSummaryIR35Just !== null && fd.FinSummaryIR35Just.length > 9) { } else { return false; }

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
            if (fd.OnbContractorGenderId === null) return false;
            if (fd.OnbContractorTitleId === null) return false;
            if (fd.OnbContractorFirstname !== null && fd.OnbContractorFirstname.length > 1) { } else return false;
            if (fd.OnbContractorSurname !== null && fd.OnbContractorSurname.length > 1) { } else return false;
            /*
            if (fd.OnbContractorDob === null) return false;
            */
            /*
            if (fd.OnbContractorNINum !== null && fd.OnbContractorNINum.length > 1) { } else return false;
            */
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
            /*
            if (fd.OnbLineManagerGradeId === null) return false;
            if (fd.OnbLineManagerEmployeeNum !== null && fd.OnbLineManagerEmployeeNum.length > 1) { } else return false;
            if (fd.OnbLineManagerPhone !== null && fd.OnbLineManagerPhone.length > 1) { } else return false;
            */

            if (fd.OnbWorkOrderNumber !== null && fd.OnbWorkOrderNumber.length > 1) { } else { return false; }
            if (fd.OnbRecruitersEmail !== null && fd.OnbRecruitersEmail.length > 1) { } else { return false; }


        }


        //at the end return true
        return true;

    }


    private createCaseUploadFolder = (casefolderName: string) => {
        sp.web.getFolderByServerRelativeUrl(this.UploadFolder_CLRoot).folders.add(casefolderName).then(folderAddRes => {
            console.log('folder created', folderAddRes.data);
            folderAddRes.folder.getItem().then(fItem => {
                fItem.breakRoleInheritance(false).then(bri => {
                    console.log('folder bri done');
                    //https://gist.github.com/nakkeerann/8a4dd4cfc7b2903c796d07107a91a7fc
                    fItem.roleAssignments.expand('Member').get().then(rass => {
                        console.log('rass', rass);
                        rass.forEach(ra => {
                            const userEmail: string = ra['Member']['UserPrincipalName'];
                            console.log('ra Member UserPrincipalName', userEmail);
                        });
                    });
                });
            });
        });
    }

    private checkCaseCreated = (): boolean => {
        if (this.state.FormData['CaseCreated'] === true)
            return true;

        return false;
    }
    private saveData = (submitForApproval: boolean, submitDecision, stayOnNewCaseTab?: boolean): void => {
        this.StayOnNewCaseTab = stayOnNewCaseTab;
        if (this.validateEntity(submitForApproval, submitDecision)) {
            console.log('in save data');
            if (this.props.onError) this.props.onError(null);
            let f: ICLCase = { ...this.state.FormData };
            //remove all the child and parent entities before sending post/patch
            //delete f.User; //parent entity
            delete f['CLHiringMembers']; //chile entity

            if (this.isNumeric(f.FinMaxRate) === true) {
                f.FinMaxRate = Number(f.FinMaxRate);
            }
            else {
                f.FinMaxRate = null;
            }

            if (this.isNumeric(f.FinBillableRate) === true) {
                f.FinBillableRate = Number(f.FinBillableRate);
            }
            else {
                f.FinBillableRate = null;
            }

            if (this.isNumeric(f.FinTotalDays) === true) {
                f.FinTotalDays = Number(f.FinTotalDays);
            }
            else {
                f.FinTotalDays = null;
            }

            if (this.isNumeric(f.FinEstCost) === true) {
                f.FinEstCost = Number(f.FinEstCost);
            }
            else {
                f.FinEstCost = null;
            }
            if (this.isNumeric(f.FinCostPerWorker) === true) {
                f.FinCostPerWorker = Number(f.FinCostPerWorker);
            }
            else {
                f.FinCostPerWorker = null;
            }

            //
            if (submitForApproval === true) {
                f.Title = "SubmitForApproval"; //for api to know its a request for approval
            }

            if (submitDecision === true) {
                f.Title = "SubmitDecision";
            }

            console.log('case before saving', f);

            let newCase: boolean = false;
            if (f['CaseCreated'] !== true) {
                console.log('create case folder on sharepoint');
                newCase = true;
                //this.createCaseUploadFolder(String(f.ID));
            }

            this.clCaseService.updatePut(f.ID, f).then((): void => {
                //console.log('saved..');

                this.saveChildEntitiesAfterUpdate();
                //call to create folder or update folder permissions
                //this.props.afterSaveFolderProcess(newCase, this.state.FormData, this.state.FormDataBeforeChanges);
                if (submitDecision === true) {
                    this.props.onShowList(true);
                }
                else {
                    if (submitForApproval !== true) {
                        this.handleAfterSaveFolderProcess(this.state.FormData, this.state.FormDataBeforeChanges);
                    }

                }


                if (this.props.onError)
                    this.props.onError(null);

                if (submitForApproval === true) {
                    //
                    console.log('submit for approval - done');
                    this.setState({ HideSubmitApprovalDoneMessage: false });
                }
                else {
                    if (stayOnNewCaseTab === true) {
                        this.loadCaseInfo();
                        this.loadClCase();
                    }
                    else {
                        //this.props.onShowList(true);
                    }

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

    private saveChildEntitiesAfterUpdate = (): Promise<any> => {

        let promises = [];
        if (this.childEntities) {
            this.childEntities.forEach((ce) => {
                this.state.FormData[ce.ObjectParentProperty].forEach((c) => {
                    if (c.ID === 0) {
                        c[ce.ParentIdProperty] = this.state.FormData.ID;
                        promises.push(ce.ChildService.create(c));
                    }
                    else {
                        //no need to update
                    }
                });

                this.state.FormDataBeforeChanges[ce.ObjectParentProperty].forEach((c) => {
                    if (this.state.FormData[ce.ObjectParentProperty].map(i => i[ce.ChildIdProperty]).indexOf(c[ce.ChildIdProperty]) === -1) {
                        promises.push(ce.ChildService.delete(c.ID));
                    }

                });
            });



            return Promise.all(promises).then(() => this.state.FormData);
        }
    }

    private saveData_Worker = (submitToEngaged: boolean, saveEngaged: boolean, moveToChecksDone: boolean, saveLeaving: boolean, moveToArchive: boolean, stayOnNewCaseTab?: boolean): void => {
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

                    if (stayOnNewCaseTab === true) {
                        this.loadCaseInfo();
                        this.loadCLWorker();
                    }
                    else {
                        this.props.onShowList(true);
                    }
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

    private loadCLGenders = (): void => {
        this.clGenderService.readAll().then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "CLGenders", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading CLGenders lookup data`, err.message); });
    }

    private loadCLStaffGrades = (): void => {
        this.clStaffGradeService.readAll().then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "CLStaffGrades", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading CLStaffGrades lookup data`, err.message); });
    }
    private loadDirectorates = (): void => {
        this.directorateService.readAll().then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Directorates", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Directorates lookup data`, err.message); });
    }
    private loadCLProfessionalCats = (): void => {
        this.clProfessionalCatService.readAll().then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "CLProfessionalCats", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading CLProfessionalCats lookup data`, err.message); });
    }

    private loadCLWorkLocations = (): void => {
        this.clWorkLocationService.readAll().then((data: IEntity[]): IEntity[] => {
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
        this.clIR35ScopeService.readAll().then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "CLIR35Scopes", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading CLIR35Scopes lookup data`, err.message); });
    }
    private loadCLSecurityClearances = (): void => {
        //if (this.state.Stage !== "Onboarding") return;

        this.clSecurityClearanceService.readAll().then((data: IEntity[]): IEntity[] => {
            console.log('loadCLSecurityClearances - data', data);
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "CLSecurityClearances", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading CLSecurityClearances lookup data`, err.message); });
    }

    private loadCLDeclarationConflicts = (): void => {
        //if (this.state.Stage !== "Onboarding") return;

        this.clDeclarationConflictService.readAll().then((data: IEntity[]): IEntity[] => {
            console.log('CLDeclarationConflicts - data', data);
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "CLDeclarationConflicts", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading CLDeclarationConflicts lookup data`, err.message); });
    }

    private loadPersonTitles = (): void => {
        //if (this.state.Stage !== "Onboarding") return;

        this.personTitleService.readAll().then((data: IEntity[]): IEntity[] => {
            console.log('PersonTitles - data', data);
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "PersonTitles", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading PersonTitles lookup data`, err.message); });
    }

    protected loadLookups(): Promise<any> {

        return Promise.all([
            this.loadUsers(),
            this.loadCLGenders(),
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

            this.clCaseService.readWithExpand(this.props.clCaseId).then((c: ICLCase) => {
                console.log('ClCase', c);



                this.setState({
                    FormData: c,
                    FormDataBeforeChanges: c,
                }, () => {
                    this.UploadFolder_Evidence = `${getUploadFolder_CLRoot(this.props.spfxContext)}/${this.state.FormData.ID}`;
                    this.setDisableFinEstCost();
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

        //comment following condition cause we want case pdf available in every stage - 08-Sep-2021
        // const stage = this.state.Stage;
        // if (stage === "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended") {
        //     //ok - load data
        // }
        // else {
        //     return;
        // }

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
        if (stage === "Onboarding" || stage === "Engaged" || stage === "Leaving" || stage === "Left" || stage === "Extended") {
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

    private changeTextField_ReqNumPositions = (value: string, f: string): void => {

        let maxLimit: number = 30;
        if (this.props.superUserPermission === true)
            maxLimit = 99;

        if (value == null || value == '') {
            console.log('set value to null');
            this.setState({ FormData: this.cloneObject(this.state.FormData, f, value)/*, FormIsDirty: true*/ });
        }
        else {
            const isNum: boolean = this.isNumeric(value);
            console.log('isNumeric', isNum);
            if (isNum === true) {
                if (Number(value) <= maxLimit) {
                    if (Number(value) == 0) {
                        //make 1 if they enter 0
                        this.setState({ FormData: this.cloneObject(this.state.FormData, f, "1")/*, FormIsDirty: true*/ });
                    }
                    else {
                        //set to value what they entered
                        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value)/*, FormIsDirty: true*/ });
                    }

                }
                else {
                    //set to max limit
                    this.setState({ FormData: this.cloneObject(this.state.FormData, f, String(maxLimit))/*, FormIsDirty: true*/ });
                }

            }
            else {
                this.setState({ FormData: this.cloneObject(this.state.FormData, f, this.state.FormData[f])/*, FormIsDirty: true*/ });
            }

        }

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

    private changeTextField_Worker = (value: string, f: string, engagedChecks?: boolean): void => {
        this.setState({ FormDataWorker: this.cloneObject(this.state.FormDataWorker, f, value)/*, FormIsDirty: true*/ },

            () => {
                if (engagedChecks === true) {
                    this.engaged_Checks();
                }
            }

        );
    }

    private setDisableFinEstCost = () => {
        if (this.state.FormData.FinCalcType === 'Manual') {
            this.setState({ DisableFinEstCost: false });
        }
        else {
            this.setState({ DisableFinEstCost: true }, this.calculateRate);
        }
    }

    private changeCheckbox_Worker = (value: boolean, f: string): void => {
        this.setState({ FormDataWorker: this.cloneObject(this.state.FormDataWorker, f, value)/*, FormIsDirty: true*/ });
    }
    private changeDropdown_FinCalcType = (option: IDropdownOption, f: string, index?: number): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, option.key), /*FormIsDirty: true*/ }, this.setDisableFinEstCost);
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

    private changeMultiUserPicker = (value: number[], f: string, newEntity: object, userIdProperty: string): void => {

        //to avoid same user to add multiple times
        const valuesUnique = value.filter((item, pos) => {
            return value.indexOf(item) == pos;
        });
        value = valuesUnique;

        const loadedUsers = this.cloneObject(this.state.FormDataBeforeChanges);
        let newUsers = [];
        value.forEach((userId) => {
            let existingUser = loadedUsers[f] ? loadedUsers[f].map(user => user[userIdProperty]).indexOf(userId) : -1;
            if (existingUser !== -1) {
                //existing user which is saved in db
                newUsers.push(loadedUsers[f][existingUser]);
            }
            else {
                //-1
                let newUser = { ...newEntity };
                newUser[userIdProperty] = userId;
                newUsers.push(newUser);
            }
        });
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, newUsers), FormIsDirty: true });
    }



    private engaged_Checks = (): void => {
        const fd = this.state.FormDataWorker;
        if (fd.BPSSCheckedById !== null && fd.BPSSCheckedOn !== null &&
            fd.POCheckedById !== null && fd.POCheckedOn !== null &&
            fd.ITCheckedById !== null && fd.ITCheckedOn !== null &&
            fd.UKSBSCheckedById !== null && fd.UKSBSCheckedOn !== null &&
            fd.SDSCheckedById !== null && fd.SDSCheckedOn !== null &&
            fd.SDSNotes !== null && fd.SDSNotes.length > 5) {
            //fd.PassCheckedById !== null && fd.PassCheckedOn !== null &&
            //fd.ContractCheckedById !== null && fd.ContractCheckedOn !== null) {
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
            fd.LeUKSBSCheckedById !== null && fd.LeUKSBSCheckedOn !== null) {
            //fd.LePassCheckedById !== null && fd.LePassCheckedOn !== null) {
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

    private blurFinBillableRate = (ev, f: string): void => {
        console.log('blur', f);
        const billableRate: number = Number(this.state.FormData.FinBillableRate);
        if (billableRate > 0) {
            const dayRateWithVAT: string = ((billableRate * 0.2) + (billableRate)).toFixed(2);
            let obj = this.cloneObject(this.state.FormData, 'FinMaxRate', dayRateWithVAT);
            this.setState({ FormData: obj/*, FormIsDirty: true*/ }, this.calculateRate);
        }
        else {
            console.log('value is less than 0');
            this.setState({ FormData: this.cloneObject(this.state.FormData, 'FinMaxRate', null)/*, FormIsDirty: true*/ });
        }


        // if (Number(this.state.FormData[f]) > 0) {
        //     const rateStr = Number(this.state.FormData[f]).toFixed(2);
        //     const dayRate:string = ((Number(this.state.FormData[f]) * 0.2) + (Number(this.state.FormData[f]))).toFixed(2);
        //     console.log('dayRate', dayRate);
        //     let obj = this.cloneObject(this.state.FormData, f, rateStr);
        //     obj = this.cloneObject(obj, 'FinMaxRate', dayRate);
        //     this.setState({ FormData: obj/*, FormIsDirty: true*/ }, this.calculateRate);
        //     //this.setState({ FormData: this.cloneObject(this.state.FormData, 'FinMaxRate', dayRate)/*, FormIsDirty: true*/ });
        // }
        // else {
        //     console.log('value is less than 0');
        // }

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

    private calculateTotalDays = (): void => {
        if (this.state.FormData.FinTotalDays == null || this.state.FormData.FinTotalDays == 0) {
            if (this.state.FormData.ReqEstStartDate != null && this.state.FormData.ReqEstEndDate != null) {
                const startDate: Date = new Date(this.state.FormData.ReqEstStartDate.getTime());
                const endDate: Date = new Date(this.state.FormData.ReqEstEndDate.getTime());
                const days: number = this.getBusinessDatesCount(startDate, endDate);
                console.log('days', days);


                this.setState({ FormData: this.cloneObject(this.state.FormData, 'FinTotalDays', days) });


            }
            else {
                console.log('both dates and other values are not provided');
            }
        }

    }

    private calculateRate = (): void => {
        if (this.state.FormData.FinCalcType === 'Automatic' && this.state.FormData.ReqEstStartDate != null && this.state.FormData.ReqEstEndDate != null && this.state.FormData.ReqNumPositions > 0 && this.state.FormData.FinMaxRate > 0) {
            const startDate: Date = new Date(this.state.FormData.ReqEstStartDate.getTime());
            const endDate: Date = new Date(this.state.FormData.ReqEstEndDate.getTime());
            const days: number = this.state.FormData.FinTotalDays;
            console.log('days', days);

            const numPositions: number = this.state.FormData.ReqNumPositions;
            const dayRate: number = this.state.FormData.FinMaxRate;

            const totalCost: string = (numPositions * dayRate * days).toFixed(2);
            console.log('totalCost', totalCost);
            const totalCostPerWorker: string = (dayRate * days).toFixed(2);

            let formObj = this.cloneObject(this.state.FormData, 'FinEstCost', totalCost);
            formObj = this.cloneObject(formObj, 'FinCostPerWorker', totalCostPerWorker);

            this.setState({ FormData: formObj });

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

            this.clCaseEvidenceService.delete(this.state.IR35Evidence.ID).then(d => {

                sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Evidence).files.getByName(fileName).delete().then(df => {
                    this.loadIR35Evidence();
                });
            }, (err) => {
                if (this.props.onError) this.props.onError(`Cannot delete this evidence. `, err.message);
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

            this.clCaseEvidenceService.delete(this.state.ContractorSecurityCheckEvidence.ID).then(d => {

                sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Evidence).files.getByName(fileName).delete().then(df => {
                    this.loadContractorSecurityCheckEvidence();
                });
            }, (err) => {
                if (this.props.onError) this.props.onError(`Cannot delete this evidence. `, err.message);
            });

        }
    }

    private isSuperUserOrApprover = (): boolean => {
        if (this.props.superUserPermission === true
            || this.props.currentUserId === this.state.FormData.BHUserId
            || this.props.currentUserId === this.state.FormData.FBPUserId
            || this.props.currentUserId === this.state.FormData.HRBPUserId
            || this.props.currentUserId === this.state.FormData.CBPUserId) {
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

        if (this.state.FormDataWorker.Archived === true) {
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

    private toggleAllowChangeHM = (): void => {
        this.setState({
            ShowAllowChangeHM: !this.state.ShowAllowChangeHM,
        });
    }

    private toggleAllowChangeRequirement = (): void => {
        this.setState({
            ShowAllowChangeRequirement: !this.state.ShowAllowChangeRequirement,
        });
    }

    private toggleAllowChangeCommercial = (): void => {
        this.setState({
            ShowAllowChangeCommercial: !this.state.ShowAllowChangeCommercial,
        });
    }

    private toggleAllowChangeResourcingJustification = (): void => {
        this.setState({
            ShowAllowChangeResourcingJustification: !this.state.ShowAllowChangeResourcingJustification,
        });
    }

    private toggleAllowChangeFinance = (): void => {
        this.setState({
            ShowAllowChangeFinance: !this.state.ShowAllowChangeFinance,
        });
    }

    private toggleAllowChangeOther = (): void => {
        this.setState({
            ShowAllowChangeOther: !this.state.ShowAllowChangeOther,
        });
    }

    private toggleAllowChangeApprovers = (): void => {
        this.setState({
            ShowAllowChangeApprovers: !this.state.ShowAllowChangeApprovers,
        });
    }

    private toggleAllowChangeOnboarding = (): void => {
        this.setState({
            ShowAllowChangeOnboarding: !this.state.ShowAllowChangeOnboarding,
        });
    }

    private createSDSPdf = (): void => {
        const spSiteUrl: string = this.props.spfxContext.pageContext.web.absoluteUrl;
        //console.log('spSiteUrl', spSiteUrl);
        this.clWorkerService.createSDSPDF(this.state.FormDataWorker.ID, spSiteUrl).then((res: string): void => {

            console.log('Pdf creation initialized', res);
            this.loadCLWorker();
            // this.setState({
            //     PDFStatus: res,
            //     EnableDownloadPdf: false,
            //     EnableDeletePdf: false,
            //     EnableCreatePdf: false,
            // });
            //this.loadData(); //no need


        }, (err) => {
            if (this.props.onError)
                this.props.onError(`Error creating PDF`, err.message);

        });
    }

    private refreshSDSPdfStatus = (): void => {
        this.loadCLWorker();
    }

    private downloadSDSPdf = (): void => {
        console.log('download sds pdf');
        const fileName: string = this.state.FormDataWorker.SDSPdfName;

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







    private createCasePdf = (): void => {
        const spSiteUrl: string = this.props.spfxContext.pageContext.web.absoluteUrl;
        //console.log('spSiteUrl', spSiteUrl);
        this.clWorkerService.createCasePDF(this.props.clWorkerId, spSiteUrl).then((res: string): void => {

            console.log('case Pdf creation initialized', res);
            this.loadCLWorker();
            // this.setState({
            //     PDFStatus: res,
            //     EnableDownloadPdf: false,
            //     EnableDeletePdf: false,
            //     EnableCreatePdf: false,
            // });
            //this.loadData(); //no need


        }, (err) => {
            if (this.props.onError)
                this.props.onError(`Error creating PDF`, err.message);

        });
    }

    private refreshCasePdfStatus = (): void => {
        this.loadCLWorker();
    }

    private downloadCasePdf = (): void => {
        console.log('download case pdf');
        const fileName: string = this.state.FormDataWorker.CasePdfName;

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

    private showHelpPanel = (helpText?: string) => {
        console.log('show help panel');
        this.setState({ UserHelpText: helpText, ShowHelpPanel: true });
    }

    private hideHelpPanel = () => {
        console.log('hide help panel');
        this.setState({ ShowHelpPanel: false });
    }











    private handleAfterSaveFolderProcess = (caseData: ICLCase, caseDataBeforeChanges: ICLCase): void => {
        this.setState({ ShowWaitMessage: true, CreateFolderWaitMessage: 'Checking if folder exists' });
        console.log('in handleAfterSaveFolderProcess', caseData, caseDataBeforeChanges);
        //next todo 
        //create folder when newCase is true and give permissions like HM, members etc and others like approvers 
        const folderNewUsers: string[] = this.makeFolderNewUsersArr(caseData);

        // if (newCase === true) {
        //   this.createNewCaseUploadFolder(String(caseData.ID), folderNewUsers);
        // }
        // else {
        //   //const folderExistingsers: string[] = this.makeFolderExistingUsersArr(caseDataBeforeChanges);
        //   this.resetFolderPermissionsAfterEditCase(String(caseData.ID), folderNewUsers);

        // }


        //otherwise for existing folder remove all permissions then add all again

        this.checkSPFolderExist(caseData, folderNewUsers);

    }

    private checkSPFolderExist = (caseData: ICLCase, folderNewUsers: string[]) => {
        console.log('in checkSPFolderExist');
        this.setState({ CreateFolderWaitMessage: 'Checking for documents folder' });
        const folder = sp.web.getFolderByServerRelativePath(this.UploadFolder_CLRoot + '/' + String(caseData.ID)).select('Exists').get().then(ff => {
            if (ff.Exists) {
                console.log('checkSPFolderExist - folder exist');
                //this.setState({ CreateFolderWaitMessage: 'Folder found, resetting premissions' });
                this.resetFolderPermissionsAfterEditCase(String(caseData.ID), folderNewUsers);
            }
            else {
                console.log('checkSPFolderExist - folder doesnt exist so create new');
                this.setState({ CreateFolderWaitMessage: 'Creating folder for documents' });
                this.createNewCaseUploadFolder(String(caseData.ID), folderNewUsers);
            }

        }).catch(err => {
            console.log('checkSPFolderExist - err', err);
        });

        // sp.web.getFolderByServerRelativeUrl(this.UploadFolder_CLRoot).folders.getByName(casefolderName).getItem().then((folderItem: SharePointQueryableSecurable) => {

        // });
    }

    private makeFolderNewUsersArr = (caseData: ICLCase): string[] => {
        let users: string[] = [];

        //hiring manager
        if (caseData.ApplHMUserId > 0) {
            const u1 = this.props.users.filter(x => x.ID === caseData.ApplHMUserId)[0];
            users.push(u1.Username);
        }

        //hiring members
        const hiringMembers: ICLHiringMember[] = caseData['CLHiringMembers'];
        hiringMembers.forEach(m => {
            const u1 = this.props.users.filter(x => x.ID === m.UserId)[0];
            users.push(u1.Username);
        });

        //BH
        if (caseData.BHUserId > 0) {
            const u1 = this.props.users.filter(x => x.ID === caseData.BHUserId)[0];
            users.push(u1.Username);
        }

        //FBP
        if (caseData.FBPUserId > 0) {
            const u1 = this.props.users.filter(x => x.ID === caseData.FBPUserId)[0];
            users.push(u1.Username);
        }

        //HRBP
        if (caseData.HRBPUserId > 0) {
            const u1 = this.props.users.filter(x => x.ID === caseData.HRBPUserId)[0];
            users.push(u1.Username);
        }

        //Superusers/viewers
        this.props.superUsersAndViewers.forEach(su => {
            users.push(su.Username);
        });





        return users;
    }

    private createNewCaseUploadFolder = (casefolderName: string, folderNewUsers: string[]) => {
        sp.web.getFolderByServerRelativeUrl(this.UploadFolder_CLRoot).folders.add(casefolderName).then(folderAddRes => {
            console.log('createNewCaseUploadFolder: folder created', folderAddRes.data);
            this.setState({ CreateFolderWaitMessage: 'Folder created' });
            folderAddRes.folder.getItem().then((folderItem: SharePointQueryableSecurable) => {
                folderItem.breakRoleInheritance(false).then(bri => {
                    console.log('createNewCaseUploadFolder: folder break inheritence done');

                    this.RoleAssignmentsToAdd = [];
                    this.setState({ CreateFolderWaitMessage: 'Adding users permissions' });
                    folderNewUsers.forEach(userEmail => {
                        this.RoleAssignmentsToAdd.push(userEmail);
                    });

                    this.doPermissionAddRecursive(this.RoleAssignmentsToAdd.length - 1, true, folderItem, 0).then(() => {

                        if (this.consoleLogFlag)
                            console.log('createNewCaseUploadFolder - Permissions Sorted: ', casefolderName);
                        if (this.StayOnNewCaseTab !== true)
                            this.props.onShowList(true);
                        this.setState({ ShowWaitMessage: false });
                    });

                });
            });
        });
    }

    private doPermissionAddRecursive = (num, nextRole: boolean, folderItem: SharePointQueryableSecurable, delayCount): Promise<any> => {


        if (this.consoleLogFlag)
            console.log('>> doPermissionAddRecursive: ', num);

        if (nextRole == true) {
            this.roleAssignmentAdded = false;
            this.folderPermissionAdd(num, folderItem);
            delayCount = 0;
        }

        const decide = (asyncResult) => {
            if (asyncResult >= 0) {
                this.setState({ CreateFolderWaitMessage: `Applying permission ${this.RoleAssignmentsToAdd.length - num} of ${this.RoleAssignmentsToAdd.length}` });
            }

            if (this.consoleLogFlag)
                console.log('>> doPermissionAddRecursive Decide: ', asyncResult, delayCount);

            if (asyncResult < 0) {
                if (this.consoleLogFlag)
                    console.log('>> doPermissionAddRecursive Completed: ', asyncResult, delayCount);

                return "lift off"; // no, all done, return a non-promise result
            }
            if (this.roleAssignmentAdded == true) {
                return this.doPermissionAddRecursive(num - 1, true, folderItem, delayCount); // yes, call recFun again which returns a promise
            }
            delayCount = delayCount + 1;
            if (delayCount > 20) {
                // if we had to delay 20 times then something has gone wrong. we should try
                return this.doPermissionAddRecursive(num, true, folderItem, delayCount);
            }
            return this.doPermissionAddRecursive(num, false, folderItem, delayCount); // yes, call recFun again which returns a promise
        };

        return this.createPermissionAddDelay(num, delayCount).then(decide);
    }

    private folderPermissionAdd = (userRef: number, folderItem: SharePointQueryableSecurable): void => {

        const userEmail = this.RoleAssignmentsToAdd[userRef];
        if (this.consoleLogFlag)
            console.log('>> folderPermissionAdd: ', userRef, userEmail);

        sp.web.ensureUser(userEmail).then(user => {

            //const userId: number = Number(user['Id']);
            const userId: number = user.data.Id;
            folderItem.roleAssignments.add(userId, this.props.fullControlFolderRoleId).then(roleAddedValue => {
                if (this.consoleLogFlag)
                    console.log(`>> folderPermissionAdd: role added for user ${userEmail}`);
                this.roleAssignmentAdded = true;
            });

        }).catch(e => {
            if (this.consoleLogFlag)
                console.log(`>> folderPermissionAdd: user doesnt exist ${userEmail}`);
            this.roleAssignmentAdded = true;
        });
    }

    private createPermissionAddDelay = (asyncParam, delayCount): Promise<any> => { // example operation
        const promiseDelay = (data, msec) => new Promise(res => setTimeout(res, msec, data));
        if (this.consoleLogFlag)
            console.log('>> CreatePermissionAddDelay: ', asyncParam, delayCount);

        return promiseDelay(asyncParam, 100); //resolve with argument in 100 millisecond.
    }

    private resetFolderPermissionsAfterEditCase = (casefolderName: string, folderNewUsers: string[]) => {

        sp.web.getFolderByServerRelativeUrl(this.UploadFolder_CLRoot).folders.getByName(casefolderName).getItem().then((folderItem: SharePointQueryableSecurable) => {


            this.RoleAssignmentsToRemove = [];
            folderItem.roleAssignments.get().then(rass => {
                console.log('rass', rass);
                rass.forEach(ra => {

                    this.RoleAssignmentsToRemove.push(Number(ra['PrincipalId']));

                    /*           const principalId: number = Number(ra['PrincipalId']);
                              console.log('principalId', principalId);
                              if(principalId !== this.state.CurrentUserPrincipalId)
                                promisesRemove.push(this.removeFolderRoleBySiteUserId(principalId, folderItem));
                              else
                                console.log('not adding current user in folder permission remove list');
                     */
                });
            }).then(() => {

                this.doPermissionRemoveRecursive(this.RoleAssignmentsToRemove.length - 1, true, folderItem, 0).then(() => {

                    this.RoleAssignmentsToAdd = [];

                    folderNewUsers.forEach(userEmail => {
                        this.RoleAssignmentsToAdd.push(userEmail);
                    });

                    this.doPermissionAddRecursive(this.RoleAssignmentsToAdd.length - 1, true, folderItem, 0).then(() => {
                        if (this.consoleLogFlag)
                            console.log('resetFolderPermissionsAfterEditCase - Permissions Sorted: ', casefolderName);
                        if (this.StayOnNewCaseTab !== true)
                            this.props.onShowList(true);
                        this.setState({ ShowWaitMessage: false });
                    });

                });

            });



        });
    }

    private doPermissionRemoveRecursive = (num, nextRole: boolean, folderItem: SharePointQueryableSecurable, delayCount): Promise<any> => {


        if (this.consoleLogFlag)
            console.log(">> doPermissionRemoveRecursive: " + num);

        if (nextRole == true) {
            this.roleAssignmentRemoved = false;
            this.folderPermissionRemove(num, folderItem);
            delayCount = 0;
        }

        const decide = (asyncResult) => {

            if (asyncResult >= 0) {
                this.setState({ CreateFolderWaitMessage: `Checking user permission ${this.RoleAssignmentsToRemove.length - num} to ${this.RoleAssignmentsToRemove.length}` });
            }

            if (this.consoleLogFlag)
                console.log('>> doPermissionRemoveRecursive decide: ', asyncResult, delayCount);
            if (asyncResult < 0) {
                if (this.consoleLogFlag)
                    console.log('>> doPermissionRemoveRecursive Completed: ', asyncResult, delayCount);
                return "lift off"; // no, all done, return a non-promise result
            }
            if (this.roleAssignmentRemoved == true) {
                return this.doPermissionRemoveRecursive(num - 1, true, folderItem, delayCount);
            }
            delayCount = delayCount + 1;
            if (delayCount > 20) {
                return this.doPermissionRemoveRecursive(num, true, folderItem, delayCount);
            }
            return this.doPermissionRemoveRecursive(num, false, folderItem, delayCount);
        };

        return this.createPermissionRemoveDelay(num, delayCount).then(decide);
    }

    private folderPermissionRemove = (userRef: number, folderItem: SharePointQueryableSecurable): void => {

        const principalId = this.RoleAssignmentsToRemove[userRef];
        if (this.consoleLogFlag) {
            console.log('folderPermissionRemove - folder permission remove: ', userRef);
            console.log('principalId', principalId);
        }

        if (principalId !== this.props.currentUserPrincipalId)
            folderItem.roleAssignments.remove(principalId, this.props.fullControlFolderRoleId).then(roleAddedValue => {
                if (this.consoleLogFlag)
                    console.log(`folderPermissionRemove - role removed for user ${principalId}`);
                this.roleAssignmentRemoved = true;
            }).catch(err => {
                console.log(`>> folderPermissionRemove: - failed ${err}`);
                this.roleAssignmentRemoved = true;
            });
        else {
            if (this.consoleLogFlag)
                console.log('>> folderPermissionRemove: not adding current user in folder permission remove list');
            this.roleAssignmentRemoved = true;
        }
    }

    private createPermissionRemoveDelay = (asyncParam, delayCount): Promise<any> => { // example operation
        const promiseDelay = (data, msec) => new Promise(res => setTimeout(res, msec, data));
        if (this.consoleLogFlag)
            console.log('>> createPermissionRemoveDelay: ', asyncParam, delayCount);
        return promiseDelay(asyncParam, 100);
    }


}