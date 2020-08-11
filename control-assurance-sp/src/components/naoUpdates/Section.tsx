import * as React from 'react';
import { IEntityFormProps, IUser, IGoDefForm, GoForm, IGoForm, SectionStatus } from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '../cr/FormButtons';
import { UpdateHeader2 } from '../cr/UpdateHeader2';
import MainList from '../tracker/MainList';

import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup, IChoiceGroupOption } from '../cr/CrChoiceGroup';
import { CrCheckbox } from '../cr/CrCheckbox';

import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { MessageDialog } from '../cr/MessageDialog';


export interface ISectionProps extends IEntityFormProps {

    isArchive: boolean;
    sectionTitle: string;

    naoPeriodId: number | string;
    dgAreaId: number | string;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    incompleteOnly:boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine:boolean;
    onChangeJustMine: (value: boolean) => void;
    listFilterText:string;
    onChangeFilterText: (value: string) => void;

    section_IsOpen: boolean;
    onSection_toggleOpen: () => void;

    onMainSaved: () => void;
    mainListsSaveCounter:number;

    sectionUpdateStatus:string;
}

export class SectionState {
    public Loading:boolean = false;


    constructor() {
        
    }


}

export default class Section extends React.Component<ISectionProps, SectionState> {
    //private goFormService: services.GoFormService = new services.GoFormService(this.props.spfxContext, this.props.api);
    //private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);


    constructor(props: ISectionProps, state: SectionState) {
        super(props);
        this.state = new SectionState();
    }

    public render(): React.ReactElement<ISectionProps> {

        const ShowForm = this.props.section_IsOpen;

        return (
            <div className={styles.cr}>
                <UpdateHeader2 title={this.props.sectionTitle} isOpen={ShowForm}
                    leadUser=""
                    //rag={ this.state.FormData.SummaryCompletionStatus === SectionStatus.Completed ? 5 : this.state.FormData.SummaryCompletionStatus === SectionStatus.InProgress ? 3 : null }
                    rag={ this.props.sectionUpdateStatus === "Started" ? 3 : this.props.sectionUpdateStatus === "Updated" ? 5 : null }
                    //ragLabel={ this.state.FormData.SummaryCompletionStatus === SectionStatus.Completed ? "Completed" : this.state.FormData.SummaryCompletionStatus === SectionStatus.InProgress ? "In Progress" : null }
                    ragLabel={this.props.sectionUpdateStatus}
                    onClick={this.props.onSection_toggleOpen} />

                {ShowForm && <div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>
                        <MainList
                            {...this.props}
                            onError={this.props.onError}
                            onItemTitleClick={this.props.onItemTitleClick}
                            incompleteOnly={this.props.incompleteOnly}
                            onChangeIncompleteOnly={this.props.onChangeIncompleteOnly}
                            justMine={this.props.justMine}
                            onChangeJustMine={this.props.onChangeJustMine}
                            dgAreaId={this.props.dgAreaId}
                            naoPeriodId={this.props.naoPeriodId}
                            filterText={this.props.listFilterText}
                            onChangeFilterText={this.props.onChangeFilterText}

                        />
                    </div>
                    <div style={{paddingTop:"10px", paddingLeft:"10px", fontStyle:"italic"}}>
                    Please click on a Title to view or update recommendations.
                    </div>
                    <br /><br />

                </div>}



            </div>
        );
    }


    public renderFormFields() {

        

        return (
            <div>
                list here

            </div>
        );

    }




    //#region Form initialisation

    public componentDidMount(): void {

    }

    public componentDidUpdate(prevProps: ISectionProps): void {

    }




    //#endregion



    //#region Validations

    protected validateEntityUpdate = (): boolean => {
        return true;
    }



    //#endregion

    //#region Form infrastructure



    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }

    // protected toggleProgressUpdateForm = (): void => {
    //     this.setState({ ShowForm: !this.state.ShowForm });
    // }



    //#endregion


    //#region Data Load

    // private loadGoForm = (): Promise<IGoForm> => {
    //     return this.goFormService.readGoForm(this.props.PeriodId, this.props.DirectorateGroupId).then((arrGF: IGoForm[]) => {
    //         console.log('reading GoForm: ', arrGF);
    //         if(arrGF.length > 0){
    //             const formData: IGoDefForm = arrGF[0];
    //             this.setState({ FormData: formData });
    //             return formData;
    //         }
    //         else{
    //             //GoForm doesn't exist in db, reset FormData, so all the fields are empty, request may come from componentDidUpdate
    //             const fd = new GoForm(this.props.PeriodId, this.props.DirectorateGroupId);
    //             this.setState({ FormData: fd });
    //             return null;
    //         }

    //     }, (err) => {
    //         if (this.props.onError) this.props.onError(`Error loading progress update`, err.message);
    //     });
    // }

    // private loadUpdates = (): void => {
    //     this.setState({ Loading: true });
    //     let loadingPromises = [this.loadLookups()];

    //     Promise.all(loadingPromises).then(this.onLoaded, this.onErrorLoading);
    // }
    // private loadLookups(): Promise<any> {
    
    //     return Promise.all([
    //         this.loadGoForm(),    
    //     ]);
    // }
    // protected onLoaded = (loadedData: any[]): void => {
    //     this.setState({ Loading: false });
    // }

    // protected onErrorLoading = (): void => {
    //     this.setState({ Loading: false });
    // }

    //#endregion Data Load

    //#region Save Data



    //#endregion Save Data
}
