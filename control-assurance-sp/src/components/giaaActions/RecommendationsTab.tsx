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
import { IGIAAAuditReportInfo, IEntity } from '../../types';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import EntityList from '../entity/EntityList';
import TestList2 from '../entity/TestList2';
import { ElementStatuses } from '../../types/AppGlobals';

export interface IRecommendationsTabProps extends types.IBaseComponentProps {

    //filteredItems: any[];
    parentId: any;
    //giaaPeriodId:number | string;
    parentTitle: string;
    onShowList: () => void;
    //isViewOnly: boolean;

    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;

    incompleteOnly: boolean;
    justMine: boolean;
    actionStatusTypeId: number;

    onChangeIncompleteOnly: (value: boolean) => void;
    onChangeJustMine: (value: boolean) => void;
    onChangeActionStatusType: (option: IDropdownOption)=> void;

    superUserPermission:boolean;

    consumerName: string;
}

export interface ILookupData {
    GIAAActionStatusTypes: IEntity[];
}
export class LookupData implements ILookupData {

    public GIAAActionStatusTypes: IEntity[] = [];

}

export interface IRecommendationsTabState {
    Loading: boolean;
    LookupData: ILookupData;

    // IncompleteOnly: boolean;
    // JustMine: boolean;
    // ActionStatusTypeId:number;

    ListFilterText: string;
    AuditReportInfo: IGIAAAuditReportInfo;


}

export class RecommendationsTabState implements IRecommendationsTabState {
    public Loading = false;
    public LookupData = new LookupData();

    // public IncompleteOnly = false;
    // public JustMine = false;
    // public ActionStatusTypeId = 0;

    public ListFilterText: string = null;
    public AuditReportInfo = null;


}

export default class RecommendationsTab extends React.Component<IRecommendationsTabProps, IRecommendationsTabState> {

    private parentService: services.GIAAAuditReportService = new services.GIAAAuditReportService(this.props.spfxContext, this.props.api);
    private giaaActionStatusTypeService: services.GIAAActionStatusTypeService = new services.GIAAActionStatusTypeService(this.props.spfxContext, this.props.api);

    constructor(props: IRecommendationsTabProps, state: IRecommendationsTabState) {
        super(props);
        this.state = new RecommendationsTabState();

    }

    public render(): React.ReactElement<IRecommendationsTabProps> {

        console.log(this.props.parentId, this.props.parentTitle);

        return (
            <React.Fragment>
                {this.renderSectionTitle()}
                {this.renderInfoTable()}
                {this.renderBackLink()}
                {this.renderRecommendationsList()}
            </React.Fragment>
        );
    }

    private renderSectionTitle() {
        const rInfo = this.state.AuditReportInfo;
        if (rInfo === null) {
            return (
                <React.Fragment>
                    <h1 style={{ fontFamily: 'Calibri', fontSize: '36px' }}>{this.props.parentTitle}</h1>
    
                </React.Fragment>
            );
        }
        else{
            return (
                <React.Fragment>
                    <h1 style={{ fontFamily: 'Calibri', fontSize: '36px' }}>{rInfo.Title}</h1>
    
                </React.Fragment>
            );
        }




    }

    private renderInfoTable() {

        const rInfo = this.state.AuditReportInfo;
        if (rInfo === null) return null;

        return (

            <React.Fragment>

                <div style={{ marginBottom: '20px', marginTop: '50px' }} className={styles.sectionATitle}>Details</div>

                <div style={{ width: '98%', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>
                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>
                        <tbody>

                            <tr>
                                <td style={{ width: '150px', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Audit Report Number
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {rInfo.NumberStr}
                                </td>
                                <td style={{ width: '150px', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Directorate
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {rInfo.Directorate}
                                </td>

                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Audit Year
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {rInfo.Year}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    DG
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {rInfo.DG}
                                </td>
                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Report Issue Date
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {rInfo.IssueDate}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Director
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {rInfo.Director}
                                </td>
                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Stats
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {rInfo.Stats}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Assurance Option
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {rInfo.Assurance}
                                </td>
                            </tr>

                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Link to Audit Report
                            </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <a target="_blank" href={rInfo.Link}>Click to View Report</a>
                                </td>

                            </tr>


                        </tbody>

                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderBackLink(){
        return(
            <React.Fragment>
                <div style={{paddingTop:'20px', paddingLeft: '10px'}}>
                    <span style={{cursor:'pointer', color:'black', textDecoration:'underline'}} onClick={this.props.onShowList} >Back to {this.props.consumerName}</span>
                </div>
            </React.Fragment>
        );
    }

    private renderRecommendationsList() {
        return (
            <React.Fragment>
                <div style={{ marginBottom: '20px', marginTop: '50px' }} className={styles.sectionATitle}>Recommendations</div>


                {<div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>
                        <RecommendationsList
                            {...this.props}
                            //giaaPeriodId={this.props.giaaPeriodId}
                            actionStatusTypes={this.state.LookupData.GIAAActionStatusTypes}
                            giaaAuditReportId={this.props.parentId}
                            onError={this.props.onError}
                            onItemTitleClick={this.props.onItemTitleClick}

                            // incompleteOnly={this.state.IncompleteOnly}
                            // onChangeIncompleteOnly={this.handle_ChangeIncompleteOnly}
                            // justMine={this.state.JustMine}
                            // onChangeJustMine={this.handle_ChangeJustMine}
                            // actionStatusTypeId={this.state.ActionStatusTypeId}
                            // onChangeActionStatusType={this.handle_ChangeActionStatusType}

                            
                            incompleteOnly={this.props.incompleteOnly}
                            justMine={this.props.justMine}
                            actionStatusTypeId={this.props.actionStatusTypeId}

                            onChangeIncompleteOnly={this.props.onChangeIncompleteOnly}                            
                            onChangeJustMine={this.props.onChangeJustMine}                            
                            onChangeActionStatusType={this.props.onChangeActionStatusType}

                            filterText={this.state.ListFilterText}
                            onChangeFilterText={this.handle_ChangeFilterText}

                            superUserPermission={this.props.superUserPermission}

                        />
                    </div>
                    <div style={{ paddingTop: "10px", paddingLeft: "10px", fontStyle: "italic" }}>
                        Please click on a Rec Ref to view or update.
                    </div>
                    <br /><br />

                </div>}


            </React.Fragment>
        );
    }



    //#region Data Load

    private loadAuditReportInfo = (): void => {

        this.parentService.getAuditReportInfo(this.props.parentId).then((x: IGIAAAuditReportInfo) => {
            console.log('Audit Report Info', x);

            this.setState({
                AuditReportInfo: x
            });


        }, (err) => {
            if (this.props.onError) this.props.onError(`Error loading publication info`, err.message);
        });


    }

    private loadLookups(): Promise<any> {

        return Promise.all([
            this.loadGIAAActionStatusTypes(),
            this.loadAuditReportInfo(),


        ]);
    }

    public componentDidMount(): void {
        this.setState({ Loading: true }, this.callBackFirstLoad

        );
    }



    private loadGIAAActionStatusTypes = (): void => {
        this.giaaActionStatusTypeService.readAll(`?$orderby=ID`).then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'GIAAActionStatusTypes', data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading GIAAActionStatusTypes lookup data`, err.message); });
    }

    private callBackFirstLoad = (): void => {
        let loadingPromises = [this.loadLookups()];
        Promise.all(loadingPromises).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));

    }

    //#endregion Data Load



    //#region Event Handlers


    private handle_ChangeFilterText = (value: string): void => {
        this.setState({ ListFilterText: value });
    }

    // private handle_ChangeIncompleteOnly = (value: boolean): void => {
    //     this.setState({ IncompleteOnly: value });
    // }

    // private handle_ChangeJustMine = (value: boolean): void => {
    //     this.setState({ JustMine: value });
    // }

    // private handle_ChangeActionStatusType = (option: IDropdownOption): void => {
    //     this.setState({ ActionStatusTypeId: Number(option.key), },  );
    // }
    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }

    // private handle_ListItemTitleClick = (ID: number, title: string, filteredItems: any[]): void => {

    //     console.log('on item title click ', ID, title, filteredItems);
    //     this.setState({
    //         //SelectedPivotKey: this.headerTxt_RecommendationsTab,
    //         SelectedId: ID,
    //         SelectedTitle: title,
    //         FilteredItems: filteredItems
    //     });
    // }

    //#endregion Event Handlers

}


