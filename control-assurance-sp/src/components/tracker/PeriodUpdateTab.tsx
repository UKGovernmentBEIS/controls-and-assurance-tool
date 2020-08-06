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
import { IEntity, INAOUpdate, NAOUpdate } from '../../types';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import EntityList from '../entity/EntityList';
import EvidenceList from './EV/EvidenceList';
import '../../styles/CustomFabric.scss';



export interface IPeriodUpdateTabProps extends types.IBaseComponentProps {

    filteredItems: any[];
    naoRecommendationId: any;
    naoPeriodId: any;
    //onSavedAndClose?: () => void;
    //parentTitle: string;
    onShowList: () => void;
    //isViewOnly: boolean;

    //onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
}

export interface ILookupData {
    NAOUpdateStatusTypes: IEntity[];
    NAORecStatusTypes: IEntity[];
}

export class LookupData implements ILookupData {

    public NAOUpdateStatusTypes: IEntity[] = [];
    public NAORecStatusTypes: IEntity[] = [];

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


        let recDetails: string = recInfo["NAORecommendation"]["RecommendationDetails"];
        recDetails = recDetails.split('\n').join('<br/>');

        let conclusion: string = recInfo["NAORecommendation"]["Conclusion"];
        conclusion = conclusion.split('\n').join('<br/>');

        return (

            <React.Fragment>

                <div style={{ marginBottom: '20px', marginTop: '50px' }} className={styles.sectionATitle}>Recommendation Details</div>

                <div style={{ width: '98%', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>
                            <tr>
                                <td style={{ width: '150px', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Period
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {recInfo["NAOPeriod"]["Title"]}
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
                                    Recommendation
                            </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <div dangerouslySetInnerHTML={{ __html: recDetails }} ></div>
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Conclusion
                                </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <div dangerouslySetInnerHTML={{ __html: conclusion }} ></div>
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


                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        Proposed Status
                    </div>
                    <CrDropdown
                        style={{ width: '350px' }}
                        placeholder="Select an Option"
                        className={styles.formField}
                        options={this.state.LookupData.NAORecStatusTypes.map((p) => { return { key: p.ID, text: p.Title }; })}
                        selectedKey={fd.NAORecStatusTypeId}
                        onChanged={(v) => this.changeDropdown(v, "NAORecStatusTypeId")}
                    //options={services.LookupService.entitiesToSelectableOptions(policyStatusOveralls)}
                    // options={[
                    //     { key: '1', text: '1' }
                    // ]}

                    //onChanged={(v) => this.changeDropdown(v, "SuggestOverallStatusID")}
                    />

                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        Target Date
                    </div>
                    <div style={{ width: '350px' }}>

                        <CrTextField
                            className={styles.formField}
                            onChanged={(v) => this.changeTextField(v, "TargetDate")}
                            value={fd.TargetDate}
                        //readonly={this.readOnlyMode()}
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

                    //readonly={this.readOnlyMode()}
                    />

                    {/* <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        NAO Comments
                    </div>

                    <CrTextField
                        className={styles.formField}
                        multiline
                        rows={6}
                        maxLength={6000}
                        charCounter={true}
                        onChanged={(v) => this.changeTextField(v, "NAOComments")}
                        value={fd.NAOComments}


                    /> */}


                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        Further links in format label: link ( eg: Treasury Minuites: http://bit.ly/23jgds )
                    </div>

                    <CrTextField
                        className={styles.formField}
                        onChanged={(v) => this.changeTextField(v, "FurtherLinks")}
                        value={fd.FurtherLinks}

                    //readonly={this.readOnlyMode()}
                    />

                    <div style={{ marginBottom: '5px' }}>
                        <span style={{ fontWeight: 'bold' }}>Update Status:&nbsp;</span><span>{fd.LastSavedInfo}</span>
                    </div>
                    {/* <CrDropdown
                        style={{ width: '350px' }}
                        placeholder="Select an Option"
                        className={styles.formField}
                        options={this.state.LookupData.NAOUpdateStatusTypes.map((p) => { return { key: p.ID, text: p.Title }; })}
                        selectedKey={fd.NAOUpdateStatusTypeId}
                        onChanged={(v) => this.changeDropdown(v, "NAOUpdateStatusTypeId")}

                    /> */}

                </div>





            </div>
        );
    }

    private renderFormButtons() {

        return (
            <div>

                {
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

                {/* {(this.props.isViewOnly === true) &&
                    <div style={{ marginTop: '20px' }}>
                        {(this.state.HideNextButton === false) && <PrimaryButton text="Next" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.showNext()}
                        />}

                        <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={this.props.onShowList}
                        />
                    </div>
                } */}

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
                columnType: ColumnType.DisplayInListOnly,
                name: 'Period',
                fieldName: 'NAOPeriodTitle',
                isParent: true,
                parentEntityName: 'NAOPeriod',
                parentColumnName: 'Title',
                minWidth: 120,
                maxWidth: 120,
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
                minWidth: 120,
                maxWidth: 120,
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
                minWidth: 150,
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
                        //entityReadAllWithArg2={this.props.naoPeriodId}
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
        return this.naoRecStatusTypeService.readAll(`?$orderby=Title`).then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'NAORecStatusTypes', data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading NAORecStatusTypes lookup data`, err.message); });
    }

    private loadNAOUpdateStatusTypes = (): Promise<IEntity[]> => {
        return this.naoUpdateStatusTypeService.readAll(`?$orderby=Title`).then((data: IEntity[]): IEntity[] => {
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

            this.setState({
                FormData: u,
                HideNextButton: hideNextButton
            }, this.loadRecInfo);


        }, (err) => {
            if (this.props.onError) this.props.onError(`Error loading update`, err.message);
        });


    }
    private loadRecInfo = (): void => {
        if (this.state.FormData.ID > 0) {

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

    protected loadLookups(): Promise<any> {

        return Promise.all([
            this.loadNAORecStatusTypes(),
            this.loadNAOUpdateStatusTypes(),
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

    //#endregion Event Handlers

}