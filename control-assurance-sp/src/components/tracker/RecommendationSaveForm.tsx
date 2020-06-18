import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { IDirectorate, INAORecommendation } from '../../types';
import { CrTextField } from '../cr/CrTextField';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { FormButtons } from '../cr/FormButtons';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../cr/FormCommandBar';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import styles from '../../styles/cr.module.scss';

export interface IRecommendationSaveFormProps extends types.IBaseComponentProps {
    //periodID: number | string;
    naoPublicationId: number | string;
    entityId: number;
    showForm: boolean;
    onSaved?: () => void;
    onCancelled?: () => void;
}

export interface ILookupData {
    NAORecStatusTypes: types.IEntity[];
}
export class LookupData implements ILookupData {
    public NAORecStatusTypes = null;
}
export interface IErrorMessage {
    Title: string;
    //Directorate: string;
    //Type: string;
    //Year: string;
}
export class ErrorMessage implements IErrorMessage {
    public Title = null;
    //public Directorate = null;
    //public Type = null;
    //public Year = null;
}
export interface IRecommendationSaveFormState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: INAORecommendation;
    //ClearSuggestedStatus:boolean;
    FormDataBeforeChanges: INAORecommendation;
    FormIsDirty: boolean;
    ErrMessages: IErrorMessage;
}
export class RecommendationSaveFormState implements IRecommendationSaveFormState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData = new types.NAORecommendation();
    public FormDataBeforeChanges = new types.NAORecommendation();
    public FormIsDirty = false;
    //public ClearSuggestedStatus = false;
    public ErrMessages = new ErrorMessage();
}

export default class RecommendationSaveForm extends React.Component<IRecommendationSaveFormProps, IRecommendationSaveFormState> {
    private naoRecStatusTypeService: services.NAORecStatusTypeService = new services.NAORecStatusTypeService(this.props.spfxContext, this.props.api);
    private naoRecommendationService: services.NAORecommendationService = new services.NAORecommendationService(this.props.spfxContext, this.props.api);



    // private childEntities: types.IFormDataChildEntities[] = [
    //     { ObjectParentProperty: 'GoAssignments', ParentIdProperty: 'GoElementId', ChildIdProperty: 'UserId', ChildService: this.goAssignmentService },
    // ];

    constructor(props: IRecommendationSaveFormProps, state: IRecommendationSaveFormState) {
        super(props);
        this.state = new RecommendationSaveFormState();
    }

    //#region Render

    public render(): React.ReactElement<IRecommendationSaveFormProps> {
        //const errors = this.state.ValidationErrors;
        return (
            <Panel isOpen={this.props.showForm} headerText={"Recommendation"} type={PanelType.medium} onRenderNavigation={() => <FormCommandBar onSave={this.saveData} onCancel={this.props.onCancelled} />}>
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
                {this.renderTitle()}
                {this.renderRecommendationDetails()}
                {this.renderTargetDate()}
                {this.renderNAORecStatusTypes()}

            </React.Fragment>
        );
    }

    private renderTitle() {
        console.log('in renderTitle');
        return (
            <CrTextField
                label="Rec Ref"
                required={true}
                className={styles.formField}
                value={this.state.FormData.Title}
                onChanged={(v) => this.changeTextField(v, "Title")}
                errorMessage={this.state.ErrMessages.Title}
            />
        );
    }

    private renderRecommendationDetails() {

        return (
            <CrTextField
                label="Recommendation Details"
                className={styles.formField}
                value={this.state.FormData.RecommendationDetails}
                onChanged={(v) => this.changeTextField(v, "RecommendationDetails")}
                multiline={true}
                required={true}
                //errorMessage={this.state.ErrMessages.RecommendationDetails}
                rows={3}
            />
        );
    }

    private renderTargetDate() {

        return (
            <CrTextField
                label="Target Date"
                required={true}
                className={styles.formField}
                value={this.state.FormData.TargetDate}
                onChanged={(v) => this.changeTextField(v, "TargetDate")}
                //errorMessage={this.state.ErrMessages.Title}
            />
        );
    }

    private renderNAORecStatusTypes() {
        const naoRecStatusTypes = this.state.LookupData.NAORecStatusTypes;
        if (naoRecStatusTypes) {
            return (
                <CrDropdown
                    label="Current Rec Status"
                    placeholder="Select an Option"
                    required={true}
                    className={styles.formField}
                    options={services.LookupService.entitiesToSelectableOptions(naoRecStatusTypes)}
                    selectedKey={this.state.FormData.NAORecStatusTypeId}
                    onChanged={(v) => this.changeDropdown(v, "NAORecStatusTypeId")}
                    //errorMessage={this.state.ErrMessages.Directorate}
                />
            );
        }
        else
            return null;
    }



    //#endregion Render


    //#region Data Load/Save

    private loadData = (): Promise<void> => {
        console.log('loadData - Id: ', this.props.entityId);
        let x = this.naoRecommendationService.read(this.props.entityId).then((e: INAORecommendation): void => {

            console.log('rec ', e);
            this.setState({
                FormData: e,
                FormDataBeforeChanges: e,
            });

        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Rec data`, err.message); });
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
        proms.push(this.loadNAORecStatusTypess());
        return Promise.all(proms);
    }

    // private loadIDirectorates = (): Promise<IDirectorate[]> => {
    //     return this.directorateService.readAll().then((data: IDirectorate[]): IDirectorate[] => {
    //         this.setState({ LookupData: this.cloneObject(this.state.LookupData, "IDirectorates", data) });
    //         return data;
    //     }, (err) => { if (this.props.onError) this.props.onError(`Error loading Users lookup data`, err.message); });
    // }

    private loadNAORecStatusTypess = (): void => {
        this.naoRecStatusTypeService.readAll().then((data: types.IEntity[]): types.IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "NAORecStatusTypes", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading NAORecStatusTypes lookup data`, err.message); });
    }




    private onAfterLoad = (entity: types.IEntity): void => {

        //console.log('after load', this.state.LookupData.Users);

    }


    private saveData = (): void => {

        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);

            let f: INAORecommendation = { ...this.state.FormData };
            

            //remove all the child and parent entities before sending post/patch
            //delete f.User; //parent entity

            if (f.ID === 0) {

                f.NAOPublicationId = Number(this.props.naoPublicationId);

                this.naoRecommendationService.create(f).then(x => {
                    this.props.onSaved();

                });

            }
            else {

                //console.log('in update');

                this.naoRecommendationService.update(f.ID, f).then(this.props.onSaved, (err) => {
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

        if ((this.state.FormData.Title === null) || (this.state.FormData.Title === '')) {
            errMsg.Title = "Title required";
            returnVal = false;
        }
        else {
            errMsg.Title = null;
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

    //#endregion Form Operations

}