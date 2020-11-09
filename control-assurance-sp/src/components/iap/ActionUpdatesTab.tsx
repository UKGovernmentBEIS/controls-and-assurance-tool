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
import { IEntity, IIAPAction } from '../../types';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import EntityList from '../entity/EntityList';
//import EvidenceList from './EV/EvidenceList';




export interface IActionUpdatesTabProps extends types.IBaseComponentProps {

    filteredItemsMainList: any[];
    iapActionId: any;

    onShowList: () => void;
    //isViewOnly: boolean;

    superUserPermission:boolean;
    actionOwnerPermission:boolean;
    currentUserId: number;


}

export interface ILookupData {

}

export class LookupData implements ILookupData {



}



export interface IActionUpdatesTabState {
    Loading: boolean;
    LookupData: ILookupData;
    IAPInfo: IIAPAction;
    IAPActionId: number;
    ActionOwnerPermission:boolean;
    FilteredItemsMainList: any[];

    HideNextButton: boolean;
    ListFilterText: string;


}

export class ActionUpdatesTabState implements IActionUpdatesTabState {
    public Loading = false;
    public LookupData = new LookupData();
    public IAPInfo = null;
    public IAPActionId: number = 0;
    public ActionOwnerPermission = false;
    public FilteredItemsMainList: any[] = null;
    public HideNextButton: boolean = false;

    public ListFilterText: string = null;


}

export default class ActionUpdatesTab extends React.Component<IActionUpdatesTabProps, IActionUpdatesTabState> {

    private iapUpdateService: services.IAPActionService = new services.IAPActionService(this.props.spfxContext, this.props.api);

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
                {this.renderFormButtons()}
                {this.renderUpdatesList()}


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

    private renderUpdatesList() {
        const iapInfo = this.state.IAPInfo;
        if (iapInfo === null) return;

        const completionDate = iapInfo.CompletionDate;
        const iAPStatusTypeId = iapInfo.IAPStatusTypeId;
        console.log('CompletionDate', completionDate, 'IAPStatusTypeId', iAPStatusTypeId);


        return (
            <React.Fragment>
                <div style={{ marginBottom: '20px', marginTop: '20px' }} className={styles.sectionATitle}>Updates, Feedback, Evidence</div>


                {<div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>
                        <UpdatesList
                            {...this.props}
                            iapUpdateId={this.state.IAPActionId}
                            defaultIAPStatusTypeId={iAPStatusTypeId}
                            defaultCompletionDate={completionDate}
                            onError={this.props.onError}
                            filterText={this.state.ListFilterText}
                            onChangeFilterText={this.handle_ChangeFilterText}
                            superUserPermission={this.props.superUserPermission}
                            actionOwnerPermission={this.state.ActionOwnerPermission}

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
                        {(this.state.HideNextButton === false) &&
                            <PrimaryButton text="Next" className={styles.formButton} style={{ marginRight: '5px' }}
                                onClick={() => this.showNext()}
                            />}

                        <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={this.props.onShowList}
                        />


                    </React.Fragment>
                }

            </div>
        );


    }




    private showNext = (): void => {

        console.log('in showNext');

        const currentIAPActionId: number = Number(this.state.IAPActionId);
        let currentIDFound: boolean = false;
        let nextIAPActionID: number = 0;
        let actionOwnerPermission:boolean = false;

        for (let i = 0; i < this.state.FilteredItemsMainList.length; i++) {

            let e: any = this.state.FilteredItemsMainList[i];
            const id: number = Number(e["ID"]);

            if (id === currentIAPActionId) {
                currentIDFound = true;
                continue;
            }
            if (currentIDFound === true) {
                nextIAPActionID = id;
                const ownerIdsStr:string = e["OwnerIds"];
                //console.log('ownerIdsStr', ownerIdsStr);

                const ownerIdsArr:string[] = ownerIdsStr.split(',');

                for (let j = 0; j < ownerIdsArr.length; j++) {
      
                    let ownerId:number = Number(ownerIdsArr[j]);
                    if(ownerId === this.props.currentUserId){
                      actionOwnerPermission = true;
                      break;
                    }
                  }




                //console.log("nextRecID", nextRecID);
                break;
            }

        }

        if (nextIAPActionID > 0) {
            this.setState({
                IAPActionId: nextIAPActionID,
                ActionOwnerPermission: actionOwnerPermission,
            }, () => this.loadIAPInfo());
        }

    }

    private loadIAPInfo = (): void => {

        console.log('in loadIAPInfo');

        this.iapUpdateService.read(this.state.IAPActionId).then((u: IIAPAction) => {
            console.log('Rec Info', u);

            //check if this is the last record or not in the props.filteredItems
            const lastMainId_FilteredItems: number = Number(this.state.FilteredItemsMainList[this.state.FilteredItemsMainList.length - 1]["ID"]);
            const mainId_Current: number = Number(this.state.IAPActionId);


            let hideNextButton: boolean = false;
            if (mainId_Current === lastMainId_FilteredItems) {
                //console.log("This is the last one...");
                hideNextButton = true;

            }

            this.setState({
                IAPInfo: u,
                HideNextButton: hideNextButton
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
            IAPActionId: Number(this.props.iapActionId),
            ActionOwnerPermission: this.props.actionOwnerPermission,
            FilteredItemsMainList: this.props.filteredItemsMainList
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