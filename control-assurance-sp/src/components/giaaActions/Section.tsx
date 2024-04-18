import * as React from 'react';
import { IEntityFormProps, IGIAAImportInfo, GIAAImport } from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { UpdateHeader2 } from '../cr/UpdateHeader2';
import MainList from './MainList';

export interface ISectionProps extends IEntityFormProps {

    isArchive: boolean;
    sectionTitle: string;
    dgAreaId: number | string;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    incompleteOnly: boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine: boolean;
    onChangeJustMine: (value: boolean) => void;
    listFilterText: string;
    onChangeFilterText: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
    section_IsOpen: boolean;
    onSection_toggleOpen: () => void;
    onMainSaved: () => void;
    mainListsSaveCounter: number;
    superUserPermission: boolean;
}

export class SectionState {

    public Loading: boolean = false;
    public UpdatesReqInProgress: boolean = false;
    public CheckUpdatesReqPressed: boolean = false;
    constructor() {
    }
}

export default class Section extends React.Component<ISectionProps, SectionState> {

    private gIAAImportService: services.GIAAImportService = new services.GIAAImportService(this.props.spfxContext, this.props.api);
    constructor(props: ISectionProps, state: SectionState) {
        super(props);
        this.state = new SectionState();
    }
    public render(): React.ReactElement<ISectionProps> {
        const ShowForm = this.props.section_IsOpen;
        const currentDateTime: string = services.DateService.dateToUkDateTime(new Date());
        return (
            <div className={styles.cr}>
                <UpdateHeader2 title={this.props.sectionTitle} isOpen={ShowForm}
                    leadUser=""
                    hideRagIndicator={true}
                    rag={null}
                    ragLabel={null}
                    onClick={this.props.onSection_toggleOpen} />

                {ShowForm && <div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                        <MainList
                            {...this.props}
                            isArchive={this.props.isArchive}
                            onError={this.props.onError}
                            onItemTitleClick={this.props.onItemTitleClick}
                            incompleteOnly={this.props.incompleteOnly}
                            onChangeIncompleteOnly={this.props.onChangeIncompleteOnly}
                            justMine={this.props.justMine}
                            onChangeJustMine={this.props.onChangeJustMine}
                            dgAreaId={this.props.dgAreaId}
                            filterText={this.props.listFilterText}
                            onChangeFilterText={this.props.onChangeFilterText}
                            onMainSaved={this.props.onMainSaved}
                            mainListsSaveCounter={this.props.mainListsSaveCounter}
                            superUserPermission={this.props.superUserPermission}
                            onCheckUpdatesReq={this.handleUpdatesReq}
                            updatesReqInProgress={this.state.UpdatesReqInProgress}
                        />
                    </div>
                    <div style={{ paddingTop: "10px", paddingLeft: "10px", }}>
                        <div style={{ fontStyle: "italic", paddingBottom: '10px', }}>Please click on a Title to view or update recommendations.</div>
                        {this.state.CheckUpdatesReqPressed && this.state.UpdatesReqInProgress === true && <div>{currentDateTime}: Working....Please wait.<br />
                            All recommendations will now be checked and if necessary, will set the status to &apos;Overdue&apos; and to ensure Action Owners and GIAA Staff know that they have tasks to complete.<br />
                            <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => this.loadImporInProgressInfo()} >Refresh</span></div>
                        }
                        {this.state.CheckUpdatesReqPressed && this.state.UpdatesReqInProgress === false && <div>{currentDateTime}: Completed<br />
                            All recommendations have been checked and where necessary, the status has been set to &apos;Overdue&apos; and Action Owners and GIAA Staff can see that they have tasks to complete.</div>
                        }
                    </div>
                    <br /><br />
                </div>}
            </div>
        );
    }

    //#region Form initialisation

    public componentDidMount(): void {
        this.loadImporInProgressInfo();
    }

    private handleUpdatesReq = (): void => {
        console.log('on checkUpdatesReq');
        const giaaImport = new GIAAImport();
        giaaImport.XMLContents = "Check Updates Req";
        this.gIAAImportService.create(giaaImport).then(x => {
            this.setState({ UpdatesReqInProgress: true, CheckUpdatesReqPressed: true });
        });
    }

    private loadImporInProgressInfo = (): Promise<void> => {
        let x = this.gIAAImportService.getImportInfo().then((e: IGIAAImportInfo): void => {
            console.log('data ', e);
            let inProgress: boolean = false;
            if (e.Status == "InProgress") {
                inProgress = true;
            }
            else {
                this.props.onMainSaved();
            }
            this.setState({
                UpdatesReqInProgress: inProgress
            });

        }, (err) => { if (this.props.onError) this.props.onError(`Error loading data`, err.message); });
        return x;
    }

    //#endregion

}
