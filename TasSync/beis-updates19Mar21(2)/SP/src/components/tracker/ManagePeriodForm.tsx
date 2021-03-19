import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { IDirectorate, INAOPublication, NAOPublication, INAOPublicationDirectorate, NAOPublicationDirectorate, ILinkLocalType } from '../../types';
import { CrTextField } from '../cr/CrTextField';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { FormButtons } from '../cr/FormButtons';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../cr/FormCommandBar';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import { CrCheckbox } from '../cr/CrCheckbox';
import { CrDatePicker } from '../cr/CrDatePicker';
import { changeDatePicker } from '../../types/AppGlobals';
//import { Stack, IStackProps, IStackStyles } from 'office-ui-fabric-react/lib/Stack';
import styles from '../../styles/cr.module.scss';
import { ThemeSettingName } from 'office-ui-fabric-react/lib/Styling';
//import { ILink } from 'office-ui-fabric-react/lib/Link';

export interface IManagePeriodFormProps extends types.IBaseComponentProps {
    //periodID: number | string;
    entityId: number;
    showForm: boolean;
    onSaved?: () => void;
    onCancelled?: () => void;
}

export interface ILookupData {

}
export class LookupData implements ILookupData {

}
export interface IErrorMessage {

    CurrentPeriodTitle: string;
    CurrentPeriodStartDate: string;
    CurrentPeriodEndDate: string;
    //Link: string;
}
export class ErrorMessage implements IErrorMessage {

    public CurrentPeriodTitle = null;
    public CurrentPeriodStartDate = null;
    public CurrentPeriodEndDate = null;
}

export interface IManagePeriodFormState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: INAOPublication;
    //ClearSuggestedStatus:boolean;
    FormDataBeforeChanges: INAOPublication;
    FormIsDirty: boolean;
    ErrMessages: IErrorMessage;
}
export class ManagePeriodFormState implements IManagePeriodFormState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData = new NAOPublication();
    public FormDataBeforeChanges = new NAOPublication();
    public FormIsDirty = false;

    public ErrMessages = new ErrorMessage();
}

export default class ManagePeriodForm extends React.Component<IManagePeriodFormProps, IManagePeriodFormState> {

    private naoPublicationService: services.NAOPublicationService = new services.NAOPublicationService(this.props.spfxContext, this.props.api);



    constructor(props: IManagePeriodFormProps, state: IManagePeriodFormState) {
        super(props);
        this.state = new ManagePeriodFormState();
    }

    //#region Render

    public render(): React.ReactElement<IManagePeriodFormProps> {
        //const errors = this.state.ValidationErrors;
        return (
            <Panel isOpen={this.props.showForm} type={PanelType.medium} onRenderNavigation={() => <FormCommandBar onSave={this.saveData} onCancel={this.props.onCancelled} />}>
                <div className={styles.cr}>
                    {this.renderFormFields()}
                    <FormButtons
                        primaryText={"Save"}
                        onPrimaryClick={() => this.saveData()}
                        onSecondaryClick={this.props.onCancelled}
                    />
                </div>
            </Panel>
        );
    }

    public renderFormFields() {
        return (
            <React.Fragment>
                {this.renderPeriodTitle_ReadOnly()}
                {this.renderCurrentPeriodDates_ReadOnly()}

                {this.renderPeriodTitle()}
                {this.renderCurrentPeriodDates()}


            </React.Fragment>
        );
    }


    private renderPeriodTitle_ReadOnly() {

        return (
            <div>
                <div style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '18px', marginBottom: '15px' }}>Current Period</div>
                <div style={{ marginBottom: '5px' }}>Period Title</div>
                <CrTextField
                    //label="Period Title"
                    className={styles.formField}
                    value={this.state.FormDataBeforeChanges.CurrentPeriodTitle}
                    disabled={true}
                />
            </div>
        );
    }

    private renderCurrentPeriodDates_ReadOnly() {

        return (

            <div>
                <div style={{ display: 'flex', marginTop: '5px' }}>
                    <div style={{ width: '50%', paddingRight: '5px' }}>
                        <CrDatePicker
                            label="Period Start Date"
                            value={this.state.FormDataBeforeChanges.CurrentPeriodStartDate}
                            disabled={true}
                        />

                    </div>
                    <div style={{ width: '50%', paddingLeft: '5px' }}>

                        <CrDatePicker
                            label="Period End Date"
                            value={this.state.FormDataBeforeChanges.CurrentPeriodEndDate}
                            disabled={true}
                        />

                    </div>

                </div>
                <div style={{ marginTop: '10px', marginBottom: '20px', fontStyle: 'italic' }}>
                    To edit current period, cancel and edit the publication.
                </div>
            </div>

        );
    }

    private renderPeriodTitle() {

        return (
            <div>
                <div style={{ marginTop: '35px', fontWeight: 'bold', fontSize: '18px', marginBottom: '15px' }}>Create a new Period</div>
                <div style={{ marginBottom: '5px' }}>Period Title</div>
                <CrTextField
                    //label="Period Title"
                    required={true}
                    className={styles.formField}
                    value={this.state.FormData.CurrentPeriodTitle}
                    onChanged={(v) => this.changeTextField(v, "CurrentPeriodTitle")}
                    errorMessage={this.state.ErrMessages.CurrentPeriodTitle}
                />
            </div>
        );
    }

    private renderCurrentPeriodDates() {

        return (

            <div>
                <div style={{ display: 'flex', marginTop: '5px' }}>
                    <div style={{ width: '50%', paddingRight: '5px' }}>
                        <CrDatePicker
                            label="Period Start Date"
                            value={this.state.FormData.CurrentPeriodStartDate}
                            onSelectDate={(v) => changeDatePicker(this, v, "CurrentPeriodStartDate")}
                            required={true}
                            errorMessage={this.state.ErrMessages.CurrentPeriodStartDate}
                        />

                    </div>
                    <div style={{ width: '50%', paddingLeft: '5px' }}>

                        <CrDatePicker
                            label="Period End Date"
                            value={this.state.FormData.CurrentPeriodEndDate}
                            onSelectDate={(v) => changeDatePicker(this, v, "CurrentPeriodEndDate")}
                            required={true}
                            errorMessage={this.state.ErrMessages.CurrentPeriodEndDate}
                        />

                    </div>

                </div>
                <div style={{ marginTop: '10px', marginBottom: '20px', fontStyle: 'italic' }}>
                On save, the above details will be used to start a new period for this publication and old period will be closed. Note this means all updates started by users will be Saved. This action can't be reversed.
                </div>
            </div>

        );
    }



    //#endregion Render


    //#region Data Load/Save

    private loadData = (): Promise<void> => {
        console.log('loadData - Id: ', this.props.entityId);
        let x = this.naoPublicationService.read(this.props.entityId).then((e: INAOPublication): void => {

            console.log('publication ', e);

            const fdBeforeChanges = {...e};

            //make the following values to null, so user can enter new values for the new period
            e.CurrentPeriodTitle = null;
            e.CurrentPeriodStartDate = null;
            e.CurrentPeriodEndDate = null;

            //set the following value to let api know to create a new period
            e.Title = "__NEW_PERIOD_REQUEST__";




            this.setState({
                FormData: e,
                FormDataBeforeChanges: fdBeforeChanges,
            });

        }, (err) => { if (this.props.onError) this.props.onError(`Error loading data`, err.message); });
        return x;
    }

    public componentDidMount(): void {
        this.setState({ Loading: true });
        let loadingPromises = [this.loadLookups()];
        if (this.props.entityId) {
            loadingPromises.push(this.loadData());
        }
        Promise.all(loadingPromises).then(p => this.onAfterLoad(p[1])).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));

    }

    private loadLookups(): Promise<any> {

        let proms: any[] = [];
        return Promise.all(proms);
    }




    private onAfterLoad = (entity: types.IEntity): void => {



    }


    private saveData = (): void => {

        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);

            let f: INAOPublication = { ...this.state.FormData };

            //remove all the child and parent entities before sending post/patch
            delete f.NAOPublicationDirectorates;
            delete f.NAOPeriods;

            if (f.ID === 0) {


                // this.naoPublicationService.create(f).then(this.saveChildEntitiesAfterCreate).then(this.onAfterCreate).then(this.props.onSaved, (err) => {
                //     if (this.props.onError) this.props.onError(`Error creating item`, err.message);
                // });

            }
            else {


                this.naoPublicationService.updatePut(f.ID, f).then(this.onAfterUpdate).then(this.props.onSaved, (err) => {
                    if (this.props.onError) this.props.onError(`Error updating item`, err.message);
                });

            }
        }

    }



    private onAfterUpdate(): Promise<any> { return Promise.resolve(); }







    //#endregion Data Load/Save


    //#region Form Operations

    private validateEntity = (): boolean => {

        let returnVal: boolean = true;
        let errMsg: IErrorMessage = { ...this.state.ErrMessages };


        if ((this.state.FormData.CurrentPeriodTitle === null) || (this.state.FormData.CurrentPeriodTitle === '')) {
            errMsg.CurrentPeriodTitle = "Period Title required";
            returnVal = false;
        }
        else {
            errMsg.CurrentPeriodTitle = null;
        }

        if ((this.state.FormData.CurrentPeriodStartDate === null)) {
            errMsg.CurrentPeriodStartDate = "Period Start Date required";
            returnVal = false;
        }
        else {
            errMsg.CurrentPeriodStartDate = null;
        }

        if ((this.state.FormData.CurrentPeriodEndDate === null)) {
            errMsg.CurrentPeriodEndDate = "Period End Date required";
            returnVal = false;
        }
        else {
            errMsg.CurrentPeriodEndDate = null;
        }



        //at the end set state
        this.setState({ ErrMessages: errMsg });

        return returnVal;


    }

    private cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }



    private changeTextField = (value: string, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true });
    }

    private changeDropdown = (option: IDropdownOption, f: string, index?: number): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, option.key), FormIsDirty: true });
    }

    private changeMultiDropdown = (item: IDropdownOption, f: string, newEntity: object, optionIdProperty: string): void => {
        const loadedChoices = this.cloneArray(this.state.FormDataBeforeChanges[f]);
        const editedChoices = this.cloneArray(this.state.FormData[f]);


        if (item.selected) {
            let indexOfExisting = loadedChoices.map(choice => choice[optionIdProperty]).indexOf(item.key);
            if (indexOfExisting !== -1) {
                editedChoices.push(this.cloneObject(loadedChoices[indexOfExisting]));
            } else {
                let newChoice = { ...newEntity };
                newChoice[optionIdProperty] = item.key;
                editedChoices.push(newChoice);
            }
        } else {
            let indexToRemove = editedChoices.map(choice => choice[optionIdProperty]).indexOf(item.key);
            editedChoices.splice(indexToRemove, 1);
        }

        this.setState({ FormData: this.cloneObject(this.state.FormData, f, editedChoices), FormIsDirty: true });
    }

    private cloneArray(array): any[] { return [...array]; }

    private changeCheckbox = (value: boolean, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true });
    }

    // private changeDatePicker = (date: Date, f: string): void => {
    //     this.setState({ FormData: this.cloneObject(this.state.FormData, f, date), FormIsDirty: true });
    // }
    //#endregion Form Operations

}