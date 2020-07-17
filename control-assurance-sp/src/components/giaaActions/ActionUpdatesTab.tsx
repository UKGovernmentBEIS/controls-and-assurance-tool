import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import UpdatesList from './UpdatesList';
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
import { IEntity, IGIAARecommendation, GIAAUpdate } from '../../types';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import EntityList from '../entity/EntityList';
import EvidenceList from './EV/EvidenceList';




export interface IActionUpdatesTabProps extends types.IBaseComponentProps {

    filteredItemsRecList: any[];
    filteredItemsMainList: any[];
    giaaRecommendationId: any;
    giaaAuditReportId: any;

    recListIncompleteOnly: boolean;
    recListJustMine: boolean;
    recListActionStatusTypeId: number;

    onChangeMainListID: (ID:number) => void;

    onShowList: () => void;
    //isViewOnly: boolean;


}

export interface ILookupData {

}

export class LookupData implements ILookupData {



}



export interface IActionUpdatesTabState {
    Loading: boolean;
    LookupData: ILookupData;
    RecInfo: IGIAARecommendation;
    GIAARecommendationId: number;
    FilteredItemsRecList: any[];

    GIAAAuditReportId: number;
    HideNextButton: boolean;

    ListFilterText: string;


}

export class ActionUpdatesTabState implements IActionUpdatesTabState {
    public Loading = false;
    public LookupData = new LookupData();
    public RecInfo = null;
    public GIAARecommendationId: number = 0;
    public GIAAAuditReportId: number = 0;
    public FilteredItemsRecList: any[] = null;
    public HideNextButton: boolean = false;

    public ListFilterText: string = null;


}

export default class ActionUpdatesTab extends React.Component<IActionUpdatesTabProps, IActionUpdatesTabState> {

    private giaaRecommendationService: services.GIAARecommendationService = new services.GIAARecommendationService(this.props.spfxContext, this.props.api);

    constructor(props: IActionUpdatesTabProps, state: IActionUpdatesTabState) {
        super(props);
        // console.log("Rec Id", props.giaaRecommendationId);
        // console.log("filteredItemsRecList", props.filteredItemsRecList);
        // console.log("filteredItemsMainList", props.filteredItemsMainList);

        // console.log("recListIncompleteOnly", props.recListIncompleteOnly);
        // console.log("recListJustMine", props.recListJustMine);
        // console.log("recListActionStatusTypeId", props.recListActionStatusTypeId);

        this.state = new ActionUpdatesTabState();

    }

    public render(): React.ReactElement<IActionUpdatesTabProps> {



        return (
            <React.Fragment>
                {this.renderSectionTitle()}
                {this.renderInfoTable()}
                {this.renderUpdatesList()}
                {this.renderFormButtons()}

            </React.Fragment>
        );
    }

    private renderSectionTitle() {
        return (
            <React.Fragment>
                <h1 style={{ fontFamily: 'Calibri', fontSize: '36px' }}>Action Updates</h1>

            </React.Fragment>
        );
    }

    private renderInfoTable() {
        const recInfo = this.state.RecInfo;
        if (recInfo === null) return;
        const auditReportTitle: string = recInfo['GIAAAuditReport']['Title'];
        const recRef: string = recInfo.Title;
        let recDetails: string = recInfo.RecommendationDetails;
        recDetails = recDetails.replace('\n', '<br/>');
        return (

            <React.Fragment>

                <div style={{ marginBottom: '20px', marginTop: '50px' }} className={styles.sectionATitle}>Recommendation Details</div>

                <div style={{ width: '98%', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>
                            <tr>
                                <td style={{ width: '150px', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Audit Report Title
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {auditReportTitle}
                                </td>
                                <td style={{ width: '150px', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Rec Ref
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>

                                    {recRef}
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

    private renderUpdatesList() {
        const recInfo = this.state.RecInfo;
        if (recInfo === null) return;

        return (
            <React.Fragment>
                <div style={{ marginBottom: '20px', marginTop: '50px' }} className={styles.sectionATitle}>Updates, Feedback, Evidence</div>


                {<div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>
                        <UpdatesList
                            {...this.props}
                            giaaRecommendationId={this.state.GIAARecommendationId}
                            defaultGIAAActionStatusTypeId={this.state.RecInfo.GIAAActionStatusTypeId}
                            defaultRevisedDate={this.state.RecInfo.RevisedDate}
                            onError={this.props.onError}
                            filterText={this.state.ListFilterText}
                            onChangeFilterText={this.handle_ChangeFilterText}

                        />
                    </div>
                    {/* <div style={{ paddingTop: "10px", paddingLeft: "10px", fontStyle: "italic" }}>
                        Please click on a Rec Ref to view or update.
                    </div> */}
                    <br /><br />

                </div>}


            </React.Fragment>
        );
    }

    private renderFormButtons() {
        const recInfo = this.state.RecInfo;
        if (recInfo === null) return;

        return (
            <div>

                {
                    <React.Fragment>
                        {(this.state.HideNextButton === false) &&
                            <PrimaryButton text="Next" className={styles.formButton} style={{ marginRight: '5px' }}
                                onClick={() => this.showNext()}
                            />}

                        <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
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




    private showNext = (): void => {

        console.log('in showNext');

        const currentRecId: number = Number(this.state.GIAARecommendationId);
        let currentRecIDFound: boolean = false;
        let nextRecID: number = 0;

        for (let i = 0; i < this.state.FilteredItemsRecList.length; i++) {

            let e: any = this.state.FilteredItemsRecList[i];
            const id: number = Number(e["ID"]);

            if (id === currentRecId) {
                currentRecIDFound = true;
                continue;
            }
            if (currentRecIDFound === true) {
                nextRecID = id;
                //console.log("nextRecID", nextRecID);
                break;
            }

        }

        if (nextRecID > 0) {
            this.setState({
                GIAARecommendationId: nextRecID,
            }, () => this.loadRecInfo());
        }
        else {

            //this condition will run when all the recs are finished for the current report
            //but this condition will not run on last report and last rec (in that case we hide next button before this)



            //load Recs List for the next report
            console.log('load Recs List for the next report');

            const currentMainId: number = Number(this.state.GIAAAuditReportId);
            let currentMainIDFound: boolean = false;
            let nextMainID: number = 0;

            for (let i = 0; i < this.props.filteredItemsMainList.length; i++) {

                let ee: any = this.props.filteredItemsMainList[i];
                const idd: number = Number(ee["ID"]);

                if (idd === currentMainId) {
                    currentMainIDFound = true;
                    continue;
                }
                if (currentMainIDFound === true) {
                    nextMainID = idd;
                    break;
                }

            }


            if (nextMainID > 0) {
                //load rec list items from db
                //and set values in state then call same method again to load data for that rec

                const read: Promise<IEntity[]> = this.giaaRecommendationService.readAllWithFilters(nextMainID, this.props.recListIncompleteOnly, this.props.recListJustMine, this.props.recListActionStatusTypeId);
                read.then((entities: any[]): void => {

                    if(entities.length > 0){
                        //new report has some recs
                        const newReportFirstRecId:number = Number(entities[0]["ID"]);
                        console.log('newReportFirstRecId', newReportFirstRecId);

                        this.props.onChangeMainListID(nextMainID);
                        this.setState({
                            GIAAAuditReportId: nextMainID,
                            GIAARecommendationId: newReportFirstRecId,
                            FilteredItemsRecList: entities,
                        }, () => this.loadRecInfo());
                    }
                    else{
                        //new report doesnt have any rec
                        //hide next button
                        this.setState({
                            HideNextButton: true
                        });
                    }




                }, (err) => this.props.onError(`Error loading rec list`, err.message));


            }





        }
    }

    private loadRecInfo = (): void => {

        console.log('in loadRecInfo');

        this.giaaRecommendationService.getRecInfo(this.state.GIAARecommendationId).then((r: IGIAARecommendation) => {
            console.log('Rec Info', r);

            //check if this is the last record or not in the props.filteredItems
            const lastRecId_FilteredItems: number = Number(this.state.FilteredItemsRecList[this.state.FilteredItemsRecList.length - 1]["ID"]);
            const recId_Current: number = Number(this.state.GIAARecommendationId);

            const lastReportId_FilteredItems: number = Number(this.props.filteredItemsMainList[this.props.filteredItemsMainList.length - 1]["ID"]);
            const reportId_Current: number = Number(this.state.GIAAAuditReportId);


            let hideNextButton: boolean = false;
            if (recId_Current === lastRecId_FilteredItems && reportId_Current === lastReportId_FilteredItems) {
                //console.log("This is the last one...");
                hideNextButton = true;

            }

            this.setState({
                RecInfo: r,
                HideNextButton: hideNextButton
            });


        }, (err) => {
            if (this.props.onError) this.props.onError(`Error loading rec info`, err.message);
        });

    }

    protected loadLookups(): Promise<any> {

        return Promise.all([

            this.loadRecInfo()

        ]);
    }


    public componentDidMount(): void {

        this.setState({
            Loading: true,
            GIAARecommendationId: Number(this.props.giaaRecommendationId),
            GIAAAuditReportId: Number(this.props.giaaAuditReportId),
            FilteredItemsRecList: this.props.filteredItemsRecList
        }, this.callBackFirstLoad

        );
    }
    private callBackFirstLoad = (): void => {
        let loadingPromises = [this.loadLookups()];

        Promise.all(loadingPromises).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));

    }


    //#endregion Data Load/Save


    //#region Event Handlers



    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }

    private handle_ChangeFilterText = (value: string): void => {
        this.setState({ ListFilterText: value });
    }


    //#endregion Event Handlers

}