import * as React from 'react';
import { IEntityFormProps, IUser, IGoDefForm, GoForm, IGoForm, SectionStatus } from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '.././cr/FormButtons';
import { UpdateHeader2 } from '.././cr/UpdateHeader2';
import MainList from './MainList';

import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup, IChoiceGroupOption } from '../cr/CrChoiceGroup';
import { CrCheckbox } from '../cr/CrCheckbox';

import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { ConfirmDialog } from '.././cr/ConfirmDialog';
import { MessageDialog } from '../cr/MessageDialog';


export interface ISection1Props extends IEntityFormProps {
    //signoffFor: string;
    //formId: number;
    //form: IFForm;
    //title?: string;
    //signoffText?: string;
    //onSignOff: ()=> void;
    //canSignOffDDSection: boolean;
    //canSignOffDirSection: boolean;
    //goDefForm: IGoDefForm;
    //goForm: IGoForm;
    //isViewOnly:boolean;
    //periodId: number;
    //directorateGroupId: number;

    giaaPeriodId: number | string;
    dgAreaId: number | string;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    incompleteOnly:boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine:boolean;
    onChangeJustMine: (value: boolean) => void;
    listFilterText:string;
    onChangeFilterText: (value: string) => void;

    section1_IsOpen: boolean;
    onSection1_toggleOpen: () => void;
}

export class Section1State {
    //public ShowForm = false;
    //public ShowHelpPanel: boolean = false;
    //public UserHelpText: string = null;
    //public FormData:IGoForm;
    public Loading:boolean = false;
    //public ShowConfirmDialog = false;

    constructor() {
        
    }

    //public ShowConfirmDialog = false;
    //public DDSignOffName: string = null;
    //public DirSignOffName: string = null;
}

export default class Section1 extends React.Component<ISection1Props, Section1State> {
    //private goFormService: services.GoFormService = new services.GoFormService(this.props.spfxContext, this.props.api);
    //private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);


    constructor(props: ISection1Props, state: Section1State) {
        super(props);
        //this.state = new Section1UpdateState(this.props.periodId, this.props.directorateGroupId);
        this.state = new Section1State();
        //console.log("in constructor", this.props.formId);
    }

    public render(): React.ReactElement<ISection1Props> {

        //const {title, signoffText} = this.props;

        //const { Section1Title } = this.props.goDefForm;
        const Section1Title = "Active GIAA Audit Reports";

        //const { ShowForm } = this.state;
        const ShowForm = this.props.section1_IsOpen;

        return (
            <div className={styles.cr}>
                <UpdateHeader2 title={Section1Title} isOpen={ShowForm}
                    leadUser=""
                    //rag={ this.state.FormData.SummaryCompletionStatus === SectionStatus.Completed ? 5 : this.state.FormData.SummaryCompletionStatus === SectionStatus.InProgress ? 3 : null }
                    rag={null}
                    //ragLabel={ this.state.FormData.SummaryCompletionStatus === SectionStatus.Completed ? "Completed" : this.state.FormData.SummaryCompletionStatus === SectionStatus.InProgress ? "In Progress" : null }
                    ragLabel={null}
                    onClick={this.props.onSection1_toggleOpen} />

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
                            giaaPeriodId={this.props.giaaPeriodId}
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

    public componentDidUpdate(prevProps: ISection1Props): void {

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
