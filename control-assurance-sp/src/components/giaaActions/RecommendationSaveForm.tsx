import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { IDirectorate, IGIAARecommendation, GIAARecommendation, IEntity } from '../../types';
import { CrTextField } from '../cr/CrTextField';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { FormButtons } from '../cr/FormButtons';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../cr/FormCommandBar';
import { CrDatePicker } from '../cr/CrDatePicker';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import styles from '../../styles/cr.module.scss';

export interface IRecommendationSaveFormProps extends types.IBaseComponentProps {
    //periodID: number | string;
    giaaAuditReportId: number | string;
    entityId: number;
    showForm: boolean;
    onSaved?: () => void;
    onCancelled?: () => void;
}

export interface ILookupData {
    GIAAActionPriorities: IEntity[];
    GIAAActionStatusTypes: IEntity[];
}
export class LookupData implements ILookupData {
    public GIAAActionPriorities = null;
    public GIAAActionStatusTypes = null;
}
export interface IErrorMessage {
    Title: string;
    RecDetails: string;
    Priority: string;
    TargetDate:string;
    ActionStatus:string;

}
export class ErrorMessage implements IErrorMessage {
    public Title = null;
    public RecDetails = null;
    public Priority = null;
    public TargetDate = null;
    public ActionStatus = null;
}
export interface IRecommendationSaveFormState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: IGIAARecommendation;
    //ClearSuggestedStatus:boolean;
    FormDataBeforeChanges: IGIAARecommendation;
    FormIsDirty: boolean;
    ErrMessages: IErrorMessage;
}
export class RecommendationSaveFormState implements IRecommendationSaveFormState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData = new GIAARecommendation();
    public FormDataBeforeChanges = new GIAARecommendation();
    public FormIsDirty = false;
    //public ClearSuggestedStatus = false;
    public ErrMessages = new ErrorMessage();
}

export default class RecommendationSaveForm extends React.Component<IRecommendationSaveFormProps, IRecommendationSaveFormState> {
    private giaaActionPriorityService: services.GIAAActionPriorityService = new services.GIAAActionPriorityService(this.props.spfxContext, this.props.api);
    private giaaActionStatusTypeService: services.GIAAActionStatusTypeService = new services.GIAAActionStatusTypeService(this.props.spfxContext, this.props.api);
    private giaaRecommendationService: services.GIAARecommendationService = new services.GIAARecommendationService(this.props.spfxContext, this.props.api);



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
                {this.renderGIAAActionPriorities()}
                {this.renderTargetDate()}
                {this.renderGIAAActionStatusTypes()}

            </React.Fragment>
        );
    }

    private renderTitle() {

        return (
            <CrTextField
                label="Ref"
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
                label="Recommendations/Actions"
                className={styles.formField}
                value={this.state.FormData.RecommendationDetails}
                onChanged={(v) => this.changeTextField(v, "RecommendationDetails")}
                multiline={true}
                required={true}
                errorMessage={this.state.ErrMessages.RecDetails}
                rows={3}
            />
        );
    }

    private renderGIAAActionPriorities() {
        const giaaActionPriorities = this.state.LookupData.GIAAActionPriorities;
        if (giaaActionPriorities) {
            return (
                <CrDropdown
                    label="Priority"
                    placeholder="Select an Option"
                    required={true}
                    className={styles.formField}
                    options={services.LookupService.entitiesToSelectableOptions(giaaActionPriorities)}
                    selectedKey={this.state.FormData.GIAAActionPriorityId}
                    onChanged={(v) => this.changeDropdown(v, "GIAAActionPriorityId")}
                    errorMessage={this.state.ErrMessages.Priority}
                />
            );
        }
        else
            return null;
    }

    private renderTargetDate() {

        return (
            <CrDatePicker
                label="Target Date"
                className={styles.formField}
                value={this.state.FormData.TargetDate}
                onSelectDate={(v) => this.changeDatePicker(v, "TargetDate")}
                required={true}
                errorMessage={this.state.ErrMessages.TargetDate}
            />
        );
    }

    private renderGIAAActionStatusTypes() {
        const giaaActionStatusTypes = this.state.LookupData.GIAAActionStatusTypes;
        if (giaaActionStatusTypes) {
            return (
                <CrDropdown
                    label="Action Status"
                    placeholder="Select an Option"
                    required={true}
                    className={styles.formField}
                    options={services.LookupService.entitiesToSelectableOptions(giaaActionStatusTypes)}
                    selectedKey={this.state.FormData.GIAAActionStatusTypeId}
                    onChanged={(v) => this.changeDropdown(v, "GIAAActionStatusTypeId")}
                    errorMessage={this.state.ErrMessages.ActionStatus}
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
        let x = this.giaaRecommendationService.read(this.props.entityId).then((e: IGIAARecommendation): void => {

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
        proms.push(this.loadGIAAActionPriorities());
        proms.push(this.loadGIAAActionStatusTypes());
        return Promise.all(proms);
    }

    // private loadIDirectorates = (): Promise<IDirectorate[]> => {
    //     return this.directorateService.readAll().then((data: IDirectorate[]): IDirectorate[] => {
    //         this.setState({ LookupData: this.cloneObject(this.state.LookupData, "IDirectorates", data) });
    //         return data;
    //     }, (err) => { if (this.props.onError) this.props.onError(`Error loading Users lookup data`, err.message); });
    // }

    private loadGIAAActionPriorities = (): void => {
        this.giaaActionPriorityService.readAll().then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "GIAAActionPriorities", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading GIAAActionPriorities lookup data`, err.message); });
    }

    private loadGIAAActionStatusTypes = (): void => {
        this.giaaActionStatusTypeService.readAll().then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "GIAAActionStatusTypes", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading GIAAActionStatusTypes lookup data`, err.message); });
    }




    private onAfterLoad = (entity: types.IEntity): void => {

        //console.log('after load', this.state.LookupData.Users);

    }


    private saveData = (): void => {

        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);

            let f: IGIAARecommendation = { ...this.state.FormData };
            

            //remove all the child and parent entities before sending post/patch
            //delete f.User; //parent entity

            if (f.ID === 0) {

                f.GIAAAuditReportId = Number(this.props.giaaAuditReportId);

                this.giaaRecommendationService.create(f).then(x => {
                    this.props.onSaved();

                });

            }
            else {

                //console.log('in update');

                this.giaaRecommendationService.update(f.ID, f).then(this.props.onSaved, (err) => {
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
            errMsg.Title = "Ref required";
            returnVal = false;
        }
        else {
            errMsg.Title = null;
        }

        if ((this.state.FormData.RecommendationDetails === null) || (this.state.FormData.RecommendationDetails === '')) {
            errMsg.RecDetails = "Recommendation Details required";
            returnVal = false;
        }
        else {
            errMsg.RecDetails = null;
        }

        if ((this.state.FormData.GIAAActionPriorityId === null)) {
            errMsg.Priority = "Priority required";
            returnVal = false;
        }
        else {
            errMsg.Priority = null;
        }

        if ((this.state.FormData.TargetDate === null)) {
            errMsg.TargetDate = "Target Date required";
            returnVal = false;
        }
        else {
            errMsg.TargetDate = null;
        }

        if ((this.state.FormData.GIAAActionStatusTypeId === null)) {
            errMsg.ActionStatus = "Action Status required";
            returnVal = false;
        }
        else {
            errMsg.ActionStatus = null;
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
    protected changeDatePicker = (date: Date, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, date), FormIsDirty: true });
    }

    //#endregion Form Operations

}