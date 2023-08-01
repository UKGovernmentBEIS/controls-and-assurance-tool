import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import UpdatesList from './UpdatesList';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import styles from '../../styles/cr.module.scss';
import { IIAPAction, ILinkLocalType } from '../../types';


export interface IActionUpdatesTabProps extends types.IBaseComponentProps {

    filteredItemsMainList: any[];
    iapActionId: any;
    onShowList: () => void;
    superUserPermission: boolean;
    actionOwnerPermission: boolean;
    currentUserId: number;
    showingGroupUpdates: boolean;
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
    ActionOwnerPermission: boolean;
    FilteredItemsMainList: any[];
    HideNextButton: boolean;
    ListFilterText: string;
    GroupTitle: string;
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
    public GroupTitle: string = "";
}

export default class ActionUpdatesTab extends React.Component<IActionUpdatesTabProps, IActionUpdatesTabState> {

    private iapUpdateService: services.IAPActionService = new services.IAPActionService(this.props.spfxContext, this.props.api);

    constructor(props: IActionUpdatesTabProps, state: IActionUpdatesTabState) {
        super(props);
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

        let arrLinks: ILinkLocalType[] = [];
        //unpack publication links from single value
        if (iapInfo.ActionLinks !== null && iapInfo.ActionLinks !== '') {
            let arr1 = iapInfo.ActionLinks.split('>');

            for (let i = 0; i < arr1.length; i++) {
                let itemStr: string = arr1[i];
                if (itemStr.trim() === '') {
                    continue;
                }
                let arr2 = itemStr.split('<');
                let item: ILinkLocalType = { Description: '', URL: '' };
                item.Description = arr2[0];
                item.URL = arr2[1];
                arrLinks.push(item);
            }
        }

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
                                    {iapTitle}{this.state.GroupTitle}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Action
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <div dangerouslySetInnerHTML={{ __html: iapDetails }} ></div>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Links
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>

                                    {arrLinks.map((c, i) =>
                                        <span key={`span_ActionLink_${i}`}><a key={`span_Lnk_ActionLink_${i}`} target="_blank" rel="noreferrer" href={c.URL}>{c.Description}</a>&nbsp;&nbsp;</span>
                                    )}
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
                            iapTypeId={this.state.IAPInfo.IAPTypeId}
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
        let actionOwnerPermission: boolean = false;

        for (let i = 0; i < this.state.FilteredItemsMainList.length; i++) {

            let e: any = this.state.FilteredItemsMainList[i];
            const id: number = Number(e["ID"]);

            if (id === currentIAPActionId) {
                currentIDFound = true;
                continue;
            }
            if (currentIDFound === true) {
                nextIAPActionID = id;
                const ownerIdsStr: string = e["OwnerIds"];
                const ownerIdsArr: string[] = ownerIdsStr.split(',');

                for (let j = 0; j < ownerIdsArr.length; j++) {

                    let ownerId: number = Number(ownerIdsArr[j]);
                    if (ownerId === this.props.currentUserId) {
                        actionOwnerPermission = true;
                        break;
                    }
                }
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
            console.log('Action Info', u);
            //check if this is the last record or not in the props.filteredItems
            const lastMainId_FilteredItems: number = Number(this.state.FilteredItemsMainList[this.state.FilteredItemsMainList.length - 1]["ID"]);
            const mainId_Current: number = Number(this.state.IAPActionId);
            let hideNextButton: boolean = false;
            if (mainId_Current === lastMainId_FilteredItems) {
                hideNextButton = true;
            }

            let groupTitle: string = "";
            if (this.props.showingGroupUpdates === true) {

                const currentItemInFiltered = this.state.FilteredItemsMainList.filter(x => Number(x.ID) === Number(this.state.IAPActionId));
                if (currentItemInFiltered.length > 0) {
                    groupTitle = ` (${currentItemInFiltered[0]["Title"]})`;
                }
            }

            this.setState({
                IAPInfo: u,
                GroupTitle: groupTitle,
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
    private handle_ChangeFilterText = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
        this.setState({ ListFilterText: newValue });
    }
    //#endregion Event Handlers
}