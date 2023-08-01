import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import RecommendationsList from './RecommendationsList';
import styles from '../../styles/cr.module.scss';
import { INAOPublicationInfo, ILinkLocalType } from '../../types';

export interface IRecommendationsTabProps extends types.IBaseComponentProps {
    filteredItems: any[];
    parentId: any;
    periodId: number | string;
    parentTitle: string;
    onShowList: () => void;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    superUserPermission: boolean;
    dgOrDGMemberPermission: boolean;
}

export interface IRecommendationsTabState {
    Loading: boolean;
    IncompleteOnly: boolean;
    JustMine: boolean;
    ListFilterText: string;
    PublicationInfo: INAOPublicationInfo;
}

export class RecommendationsTabState implements IRecommendationsTabState {
    public Loading = false;
    public IncompleteOnly = false;
    public JustMine = false;
    public ListFilterText: string = null;
    public PublicationInfo = null;
}

export default class RecommendationsTab extends React.Component<IRecommendationsTabProps, IRecommendationsTabState> {

    private parentService: services.NAOPublicationService = new services.NAOPublicationService(this.props.spfxContext, this.props.api);
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
                {this.renderRecommendationsList()}
            </React.Fragment>
        );
    }

    private renderSectionTitle() {
        return (
            <React.Fragment>
                <h1 style={{ fontFamily: 'Calibri', fontSize: '36px' }}>{this.props.parentTitle}</h1>

            </React.Fragment>
        );
    }

    private renderInfoTable() {
        const pInfo = this.state.PublicationInfo;
        if (pInfo === null) return null;
        let summary: string = pInfo.PublicationSummary;
        summary = summary.split('\n').join('<br/>');
        let contactDetails: string = pInfo.ContactDetails;
        contactDetails = contactDetails.split('\n').join('<br/>');

        let arrLinks: ILinkLocalType[] = [];
        //unpack publication links from single value
        if (pInfo.Links !== null && pInfo.Links !== '') {
            let arr1 = pInfo.Links.split('>');
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
                                    Type
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {pInfo.NAOType}
                                </td>
                                <td style={{ width: '150px', borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Directorate(s)
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {pInfo.Directorate}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Year
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {pInfo.Year}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Lead
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {pInfo.Lead}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Stats
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)' }}>
                                    {pInfo.Stats}
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Contact Details
                                </td>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <div dangerouslySetInnerHTML={{ __html: contactDetails }} ></div>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Links
                                </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    {arrLinks.map((c, i) =>
                                        <span key={`span_PubLink_${i}`}><a key={`span_Lnk_PubLink_${i}`} target="_blank" rel="noreferrer" href={c.URL}>{c.Description}</a>&nbsp;&nbsp;</span>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', backgroundColor: 'rgb(229,229,229)' }}>
                                    Summary
                                </td>
                                <td colSpan={3} style={{ borderTop: '1px solid rgb(166,166,166)', borderLeft: '1px solid rgb(166,166,166)', borderBottom: '1px solid rgb(166,166,166)', borderRight: '1px solid rgb(166,166,166)' }}>
                                    <div dangerouslySetInnerHTML={{ __html: summary }} ></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
                            naoPublicationId={this.props.parentId}
                            periodId={this.props.periodId}
                            onError={this.props.onError}
                            onItemTitleClick={this.props.onItemTitleClick}
                            incompleteOnly={this.state.IncompleteOnly}
                            onChangeIncompleteOnly={this.handle_ChangeIncompleteOnly}
                            justMine={this.state.JustMine}
                            onChangeJustMine={this.handle_ChangeJustMine}
                            filterText={this.state.ListFilterText}
                            onChangeFilterText={this.handle_ChangeFilterText}
                            superUserPermission={this.props.superUserPermission}
                            dgOrDGMemberPermission={this.props.dgOrDGMemberPermission}
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

    private loadPublicationInfo = (): void => {

        this.parentService.getPublicationInfo(this.props.parentId).then((p: INAOPublicationInfo) => {
            console.log('Pub Info', p);
            this.setState({
                PublicationInfo: p
            });

        }, (err) => {
            if (this.props.onError) this.props.onError(`Error loading publication info`, err.message);
        });
    }

    private loadLookups(): Promise<any> {
        return Promise.all([
            this.loadPublicationInfo(),
        ]);
    }
    public componentDidMount(): void {
        this.setState({ Loading: true }, this.callBackFirstLoad
        );
    }

    private callBackFirstLoad = (): void => {
        let loadingPromises = [this.loadLookups()];
        Promise.all(loadingPromises).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));
    }

    //#endregion Data Load



    //#region Event Handlers


    private handle_ChangeFilterText = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
        this.setState({ ListFilterText: newValue });
    }

    private handle_ChangeIncompleteOnly = (value: boolean): void => {
        this.setState({ IncompleteOnly: value });
    }

    private handle_ChangeJustMine = (value: boolean): void => {
        this.setState({ JustMine: value });
    }

    //#endregion Event Handlers

}