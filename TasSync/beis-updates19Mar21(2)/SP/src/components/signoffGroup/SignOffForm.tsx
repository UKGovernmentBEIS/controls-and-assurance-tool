import * as React from 'react';
import { IEntityFormProps, IFForm, FForm, IUser } from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '.././cr/FormButtons';
import { UpdateHeader } from '.././cr/UpdateHeader';
import { ConfirmDialog } from '.././cr/ConfirmDialog';


export interface ISignOffFormProps extends IEntityFormProps {
    signoffFor: string;
    formId: number;
    form: IFForm;
    title?: string;
    signoffText?: string;
    onSignOff: ()=> void;
    canSignOffDDSection: boolean;
    canSignOffDirSection: boolean;
}

export class SignOffFormState{
    public ShowForm = false;
    public ShowConfirmDialog = false;
    public DDSignOffName: string = null;
    public DirSignOffName: string = null;
}

export default class SignOffForm extends React.Component<ISignOffFormProps, SignOffFormState> {
    private formService: services.FormService = new services.FormService(this.props.spfxContext, this.props.api);
    private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);

    constructor(props: ISignOffFormProps, state: SignOffFormState) {
        super(props);
        this.state = new SignOffFormState();
        //console.log("in constructor", this.props.formId);
    }

    public render(): React.ReactElement<ISignOffFormProps> {

        const {title, signoffText} = this.props;
               
        const {ShowForm} = this.state;
        
        return (
            <div className={styles.cr}>
                <UpdateHeader title={title} isOpen={ShowForm}
                    leadUser=""                    
                    rag={this.getRag()}
                    ragLabel={this.getRagLabel()}
                    onClick={this.toggleProgressUpdateForm} />

                {ShowForm && <div className={`ms-scaleDownIn100`}>
                    {this.renderFormFields(signoffText)}
                    <ConfirmDialog hidden={!this.state.ShowConfirmDialog} title="Sign-Off Confirmation" content="Are you sure you want to sign-off this form?" confirmButtonText="Sign-Off" handleConfirm={this.saveUpdate} handleCancel={() => this.setState({ ShowConfirmDialog: false })} />
                    <FormButtons
                        primaryText={this.props.signoffFor === "DD" ? "Sign off as a Deputy Director" : "Sign off as Director"}
                        onPrimaryClick={this.displayConfirm}
                        primaryDisabled={!this.enableSignOff()}
                    />
                </div>}
                                    
            </div>
        );
    }

    private renderFormFields(signoffText?: string){
        return(
            <React.Fragment>
                {this.renderSignOffText(signoffText)}
            </React.Fragment>
        );
    }
    private renderSignOffText(signoffText:string){
        let signedOffBy="";
        if(this.props.signoffFor === "DD"){
            //Signed off by Joe Smith on 12/04/2019 at 13:45
            if(this.state.DDSignOffName != null){
                signedOffBy = `<br/><br/>Signed off by ${this.state.DDSignOffName} on ${services.DateService.dateToUkDate(this.props.form.DDSignOffDate)} at ${services.DateService.dateToUkTime(this.props.form.DDSignOffDate)}`;
            }
        }
        else{
            if(this.state.DirSignOffName != null){
                signedOffBy = `<br/><br/>Signed off by ${this.state.DirSignOffName} on ${services.DateService.dateToUkDate(this.props.form.DirSignOffDate)} at ${services.DateService.dateToUkTime(this.props.form.DirSignOffDate)}`;
            }
        }
        if(signoffText != null && signoffText != "" )
            return (
                    <div style={{ marginTop: 10, marginBottom:20 }} dangerouslySetInnerHTML={{ __html: signoffText+signedOffBy }}></div>
            );
    }
    
    private enableSignOff() : boolean{
        
        if(this.props.signoffFor === "DD"){
            if(this.props.form.LastSignOffFor === "WaitingSignOff"){

                //check if the user is logged in as DD
                if(this.props.canSignOffDDSection === true)
                    return true;
            }
        }
        else{
            //this.props.signoffFor === Dir
            if(this.props.form.LastSignOffFor === "DD"){

                //check if the user is logged in as D
                if(this.props.canSignOffDirSection === true)
                    return true;
            }
        }

        return false;
    }

    private getRagLabel() : string{
        
        if(this.props.signoffFor === "DD"){
            if(this.props.form.LastSignOffFor === "WaitingSignOff"){
                return "Require SignOff";
            }
            else if(this.props.form.DDSignOffStatus === true){
                return "Signed Off";
            }
            else{
                return "N/A";
            }
        }
        else{
            //this.props.signoffFor === Dir
            if(this.props.form.LastSignOffFor === "DD"){
                return "Require SignOff";
            }
            else if(this.props.form.DirSignOffStatus === true){
                return "Signed Off";
            }
            else{
                return "N/A";
            }
        }

        
    }

    private getRag() : number{
        
        if(this.props.signoffFor === "DD"){
            if(this.props.form.LastSignOffFor === "WaitingSignOff"){
                return 3;
            }
            else if(this.props.form.DDSignOffStatus === true){
                return 5;
            }
            else{
                return null;
            }
        }
        else{
            //this.props.signoffFor === Dir
            if(this.props.form.LastSignOffFor === "DD"){
                return 3;
            }
            else if(this.props.form.DirSignOffStatus === true){
                return 5;
            }
            else{
                return null;
            }
        }

        
    }

    //#region Form initialisation

    public componentDidMount(): void {
        this.loadUserInfo();
    }

    public componentDidUpdate(prevProps: ISignOffFormProps): void {
        if (prevProps.formId !== this.props.formId){
            this.loadUserInfo();
        }
    }

    protected loadUserInfo = (): void => {
        
        if(this.props.signoffFor === "DD"){
            if(this.props.form.DDSignOffStatus === true){
                this.userService.read(this.props.form.DDSignOffUserId).then((u: IUser): void => {                    
                    this.setState({ DDSignOffName: u.Title });
                }, (err) => {  });
            }
            else{
                this.setState({ DDSignOffName: null });
            }
                
        }
        else if(this.props.signoffFor === "Dir"){
            if(this.props.form.DirSignOffStatus === true){
                this.userService.read(this.props.form.DirSignOffUserId).then((u: IUser): void => {                    
                    this.setState({ DirSignOffName: u.Title });
                }, (err) => {  });
            }
            else
                this.setState({ DirSignOffName: null });
        }


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
    
    protected displayConfirm = (): void => {
        this.setState({ ShowConfirmDialog: true });
    }

    protected onAfterSave(): void {
        this.props.onSignOff();
     }
     
    protected saveUpdate = (): void => {

        this.setState({ ShowConfirmDialog: false });
        if (this.validateEntityUpdate()) {
            
            let formUpdate = new FForm();
            formUpdate.ID = this.props.form.ID;
            formUpdate.LastSignOffFor = this.props.signoffFor;

            delete formUpdate.PeriodId;
            delete formUpdate.TeamId;
            delete formUpdate.DefFormId;
            delete formUpdate.Title;
            delete formUpdate.DDSignOffStatus;
            delete formUpdate.DDSignOffUserId;
            delete formUpdate.DDSignOffDate;
            delete formUpdate.DirSignOffStatus;
            delete formUpdate.DirSignOffUserId;
            delete formUpdate.DirSignOffDate;
            delete formUpdate.FirstSignedOff;

        

            this.formService.update(formUpdate.ID, formUpdate).then((): void => {
                this.onAfterSave();
                if (this.props.onError)
                    this.props.onError(null);
                if (this.props.onSaved)
                    this.props.onSaved();
            }, (err) => {
                if (this.props.onError)
                    this.props.onError(`Error saving progress update`, err.message);
            });
        }
    }


    protected toggleProgressUpdateForm = (): void => {
        this.setState({ ShowForm: !this.state.ShowForm });
    }

    //#endregion
}
