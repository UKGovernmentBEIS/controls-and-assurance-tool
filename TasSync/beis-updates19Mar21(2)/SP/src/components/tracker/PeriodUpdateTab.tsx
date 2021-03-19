import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import RecommendationsList from './RecommendationsList';
import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup, IChoiceGroupOption } from '../cr/CrChoiceGroup';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { CrCheckbox } from '../cr/CrCheckbox';
import { FormButtons } from '../cr/FormButtons';
import { MessageDialog } from '../cr/MessageDialog';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import styles from '../../styles/cr.module.scss';
import { IEntity, ILinkLocalType, INAOUpdate, IUser, NAOUpdate } from '../../types';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import EntityList from '../entity/EntityList';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import EvidenceList from './EV/EvidenceList';
import '../../styles/CustomFabric.scss';



export interface IPeriodUpdateTabProps extends types.IBaseComponentProps {

    filteredItems: any[];
    naoRecommendationId: any;
    naoPeriodId: any;
    //onSavedAndClose?: () => void;
    //parentTitle: string;
    onShowList: () => void;
    isViewOnly: boolean;

    //onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;

    //superUserPermission:boolean;
    //assigneePermission:boolean;
}

export interface ILookupData {
    NAOUpdateStatusTypes: IEntity[];
    NAORecStatusTypes: IEntity[];
    Users: IUser[];
}

export class LookupData implements ILookupData {

    public NAOUpdateStatusTypes: IEntity[] = [];
    public NAORecStatusTypes: IEntity[] = [];
    public Users = null;

}



export interface IPeriodUpdateTabState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: INAOUpdate;
    RecInfo: INAOUpdate;
    Evidence_ListFilterText: string;
    NAORecommendationId: number;
    HideNoNextMessage: boolean;
    HideNextButton: boolean;
    ArrLinks: ILinkLocalType[];
    LastPeriodActions: string;
    //FormData: IGoElement;

    //IncompleteOnly: boolean;
    //JustMine: boolean;
    //ListFilterText: string;

    // SelectedId: number;
    // SelectedTitle: string;
    // FilteredItems: any[];
}

export class PeriodUpdateTabState implements IPeriodUpdateTabState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData;
    public RecInfo = null;
    public Evidence_ListFilterText: string = null;
    public NAORecommendationId: number = 0;
    public HideNoNextMessage: boolean = true;
    public HideNextButton: boolean = false;
    public ArrLinks: ILinkLocalType[] = [];
    public LastPeriodActions: string = "";

    constructor(naoPeriodId: number, naoRecommendationId: number) {
        this.FormData = new NAOUpdate(naoPeriodId, naoRecommendationId);

    }

    //public FormData: IGoElement;

    //public IncompleteOnly = false;
    //public JustMine = false;
    //public ListFilterText: string = null;

    // public SelectedId: number = 0;
    // public SelectedTitle: string = null;
    // public FilteredItems = [];
}

export default class PeriodUpdateTab extends React.Component<IPeriodUpdateTabProps, IPeriodUpdateTabState> {

    private naoRecStatusTypeService: services.NAORecStatusTypeService = new services.NAORecStatusTypeService(this.props.spfxContext, this.props.api);
    private naoUpdateStatusTypeService: services.NAOUpdateStatusTypeService = new services.NAOUpdateStatusTypeService(this.props.spfxContext, this.props.api);
    private naoUpdateService: services.NAOUpdateService = new services.NAOUpdateService(this.props.spfxContext, this.props.api);
    private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);

    constructor(props: IPeriodUpdateTabProps, state: IPeriodUpdateTabState) {
        super(props);
        console.log("Rec Id", props.naoRecommendationId, "PeriodId", props.naoPeriodId);
        this.state = new PeriodUpdateTabState(props.naoPeriodId, props.naoRecommendationId);

    }

    public render(): React.ReactElement<IPeriodUpdateTabProps> {



        return (
            <React.Fragment>
                {this.renderSectionTitle()}
                {this.renderInfoTable()}
                {this.renderPeriodUpdateDetails()}
                {this.renderFormButtons()}
                {this.renderListsMainTitle()}
                {this.renderEvidencesList()}
                {this.renderFeedbacksList()}
                {this.renderHistoricUpdatesList()}
                {this.renderChangeLogs()}

                <MessageDialog hidden={this.state.HideNoNextMessage} title="Information" content="This is the last record in your list." handleOk={() => { this.setState({ HideNoNextMessage: true }); }} />

            </React.Fragment>
        );
    }

    private renderSectionTitle() {
        return (
            <React.Fragment>
                <h1 style={{ fontFamily: 'Calibri', fontSize: '36px' }}>Period Update</h1>

            </React.Fragment>
        );
    }

    private renderInfoTable() {
        const recInfo = this.state.RecInfo;
        if (recInfo === null) return;

        const periodStartDate = new Date(String(recInfo["NAOPeriod"]["PeriodStartDate"]));
        const periodEndDate = new Date(String(recInfo["NAOPeriod"]["PeriodEndDate"]));
        const periodTitle: string = recInfo["NAOPeriod"]["Title"];

        const periodStartDateStr: string = services.DateService.dateToUkDate(periodStartDate);
        const periodEndDateStr: string = services.DateService.dateToUkDate(periodEndDate);

        let recDetails: string = recInfo["NAORecommendation"]["RecommendationDetails"];
        if (recDetails !== null)
            recDetails = recDetails.split('\n').join('<br/>');
        else
            recDetails = "";

        let conclusion: string = recInfo["NAORecommendation"]["Conclusion"];
        if (conclusion !== null)
            conclusion = conclusion.split('\n').join('<br/>');
        else
            conclusion = "";

        return (

            <React.Fragment>

                <div style={{ marginBottom: '20px', marginTop: '50px' }} className={styles.sectionATitle}>Recommendation Details</div>

                <div style={{ width: '98%', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>
                            <tr>
                                <td style={{ width: '150px', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Update Period
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {`${periodTitle} ( ${periodStartDateStr} to ${periodEndDateStr} )`}
                                </td>
                                <td style={{ width: '150px', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Rec Ref
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {recInfo["NAORecommendation"]["Title"]}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Report Conclusion
                                </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <div dangerouslySetInnerHTML={{ __html: conclusion }} ></div>
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Recommendation
                            </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <div dangerouslySetInnerHTML={{ __html: recDetails }} ></div>
                                </td>

                            </tr>


                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderPeriodUpdateDetails() {
        const fd = this.state.FormData;


        return (
            <div>
                <div style={{ marginBottom: '20px', marginTop: '50px' }} className={styles.sectionATitle}>Period Update Details</div>

                <div style={{ width: '98%', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px' }}>

                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        We wish to provide an update for this period
                    </div>
                    <CrChoiceGroup
                        className="inlineflex"
                        options={[
                            {
                                key: '1',
                                text: 'Yes',
                            },
                            {
                                key: '0',
                                text: 'No'
                            },
                        ]}
                        selectedKey={fd.ProvideUpdate}
                        onChange={(ev, option) => this.changeChoiceGroup(ev, option, "ProvideUpdate")}
                    />

                    {fd.ProvideUpdate === '1' &&
                        <div>

                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                Proposed Recommendation Status
                    </div>
                            <CrDropdown
                                style={{ width: '350px' }}
                                placeholder="Select an Option"
                                className={styles.formField}
                                options={this.state.LookupData.NAORecStatusTypes.map((p) => { return { key: p.ID, text: p.Title }; })}
                                selectedKey={fd.NAORecStatusTypeId}
                                onChanged={(v) => this.changeDropdown(v, "NAORecStatusTypeId")}

                            />

                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                Target Date
                    </div>
                            <div style={{ width: '350px' }}>

                                <CrTextField
                                    className={styles.formField}
                                    onChanged={(v) => this.changeTextField(v, "TargetDate")}
                                    value={fd.TargetDate}

                                />
                            </div>



                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                Actions Taken (Please mention by whom if not BEIS)
                            </div>

                            <CrTextField
                                className={styles.formField}
                                multiline
                                rows={6}
                                maxLength={6000}
                                charCounter={true}
                                onChanged={(v) => this.changeTextField(v, "ActionsTaken")}
                                value={fd.ActionsTaken}

                            />
                            <div style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '5px' }}>
                                Actions Taken Previous Period:
                            </div>
                            <div style={{ fontStyle: 'italic', marginBottom: '30px' }}>
                                {this.state.LastPeriodActions}
                            </div>




                            {/* <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                Further links in format label: link ( eg: Treasury Minuites: http://bit.ly/23jgds )
                            </div>

                            <CrTextField
                                className={styles.formField}
                                onChanged={(v) => this.changeTextField(v, "FurtherLinks")}
                                value={fd.FurtherLinks}

                            /> */}

                            {this.renderLinks()}
                            {this.renderApprovalSection()}

                            <div style={{ marginBottom: '5px' }}>
                                <span style={{ fontWeight: 'bold' }}>Update Status:&nbsp;</span><span>{fd.LastSavedInfo}</span>
                            </div>

                        </div>
                    }



                </div>





            </div>
        );
    }

    public renderLinks() {


        return (
            <div>

                <div style={{ display: 'flex' }}>
                    <div style={{ width: '40%', paddingRight: '5px', fontWeight: 'bold' }}>
                        <span>Link Text (ie. Treasury Minutes)</span>

                    </div>
                    <div style={{ width: '40%', paddingRight: '5px', fontWeight: 'bold' }}>
                        <span>Link URL (ie. http://bit.ly/hdydg)</span>

                    </div>
                    <div style={{ width: '20%', paddingLeft: '2px', fontWeight: 'bold' }}>
                        <span>Add to Publication</span>

                    </div>

                </div>


                {this.state.ArrLinks.map((c, i) =>
                    this.renderLink(c, i)
                )}

                {<div className={styles.formField}>
                    <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={this.addBlankLinkItem} >Add fields For another link</span>
                </div>}

            </div>
        );
    }

    private renderLink(item: ILinkLocalType, index: number) {

        return (

            <div key={`div_renderLink_${index}`} style={{ display: 'flex', marginTop: '5px' }}>
                <div key={`divCol1_renderLink_${index}`} style={{ width: '40%', paddingRight: '5px' }}>
                    <CrTextField key={`div_TextField1_${index}`} value={item.Description}
                        onChanged={(v) => this.changeTextField_Link(v, index, "Description")}
                    />

                </div>

                <div key={`divCol2_renderLink_${index}`} style={{ width: '40%', paddingRight: '5px' }}>

                    <CrTextField key={`div_TextField2_${index}`} value={item.URL}
                        onChanged={(v) => this.changeTextField_Link(v, index, "URL")}
                    />

                </div>

                <div key={`divCol3_renderLink_${index}`} style={{ width: '20%', paddingLeft: '2px' }}>

                    <CrChoiceGroup
                        className="inlineflex"
                        options={[
                            {
                                key: 'False',
                                text: 'No',
                            },
                            {
                                key: 'True',
                                text: 'Yes'
                            },
                        ]}
                        selectedKey={item.AddToPublication}
                        onChange={(ev, option) => this.changeChoiceGroup_Link(ev, option, index)}
                    />

                </div>

            </div>

        );
    }

    private renderApprovalSection() {

        const users = this.state.LookupData.Users;
        if (users === null) return null;

        const drpOptions: IDropdownOption[] = [
            { key: 'Blank', text: '' },
            { key: 'Deputy Director', text: 'Deputy Director' },
            { key: 'Director', text: 'Director' },
            { key: 'Director General', text: 'Director General' },
            { key: 'Permanent Secretary', text: 'Permanent Secretary' },
        ];

        return (

            <div className={styles.formField}>

                <div style={{ display: 'flex' }}>
                    <div style={{ width: '50%', paddingRight: '5px', fontWeight: 'bold' }}>
                        <span>Approved By</span>

                    </div>
                    <div style={{ width: '50%', fontWeight: 'bold' }}>
                        <span>Position</span>

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
                            //selectedEntities={users.map((u) => { return u..UserId; })}
                            selectedEntities={this.state.FormData.ApprovedById && [this.state.FormData.ApprovedById]}
                            onChange={(v) => this.changeUserPicker(v, 'ApprovedById')}
                        //onChange={(v) => this.changeMultiUserPicker(v, 'NAOAssignments', new NAOAssignment(), 'UserId')}
                        />



                    </div>

                    <div style={{ width: '50%', }}>
                        <CrDropdown
                            placeholder="Select an Option"
                            options={drpOptions}
                            selectedKey={this.state.FormData.ApprovedByPosition}
                            onChanged={(v) => this.changeDropdown(v, "ApprovedByPosition")}
                        />

                    </div>




                </div>
            </div>
        );
    }

    private renderFormButtons() {

        return (
            <div>

                {
                    (this.props.isViewOnly === false) &&
                    <React.Fragment>
                        {(this.state.HideNextButton === false) && <PrimaryButton text="Save &amp; Next" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.saveData(true)}
                        />}

                        <PrimaryButton text="Save &amp; Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.saveData(false)}
                        />

                        <DefaultButton text="Cancel" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={this.props.onShowList}
                        />


                    </React.Fragment>
                }

                {(this.props.isViewOnly === true) &&
                    <div style={{ marginTop: '20px' }}>
                        {(this.state.HideNextButton === false) && <PrimaryButton text="Next" className={styles.formButton} style={{ marginRight: '5px' }}
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

    private renderListsMainTitle() {
        return (
            <div style={{ marginBottom: '20px', marginTop: '50px' }} className={styles.sectionATitle}>
                Evidence, Feedback, Previous Updates and Logs
            </div>
        );
    }

    private renderEvidencesList() {

        return (
            <React.Fragment>
                <div style={{ marginTop: '30px', fontWeight: "bold", marginBottom: '10px' }}>Evidence</div>
                <div style={{ minHeight: '120px', border: '1px solid rgb(166,166,166)' }}>
                    <EvidenceList
                        entityReadAllWithArg1={this.state.FormData.ID}
                        isViewOnly={false}
                        //goElementId={this.state.FormData.ID}
                        //goElementId={this.state.GoElementId}
                        filterText={this.state.Evidence_ListFilterText}
                        onChangeFilterText={this.handleEvidence_ChangeFilterText}
                        {...this.props}
                        onError={this.props.onError}

                    />
                </div>

            </React.Fragment>
        );

    }

    private renderFeedbacksList() {
        const listColumns: IGenColumn[] = [
            {
                key: 'NAOUpdateId',
                columnDisplayType: ColumnDisplayType.FormOnly,
                fieldDisabled: true,
                fieldHiddenInForm: true,
                fieldDefaultValue: this.state.FormData.ID,
                columnType: ColumnType.TextBox,
                name: 'NAOUpdateId',
                fieldName: 'NAOUpdateId',
                minWidth: 1,
                isResizable: true,
                isRequired: true,
            },
            {
                key: 'NAOUpdateFeedbackTitle',
                columnType: ColumnType.DropDown,
                name: 'Comment Type',
                fieldName: 'NAOUpdateFeedbackTitle',
                idFieldName: 'NAOUpdateFeedbackTypeId',
                isParent: true,
                parentEntityName: 'NAOUpdateFeedbackType',
                parentColumnName: 'Title',
                parentService: new services.NAOUpdateFeedbackTypeService(this.props.spfxContext, this.props.api),
                minWidth: 120,
                maxWidth: 120,
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
                fieldMaxLength: 10000,
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
                        entityService={new services.NAOUpdateFeedbackService(this.props.spfxContext, this.props.api)}
                        entityNamePlural="Comments"
                        entityNameSingular="Comment"
                        childEntityNameApi=""
                        childEntityNamePlural=""
                        childEntityNameSingular=""
                        zeroMarginTop={true}
                        hideTitleBelowCommandBar={true}
                    />
                </div>
                <div style={{ paddingTop: "10px", fontStyle: "italic" }}>
                    This area can be used to leave comments for other users.
                </div>

            </React.Fragment>
        );

    }

    private renderHistoricUpdatesList() {
        const listColumns: IGenColumn[] = [

            {
                key: 'NAOPeriodTitle',
                columnType: ColumnType.TextBox,
                name: 'Period Title',
                fieldName: 'NAOPeriodTitle',
                isParent: true,
                parentEntityName: 'NAOPeriod',
                parentColumnName: 'Title',
                minWidth: 100,
                maxWidth: 100,
                isResizable: true,
                isRequired: true,
                headerClassName: styles.bold,
            },
            {
                key: 'NAOPeriodStartDate',
                columnType: ColumnType.DatePicker,
                name: 'Period From',
                fieldName: 'NAOPeriodStartDate',
                isParent: true,
                parentEntityName: 'NAOPeriod',
                parentColumnName: 'PeriodStartDate',
                minWidth: 70,
                maxWidth: 70,
                isResizable: true,
                isRequired: true,
                headerClassName: styles.bold,
            },
            {
                key: 'NAOPeriodEndDate',
                columnType: ColumnType.DatePicker,
                name: 'Period To',
                fieldName: 'NAOPeriodEndDate',
                isParent: true,
                parentEntityName: 'NAOPeriod',
                parentColumnName: 'PeriodEndDate',
                minWidth: 70,
                maxWidth: 70,
                isResizable: true,
                isRequired: true,
                headerClassName: styles.bold,
            },
            {
                key: 'NAORecStatusTypeTitle',
                columnType: ColumnType.DisplayInListOnly,
                name: 'Proposed Status',
                fieldName: 'NAORecStatusTypeTitle',
                isParent: true,
                parentEntityName: 'NAORecStatusType',
                parentColumnName: 'Title',
                minWidth: 88,
                maxWidth: 88,
                isResizable: true,
                isRequired: true,
                headerClassName: styles.bold,
            },
            {
                key: 'ActionsTaken',
                columnType: ColumnType.TextBox,
                name: 'Actions taken',
                fieldName: 'ActionsTaken',
                minWidth: 500,
                isResizable: true,
                isRequired: true,
                fieldMaxLength: 10000,
                isMultiline: true,
                numRows: 5,
                headerClassName: styles.bold,
            },

            // {
            //     key: 'NAOComments',
            //     columnType: ColumnType.TextBox,
            //     name: 'NAO Comments',
            //     fieldName: 'NAOComments',
            //     minWidth: 250,
            //     isResizable: true,
            //     isRequired: true,
            //     fieldMaxLength: 10000,
            //     isMultiline: true,
            //     numRows: 5,
            //     headerClassName: styles.bold,
            // },

            {
                key: 'TargetDate',
                columnType: ColumnType.TextBox,
                name: 'Target Date',
                fieldName: 'TargetDate',
                minWidth: 100,
                isResizable: true,
                isRequired: true,
                headerClassName: styles.bold,
            },



        ];

        return (
            <React.Fragment>
                <div style={{ marginTop: '30px', fontWeight: "bold", marginBottom: '10px' }}>Historic Updates</div>
                <div style={{ minHeight: '120px', border: '1px solid rgb(166,166,166)' }}>
                    <EntityList
                        entityReadAllWithArg1={this.state.NAORecommendationId}
                        entityReadAllWithArg2={this.props.naoPeriodId}
                        allowAdd={false}
                        columns={listColumns}
                        {...this.props}
                        onError={this.props.onError}
                        entityService={new services.NAOUpdateService(this.props.spfxContext, this.props.api)}
                        entityNamePlural="Updates"
                        entityNameSingular="Update"
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

    private renderChangeLogs() {
        const fd = this.state.FormData;
        let changeLog = fd.UpdateChangeLog ? fd.UpdateChangeLog : "";
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

    //#region Data Load/Save

    private validateEntity = (): boolean => {
        return true;
    }
    private saveData = (showNext: boolean): void => {
        this.saveLinksToSingleValue(showNext);
    }
    private saveLinksToSingleValue = (showNext: boolean): void => {

        let singleStr: string = "";
        const arrLinks = this.state.ArrLinks;

        for (let i = 0; i < arrLinks.length; i++) {
            let item: ILinkLocalType = arrLinks[i];
            if (item.Description.trim() === '' && item.URL.trim() === '') {
                //ignore this item
            }
            else {
                if (item.URL.trim() !== '') {
                    let description: string = item.Description !== '' ? item.Description : item.URL;
                    //use '<' for separator between description and url, And use '>' for next item separator
                    singleStr += `${description}<${item.URL.trim()}<${item.AddToPublication}>`;
                }
            }
        }

        //set single value in state
        const fd = { ...this.state.FormData };
        fd.FurtherLinks = singleStr;

        this.setState({ FormData: fd }, () => this.saveDataFinal(showNext));

    }
    private saveDataFinal = (showNext: boolean): void => {
        if (this.validateEntity()) {
            console.log('in save data');
            if (this.props.onError) this.props.onError(null);
            let f: INAOUpdate = { ...this.state.FormData };
            //remove all the child and parent entities before sending post/patch
            //delete f.User; //parent entity

            // this.naoUpdateService.create(f).then(this.props.onSavedAndClose, (err) => {
            //     if (this.props.onError) this.props.onError(`Error updating item`, err.message);
            // });

            this.naoUpdateService.create(f).then((): void => {
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
                    this.props.onError(`Error saving update`, err.message);
            });


        }
    }

    private showNext = (): void => {


        const currentNAORecId: number = Number(this.state.NAORecommendationId);
        //console.log("filtered items", this.props.filteredItems);
        //console.log("current GoElementId", currentGoElementID);
        let currentIDFound: boolean = false;
        let nextNAORecID: number = 0;




        for (let i = 0; i < this.props.filteredItems.length; i++) {
            let e: any = this.props.filteredItems[i];
            const id: number = Number(e["ID"]);

            if (id === currentNAORecId) {
                currentIDFound = true;
                //console.log("if condition", id, currentGoElementID);
                continue;

            }
            if (currentIDFound === true) {
                nextNAORecID = id;
                console.log("nextNAORecID", nextNAORecID);
                break;
            }

        }

        if (nextNAORecID > 0) {
            this.setState({
                NAORecommendationId: nextNAORecID,
            }, () => this.loadUpdate(false));
        }
        else {

            //this condition will not run cause we are already hiding next buttons
            this.setState({
                HideNoNextMessage: false,
            });
        }


    }

    private loadNAORecStatusTypes = (): Promise<IEntity[]> => {
        return this.naoRecStatusTypeService.readAll(`?$orderby=ID`).then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'NAORecStatusTypes', data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading NAORecStatusTypes lookup data`, err.message); });
    }

    private loadNAOUpdateStatusTypes = (): Promise<IEntity[]> => {
        return this.naoUpdateStatusTypeService.readAll(`?$orderby=ID`).then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'NAOUpdateStatusTypes', data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading NAOUpdateStatusTypes lookup data`, err.message); });
    }

    private loadUpdate = (firstLoad: boolean): void => {

        this.naoUpdateService.readByPeriodAndRec(this.state.NAORecommendationId, this.props.naoPeriodId).then((u: INAOUpdate) => {
            console.log('NAOUpdate', u);
            // if (firstLoad === false) {
            //     //if we need to send info to parent component after loading next goElement- do it here
            // }

            //check if this is the last record or not in the props.filteredItems
            const lastRecId_FilteredItems: number = Number(this.props.filteredItems[this.props.filteredItems.length - 1]["ID"]);
            const recId_Current: number = Number(this.state.NAORecommendationId);
            let hideNextButton: boolean = false;
            if (recId_Current === lastRecId_FilteredItems) {
                //console.log("This is the last one...");
                hideNextButton = true;

            }


            /**************************************links************************************************************** */

            let arrLinks: ILinkLocalType[] = [];

            //unpack publication links from single value
            if (u.FurtherLinks !== null && u.FurtherLinks !== '') {
                let arr1 = u.FurtherLinks.split('>');

                //console.log('arr1', arr1);

                for (let i = 0; i < arr1.length; i++) {

                    let itemStr: string = arr1[i];
                    //console.log('arr1 Loop itemStr', itemStr);
                    if (itemStr.trim() === '') {
                        continue;
                    }
                    //console.log('after continue');
                    let arr2 = itemStr.split('<');
                    //console.log('after arr2 Split', arr2);
                    let item: ILinkLocalType = { Description: '', URL: '' };
                    item.Description = arr2[0];
                    item.URL = arr2[1];
                    item.AddToPublication = 'False'; //always False on data load

                    //console.log('item filled with data', item);

                    arrLinks.push(item);

                    //console.log('item pushed to arrLinks', arrLinks);

                }
            }


            /************************************links end***************************************************************** */

            this.setState({
                FormData: u,
                ArrLinks: arrLinks,
                HideNextButton: hideNextButton
            }, this.loadRecInfo);


        }, (err) => {
            if (this.props.onError) this.props.onError(`Error loading update`, err.message);
        });

        this.naoUpdateService.getLastPeriodActionsTaken(this.state.NAORecommendationId, this.props.naoPeriodId).then((res: string): void => {

            console.log('last Period Actions', res);
            this.setState({
                LastPeriodActions: res,
            });

        }, (err) => {

        });


    }
    private loadRecInfo = (): void => {
        if (this.state.FormData.ID > 0) {

            this.addBlankLinkItem();
            this.naoUpdateService.getRecInfo(this.state.FormData.ID).then((u: INAOUpdate) => {
                console.log('Rec Info', u);

                this.setState({
                    RecInfo: u
                });


            }, (err) => {
                if (this.props.onError) this.props.onError(`Error loading rec info`, err.message);
            });
        }

    }

    private addBlankLinkItem = () => {
        console.log('in addBlankLinkItem');
        const arrCopy = [...this.state.ArrLinks, { Description: '', URL: '', AddToPublication: 'False' }];
        this.setState({ ArrLinks: arrCopy });
        //const item: ILinkLocalType = { Description: 'des', URL: 'url' };
        //arrCopy.push()
    }

    private loadUsers = (): void => {
        this.userService.readAll().then((data: IUser[]): IUser[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Users", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Users lookup data`, err.message); });
    }

    protected loadLookups(): Promise<any> {

        return Promise.all([
            this.loadNAORecStatusTypes(),
            this.loadNAOUpdateStatusTypes(),
            this.loadUsers(),
            this.loadUpdate(true),

        ]);
    }


    public componentDidMount(): void {
        //this.loadUpdates();
        this.setState({ Loading: true, NAORecommendationId: Number(this.props.naoRecommendationId) }, this.callBackFirstLoad

        );
    }
    private callBackFirstLoad = (): void => {
        let loadingPromises = [this.loadLookups()];

        // if (this.state.GoElementId > 0) {
        //     loadingPromises.push(this.loadGoElement(true));
        // }
        Promise.all(loadingPromises).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));

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

    protected changeTextField = (value: string, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value)/*, FormIsDirty: true*/ });
    }
    private changeTextField_Link = (value: string, index: number, type: string): void => {
        const arrCopy = [...this.state.ArrLinks];
        const item: ILinkLocalType = arrCopy[index];
        if (type === "Description") {
            item.Description = value;
        }
        else {
            item.URL = value;
        }

        this.setState({ ArrLinks: arrCopy });
    }
    private changeChoiceGroup_Link = (ev, option: IChoiceGroupOption, index: number): void => {
        const selectedKey = option.key;
        const arrCopy = [...this.state.ArrLinks];
        const item: ILinkLocalType = arrCopy[index];
        item.AddToPublication = selectedKey;

        this.setState({ ArrLinks: arrCopy });

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

    //#endregion Event Handlers

}