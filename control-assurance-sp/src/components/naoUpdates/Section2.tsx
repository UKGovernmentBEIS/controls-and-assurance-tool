import * as React from 'react';
import { IEntityFormProps, IUser, IGoDefForm, GoForm, IGoForm, SectionStatus } from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '.././cr/FormButtons';
import { UpdateHeader2 } from '.././cr/UpdateHeader2';

import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup, IChoiceGroupOption } from '../cr/CrChoiceGroup';
import { CrCheckbox } from '../cr/CrCheckbox';

import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { ConfirmDialog } from '.././cr/ConfirmDialog';
import { MessageDialog } from '../cr/MessageDialog';


export interface ISection2Props extends IEntityFormProps {
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
}

export class Section2State {
    public ShowForm = false;
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

export default class Section1 extends React.Component<ISection2Props, Section2State> {
    //private goFormService: services.GoFormService = new services.GoFormService(this.props.spfxContext, this.props.api);
    //private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);


    constructor(props: ISection2Props, state: Section2State) {
        super(props);
        //this.state = new Section1UpdateState(this.props.periodId, this.props.directorateGroupId);
        this.state = new Section2State();
        //console.log("in constructor", this.props.formId);
    }

    public render(): React.ReactElement<ISection2Props> {

        //const {title, signoffText} = this.props;

        //const { Section1Title } = this.props.goDefForm;
        const Section1Title = "Archived NAO/PAC Publications";

        const { ShowForm } = this.state;

        return (
            <div className={styles.cr}>
                <UpdateHeader2 title={Section1Title} isOpen={ShowForm}
                    leadUser=""
                    //rag={ this.state.FormData.SummaryCompletionStatus === SectionStatus.Completed ? 5 : this.state.FormData.SummaryCompletionStatus === SectionStatus.InProgress ? 3 : null }
                    rag={null}
                    //ragLabel={ this.state.FormData.SummaryCompletionStatus === SectionStatus.Completed ? "Completed" : this.state.FormData.SummaryCompletionStatus === SectionStatus.InProgress ? "In Progress" : null }
                    ragLabel={null}
                    onClick={this.toggleProgressUpdateForm} />

                {ShowForm && <div className={`ms-scaleDownIn100`}>
                    {this.renderFormFields()}

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

    public componentDidUpdate(prevProps: ISection2Props): void {

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

    protected toggleProgressUpdateForm = (): void => {
        this.setState({ ShowForm: !this.state.ShowForm });
    }



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
