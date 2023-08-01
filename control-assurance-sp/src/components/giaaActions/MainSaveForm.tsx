import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { IEntity, IDirectorate, IGIAAAuditReport, GIAAAuditReport, IGIAAAuditReportDirectorate, GIAAAuditReportDirectorate } from '../../types';
import { CrTextField } from '../cr/CrTextField';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { FormButtons } from '../cr/FormButtons';
import { CrCheckbox } from '../cr/CrCheckbox';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../cr/FormCommandBar';
import { changeDatePicker } from '../../types/AppGlobals';
import { CrDatePicker } from '../cr/CrDatePicker';
import styles from '../../styles/cr.module.scss';

export interface IMainSaveFormProps extends types.IBaseComponentProps {
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
    public ErrMessages = new ErrorMessage();
}

export default class MainSaveForm extends React.Component<IMainSaveFormProps, IMainSaveFormState> {
    private directorateService: services.DirectorateService = new services.DirectorateService(this.props.spfxContext, this.props.api);
    private giaaAssuranceService: services.GIAAAssuranceService = new services.GIAAAssuranceService(this.props.spfxContext, this.props.api);
    private giaaAuditReportService: services.GIAAAuditReportService = new services.GIAAAuditReportService(this.props.spfxContext, this.props.api);
    private giaaAuditReportDirectorateService: services.GIAAAuditReportDirectorateService = new services.GIAAAuditReportDirectorateService(this.props.spfxContext, this.props.api);

    private childEntities: types.IFormDataChildEntities[] = [
        { ObjectParentProperty: 'GIAAAuditReportDirectorates', ParentIdProperty: 'GIAAAuditReportId', ChildIdProperty: 'DirectorateId', ChildService: this.giaaAuditReportDirectorateService },
    ];

    constructor(props: IMainSaveFormProps, state: IMainSaveFormState) {
        super(props);
        this.state = new MainSaveFormState();
    }

    //#region Render

    public render(): React.ReactElement<IMainSaveFormProps> {
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
                {this.renderDirectorates()}
                {this.renderYear()}
                {this.renderAssurance()}
                {this.renderLink()}
                {this.renderIsArchiveCheckbox()}
            </React.Fragment>
        );
    }

    private renderNum() {
        return (
            <CrTextField
                label="Num"
                required={true}
                className={styles.formField}
                value={this.state.FormData.NumberStr}
                onChanged={(ev, newValue) => this.changeTextField(newValue, "NumberStr")}
                errorMessage={this.state.ErrMessages.Num}
            />
        );
    }

    private renderTitle() {
        return (
            <CrTextField
                label="Title"
                required={true}
                className={styles.formField}
                value={this.state.FormData.Title}
                onChanged={(ev, newValue) => this.changeTextField(newValue, "Title")}
                errorMessage={this.state.ErrMessages.Title}
            />
        );
    }

    private renderDirectorates() {
        const directorates = this.state.LookupData.Directorates;
        const fd_dirs: IGIAAAuditReportDirectorate[] = this.state.FormData.GIAAAuditReportDirectorates;

        if (directorates) {
            return (
                <CrDropdown
                    label="Directorate(s)"
                    placeholder="Select"
                    multiSelect
                    className={styles.formField}
                    options={services.LookupService.entitiesToSelectableOptions(directorates)}
                    selectedKeys={fd_dirs && fd_dirs.map((x) => { return x.DirectorateId; })}
                    onChanged={(v) => this.changeMultiDropdown(v, 'GIAAAuditReportDirectorates', new GIAAAuditReportDirectorate(), 'DirectorateId')}
                    required={true}
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
                onChanged={(ev, newValue) => this.changeTextField(newValue, "AuditYear")}
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
                onChanged={(ev, newValue) => this.changeTextField(newValue, "Link")}
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
                onSelectDate={(v) => changeDatePicker(this, v, "IssueDate")}
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
        let x = this.giaaAuditReportService.readWithExpandDirectorates(this.props.entityId).then((e: IGIAAAuditReport): void => {

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
    }


    private saveData = (): void => {

        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);

            let f: IGIAAAuditReport = { ...this.state.FormData };
            //remove all the child and parent entities before sending post/patch
            delete f.GIAAAuditReportDirectorates;

            if (f.ID === 0) {

                this.giaaAuditReportService.create(f).then(this.saveChildEntitiesAfterCreate).then(this.onAfterCreate).then(this.props.onSaved, (err) => {
                    if (this.props.onError) this.props.onError(`Error creating item`, err.message);
                });
            }
            else {
                this.giaaAuditReportService.update(f.ID, f).then(this.saveChildEntitiesAfterUpdate).then(this.onAfterUpdate).then(this.props.onSaved, (err) => {
                    if (this.props.onError) this.props.onError(`Error updating item`, err.message);
                });

            }
        }
    }

    private saveChildEntitiesAfterCreate = (parentEntity: IGIAAAuditReport): Promise<any> => {
        let promises = [];

        if (this.childEntities) {
            this.childEntities.forEach((ce) => {
                const assignments = this.state.FormData[ce.ObjectParentProperty];
                if (assignments) {
                    this.state.FormData[ce.ObjectParentProperty].forEach((c) => {
                        c[ce.ParentIdProperty] = parentEntity.ID;
                        if (c.ID === 0) {
                            promises.push(ce.ChildService.create(c));
                        }
                    });
                }
            });

            return Promise.all(promises).then(() => parentEntity);
        }
    }

    private saveChildEntitiesAfterUpdate = (): Promise<any> => {

        let promises = [];
        if (this.childEntities) {
            this.childEntities.forEach((ce) => {
                this.state.FormData[ce.ObjectParentProperty].forEach((c) => {
                    if (c.ID === 0) {
                        c[ce.ParentIdProperty] = this.state.FormData.ID;
                        promises.push(ce.ChildService.create(c));
                    }
                    else {
                        //no need to update
                    }
                });

                this.state.FormDataBeforeChanges[ce.ObjectParentProperty].forEach((c) => {
                    if (this.state.FormData[ce.ObjectParentProperty].map(i => i[ce.ChildIdProperty]).indexOf(c[ce.ChildIdProperty]) === -1) {
                        promises.push(ce.ChildService.delete(c.ID));
                    }
                });
            });
            return Promise.all(promises).then(() => this.state.FormData);
        }
    }

    private onAfterCreate(): Promise<any> {
        console.log('onAfterCreate');
        return Promise.resolve();
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

        if ((this.state.FormData.GIAAAuditReportDirectorates.length === 0)) {
            errMsg.Directorate = "Directorate(s) required";
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

    private changeDropdown = (option: IDropdownOption, f: string, index?: number): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, option.key), FormIsDirty: true });
    }
    private changeCheckbox = (value: boolean, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true });
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

    //#endregion Form Operations

}