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

    sectionTitle: string;
    sectionTotalCases: number;
    //onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    caseType:string;
    section_IsOpen: boolean;
    onSection_toggleOpen: () => void;

    listFilterText: string;
    onChangeFilterText: (value: string) => void;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;

    //onMainSaved: () => void;
    //superUserPermission: boolean;
}

export class SectionState {

    public Loading: boolean = false;




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

        let hideRagIndicator:boolean = true;
        let totalSectionCases:string = "";
        if(this.props.sectionTotalCases !== null){
            hideRagIndicator = false;
            totalSectionCases = String(this.props.sectionTotalCases);
        }

        return (
            <div className={styles.cr}>
                <UpdateHeader2 title={this.props.sectionTitle} isOpen={ShowForm}
                    leadUser=""
                    hideRagIndicator={hideRagIndicator}
                    //rag={ this.state.FormData.SummaryCompletionStatus === SectionStatus.Completed ? 5 : this.state.FormData.SummaryCompletionStatus === SectionStatus.InProgress ? 3 : null }
                    rag={-1}
                    ragLabel={totalSectionCases}
                    //ragLabel={ this.state.FormData.SummaryCompletionStatus === SectionStatus.Completed ? "Completed" : this.state.FormData.SummaryCompletionStatus === SectionStatus.InProgress ? "In Progress" : null }
                    //ragLabel={null}
                    onClick={this.props.onSection_toggleOpen} />

                {ShowForm && <div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                        <MainList
                            {...this.props}
                            onError={this.props.onError}
                            onItemTitleClick={this.props.onItemTitleClick}
                            filterText={this.props.listFilterText}
                            onChangeFilterText={this.props.onChangeFilterText}
                            caseType={this.props.caseType}
                            createPermission={true}
                            

                        />
                    </div>
                    {/* <div style={{ paddingTop: "10px", paddingLeft: "10px", }}>
                        <div style={{ fontStyle: "italic", paddingBottom: '10px', }}>Please click on a Title to view or update recommendations.</div>
                    </div> */}
                    <br /><br />

                </div>}



            </div>
        );
    }




    //#region Form initialisation

    public componentDidMount(): void {


    }





    // public componentDidUpdate(prevProps: ISectionProps): void {

    // }




    //#endregion




}
