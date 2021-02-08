import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import GroupsList from './GroupsList';
import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup, IChoiceGroupOption } from '../cr/CrChoiceGroup';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { CrCheckbox } from '../cr/CrCheckbox';
import { FormButtons } from '../cr/FormButtons';
import { MessageDialog } from '../cr/MessageDialog';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import styles from '../../styles/cr.module.scss';
import { IEntity, IIAPAction } from '../../types';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import EntityList from '../entity/EntityList';
//import EvidenceList from './EV/EvidenceList';




export interface IGroupActionsTabProps extends types.IBaseComponentProps {

    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;

    iapActionId: any;

    onShowList: () => void;



}

export interface ILookupData {

}

export class LookupData implements ILookupData {



}



export interface IGroupActionsTabState {
    Loading: boolean;
    LookupData: ILookupData;
    IAPInfo: IIAPAction;

    FilteredItemsMainList: any[];

    ListFilterText: string;


}

export class GroupActionsTabState implements IGroupActionsTabState {
    public Loading = false;
    public LookupData = new LookupData();
    public IAPInfo = null;
    public IAPActionId: number = 0;
    public ActionOwnerPermission = false;
    public FilteredItemsMainList: any[] = null;
    public HideNextButton: boolean = false;

    public ListFilterText: string = null;


}

export default class GroupActionsTab extends React.Component<IGroupActionsTabProps, IGroupActionsTabState> {

    private iapUpdateService: services.IAPActionService = new services.IAPActionService(this.props.spfxContext, this.props.api);

    constructor(props: IGroupActionsTabProps, state: IGroupActionsTabState) {
        super(props);


        this.state = new GroupActionsTabState();

    }

    public render(): React.ReactElement<IGroupActionsTabProps> {



        return (
            <React.Fragment>
                {this.renderSectionTitle()}
                {this.renderInfoTable()}
                {this.renderGroupsList()}
                {this.renderFormButtons()}


            </React.Fragment>
        );
    }

    private renderSectionTitle() {
        return (
            <React.Fragment>
                <h1 style={{ fontFamily: 'Calibri', fontSize: '36px' }}>Manage Group Actions</h1>

            </React.Fragment>
        );
    }

    private renderInfoTable() {
        const iapInfo = this.state.IAPInfo;
        if (iapInfo === null) return;
        const iapTitle: string = iapInfo.Title;
        let iapDetails: string = iapInfo.Details;


        //replace all
        iapDetails = iapDetails.split('\n').join('<br/>');

        return (

            <React.Fragment>

                <div style={{ marginBottom: '20px', marginTop: '50px' }} className={styles.sectionATitle}>Details</div>

                <div style={{ width: '98%', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                    <table cellSpacing="0" cellPadding="10" style={{ width: '100%' }}>

                        <tbody>
                            <tr>
                                <td style={{ width: '150px', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Title
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {iapTitle}
                                </td>


                            </tr>


                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Action
                            </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <div dangerouslySetInnerHTML={{ __html: iapDetails }} ></div>
                                </td>

                            </tr>
                        </tbody>


                    </table>
                </div>

            </React.Fragment>
        );
    }

    private renderGroupsList() {
        const iapInfo = this.state.IAPInfo;
        if (iapInfo === null) return;

        const completionDate = iapInfo.CompletionDate;
        const iAPStatusTypeId = iapInfo.IAPStatusTypeId;
        console.log('in renderGroupsList - CompletionDate', completionDate, 'IAPStatusTypeId', iAPStatusTypeId);


        return (
            <React.Fragment>
                <div style={{ marginBottom: '20px', marginTop: '20px' }} className={styles.sectionATitle}>Groups</div>


                {<div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>
                        <GroupsList
                            {...this.props}
                            parentActionId={Number(this.props.iapActionId)}
                            onItemTitleClick={this.props.onItemTitleClick}

                            onError={this.props.onError}
                            filterText={this.state.ListFilterText}
                            onChangeFilterText={this.handle_ChangeFilterText}



                        />
                    </div>

                    <br /><br />

                </div>}


            </React.Fragment>
        );
    }


    private renderFormButtons() {
        const iapInfo = this.state.IAPInfo;
        if (iapInfo === null) return;

        return (
            <div style={{ marginTop: '30px' }}>

                {
                    <React.Fragment>


                        <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={this.props.onShowList}
                        />


                    </React.Fragment>
                }

            </div>
        );


    }



    private loadIAPInfo = (): void => {

        console.log('in loadIAPInfo');

        this.iapUpdateService.read(this.props.iapActionId).then((u: IIAPAction) => {
            console.log('Rec Info', u);


            this.setState({
                IAPInfo: u,

            });


        }, (err) => {
            if (this.props.onError) this.props.onError(`Error loading rec info`, err.message);
        });

    }

    protected loadLookups(): Promise<any> {

        return Promise.all([

            this.loadIAPInfo()

        ]);
    }


    public componentDidMount(): void {

        this.setState({
            Loading: true,
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