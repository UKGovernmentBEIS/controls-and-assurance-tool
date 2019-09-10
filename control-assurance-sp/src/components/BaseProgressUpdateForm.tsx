import * as React from 'react';
import { IEntity, ICrUpdateFormState, IProgressUpdate, IBaseProgressUpdateFormProps, IElement, ElementStatus, IUserHelp } from '../types';
import * as services from '../services';
import styles from '../styles/cr.module.scss';
import { FormButtons } from './cr/FormButtons';
import { UpdateHeader } from './cr/UpdateHeader';
import { IChoiceGroupOption } from './cr/CrChoiceGroup';
import { MessageDialog } from './cr/MessageDialog';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';


export interface IBaseProgressUpdateFormState extends ICrUpdateFormState<IElement> { }

export abstract class BaseProgressUpdateForm<P extends IBaseProgressUpdateFormProps, S extends IBaseProgressUpdateFormState> extends React.Component<P, S> {
    protected abstract entityUpdateService: services.EntityService<IEntity>;
    protected userHelpService: services.UserHelpService = new services.UserHelpService(this.props.spfxContext, this.props.api);

    public render(): React.ReactElement<IBaseProgressUpdateFormProps> {
        const {entityName, externalUserLoggedIn, isArchivedPeriod} = this.props;
        const {ShowForm, FormData} = this.state;

                
        return (
            <React.Fragment>
                <div className={styles.cr}>
                    <UpdateHeader title={entityName} isOpen={ShowForm}
                        leadUser=""
                        rag={ this.state.FormData.Status === ElementStatus.Completed ? 5 : this.state.FormData.Status === ElementStatus.InProgress ? 3 : this.state.FormData.Status === ElementStatus.NotApplicable ? -1 : null }
                        ragLabel={ this.state.FormData.Status === ElementStatus.Completed ? "Completed" : this.state.FormData.Status === ElementStatus.InProgress ? "In Progress" : this.state.FormData.Status === ElementStatus.NotApplicable ? "Not Applicable" : null }
                        onClick={this.toggleProgressUpdateForm} />

                    {ShowForm && <div className={`ms-scaleDownIn100`}>
                        {this.renderFormFields()}
                        <FormButtons
                            onPrimaryClick={() => this.onBeforeSave(true)} primaryText="Save for Later"
                            primaryDisabled={(this.props.form.LastSignOffFor === "Dir" && this.props.form.DirSignOffStatus === true) ? true: (externalUserLoggedIn === true) ? true : (isArchivedPeriod === true) ? true : false}
                            onPrimary2Click={() => this.onBeforeSave(false)} primary2Text="Save &amp; Submit for Signoff"
                            primary2Disabled={(this.props.form.LastSignOffFor === "Dir" && this.props.form.DirSignOffStatus === true) ? true: (externalUserLoggedIn === true) ? true : (isArchivedPeriod === true) ? true : false}
                            onSecondaryClick={this.cancelUpdate}
                            secondaryDisabled={(this.props.form.LastSignOffFor === "Dir" && this.props.form.DirSignOffStatus === true) ? true: (externalUserLoggedIn === true) ? true : (isArchivedPeriod === true) ? true : false}
                        />                        
                    </div>}
                    <MessageDialog hidden={!this.state.ShowSaveConfirmation} title={`Save Confirmation`} content={`${this.state.FormData.Status === ElementStatus.Completed ? "Submitted as Completed." : this.state.FormData.Status === ElementStatus.NotApplicable ? "Submitted as Not Applicable." : "Saved Incomplete and marked as In Progress."}`} handleOk={ ()=> { this.setState({ ShowSaveConfirmation : false }); } } />
                               
                </div>
                <Panel isOpen={this.state.ShowHelpPanel} headerText="" type={PanelType.medium} onDismiss={this.hideHelpPanel} >
                    <div dangerouslySetInnerHTML={{ __html: this.state.UserHelpText }}></div>
                </Panel> 
            </React.Fragment>
        );
    }

    public abstract renderFormFields();

    //#region Form initialisation

    public componentDidMount(): void {
        this.loadUpdates();
    }

    public componentDidUpdate(prevProps: P): void {
        if (prevProps.formId !== this.props.formId || prevProps.DefElement.ID !== this.props.DefElement.ID){
            this.loadUpdates();
        }
    }

    protected showHelpPanel = (userHelpId?: number) => {
        if(userHelpId){
            this.userHelpService.read(userHelpId).then((h: IUserHelp): void => {
                this.setState({ UserHelpText: h.HelpText, ShowHelpPanel: true });
            }, (err) => { this.setState({ UserHelpText: "No content found.", ShowHelpPanel: true }); });            
        }  
    }
    
    protected hideHelpPanel = () => {
        this.setState({ ShowHelpPanel: false });
    }

      
    protected loadUpdates = (): void => {
        this.setState({ Loading: true });
        let loadingPromises = [this.loadLookups()];

        loadingPromises.push(this.loadEntityUpdate(this.props.formId, this.props.DefElement.ID));

        Promise.all(loadingPromises).then(this.onLoaded, this.onErrorLoading);
    }

    protected loadLookups(): Promise<any> { return Promise.resolve(); }


    protected onLoaded = (loadedData: any[]): void => {
        this.setState({ Loading: false });
        this.onAfterLoad(loadedData);
    }

    protected onAfterLoad = (loadedData: any[]): void => { };

    protected onErrorLoading = (): void => {
        this.setState({ Loading: false });
    }

    protected loadEntityUpdate = (formId: number, defElementId: number): Promise<IElement> => { return Promise.resolve(); };


    protected onPreviousEntityUpdateLoaded(entityUpdate: IProgressUpdate): void { }



    //#endregion

    //#region Field change handlers

    protected changeTextField = (value: string, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value)/*, FormIsDirty: true*/ });
    }

    protected changeChoiceGroup = (ev, option: IChoiceGroupOption, f: string): void => {
        const selectedKey = option.key;
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, selectedKey)/*, FormIsDirty: true*/ });

    }
    protected changeCheckbox = (value: boolean, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value)/*, FormIsDirty: true*/ });
    }


    //#endregion

    //#region Validations

    protected validateEntityUpdate = (): boolean => {
        return true;
    }

    protected validateForStatus = (): boolean => { 
        const entityUpdate: IElement = this.state.FormData;

        const { SectionAQuestion1, SectionAQuestion2, SectionAQuestion3, SectionAQuestion4, SectionAQuestion5,
            SectionAQuestion6, SectionAQuestion7, SectionAQuestion8, SectionAQuestion9, SectionAQuestion10,
            SectionBQuestion1, SectionBQuestion2, SectionBQuestion3, SectionBQuestion4 } = this.props.DefElement;

        //secation A
        if(SectionAQuestion1 !== null && SectionAQuestion1 !== ""){
            if(entityUpdate.ResponseA1 === null){
                return false;
            }            
        }
        if(SectionAQuestion2 !== null && SectionAQuestion2 !== ""){
            if(entityUpdate.ResponseA2 === null){
                return false;
            }            
        }
        if(SectionAQuestion3 !== null && SectionAQuestion3 !== ""){
            if(entityUpdate.ResponseA3 === null){
                return false;
            }            
        }
        if(SectionAQuestion4 !== null && SectionAQuestion4 !== ""){
            if(entityUpdate.ResponseA4 === null){
                return false;
            }            
        }
        if(SectionAQuestion5 !== null && SectionAQuestion5 !== ""){
            if(entityUpdate.ResponseA5 === null){
                return false;
            }            
        }
        if(SectionAQuestion6 !== null && SectionAQuestion6 !== ""){
            if(entityUpdate.ResponseA6 === null){
                return false;
            }            
        }
        if(SectionAQuestion7 !== null && SectionAQuestion7 !== ""){
            if(entityUpdate.ResponseA7 === null){
                return false;
            }            
        }
        if(SectionAQuestion8 !== null && SectionAQuestion8 !== ""){
            if(entityUpdate.ResponseA8 === null){
                return false;
            }            
        }
        if(SectionAQuestion9 !== null && SectionAQuestion9 !== ""){
            if(entityUpdate.ResponseA9 === null){
                return false;
            }            
        }
        if(SectionAQuestion10 !== null && SectionAQuestion10 !== ""){
            if(entityUpdate.ResponseA10 === null){
                return false;
            }            
        }

        if(entityUpdate.ResponseAOther === null){
            return false;
        }
        if(entityUpdate.ResponseAEffect === null){
            return false;
        }
        if(entityUpdate.ResponseAEffectText && entityUpdate.ResponseAEffectText.length >= 10){
            //true
        }
        else{
            return false;
        }
        
        //Section B
        if(SectionBQuestion1 !== null && SectionBQuestion1 !== ""){
            if(entityUpdate.ResponseB1 === null){
                return false;
            }
            else{
                if(entityUpdate.ResponseB1 === "Yes"){
                    if(entityUpdate.ResponseB1Effect === null){
                        return false;
                    }
                    if(entityUpdate.ResponseB1Text && entityUpdate.ResponseB1Text.length >= 10){
                        //true
                    }
                    else{
                        return false;
                    }
                }
            }
        }

        if(SectionBQuestion2 !== null && SectionBQuestion2 !== ""){
            if(entityUpdate.ResponseB2 === null){
                return false;
            }
            else{
                if(entityUpdate.ResponseB2 === "Yes"){
                    if(entityUpdate.ResponseB2Effect === null){
                        return false;
                    }
                    if(entityUpdate.ResponseB2Text && entityUpdate.ResponseB2Text.length >= 10){
                        //true
                    }
                    else{
                        return false;
                    }
                }
            }
        }

        if(SectionBQuestion3 !== null && SectionBQuestion3 !== ""){
            if(entityUpdate.ResponseB3 === null){
                return false;
            }
            else{
                if(entityUpdate.ResponseB3 === "Yes"){
                    if(entityUpdate.ResponseB3Effect === null){
                        return false;
                    }
                    if(entityUpdate.ResponseB3Text && entityUpdate.ResponseB3Text.length >= 10){
                        //true
                    }
                    else{
                        return false;
                    }
                }
            }
        }

        if(SectionBQuestion4 !== null && SectionBQuestion4 !== ""){
            if(entityUpdate.ResponseB4 === null){
                return false;
            }
            else{
                if(entityUpdate.ResponseB4 === "Yes"){
                    if(entityUpdate.ResponseB4Effect === null){
                        return false;
                    }
                    if(entityUpdate.ResponseB4Text && entityUpdate.ResponseB4Text.length >= 10){
                        //true
                    }
                    else{
                        return false;
                    }
                }
            }
        }
        

        return true;


    }

    protected validSqlDecimal(num: number, decimalPrecision?: number, decimalScale?: number): boolean {
        if (num.toString().indexOf('.') !== -1) {
            let p = num.toString().split('.')[0];
            let s = num.toString().split('.')[1];
            if (p.length <= ((decimalPrecision || 18) - (decimalScale || 4)) && s.length <= (decimalScale || 4))
                return true;
            return false;
        } else {
            if (num.toString().length <= ((decimalPrecision || 18) - (decimalScale || 4)))
                return true;
            return false;
        }
    }

    //#endregion

    //#region Form infrastructure

    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }
    protected changeNotApplicableStatus = (notApplicable: boolean): void => { 
        
        let elementStatus: string = "";


        if(notApplicable === true){
            elementStatus = ElementStatus.NotApplicable;
        }
        else
        {
            elementStatus = ElementStatus.InProgress;
        }


        const newFormData = this.cloneObject(this.state.FormData, "Status", elementStatus);

        this.setState({ FormData: newFormData });

    }

    protected onBeforeSave = (saveForLater: boolean): void => { 
        
        let elementStatus: string = "";

        if(saveForLater === true){
            elementStatus = ElementStatus.InProgress;
        }
        else
        {
            //2nd button - Save & Submit for Sign-Off
            if(this.state.FormData.NotApplicable === true){
                elementStatus = ElementStatus.NotApplicable;
            }
            else{
                const completed: boolean = this.validateForStatus(); 
                if(completed === true){
                    elementStatus = ElementStatus.Completed;
                }
                else{
                    elementStatus = ElementStatus.InProgress;
                }
            }

        }

        const newFormData = this.cloneObject(this.state.FormData, "Status", elementStatus);

        this.setState({ FormData: newFormData }, ()=> this.saveUpdate(saveForLater));

    }


    protected onAfterSave(saveForLater: boolean): void {
        if(saveForLater === false)
            this.setState({ ShowSaveConfirmation: true });
            
        this.props.onElementSave();
     }

    protected saveUpdate = (saveForLater: boolean): void => {

        if (this.validateEntityUpdate()) {
            //this.setState({ FormSaveStatus: SaveStatus.Pending });
            //this.onBeforeSave(this.state.FormData);
            const u = this.state.FormData;
            
            delete u.ID;
            delete u['Id'];

            this.entityUpdateService.create(u).then((mu: IElement): void => {
                this.setState({ /*FormSaveStatus: SaveStatus.Success, */FormData: mu/*, FormIsDirty: false*/ }, ()=> this.onAfterSave(saveForLater));
                if (this.props.onError)
                    this.props.onError(null);
                if (this.props.onSaved)
                    this.props.onSaved();
            }, (err) => {
                this.setState({ /*FormSaveStatus: SaveStatus.Error*/ });
                if (this.props.onError)
                    this.props.onError(`Error saving progress update`, err.message);
            });
        }
    }

    protected cancelUpdate = (): void => {
        this.toggleProgressUpdateForm();
        this.loadEntityUpdate(this.props.formId, this.props.DefElement.ID);
    }

    protected toggleProgressUpdateForm = (): void => {
        this.setState({ ShowForm: !this.state.ShowForm });

    }

    //#endregion
}
