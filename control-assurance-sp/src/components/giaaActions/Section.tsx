import * as React from 'react';
import { IEntityFormProps, IUser, IGoDefForm, GoForm, IGoForm, SectionStatus, IGIAAImportInfo, GIAAImport } from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '../cr/FormButtons';
import { UpdateHeader2 } from '../cr/UpdateHeader2';
import MainList from './MainList';

import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup, IChoiceGroupOption } from '../cr/CrChoiceGroup';
import { CrCheckbox } from '../cr/CrCheckbox';

import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { MessageDialog } from '../cr/MessageDialog';


export interface ISectionProps extends IEntityFormProps {

    isArchive: boolean;
    sectionTitle: string;
    //giaaPeriodId: number | string;
    dgAreaId: number | string;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    incompleteOnly: boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine: boolean;
    onChangeJustMine: (value: boolean) => void;
    listFilterText: string;
    onChangeFilterText: (value: string) => void;

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
                    //rag={ this.state.FormData.SummaryCompletionStatus === SectionStatus.Completed ? 5 : this.state.FormData.SummaryCompletionStatus === SectionStatus.InProgress ? 3 : null }
                    rag={null}
                    //ragLabel={ this.state.FormData.SummaryCompletionStatus === SectionStatus.Completed ? "Completed" : this.state.FormData.SummaryCompletionStatus === SectionStatus.InProgress ? "In Progress" : null }
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
                            //giaaPeriodId={this.props.giaaPeriodId}
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
                        All recommendations will now be checked and if necessary, will set the status to 'Overdue' and to ensure Action Owners and GIAA Staff know that they have tasks to complete.<br />
                            <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => this.loadImporInProgressInfo()} >Refresh</span></div>
                        }

                        {this.state.CheckUpdatesReqPressed && this.state.UpdatesReqInProgress === false && <div>{currentDateTime}: Completed<br />
                        All recommendations have been checked and where necessary, the status has been set to 'Overdue' and Action Owners and GIAA Staff can see that they have tasks to complete.</div>
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
            //console.log(x);

            //this.loadData();
            this.setState({ UpdatesReqInProgress: true, CheckUpdatesReqPressed: true });



        });


    }

    private loadImporInProgressInfo = (): Promise<void> => {
        //console.log('loadData - Id: ', this.props.entityId);
        let x = this.gIAAImportService.getImportInfo().then((e: IGIAAImportInfo): void => {

            console.log('data ', e);
            let inProgress: boolean = false;
            if (e.Status == "InProgress") {
                inProgress = true;
            }
            else{
                this.props.onMainSaved();
            }
            this.setState({
                UpdatesReqInProgress: inProgress
            });

        }, (err) => { if (this.props.onError) this.props.onError(`Error loading data`, err.message); });
        return x;
    }

    // public componentDidUpdate(prevProps: ISectionProps): void {

    // }




    //#endregion




}
