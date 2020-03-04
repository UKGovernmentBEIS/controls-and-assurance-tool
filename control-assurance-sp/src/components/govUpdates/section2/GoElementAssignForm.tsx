import * as React from 'react';
import * as types from '../../../types';
import * as services from '../../../services';
import { IUser, IGoElement, GoElement } from '../../../types';
import { CrTextField } from '../../cr/CrTextField';
import { FormButtons } from '../../cr/FormButtons';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../../cr/FormCommandBar';
import { CrEntityPicker } from '../../cr/CrEntityPicker';
import styles from '../../../styles/cr.module.scss';

export interface IGoElementAssignFormProps extends types.IBaseComponentProps {
    //periodID: number | string;
    goElementId: number;
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
export interface IGoElementAssignFormState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: IGoElement;
    //ClearSuggestedStatus:boolean;
    FormDataBeforeChanges: IGoElement;
    FormIsDirty: boolean;
}
export class GoElementAssignFormState implements IGoElementAssignFormState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData = new GoElement(0,0);
    public FormDataBeforeChanges = new GoElement(0,0);
    public FormIsDirty = false;
    //public ClearSuggestedStatus = false;
}

export default class GoElementAssignForm extends React.Component<IGoElementAssignFormProps, IGoElementAssignFormState> {
    private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);
    private goElementService: services.GoElementService = new services.GoElementService(this.props.spfxContext, this.props.api);
    private goAssignmentService: services.GoAssignmentService = new services.GoAssignmentService(this.props.spfxContext, this.props.api);

    private childEntities: types.IFormDataChildEntities[] = [
        { ObjectParentProperty: 'GoAssignments', ParentIdProperty: 'GoElementId', ChildIdProperty: 'UserId', ChildService: this.goAssignmentService },
    ];

    constructor(props: IGoElementAssignFormProps, state: IGoElementAssignFormState) {
        super(props);
        this.state = new GoElementAssignFormState();
    }

    //#region Render

    public render(): React.ReactElement<IGoElementAssignFormProps> {
        //const errors = this.state.ValidationErrors;
        return (
            <Panel isOpen={this.props.showForm} headerText={"Assign Users"} type={PanelType.medium} onRenderNavigation={() => <FormCommandBar onSave={this.saveData} onCancel={this.props.onCancelled} />}>
                <div className={styles.cr}>
                    {this.state.FormData.GoDefElement && this.renderFormFields()}
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
                label="Specific Evidence Area"
                //required={true}
                className={styles.formField}
                value={this.state.FormData.GoDefElement.Title}
                disabled={true}
                //onChanged={(v) => this.changeTextField(v, "Title")}
            //errorMessage={this.state.ValidationErrors[c.fieldName]} 
            />
        );
    }

    private renderUsers() {
        const users = this.state.LookupData.Users;
        const fd_users: types.IGoAssignment[] = this.state.FormData.GoAssignments;
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
                    onChange={(v) => this.changeMultiUserPicker(v, 'GoAssignments', new types.GoAssignment(), 'UserId')}
                />
            );
        }
        else
            return null;
    }

    //#endregion Render


    //#region Data Load/Save

    private loadGoElement = (): Promise<void> => {
        console.log('loadGoElement - goElementId: ', this.props.goElementId);
        let x = this.goElementService.readWithExpandDefElementAndAssignments(this.props.goElementId).then((e: IGoElement): void => {

            console.log('goElement ', e);
            this.setState({
                FormData: e,
                FormDataBeforeChanges: e,
            });

        }, (err) => { if (this.props.onError) this.props.onError(`Error loading GoElement data`, err.message); });
        return x;
    }

    public componentDidMount(): void {
        this.setState({ Loading: true });
        let loadingPromises = [this.loadLookups()];
        if (this.props.goElementId) {
            loadingPromises.push(this.loadGoElement());
        }
        Promise.all(loadingPromises).then(p => this.onAfterLoad(p[1])).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));

    }

    private loadLookups(): Promise<any> {

        let proms: any[] = [];
        proms.push(this.loadUsers());
        return Promise.all(proms);
    }

    private loadUsers = (): Promise<IUser[]> => {
        return this.userService.readAll().then((data: IUser[]): IUser[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Users", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Users lookup data`, err.message); });
    }
    private onAfterLoad = (entity: types.IEntity): void => {

        //console.log('after load', this.state.LookupData.Users);

    }

    private saveData = (): void => {
        this.saveChildEntitiesAfterUpdate().then(this.onAfterUpdate).then(this.props.onSaved, (err) => {
            if (this.props.onError) this.props.onError(`Error updating item`, err.message);
        });
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


        //return Promise.resolve();
    }

    private onAfterUpdate(): Promise<any> { return Promise.resolve(); }

    //#endregion Data Load/Save


    //#region Form Operations

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
    private cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }

    //#endregion Form Operations
    
}