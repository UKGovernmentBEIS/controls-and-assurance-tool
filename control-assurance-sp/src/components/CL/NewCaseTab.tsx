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
import { CLCase, ICLCase, IEntity, ILinkLocalType, INAOUpdate, IUser, } from '../../types';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import EntityList from '../entity/EntityList';
import { CrDatePicker } from '../cr/CrDatePicker';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import { changeDatePicker } from '../../types/AppGlobals';
import '../../styles/CustomFabric.scss';
import { IContextualMenuProps } from 'office-ui-fabric-react';



export interface INewCaseTabProps extends types.IBaseComponentProps {

    //filteredItems: any[];
    //naoRecommendationId: any;
    clCaseId?: number;
    onShowList: () => void;


    //onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;

    //superUserPermission:boolean;

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
    RecInfo: INAOUpdate;
    FormIsDirty: boolean;


}

export class NewCaseTabState implements INewCaseTabState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData;
    public RecInfo = null;
    public FormIsDirty = false;

    constructor(caseType: string) {
        this.FormData = new CLCase(caseType);

    }


}

export default class NewCaseTab extends React.Component<INewCaseTabProps, INewCaseTabState> {

    private clCaseService: services.CLCaseService = new services.CLCaseService(this.props.spfxContext, this.props.api);
    private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);
    private clStaffGradeService: services.CLStaffGradeService = new services.CLStaffGradeService(this.props.spfxContext, this.props.api);
    private directorateService: services.DirectorateService = new services.DirectorateService(this.props.spfxContext, this.props.api);
    private clProfessionalCatService: services.CLProfessionalCatService = new services.CLProfessionalCatService(this.props.spfxContext, this.props.api);
    private clWorkLocationService: services.CLWorkLocationService = new services.CLWorkLocationService(this.props.spfxContext, this.props.api);
    private clComFrameworkService: services.CLComFrameworkService = new services.CLComFrameworkService(this.props.spfxContext, this.props.api);
    private clIR35ScopeService: services.CLIR35ScopeService = new services.CLIR35ScopeService(this.props.spfxContext, this.props.api);

    constructor(props: INewCaseTabProps, state: INewCaseTabState) {
        super(props);
        this.state = new NewCaseTabState('New Case');

    }

    public render(): React.ReactElement<INewCaseTabProps> {



        return (
            <React.Fragment>
                {this.renderSectionTitle()}
                {this.renderInfoTable()}
                {this.renderDetailsOfApplicant()}
                {this.renderRequirement()}
                {this.renderCommercial()}
                {this.renderResourcingJustification()}
                {this.renderFinance()}
                {this.renderOther()}
                {this.renderApprovers()}
                {this.renderFormButtons()}

                {/* {this.renderListsMainTitle()}
                {this.renderEvidencesList()}
                {this.renderFeedbacksList()}
                {this.renderHistoricUpdatesList()}
                {this.renderChangeLogs()} */}



            </React.Fragment>
        );
    }

    private renderSectionTitle() {
        return (
            <React.Fragment>
                <h1 style={{ fontFamily: 'Calibri', fontSize: '36px' }}>Contingent Labour Business Cases</h1>

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
                            <tr>
                                <td style={{ width: '170px', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Stage
                                </td>
                                <td style={{ width: 'calc(100% - 50% - 170px - 170px)', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    Draft
                                </td>
                                <td style={{ width: '170px', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Case Ref
                                </td>
                                <td style={{ width: 'calc(100% - 50% - 170px - 170px)', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    &nbsp;
                                </td>

                            </tr>



                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Created By
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', }}>
                                    &nbsp;
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Created On
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    &nbsp;
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


        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Details of Applicant</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '100%', fontWeight: 'bold' }}>
                                <span>Name of hiring manager</span>

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


        return (
            <div>
                <div style={{ marginBottom: '10px', marginTop: '30px' }} className={styles.sectionATitle}>Requirement</div>

                <div style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingRight: '10px', paddingLeft: '10px', paddingTop: '20px', paddingBottom: '0px', backgroundColor: 'rgb(245,245,245)', border: '1px solid rgb(230,230,230)', }}>

                    <div className={styles.formField}>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>
                                <span>Title of vacancy</span>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <span>Grade of vacancy</span>

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
                                <span>Work proposal (what will they be doing? )</span>

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
                                <span>Cost centre worker is going into</span>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <span>Directorate worker is going into</span>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
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
                                <span>Estimated start date</span>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <span>Estimated end date</span>

                            </div>


                        </div>
                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <div style={{ width: '50%', paddingRight: '5px' }}>
                                <CrDatePicker
                                    width='100%'
                                    value={this.state.FormData.ReqEstStartDate}
                                    onSelectDate={(v) => changeDatePicker(this, v, "ReqEstStartDate")}
                                //required={true}
                                //errorMessage={this.state.ErrMessages.CurrentPeriodStartDate}
                                />



                            </div>

                            <div style={{ width: '50%', }}>
                                <CrDatePicker
                                    width='100%'
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
                                <span>Professional Category</span>

                            </div>
                            <div style={{ width: '50%', fontWeight: 'bold' }}>
                                <span>Work location</span>

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
                                <span>Number of positions</span>

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
                                    maxLength={2}


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

        const yesNoNaOptions: IDropdownOption[] = [
            { key: 'Yes', text: 'Yes' },
            { key: 'No', text: 'No' },
            { key: 'NA', text: 'N/A' },
        ];


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
                                    onChanged={(v) => this.changeTextField_number(v, "FinMaxRate")}
                                    value={fd.FinMaxRate && String(fd.FinMaxRate)}
                                    //value=''

                                />



                            </div>

                            <div style={{ width: 'calc(100% - 50% - 130px)', paddingRight: '5px' }}>
                                <CrTextField
                                    //className={styles.formField}
                                    //numbersOnly={true}
                                    onChanged={(v) => this.changeTextField_number(v, "FinEstCost")}
                                    value={fd.FinEstCost && String(fd.FinEstCost)}
                                    //value=''

                                />

                            </div>
                            <div style={{ width: '130px', }}>

                                <DefaultButton text="Calculate"
                                    //className={styles.formButton} style={{ marginRight: '5px' }}
                                    //style={{ border: '1px solid rgb(138,136,134)' }}
                                    onClick={this.props.onShowList}

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
                                    value=''

                                />

                            </div>
                            <div style={{ width: '130px', }}>

                                <DefaultButton text="Actions"
                                    //className={styles.formButton} style={{ marginRight: '5px' }}
                                    //style={{ border: '1px solid rgb(138,136,134)' }}
                                    onClick={this.props.onShowList}
                                    //primaryDisabled
                                    split
                                    splitButtonAriaLabel="See 2 options"
                                    aria-roledescription="split button"
                                    
                                    menuIconProps={menuProps}


                                />

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



    private renderFormButtons() {

        return (
            <div>

                {

                    <React.Fragment>
                        {<PrimaryButton text="Save as Draft" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.saveData()}
                        />}

                        <PrimaryButton text="Submit for Approval" className={styles.formButton} style={{ marginRight: '5px' }}
                        //onClick={() => this.saveData()}
                        />

                        <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={this.props.onShowList}
                        />


                    </React.Fragment>
                }



            </div>
        );


    }

    private renderListsMainTitle() {
        return (
            <div style={{ marginBottom: '20px', marginTop: '50px' }} className={styles.sectionATitle}>
                Evidence, Feedback, Previous Updates and Logs
            </div>
        );
    }



    //#region Data Load/Save

    private validateEntity = (): boolean => {
        return true;
    }


    private saveData = (): void => {
        if (this.validateEntity()) {
            console.log('in save data');
            if (this.props.onError) this.props.onError(null);
            let f: ICLCase = { ...this.state.FormData };
            //remove all the child and parent entities before sending post/patch
            //delete f.User; //parent entity

            if(this.isNumeric(f.FinMaxRate) === true){
                f.FinMaxRate = Number(f.FinMaxRate);
            }
            else{
                f.FinMaxRate = null;
            }

            if(this.isNumeric(f.FinEstCost) === true){
                f.FinEstCost = Number(f.FinEstCost);
            }
            else{
                f.FinEstCost = null;
            }

            if (f.ID === 0) {


                this.clCaseService.create(f).then((): void => {
                    //console.log('saved..');

                    if (this.props.onError)
                        this.props.onError(null);

                    this.props.onShowList();


                }, (err) => {
                    if (this.props.onError)
                        this.props.onError(`Error saving data`, err.message);
                });

            }
            else {

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
            this.loadClCase(),

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
                });


            }, (err) => {
                if (this.props.onError) this.props.onError(`Error loading case`, err.message);
            });

        }




    }


    //#endregion Data Load/Save


    //#region Event Handlers





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
        if(value == null || value == ''){
            console.log('set value to null');
            this.setState({ FormData: this.cloneObject(this.state.FormData, f, null)/*, FormIsDirty: true*/ });
        }
        else{
            const isNum: boolean = this.isNumeric(value);
            console.log('isNumeric', isNum);
            if(isNum === true){
                this.setState({ FormData: this.cloneObject(this.state.FormData, f, value)/*, FormIsDirty: true*/ });
            }
            else{
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

    private isNumeric(str:any) {
        const tempNum = Number(str);
        //if (typeof str != "string") return false; // we only process strings!  
        return !isNaN(tempNum) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
      }

    //#endregion Event Handlers

}