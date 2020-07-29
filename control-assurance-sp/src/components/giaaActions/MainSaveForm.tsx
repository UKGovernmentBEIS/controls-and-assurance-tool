import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { IEntity, IDirectorate, IGIAAAuditReport, GIAAAuditReport } from '../../types';
import { CrTextField } from '../cr/CrTextField';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { FormButtons } from '../cr/FormButtons';
import { CrCheckbox } from '../cr/CrCheckbox';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../cr/FormCommandBar';
import { CrEntityPicker } from '../cr/CrEntityPicker';


import { CrDatePicker } from '../cr/CrDatePicker';
import styles from '../../styles/cr.module.scss';

export interface IMainSaveFormProps extends types.IBaseComponentProps {
    //periodID: number | string;
    entityId: number;
    showForm: boolean;
    onSaved?: () => void;
    onCancelled?: () => void;
}

export interface ILookupData {
    Directorates: IDirectorate[];
    GIAAAssurances: IEntity[];
}
export class LookupData implements ILookupData {
    public Directorates = null;
    public GIAAAssurances = null;
}
export interface IErrorMessage {
    Num: string;
    Title: string;
    IssueDate: string;
    Directorate: string;
    Year: string;
    Assurance: string;
    Link: string;
}
export class ErrorMessage implements IErrorMessage {
    public Num = null;
    public Title = null;
    public IssueDate = null;
    public Directorate = null;
    public Year = null;
    public Assurance = null;
    public Link = null;
}
export interface IMainSaveFormState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: IGIAAAuditReport;
    //ClearSuggestedStatus:boolean;
    FormDataBeforeChanges: IGIAAAuditReport;
    FormIsDirty: boolean;
    ErrMessages: IErrorMessage;
}
export class MainSaveFormState implements IMainSaveFormState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData = new GIAAAuditReport();
    public FormDataBeforeChanges = new GIAAAuditReport();
    public FormIsDirty = false;
    //public ClearSuggestedStatus = false;
    public ErrMessages = new ErrorMessage();
}

export default class MainSaveForm extends React.Component<IMainSaveFormProps, IMainSaveFormState> {
    private directorateService: services.DirectorateService = new services.DirectorateService(this.props.spfxContext, this.props.api);
    private giaaAssuranceService: services.GIAAAssuranceService = new services.GIAAAssuranceService(this.props.spfxContext, this.props.api);
    private giaaAuditReportService: services.GIAAAuditReportService = new services.GIAAAuditReportService(this.props.spfxContext, this.props.api);


    // private childEntities: types.IFormDataChildEntities[] = [
    //     { ObjectParentProperty: 'GoAssignments', ParentIdProperty: 'GoElementId', ChildIdProperty: 'UserId', ChildService: this.goAssignmentService },
    // ];

    constructor(props: IMainSaveFormProps, state: IMainSaveFormState) {
        super(props);
        this.state = new MainSaveFormState();
    }

    //#region Render

    public render(): React.ReactElement<IMainSaveFormProps> {
        //const errors = this.state.ValidationErrors;
        return (
            <Panel isOpen={this.props.showForm} headerText={"GIAA Audit Report"} type={PanelType.medium} onRenderNavigation={() => <FormCommandBar onSave={this.saveData} onCancel={this.props.onCancelled} />}>
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
                {this.renderNum()}
                {this.renderTitle()}
                {this.renderIssueDate()}
                {this.renderDirectorate()}
                {this.renderYear()}
                {this.renderAssurance()}
                {this.renderLink()}
                {this.renderIsArchiveCheckbox()}




            </React.Fragment>
        );
    }

    private renderNum() {
        //console.log('in renderTitle');
        return (
            <CrTextField
                label="Num"
                required={true}
                className={styles.formField}
                value={this.state.FormData.NumberStr}
                onChanged={(v) => this.changeTextField(v, "NumberStr")}
                errorMessage={this.state.ErrMessages.Num}
            />
        );
    }

    private renderTitle() {
        //console.log('in renderTitle');
        return (
            <CrTextField
                label="Title"
                required={true}
                className={styles.formField}
                value={this.state.FormData.Title}
                onChanged={(v) => this.changeTextField(v, "Title")}
                errorMessage={this.state.ErrMessages.Title}
            />
        );
    }

    private renderDirectorate() {
        const directorates = this.state.LookupData.Directorates;
        if (directorates) {
            return (
                <CrDropdown
                    label="Directorate"
                    placeholder="Select an Option"
                    required={true}
                    className={styles.formField}
                    options={services.LookupService.entitiesToSelectableOptions(directorates)}
                    selectedKey={this.state.FormData.DirectorateId}
                    onChanged={(v) => this.changeDropdown(v, "DirectorateId")}
                    errorMessage={this.state.ErrMessages.Directorate}
                />
            );
        }
        else
            return null;
    }

    private renderYear() {

        return (
            <CrTextField
                label="Year"
                required={true}
                className={styles.formField}
                value={this.state.FormData.AuditYear}
                onChanged={(v) => this.changeTextField(v, "AuditYear")}
                errorMessage={this.state.ErrMessages.Year}
            />
        );
    }

    private renderAssurance() {
        const assurances = this.state.LookupData.GIAAAssurances;
        if (assurances) {
            return (
                <CrDropdown
                    label="Assurance"
                    placeholder="Select an Option"
                    required={true}
                    className={styles.formField}
                    options={services.LookupService.entitiesToSelectableOptions(assurances)}
                    selectedKey={this.state.FormData.GIAAAssuranceId}
                    onChanged={(v) => this.changeDropdown(v, "GIAAAssuranceId")}
                    errorMessage={this.state.ErrMessages.Assurance}
                />
            );
        }
        else
            return null;
    }



    private renderLink() {

        return (
            <CrTextField
                label="Link"
                className={styles.formField}
                value={this.state.FormData.Link}
                onChanged={(v) => this.changeTextField(v, "Link")}
                errorMessage={this.state.ErrMessages.Link}

            />
        );
    }


    private renderIssueDate() {
        return (
            <CrDatePicker
                label="Issue Date"
                className={styles.formField}
                value={this.state.FormData.IssueDate}
                onSelectDate={(v) => this.changeDatePicker(v, "IssueDate")}
                required={true}
                errorMessage={this.state.ErrMessages.IssueDate}
            />
        );
    }


    private renderIsArchiveCheckbox() {

        return (
            <div>

                <CrCheckbox
                    className={`${styles.formField} ${styles.checkbox}`}
                    label="Archive"
                    checked={this.state.FormData.IsArchive}
                    onChange={(ev, isChecked) => this.changeCheckbox(isChecked, "IsArchive")}


                />

            </div>
        );

    }

    //#endregion Render


    //#region Data Load/Save

    private loadData = (): Promise<void> => {
        console.log('loadData - Id: ', this.props.entityId);
        let x = this.giaaAuditReportService.read(this.props.entityId).then((e: IGIAAAuditReport): void => {

            console.log('data ', e);
            this.setState({
                FormData: e,
                FormDataBeforeChanges: e,
            });

        }, (err) => { if (this.props.onError) this.props.onError(`Error loading giaa report data`, err.message); });
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
        proms.push(this.loadDirectorates());
        proms.push(this.loadGIAAAssurances());
        return Promise.all(proms);
    }

    // private loadIDirectorates = (): Promise<IDirectorate[]> => {
    //     return this.directorateService.readAll().then((data: IDirectorate[]): IDirectorate[] => {
    //         this.setState({ LookupData: this.cloneObject(this.state.LookupData, "IDirectorates", data) });
    //         return data;
    //     }, (err) => { if (this.props.onError) this.props.onError(`Error loading Users lookup data`, err.message); });
    // }

    private loadDirectorates = (): void => {
        this.directorateService.readAll().then((data: IDirectorate[]): IDirectorate[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Directorates", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Directorates lookup data`, err.message); });
    }

    private loadGIAAAssurances = (): void => {
        this.giaaAssuranceService.readAll().then((data: types.IEntity[]): types.IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "GIAAAssurances", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Assurances lookup data`, err.message); });
    }


    private onAfterLoad = (entity: types.IEntity): void => {

        //console.log('after load', this.state.LookupData.Users);

    }


    private saveData = (): void => {

        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);

            let f: IGIAAAuditReport = { ...this.state.FormData };

            //remove all the child and parent entities before sending post/patch
            //delete f.User; //parent entity

            if (f.ID === 0) {


                this.giaaAuditReportService.create(f).then(x => {
                    this.props.onSaved();

                });

            }
            else {

                //console.log('in update');

                this.giaaAuditReportService.update(f.ID, f).then(this.props.onSaved, (err) => {
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

        if ((this.state.FormData.NumberStr === null) || (this.state.FormData.NumberStr === '')) {
            errMsg.Num = "Num required";
            returnVal = false;
        }
        else {
            errMsg.Num = null;
        }

        if ((this.state.FormData.Title === null) || (this.state.FormData.Title === '')) {
            errMsg.Title = "Title required";
            returnVal = false;
        }
        else {
            errMsg.Title = null;
        }

        if ((this.state.FormData.DirectorateId === null)) {
            errMsg.Directorate = "Directorate required";
            returnVal = false;
        }
        else {
            errMsg.Directorate = null;
        }

        if ((this.state.FormData.IssueDate === null)) {
            errMsg.IssueDate = "Issue Date required";
            returnVal = false;
        }
        else {
            errMsg.IssueDate = null;
        }

        if ((this.state.FormData.GIAAAssuranceId === null)) {
            errMsg.Assurance = "Assurance required";
            returnVal = false;
        }
        else {
            errMsg.Assurance = null;
        }

        if ((this.state.FormData.AuditYear === null) || (this.state.FormData.AuditYear === '')) {
            errMsg.Year = "Year required";
            returnVal = false;
        }
        else {
            errMsg.Year = null;
        }

        if ((this.state.FormData.Link === null) || (this.state.FormData.Link === '')) {
            errMsg.Link = "Link required";
            returnVal = false;
        }
        else {
            errMsg.Link = null;
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
    protected changeDatePicker = (date: Date, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, date), FormIsDirty: true });
    }

    private changeDropdown = (option: IDropdownOption, f: string, index?: number): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, option.key), FormIsDirty: true });
    }
    private changeCheckbox = (value: boolean, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true });
    }

    //#endregion Form Operations

}