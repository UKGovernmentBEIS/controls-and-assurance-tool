import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { IGIAARecommendation, GIAARecommendation, IEntity, IUser, IGIAAActionOwner, GIAAActionOwner } from '../../types';
import { CrTextField } from '../cr/CrTextField';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { FormButtons } from '../cr/FormButtons';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../cr/FormCommandBar';
import { CrDatePicker } from '../cr/CrDatePicker';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import { changeDatePicker } from '../../types/AppGlobals';
import styles from '../../styles/cr.module.scss';

export interface IRecommendationSaveFormProps extends types.IBaseComponentProps {
    //periodID: number | string;
    //giaaPeriodId:number | string;
    giaaAuditReportId: number | string;
    entityId: number;
    showForm: boolean;
    onSaved?: () => void;
    onCancelled?: () => void;
}

export interface ILookupData {
    GIAAActionPriorities: IEntity[];
    GIAAActionStatusTypes: IEntity[];
    Users: IUser[];
}
export class LookupData implements ILookupData {
    public GIAAActionPriorities = null;
    public GIAAActionStatusTypes = null;
    public Users = null;
}
export interface IErrorMessage {
    Title: string;
    RecDetails: string;
    Priority: string;
    TargetDate: string;
    ActionStatus: string;
    UpdateStatus: string;

}
export class ErrorMessage implements IErrorMessage {
    public Title = null;
    public RecDetails = null;
    public Priority = null;
    public TargetDate = null;
    public ActionStatus = null;
    public UpdateStatus = null;
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
    private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);
    private giaaActionPriorityService: services.GIAAActionPriorityService = new services.GIAAActionPriorityService(this.props.spfxContext, this.props.api);
    private giaaActionStatusTypeService: services.GIAAActionStatusTypeService = new services.GIAAActionStatusTypeService(this.props.spfxContext, this.props.api);
    private giaaRecommendationService: services.GIAARecommendationService = new services.GIAARecommendationService(this.props.spfxContext, this.props.api);
    private giaaActionOwnerService: services.GIAAActionOwnerService = new services.GIAAActionOwnerService(this.props.spfxContext, this.props.api);



    private childEntities: types.IFormDataChildEntities[] = [
        { ObjectParentProperty: 'GIAAActionOwners', ParentIdProperty: 'GIAARecommendationId', ChildIdProperty: 'UserId', ChildService: this.giaaActionOwnerService },
    ];

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
                {this.renderRevisedDate()}
                {this.renderGIAAActionStatusTypes()}
                {this.renderUpdateStatuses()}
                {this.renderActionOwners()}
                {this.renderDisplayOwners()}

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

        // if(this.state.FormData.TargetDate !== null){
        //     let x = this.state.FormData.TargetDate;
        //     x.setTime( x.getTime() + x.getTimezoneOffset() * 60 * 1000 );
        //     console.log('x date', x);
        // }


        return (
            <CrDatePicker
                label="Original Implementation Date"
                className={styles.formField}
                value={this.state.FormData.TargetDate}
                onSelectDate={(v) => changeDatePicker(this, v, "TargetDate")}
                required={true}
                errorMessage={this.state.ErrMessages.TargetDate}
            />
        );
    }

    private renderRevisedDate() {


        return (
            <CrDatePicker
                label="Revised Implementation Date"
                className={styles.formField}
                value={this.state.FormData.RevisedDate}
                onSelectDate={(v) => changeDatePicker(this, v, "RevisedDate")}
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

    private renderUpdateStatuses() {
        const options: IDropdownOption[] = [
            { key: 'Blank', text: '' },
            { key: 'ReqUpdate', text: 'ReqUpdate' },
        ];



        return (
            <CrDropdown
                label="Update Status"
                placeholder="Select an Option"
                required={true}
                className={styles.formField}
                options={options}
                selectedKey={this.state.FormData.UpdateStatus}
                onChanged={(v) => this.changeDropdown(v, "UpdateStatus")}
                errorMessage={this.state.ErrMessages.UpdateStatus}
            />
        );

    }

    private renderActionOwners() {
        const users = this.state.LookupData.Users;
        const fd_users: IGIAAActionOwner[] = this.state.FormData['GIAAActionOwners'];
        //console.log('fd_users', fd_users);
        if (users) {
            return (
                <CrEntityPicker
                    label="Action Owners"
                    className={styles.formField}
                    displayForUser={true}
                    entities={this.state.LookupData.Users}
                    itemLimit={10}
                    selectedEntities={fd_users && fd_users.map((owner) => { return owner.UserId; })}
                    onChange={(v) => this.changeMultiUserPicker(v, 'GIAAActionOwners', new GIAAActionOwner(), 'UserId')}
                />
            );
        }
        else
            return null;
    }



    private renderDisplayOwners() {

        if (this.props.entityId && this.state.FormData.DisplayedImportedActionOwners && this.state.FormData.DisplayedImportedActionOwners.length > 0) {

            return (
                <div>
                    <CrTextField
                        label="Imported Action Owners"
                        //className={styles.formField}
                        value={this.state.FormData.DisplayedImportedActionOwners}
                        onChanged={(v) => this.changeTextField(v, "DisplayedImportedActionOwners")}
                        multiline={true}
                        rows={2}
                    />
                    <div style={{ fontSize: '13px', fontStyle: 'italic' }} className={styles.formField}>
                        Please create Action Owners based on this imported text data, and clear the field once done.
                    </div>

                </div>

            );

        }

        else
            return null;

    }




    //#endregion Render


    //#region Data Load/Save

    private loadData = (): Promise<void> => {
        console.log('loadData - Id: ', this.props.entityId);
        let x = this.giaaRecommendationService.readWithExpandActionOwners(this.props.entityId).then((e: IGIAARecommendation): void => {

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
        proms.push(this.loadUsers());
        return Promise.all(proms);
    }

    private loadUsers = (): void => {
        this.userService.readAll().then((data: IUser[]): IUser[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Users", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Users lookup data`, err.message); });
    }

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
            delete f['GIAAActionOwners']; //chile entity

            if (f.ID === 0) {

                f.GIAAAuditReportId = Number(this.props.giaaAuditReportId);

                this.giaaRecommendationService.create(f).then(this.saveChildEntitiesAfterCreate).then(this.onAfterCreate).then(this.props.onSaved, (err) => {
                    if (this.props.onError) this.props.onError(`Error creating item`, err.message);
                });

            }
            else {

                //console.log('in update');

                this.giaaRecommendationService.update(f.ID, f).then(this.saveChildEntitiesAfterUpdate).then(this.onAfterUpdate).then(this.props.onSaved, (err) => {
                    if (this.props.onError) this.props.onError(`Error updating item`, err.message);
                });

                // this.giaaRecommendationService.updateGiaaUpdateAfterEditRec(f.ID, Number(this.props.giaaPeriodId)).then((res: string): void => {

                //     console.log('welcome accessed');

                // }, (err) => {

                // });
            }
        }

    }

    private saveChildEntitiesAfterCreate = (parentEntity: IGIAARecommendation): Promise<any> => {
        let promises = [];

        if (this.childEntities) {
            this.childEntities.forEach((ce) => {


                const owners = this.state.FormData[ce.ObjectParentProperty];

                if (owners) {

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



    private onAfterUpdate(): Promise<any> { return Promise.resolve(); }

    private onAfterCreate(): Promise<any> {
        console.log('onAfterCreate');
        return Promise.resolve();
    }

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

        if ((this.state.FormData.UpdateStatus === null)) {
            errMsg.UpdateStatus = "Update Status required";
            returnVal = false;
        }
        else {
            errMsg.UpdateStatus = null;
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
    // protected changeDatePicker = (date: Date, f: string): void => {
    //     console.log('original date', date);
    //     if(date != null){
    //         const is_dst = this.isDST(date);
    //         console.log('is_dst', is_dst);
    //         if(is_dst === true){
    //             console.log('date offset', date.getTimezoneOffset());
    //             //let date2 = new Date(date.getTime()); //copy value of date
    //             date.setTime( date.getTime() - date.getTimezoneOffset() * 60 * 1000 );
    //             console.log('date minus offset', date);
    //         }

    //     }

    //     this.setState({ FormData: this.cloneObject(this.state.FormData, f, date), FormIsDirty: true });
    // }
    
    // private isDST = (d: Date) : boolean => {
    //     let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
    //     let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
    //     return Math.max(jan, jul) != d.getTimezoneOffset(); 
    // }

    private changeMultiUserPicker = (value: number[], f: string, newEntity: object, userIdProperty: string): void => {

        //to avoid same user to add multiple times
        const valuesUnique = value.filter((item, pos) => {
            return value.indexOf(item) == pos;
        });
        value = valuesUnique;

        const loadedUsers = this.cloneObject(this.state.FormDataBeforeChanges);
        let newUsers = [];
        value.forEach((userId) => {
            let existingUser = loadedUsers[f] ? loadedUsers[f].map(user => user[userIdProperty]).indexOf(userId) : -1;
            if (existingUser !== -1) {
                //existing user which is saved in db
                newUsers.push(loadedUsers[f][existingUser]);
            }
            else {
                //-1
                let newUser = { ...newEntity };
                newUser[userIdProperty] = userId;
                newUsers.push(newUser);
            }
        });
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, newUsers), FormIsDirty: true });
    }

    //#endregion Form Operations

}