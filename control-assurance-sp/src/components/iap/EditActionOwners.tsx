import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { IUser, IIAPAction, IAPAction, IIAPAssignment, IAPAssignment, IDirectorate, IIAPActionDirectorate, IAPActionDirectorate } from '../../types';
import { CrTextField } from '../cr/CrTextField';
import { IDropdownOption } from '../cr/CrDropdown';
import { FormButtons } from '../cr/FormButtons';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../cr/FormCommandBar';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import { getUploadFolder_IAPFiles, getFolder_Help } from '../../types/AppGlobals';
import styles from '../../styles/cr.module.scss';

export interface IEditActionOwnersProps extends types.IBaseComponentProps {
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
    Title: string;
    Details: string;
    CompletionDate: string;
    Status: string;
}
export class ErrorMessage implements IErrorMessage {
    public Title = null;
    public Details = null;
    public CompletionDate = null;
    public Status = null;

}
export interface IEditActionOwnersState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: IIAPAction;
    FormDataBeforeChanges: IIAPAction;
    FormIsDirty: boolean;
    UploadStatus: string;
    UploadProgress: number;
    ShowUploadProgress: boolean;
    ShowFileUpload: boolean;
    EditRequest: boolean;
    ErrMessages: IErrorMessage;

}
export class EditActionOwnersState implements IEditActionOwnersState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData = new IAPAction(1, 1, 1);
    public FormDataBeforeChanges = new IAPAction(1, 1, 1);
    public FormIsDirty = false;
    public UploadStatus = "";
    public UploadProgress: number = 0;
    public ShowUploadProgress = false;
    public ShowFileUpload = false;
    public EditRequest = false;
    public ErrMessages = new ErrorMessage();
}

export default class EditActionOwners extends React.Component<IEditActionOwnersProps, IEditActionOwnersState> {
    private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);
    private iapUpdateService: services.IAPActionService = new services.IAPActionService(this.props.spfxContext, this.props.api);
    private aipAssignmentService: services.IAPAssignmentService = new services.IAPAssignmentService(this.props.spfxContext, this.props.api);

    private childEntities: types.IFormDataChildEntities[] = [
        { ObjectParentProperty: 'IAPAssignments', ParentIdProperty: 'IAPActionId', ChildIdProperty: 'UserId', ChildService: this.aipAssignmentService },

    ];

    constructor(props: IEditActionOwnersProps, state: IEditActionOwnersState) {
        super(props);
        this.state = new EditActionOwnersState();
    }

    //#region Render

    public render(): React.ReactElement<IEditActionOwnersProps> {
        return (
            <Panel isOpen={this.props.showForm} headerText={"Edit Action Owners"} type={PanelType.medium} onRenderNavigation={() => <FormCommandBar onSave={this.saveData} onCancel={this.props.onCancelled} />}>
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
                {this.renderUsers()}
            </React.Fragment>
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
                disabled={true}
            />
        );
    }

    private renderUsers() {
        const users = this.state.LookupData.Users;
        const fd_users: IIAPAssignment[] = this.state.FormData['IAPAssignments'];
        if (users) {
            return (
                <CrEntityPicker
                    label="Action Owners"
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
        let x = this.iapUpdateService.readWithExpandAssignments(this.props.entityId).then((e: IIAPAction): void => {

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
            this.setState({ EditRequest: true });
            loadingPromises.push(this.loadData());
        }
        else {
            this.setState({ ShowFileUpload: true });
        }
        Promise.all(loadingPromises).then(p => this.onAfterLoad(p[1])).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));

    }

    private loadLookups(): Promise<any> {

        let proms: any[] = [];
        proms.push(this.loadUsers());
        return Promise.all(proms);
    }


    private loadUsers = (): void => {
        this.userService.readAll().then((data: IUser[]): IUser[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Users", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Users lookup data`, err.message); });
    }

    private onAfterLoad = (entity: types.IEntity): void => {

    }

    private saveData = (): void => {

        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);

            let f: IIAPAction = { ...this.state.FormData };

            //remove all the child and parent entities before sending post/patch
            delete f['IAPAssignments']; //chile entity
            delete f.IAPActionDirectorates;
            this.iapUpdateService.update(f.ID, f).then(this.saveChildEntitiesAfterUpdate).then(this.onAfterUpdate).then(this.props.onSaved, (err) => {
                if (this.props.onError) this.props.onError(`Error updating item`, err.message);
            });
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

    protected changeCheckboxIsLink = (value: boolean, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), ShowFileUpload: !value, FormIsDirty: true });
    }

    private changeMultiUserPicker = (value: number[], f: string, newEntity: object, userIdProperty: string): void => {

        console.log('value', value);
        //to avoid same user to add multiple times
        const valuesUnique = value.filter((item, pos) => {
            console.log('value.indexOf(item)', value.indexOf(item));
            return value.indexOf(item) == pos;
        });
        console.log('valuesUnique', valuesUnique);
        value = valuesUnique;

        const loadedUsers = this.cloneObject(this.state.FormDataBeforeChanges);
        let newUsers = [];
        value.forEach((userId) => {

            console.log('test1', loadedUsers['IAPAssignments']);

            let existingUser = loadedUsers[f] ? loadedUsers[f].map(user => user[userIdProperty]).indexOf(userId) : -1;
            console.log('existingUser', existingUser);
            if (existingUser !== -1) {
                //existing user which is saved in db
                console.log('test4', loadedUsers['IAPAssignments'][existingUser]);
                newUsers.push(loadedUsers[f][existingUser]);
            }
            else {
                //-1
                let newUser = { ...newEntity };
                newUser[userIdProperty] = userId;
                newUsers.push(newUser);
            }
        });
        console.log('newUsers', newUsers);
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, newUsers), FormIsDirty: true });
    }

    //#endregion Form Operations

}