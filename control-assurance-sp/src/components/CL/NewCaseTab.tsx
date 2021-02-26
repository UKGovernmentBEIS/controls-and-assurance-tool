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
import { CLCase, ClCaseInfo, ICLCase, ICLCaseEvidence, IClCaseInfo, IEntity, ILinkLocalType, INAOUpdate, IUser, } from '../../types';
import { getUploadFolder_CLEvidence } from '../../types/AppGlobals';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import EntityList from '../entity/EntityList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { CrDatePicker } from '../cr/CrDatePicker';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import { changeDatePicker } from '../../types/AppGlobals';
import '../../styles/CustomFabric.scss';
import { IContextualMenuProps } from 'office-ui-fabric-react';



export interface INewCaseTabProps extends types.IBaseComponentProps {

    //filteredItems: any[];
    //naoRecommendationId: any;
    clWorkerId: number;
    clCaseId: number;
    stage: string;
    onShowList: () => void;
    currentUserId: number;
    currentUserName: string;
    superUserPermission: boolean;
    viewerPermission: boolean;



    //onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;



}

export interface ILookupData {
    CLStaffGrades: IEntity[];
    Directorates: IEntity[];
    CLProfessionalCats: IEntity[];
    CLWorkLocations: IEntity[];
    CLComFrameworks: IEntity[];
    CLIR35Scopes: IEntity[];
    Users: IUser[];
}

export class LookupData implements ILookupData {

    public CLStaffGrades: IEntity[] = [];
    public Directorates: IEntity[] = [];
    public CLProfessionalCats: IEntity[] = [];
    public CLWorkLocations: IEntity[] = [];
    public CLComFrameworks: IEntity[] = [];
    public CLIR35Scopes: IEntity[] = [];
    public Users = [];

}



export interface INewCaseTabState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: ICLCase;
    CaseInfo: IClCaseInfo;
    FormIsDirty: boolean;
    Evidence_ListFilterText: string;
    ShowIR35EvidenceForm: boolean;
    IR35Evidence: ICLCaseEvidence;
    HideIR35EvDeleteDialog: boolean;
    EvidenceChangesCounter: number;


}

export class NewCaseTabState implements INewCaseTabState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData;
    public CaseInfo;
    public FormIsDirty = false;
    public Evidence_ListFilterText: string = null;
    public ShowIR35EvidenceForm: boolean = false;
    public IR35Evidence: ICLCaseEvidence = null;
    public HideIR35EvDeleteDialog: boolean = true;
    public EvidenceChangesCounter: number = 0;

    constructor(caseType: string) {
        this.FormData = new CLCase(caseType);
        this.CaseInfo = new ClCaseInfo();

    }


}

export default class NewCaseTab extends React.Component<INewCaseTabProps, INewCaseTabState> {

    private clCaseService: services.CLCaseService = new services.CLCaseService(this.props.spfxContext, this.props.api);
    private clCaseEvidenceService: services.CLCaseEvidenceService = new services.CLCaseEvidenceService(this.props.spfxContext, this.props.api);
    private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);
    private clStaffGradeService: services.CLStaffGradeService = new services.CLStaffGradeService(this.props.spfxContext, this.props.api);
    private directorateService: services.DirectorateService = new services.DirectorateService(this.props.spfxContext, this.props.api);
    private clProfessionalCatService: services.CLProfessionalCatService = new services.CLProfessionalCatService(this.props.spfxContext, this.props.api);
    private clWorkLocationService: services.CLWorkLocationService = new services.CLWorkLocationService(this.props.spfxContext, this.props.api);
    private clComFrameworkService: services.CLComFrameworkService = new services.CLComFrameworkService(this.props.spfxContext, this.props.api);
    private clIR35ScopeService: services.CLIR35ScopeService = new services.CLIR35ScopeService(this.props.spfxContext, this.props.api);

    private UploadFolder_Evidence: string = "";

    //IChoiceGroupOption
    private approvalDecisionItems: any[] = [
        { key: 'Approve', text: 'Approve', afterDecisionText: 'Approved' },
        { key: 'Reject', text: 'Reject', afterDecisionText: 'Rejected' },
        { key: 'RequireDetails', text: 'Require further details', afterDecisionText: 'Require further details' },
    ];

    private checkIconGreen: string = require('../../images/greentick2626.png');
    private checkIconRed: string = require('../../images/redtick2626.png');



    constructor(props: INewCaseTabProps, state: INewCaseTabState) {
        super(props);
        this.state = new NewCaseTabState('New Case');
        this.UploadFolder_Evidence = getUploadFolder_CLEvidence(props.spfxContext);

    }

    public render(): React.ReactElement<INewCaseTabProps> {


        let isViewOnly: boolean = this.isViewOnlyPermission();

        return (
            <React.Fragment>
                {this.renderSectionTitle()}
                {this.renderInfoTable()}
                {this.props.stage === "Draft" && isViewOnly === false && this.renderDetailsOfApplicant()}
                {this.props.stage === "Draft" && isViewOnly === false && this.renderRequirement()}
                {this.props.stage === "Draft" && isViewOnly === false && this.renderCommercial()}
                {this.props.stage === "Draft" && isViewOnly === false && this.renderResourcingJustification()}
                {this.props.stage === "Draft" && isViewOnly === false && this.renderFinance()}
                {this.props.stage === "Draft" && isViewOnly === false && this.renderOther()}
                {this.props.stage === "Draft" && isViewOnly === false && this.renderApprovers()}
                {this.props.stage === "Draft" && isViewOnly === false && this.renderFormButtons_DraftStage()}


                {(this.props.stage === "Approval" || isViewOnly === true) && this.renderDetailsOfApplicant_info()}
                {(this.props.stage === "Approval" || isViewOnly === true) && this.renderRequirement_info()}
                {(this.props.stage === "Approval" || isViewOnly === true) && this.renderCommercial_info()}
                {(this.props.stage === "Approval" || isViewOnly === true) && this.renderResourcingJustification_info()}
                {(this.props.stage === "Approval" || isViewOnly === true) && this.renderFinance_info()}
                {(this.props.stage === "Approval" || isViewOnly === true) && this.renderOther_info()}
                {(this.props.stage === "Approval" || isViewOnly === true) && this.renderApprovers_info()}

                {(this.props.stage === "Approval" || isViewOnly === true) && this.renderBudgetHolderApprovalDecision_info()}
                {(this.props.stage === "Approval" || isViewOnly === true) && this.renderFinanceBusinessPartnerApprovalDecision_info()}
                {(this.props.stage === "Approval" || isViewOnly === true) && this.renderHRBusinessPartnerApprovalDecision_info()}

                {(this.props.stage === "Approval" || isViewOnly === true) && this.renderBudgetHolderApprovalDecision()}
                {(this.props.stage === "Approval" || isViewOnly === true) && this.renderFinanceBusinessPartnerApprovalDecision()}
                {(this.props.stage === "Approval" || isViewOnly === true) && this.renderHRBusinessPartnerApprovalDecision()}
                {this.props.stage === "Approval" && this.renderFormButtons_ApprovalStage()}

                {this.renderListsMainTitle()}
                {this.renderEvidencesList()}
                {this.renderChangeLogs()}

                {this.state.ShowIR35EvidenceForm && this.renderIR35EvidenceForm()}
                <ConfirmDialog hidden={this.state.HideIR35EvDeleteDialog} title={`Are you sure you want to delete this IR35 assessment  evidence?`} content={`A deleted evidence cannot be un-deleted.`} confirmButtonText="Delete" handleConfirm={this.deleteIR35Evidence} handleCancel={this.toggleIR35EvDeleteConfirm} />


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

        const reqVacancyTitleValidationImg = fd.ReqVacancyTitle !== null && fd.ReqVacancyTitle.length > 5 ? this.checkIconGreen : this.checkIconRed;
        const reqGradeIdValidationImg = fd.ReqGradeId !== null ? this.checkIconGreen : this.checkIconRed;
        const reqWorkPurposeValidationImg = fd.ReqWorkPurpose !== null && fd.ReqWorkPurpose.length > 9 ? this.checkIconGreen : this.checkIconRed;
        const reqCostCentreValidationImg = fd.ReqCostCentre !== null && fd.ReqCostCentre.length === 6 ? this.checkIconGreen : this.checkIconRed;
        const reqDirectorateIdValidationImg = fd.ReqDirectorateId !== null ? this.checkIconGreen : this.checkIconRed;
        const reqEstStartDateValidationImg = fd.ReqEstStartDate !== null ? this.checkIconGreen : this.checkIconRed;
        const reqEstEndDateValidationImg = fd.ReqEstEndDate !== null ? this.checkIconGreen : this.checkIconRed;
        const reqProfessionalCatIdValidationImg = fd.ReqProfessionalCatId !== null ? this.checkIconGreen : this.checkIconRed;
        const reqWorkLocationIdValidationImg = fd.ReqWorkLocationId !== null ? this.checkIconGreen : this.checkIconRed;
        const reqNumPositionsValidationImg = fd.ReqNumPositions !== null && fd.ReqNumPositions > 0 ? this.checkIconGreen : this.checkIconRed;
        

        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Requirement</div>

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
                                    selectedKey={this.state.FormData.ReqGradeId}
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
                                    <div className={styles.sectionQuestionCol1}><span>Cost centre worker is going into</span></div>
                                    <div className={styles.sectionQuestionCol2}>
                                        <img src={reqCostCentreValidationImg} />
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                
                                <div className={styles.flexContainerSectionQuestion}>
                                    <div className={styles.sectionQuestionCol1}><span>Directorate worker is going into</span></div>
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
                                    numbersOnly={true}
                                    maxLength={6}
                                    onChanged={(v) => this.changeTextField(v, "ReqCostCentre")}
                                    value={fd.ReqCostCentre}

                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDropdown
                                    placeholder="Select an Option"
                                    options={this.state.LookupData.Directorates.map((p) => { return { key: p.ID, text: p.Title }; })}
                                    selectedKey={this.state.FormData.ReqDirectorateId}
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
                                    value={this.state.FormData.ReqEstStartDate}
                                    onSelectDate={(v) => changeDatePicker(this, v, "ReqEstStartDate")}
                                //required={true}
                                //errorMessage={this.state.ErrMessages.CurrentPeriodStartDate}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDatePicker
                                    maxWidth='100%'
                                    //className={styles.width100percent}
                                    value={this.state.FormData.ReqEstEndDate}
                                    onSelectDate={(v) => changeDatePicker(this, v, "ReqEstEndDate")}
                                //required={true}
                                //errorMessage={this.state.ErrMessages.CurrentPeriodStartDate}
                                />

                            </div>




                        </div>
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

                                    selectedKey={this.state.FormData.ReqProfessionalCatId}
                                    onChanged={(v) => this.changeDropdown(v, "ReqProfessionalCatId")}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDropdown
                                    placeholder="Select an Option"
                                    options={this.state.LookupData.CLWorkLocations.map((p) => { return { key: p.ID, text: p.Title }; })}
                                    selectedKey={this.state.FormData.ReqWorkLocationId}
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
                                    //className={styles.formField}
                                    onChanged={(v) => this.changeTextField(v, "ReqNumPositions")}
                                    value={String(fd.ReqNumPositions)}
                                    numbersOnly={true}
                                    maxLength={numPositionsLength}


                                />



                            </div>

                            <div style={{ width: '50%', }}>

                                <div style={{ fontSize: '12px', fontStyle: 'italic', paddingTop: '0px', marginTop: '0px', paddingLeft: '10px' }}>
                                    Note: if case has multiple positions, the system will only show it as one case to the approvers. Once the case has been approved, it will create multiple records for onboarding each worker individually.
                                </div>

                            </div>




                        </div>
                    </div>



                </div>





            </div>
        );
    }

    private renderCommercial() {
        const fd = this.state.FormData;

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
                                <span>Framework</span>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <span>If PSR confirm whether user account already held</span>

                            </div>


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

                            <div style={{ width: '50%', }}>
                                <CrDropdown
                                    placeholder="Select an Option"
                                    options={yesNoNaOptions}
                                    selectedKey={this.state.FormData.ComPSRAccountId}
                                    onChanged={(v) => this.changeDropdown(v, "ComPSRAccountId")}
                                />

                            </div>




                        </div>
                    </div>

                    {/* 2nd row */}

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>
                                <span>Justification if not PSR</span>

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
                    </div>



                </div>





            </div>
        );
    }

    private renderResourcingJustification() {
        const fd = this.state.FormData;


        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Resourcing Justification</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>


                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>
                                <span>Alternative resourcing options: set out what other options have been considered and why these are not suitable</span>

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
                                <span>Succession planning: explain how you plan to manage knowledge transfer and reduce reliance on contingent labour</span>

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

        const menuProps: IContextualMenuProps = {
            items: [
                {
                    key: 'action1',
                    text: 'Action 1',
                    iconProps: { iconName: 'Add' },
                    onClick: (ev) => alert('action 1 todo'),
                    //onClick: (ev) => this.props.onShowList(),
                },
                {
                    key: 'action2',
                    text: 'Action2',
                    iconProps: { iconName: 'Add' },
                    onClick: (ev) => alert('action 2 todo'),
                },
            ],
        };

        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Finance</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>
                                <span>Expected daily rate including fee (excluding vat)</span>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <span>Estimated cost</span>

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
                                <span>Confirm whether in-scope of IR35</span>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <span>Attach IR35 assesment evidence</span>

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
                                    value={this.state.IR35Evidence && this.state.IR35Evidence.Title}

                                />

                            </div>
                            <div style={{ width: '130px', }}>

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


        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Approvers</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>
                                <span>Budget holder</span>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <span>Finance business partner</span>

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
                                <span>HR business partner</span>

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
                            onClick={this.props.onShowList}
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

                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Requirement</div>

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
                                    Cost centre worker is going into
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', }}>
                                    {this.state.FormData.ReqCostCentre}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Directorate worker is going into
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
                                    If PSR confirm whether user account already held
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
                            <div style={{ width: '100%', }}>
                                <CrChoiceGroup
                                    className="inlineflex"
                                    options={this.approvalDecisionItems}
                                    selectedKey={fd.BHApprovalDecision}
                                    onChange={(ev, option) => this.changeChoiceGroup(ev, option, "BHApprovalDecision")}
                                />



                            </div>


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
                            <div style={{ width: '100%', }}>
                                <CrChoiceGroup
                                    className="inlineflex"
                                    options={this.approvalDecisionItems}
                                    selectedKey={fd.FBPApprovalDecision}
                                    onChange={(ev, option) => this.changeChoiceGroup(ev, option, "FBPApprovalDecision")}
                                />



                            </div>


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
                            <div style={{ width: '100%', }}>
                                <CrChoiceGroup
                                    className="inlineflex"
                                    options={this.approvalDecisionItems}
                                    selectedKey={fd.HRBPApprovalDecision}
                                    onChange={(ev, option) => this.changeChoiceGroup(ev, option, "HRBPApprovalDecision")}
                                />



                            </div>


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
                            onClick={this.props.onShowList}
                        />


                    </React.Fragment>
                }



            </div>
        );


    }

    //#region Data Load/Save

    private validateEntity = (): boolean => {
        return true;
    }


    private saveData = (submitForApproval: boolean, submitDecision): void => {
        if (this.validateEntity()) {
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

                this.props.onShowList();


            }, (err) => {
                if (this.props.onError)
                    this.props.onError(`Error saving data`, err.message);
            });

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

    protected loadLookups(): Promise<any> {

        return Promise.all([
            this.loadUsers(),
            this.loadCLStaffGrades(),
            this.loadDirectorates(),
            this.loadCLProfessionalCats(),
            this.loadCLWorkLocations(),
            this.loadCLComFrameworks(),
            this.loadCLIR35Scopes(),
            this.loadCaseInfo(),
            this.loadClCase(),
            this.loadIR35Evidence(),

        ]);
    }


    public componentDidMount(): void {
        //this.loadUpdates();

        this.setState({ Loading: true }, this.callBackFirstLoad

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
            this.clCaseService.getCaseInfo(this.props.clCaseId).then((x: IClCaseInfo) => {
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
        // try{
        //     const temp:number = Number(value);
        //     console.log('converted into number', temp);
        // }
        // catch(ex){
        //     console.log('err', ex);
        // }
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

    protected changeTextField = (value: string, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value)/*, FormIsDirty: true*/ });
    }



    protected changeCheckbox = (value: boolean, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value)/*, FormIsDirty: true*/ });
    }
    private changeDropdown = (option: IDropdownOption, f: string, index?: number): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, option.key), /*FormIsDirty: true*/ });
    }
    protected changeChoiceGroup = (ev, option: IChoiceGroupOption, f: string): void => {
        const selectedKey = option.key;
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, selectedKey)/*, FormIsDirty: true*/ });

    }
    private changeUserPicker = (value: number[], f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value.length === 1 ? value[0] : null), });
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

    private ir35EvidenceSaved = (): void => {
        //this.loadEvidences();
        this.closeIR35EvidencePanel();
        this.loadIR35Evidence();

    }

    private closeIR35EvidencePanel = (): void => {
        this.setState({ ShowIR35EvidenceForm: false });
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

    private toggleIR35EvDeleteConfirm = (): void => {
        this.setState({ HideIR35EvDeleteDialog: !this.state.HideIR35EvDeleteDialog });
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

}