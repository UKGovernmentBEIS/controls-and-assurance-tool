import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import RecommendationsList from './RecommendationsList';
import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup, IChoiceGroupOption } from '../cr/CrChoiceGroup';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { CrCheckbox } from '../cr/CrCheckbox';
import { FormButtons } from '../cr/FormButtons';
import { CrDatePicker } from '../cr/CrDatePicker';
import { MessageDialog } from '../cr/MessageDialog';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import styles from '../../styles/cr.module.scss';
import { IEntity, IGIAAUpdate, GIAAUpdate } from '../../types';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import EntityList from '../entity/EntityList';




export interface IPeriodUpdateTabProps extends types.IBaseComponentProps {

    filteredItems: any[];
    giaaRecommendationId: any;
    giaaPeriodId: any;
    //onSavedAndClose?: () => void;
    //parentTitle: string;
    onShowList: () => void;
    //isViewOnly: boolean;

    //onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
}

export interface ILookupData {
    GIAAUpdateStatusTypes: IEntity[];
    GIAAActionStatusTypes: IEntity[];
    GIAAActionPriorities: IEntity[];
}

export class LookupData implements ILookupData {

    public GIAAUpdateStatusTypes: IEntity[] = [];
    public GIAAActionStatusTypes: IEntity[] = [];
    public GIAAActionPriorities: IEntity[] = [];

}



export interface IPeriodUpdateTabState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: IGIAAUpdate;
    RecInfo: IGIAAUpdate;
    Evidence_ListFilterText: string;
    GIAARecommendationId: number;
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
    public GIAARecommendationId: number = 0;
    public HideNoNextMessage: boolean = true;
    public HideNextButton: boolean = false;

    constructor(naoPeriodId: number, naoRecommendationId: number) {
        this.FormData = new GIAAUpdate(naoPeriodId, naoRecommendationId);

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

    private giaaActionStatusTypeService: services.GIAAActionStatusTypeService = new services.GIAAActionStatusTypeService(this.props.spfxContext, this.props.api);
    private giaaUpdateStatusTypeService: services.GIAAUpdateStatusTypeService = new services.GIAAUpdateStatusTypeService(this.props.spfxContext, this.props.api);
    private giaaActionPriorityService: services.GIAAActionPriorityService = new services.GIAAActionPriorityService(this.props.spfxContext, this.props.api);
    private giaaUpdateService: services.GIAAUpdateService = new services.GIAAUpdateService(this.props.spfxContext, this.props.api);

    constructor(props: IPeriodUpdateTabProps, state: IPeriodUpdateTabState) {
        super(props);
        console.log("Rec Id", props.giaaRecommendationId, "PeriodId", props.giaaPeriodId);
        this.state = new PeriodUpdateTabState(props.giaaPeriodId, props.giaaRecommendationId);

    }

    public render(): React.ReactElement<IPeriodUpdateTabProps> {



        return (
            <React.Fragment>
                {this.renderSectionTitle()}
                {this.renderInfoTable()}
                {this.renderPeriodUpdateDetails()}
                {this.renderFormButtons()}
                {this.renderListsMainTitle()}
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
        let recDetails: string = recInfo["GIAARecommendation"]["RecommendationDetails"];
        recDetails = recDetails.replace('\n', '<br/>');
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
                                    {recInfo["GIAAPeriod"]["Title"]}
                                </td>
                                <td style={{ width: '150px', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Rec Ref
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>

                                    {recInfo["GIAARecommendation"]["Title"]}
                                </td>

                            </tr>


                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Recommendation and Agreed Action
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
                        Proposed Status
                    </div>
                    <CrDropdown
                        style={{ width: '350px' }}
                        placeholder="Select an Option"
                        className={styles.formField}
                        options={this.state.LookupData.GIAAActionStatusTypes.map((p) => { return { key: p.ID, text: p.Title }; })}
                        selectedKey={fd.GIAAActionStatusTypeId}
                        onChanged={(v) => this.changeDropdown(v, "GIAAActionStatusTypeId")}


                    />

                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        Target Date
                    </div>
                    <div style={{ width: '350px' }}>

                        <CrDatePicker
                            className={styles.formField}
                            value={this.state.FormData.TargetDate}
                            onSelectDate={(v) => this.changeDatePicker(v, "TargetDate")}
                        />

                    </div>

                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        Priority
                    </div>
                    <CrDropdown
                        style={{ width: '350px' }}
                        placeholder="Select an Option"
                        className={styles.formField}
                        options={this.state.LookupData.GIAAActionPriorities.map((p) => { return { key: p.ID, text: p.Title }; })}
                        selectedKey={fd.GIAAActionPriorityId}
                        onChanged={(v) => this.changeDropdown(v, "GIAAActionPriorityId")}


                    />



                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        Progress Update for this Period
                    </div>

                    <CrTextField
                        className={styles.formField}
                        multiline
                        rows={6}
                        maxLength={6000}
                        charCounter={true}
                        onChanged={(v) => this.changeTextField(v, "ProgressUpdateDetails")}
                        value={fd.ProgressUpdateDetails}

                    //readonly={this.readOnlyMode()}
                    />

                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        GIAA Comments
                    </div>

                    <CrTextField
                        className={styles.formField}
                        multiline
                        rows={6}
                        maxLength={6000}
                        charCounter={true}
                        onChanged={(v) => this.changeTextField(v, "GIAAComments")}
                        value={fd.GIAAComments}

                    //readonly={this.readOnlyMode()}
                    />


                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        Link to Risk Management
                    </div>

                    <CrTextField
                        className={styles.formField}
                        onChanged={(v) => this.changeTextField(v, "Link")}
                        value={fd.Link}

                    //readonly={this.readOnlyMode()}
                    />

                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        Set Period Update Status to
                    </div>
                    <CrDropdown
                        style={{ width: '350px' }}
                        placeholder="Select an Option"
                        className={styles.formField}
                        options={this.state.LookupData.GIAAUpdateStatusTypes.map((p) => { return { key: p.ID, text: p.Title }; })}
                        selectedKey={fd.GIAAUpdateStatusId}
                        onChanged={(v) => this.changeDropdown(v, "GIAAUpdateStatusId")}

                    />

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
                Feedback, Previous Updates and Logs
            </div>
        );
    }



    private renderFeedbacksList() {
        const listColumns: IGenColumn[] = [
            {
                key: 'GIAAUpdateId',
                columnDisplayType: ColumnDisplayType.FormOnly,
                fieldDisabled: true,
                fieldHiddenInForm: true,
                fieldDefaultValue: this.state.FormData.ID,
                columnType: ColumnType.TextBox,
                name: 'GIAAUpdateId',
                fieldName: 'GIAAUpdateId',
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
                        entityService={new services.GIAAUpdateFeedbackService(this.props.spfxContext, this.props.api)}
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
                key: 'GIAAPeriodTitle',
                columnType: ColumnType.DisplayInListOnly,
                name: 'Period',
                fieldName: 'GIAAPeriodTitle',
                isParent: true,
                parentEntityName: 'GIAAPeriod',
                parentColumnName: 'Title',
                minWidth: 120,
                maxWidth: 120,
                isResizable: true,
                isRequired: true,
                headerClassName: styles.bold,
            },
            {
                key: 'GIAAActionStatusTypeTitle',
                columnType: ColumnType.DisplayInListOnly,
                name: 'Proposed Status',
                fieldName: 'GIAAActionStatusTypeTitle',
                isParent: true,
                parentEntityName: 'GIAAActionStatusType',
                parentColumnName: 'Title',
                minWidth: 120,
                maxWidth: 120,
                isResizable: true,
                isRequired: true,
                headerClassName: styles.bold,
            },
            {
                key: 'ProgressUpdateDetails',
                columnType: ColumnType.TextBox,
                name: 'Period Update',
                fieldName: 'ProgressUpdateDetails',
                minWidth: 300,
                isResizable: true,
                isRequired: true,
                fieldMaxLength: 10000,
                isMultiline: true,
                numRows: 5,
                headerClassName: styles.bold,
            },

            {
                key: 'GIAAComments',
                columnType: ColumnType.TextBox,
                name: 'GIAA Comments',
                fieldName: 'GIAAComments',
                minWidth: 250,
                isResizable: true,
                isRequired: true,
                fieldMaxLength: 10000,
                isMultiline: true,
                numRows: 5,
                headerClassName: styles.bold,
            },

            {
                key: 'TargetDate',
                columnType: ColumnType.DatePicker,
                name: 'Proposed Targe tDate',
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
                        entityReadAllWithArg1={this.state.GIAARecommendationId}
                        //entityReadAllWithArg2={this.props.naoPeriodId}
                        allowAdd={false}
                        columns={listColumns}
                        {...this.props}
                        onError={this.props.onError}
                        entityService={new services.GIAAUpdateService(this.props.spfxContext, this.props.api)}
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
            let f: IGIAAUpdate = { ...this.state.FormData };
            //remove all the child and parent entities before sending post/patch
            //delete f.User; //parent entity


            this.giaaUpdateService.create(f).then((): void => {
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


        const currentGIAARecId: number = Number(this.state.GIAARecommendationId);
        //console.log("filtered items", this.props.filteredItems);
        //console.log("current GoElementId", currentGoElementID);
        let currentIDFound: boolean = false;
        let nextGIAARecID: number = 0;




        for (let i = 0; i < this.props.filteredItems.length; i++) {
            let e: any = this.props.filteredItems[i];
            const id: number = Number(e["ID"]);

            if (id === currentGIAARecId) {
                currentIDFound = true;
                //console.log("if condition", id, currentGoElementID);
                continue;

            }
            if (currentIDFound === true) {
                nextGIAARecID = id;
                console.log("nextGIAARecID", nextGIAARecID);
                break;
            }

        }

        if (nextGIAARecID > 0) {
            this.setState({
                GIAARecommendationId: nextGIAARecID,
            }, () => this.loadUpdate(false));
        }
        else {

            //this condition will not run cause we are already hiding next buttons
            this.setState({
                HideNoNextMessage: false,
            });
        }


    }


    private loadGIAAActionStatusTypes = (): void => {
        this.giaaActionStatusTypeService.readAll(`?$orderby=ID`).then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'GIAAActionStatusTypes', data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading GIAAActionStatusTypes lookup data`, err.message); });
    }

    private loadGIAAActionPriorities = (): void => {
        this.giaaActionPriorityService.readAll(`?$orderby=ID`).then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'GIAAActionPriorities', data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading GIAAActionPriorities lookup data`, err.message); });
    }

    private loadGIAAUpdateStatusTypes = (): void => {
        this.giaaUpdateStatusTypeService.readAll(`?$orderby=ID`).then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'GIAAUpdateStatusTypes', data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading GIAAUpdateStatusTypes lookup data`, err.message); });
    }




    private loadUpdate = (firstLoad: boolean): void => {

        this.giaaUpdateService.readByPeriodAndRec(this.state.GIAARecommendationId, this.props.giaaPeriodId).then((u: IGIAAUpdate) => {
            console.log('GIAAUpdate', u);
            // if (firstLoad === false) {
            //     //if we need to send info to parent component after loading next goElement- do it here
            // }

            //check if this is the last record or not in the props.filteredItems
            const lastRecId_FilteredItems: number = Number(this.props.filteredItems[this.props.filteredItems.length - 1]["ID"]);
            const recId_Current: number = Number(this.state.GIAARecommendationId);
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

            this.giaaUpdateService.getRecInfo(this.state.FormData.ID).then((u: IGIAAUpdate) => {
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
            this.loadGIAAActionStatusTypes(),
            this.loadGIAAActionPriorities(),
            this.loadGIAAUpdateStatusTypes(),
            this.loadUpdate(true),

        ]);
    }


    public componentDidMount(): void {
        //this.loadUpdates();
        this.setState({ Loading: true, GIAARecommendationId: Number(this.props.giaaRecommendationId) }, this.callBackFirstLoad

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
    protected changeDatePicker = (date: Date, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, date), /*FormIsDirty: true*/ });
    }

    //#endregion Event Handlers

}