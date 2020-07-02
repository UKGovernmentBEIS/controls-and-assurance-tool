import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { IEntity, IUser, IIAPUpdate, IAPUpdate, IIAPAssignment, IAPAssignment } from '../../types';
import { CrTextField } from '../cr/CrTextField';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { FormButtons } from '../cr/FormButtons';
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
    Users: IUser[];
}
export class LookupData implements ILookupData {
    public Users = null;
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
    FormData: IIAPUpdate;
    //ClearSuggestedStatus:boolean;
    FormDataBeforeChanges: IIAPUpdate;
    FormIsDirty: boolean;
    ErrMessages: IErrorMessage;
}
export class MainSaveFormState implements IMainSaveFormState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData = new IAPUpdate(1, 1, 1);
    public FormDataBeforeChanges = new IAPUpdate(1, 1, 1);
    public FormIsDirty = false;
    //public ClearSuggestedStatus = false;
    public ErrMessages = new ErrorMessage();
}

export default class MainSaveForm extends React.Component<IMainSaveFormProps, IMainSaveFormState> {
    private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);
    private iapUpdateService: services.IAPUpdateService = new services.IAPUpdateService(this.props.spfxContext, this.props.api);
    private aipAssignmentService: services.IAPAssignmentService = new services.IAPAssignmentService(this.props.spfxContext, this.props.api);


    private childEntities: types.IFormDataChildEntities[] = [
        { ObjectParentProperty: 'IAPAssignments', ParentIdProperty: 'IAPUpdateId', ChildIdProperty: 'UserId', ChildService: this.aipAssignmentService },
    ];

    constructor(props: IMainSaveFormProps, state: IMainSaveFormState) {
        super(props);
        this.state = new MainSaveFormState();
    }

    //#region Render

    public render(): React.ReactElement<IMainSaveFormProps> {
        //const errors = this.state.ValidationErrors;
        return (
            <Panel isOpen={this.props.showForm} headerText={"Individual Action Plan"} type={PanelType.medium} onRenderNavigation={() => <FormCommandBar onSave={this.saveData} onCancel={this.props.onCancelled} />}>
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
                {this.renderDetails()}
                {this.renderUsers()}



            </React.Fragment>
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
            //errorMessage={this.state.ErrMessages.Title}
            />
        );
    }

    private renderDetails() {
        //console.log('in renderTitle');
        return (
            <CrTextField
                label="Details"
                required={true}
                className={styles.formField}
                value={this.state.FormData.Details}
                multiline={true}
                rows={4}
                onChanged={(v) => this.changeTextField(v, "Details")}
            //errorMessage={this.state.ErrMessages.Title}
            />
        );
    }

    private renderUsers() {
        const users = this.state.LookupData.Users;
        const fd_users: IIAPAssignment[] = this.state.FormData['IAPAssignments'];
        //console.log('fd_users', fd_users);
        if (users) {
            return (
                <CrEntityPicker
                    label="Users"
                    className={styles.formField}
                    displayForUser={true}
                    entities={this.state.LookupData.Users}
                    itemLimit={10}
                    selectedEntities={fd_users && fd_users.map((ass) => { return ass.UserId; })}
                    onChange={(v) => this.changeMultiUserPicker(v, 'IAPAssignments', new IAPAssignment(), 'UserId')}
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
        let x = this.iapUpdateService.readWithExpandAssignments(this.props.entityId).then((e: IIAPUpdate): void => {

            console.log('data ', e);
            this.setState({
                FormData: e,
                FormDataBeforeChanges: e,
            });

        }, (err) => { if (this.props.onError) this.props.onError(`Error individual action plan loading data`, err.message); });
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
        proms.push(this.loadUsers());
        return Promise.all(proms);
    }

    // private loadIDirectorates = (): Promise<IDirectorate[]> => {
    //     return this.directorateService.readAll().then((data: IDirectorate[]): IDirectorate[] => {
    //         this.setState({ LookupData: this.cloneObject(this.state.LookupData, "IDirectorates", data) });
    //         return data;
    //     }, (err) => { if (this.props.onError) this.props.onError(`Error loading Users lookup data`, err.message); });
    // }

    private loadUsers = (): void => {
        this.userService.readAll().then((data: IUser[]): IUser[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Users", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Users lookup data`, err.message); });
    }




    private onAfterLoad = (entity: types.IEntity): void => {

        //console.log('after load', this.state.LookupData.Users);

    }


    private saveData = (): void => {

        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);

            let f: IIAPUpdate = { ...this.state.FormData };

            //remove all the child and parent entities before sending post/patch
            delete f['IAPAssignments']; //chile entity

            if (f.ID === 0) {


                this.iapUpdateService.create(f).then(this.saveChildEntitiesAfterCreate).then(this.props.onSaved, (err) => {
                    if (this.props.onError) this.props.onError(`Error creating item`, err.message);
                });

            }
            else {

                //console.log('in update');

                this.iapUpdateService.update(f.ID, f).then(this.saveChildEntitiesAfterUpdate).then(this.onAfterUpdate).then(this.props.onSaved, (err) => {
                    if (this.props.onError) this.props.onError(`Error updating item`, err.message);
                });
            }
        }

    }

    private saveChildEntitiesAfterCreate = (parentEntity: IIAPUpdate): Promise<any> => {
        let promises = [];
        if (this.childEntities) {
            this.childEntities.forEach((ce) => {
                this.state.FormData[ce.ObjectParentProperty].forEach((c) => {
                    c[ce.ParentIdProperty] = parentEntity.ID;
                    if (c.ID === 0)
                        promises.push(ce.ChildService.create(c));
                });
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
    protected changeDatePicker = (date: Date, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, date), FormIsDirty: true });
    }

    private changeDropdown = (option: IDropdownOption, f: string, index?: number): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, option.key), FormIsDirty: true });
    }

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