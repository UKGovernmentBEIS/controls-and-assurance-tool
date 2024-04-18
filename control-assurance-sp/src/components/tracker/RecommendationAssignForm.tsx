import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { INAORecommendation, NAORecommendation, IUser, INAOAssignment, NAOAssignment } from '../../types';
import { CrTextField } from '../cr/CrTextField';
import { FormButtons } from '../cr/FormButtons';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../cr/FormCommandBar';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import styles from '../../styles/cr.module.scss';

export interface IRecommendationAssignFormProps extends types.IBaseComponentProps {
    recId: number;
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

export interface IRecommendationAssignFormState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: INAORecommendation;
    FormDataBeforeChanges: INAORecommendation;
    FormIsDirty: boolean;
    PickerTemp1: number;

}
export class RecommendationAssignFormState implements IRecommendationAssignFormState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData = new NAORecommendation();
    public FormDataBeforeChanges = new NAORecommendation();
    public FormIsDirty = false;
    public PickerTemp1 = null;
}

export default class RecommendationAssignForm extends React.Component<IRecommendationAssignFormProps, IRecommendationAssignFormState> {
    private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);
    private naoRecommendationService: services.NAORecommendationService = new services.NAORecommendationService(this.props.spfxContext, this.props.api);
    private naoAssignmentService: services.NAOAssignmentService = new services.NAOAssignmentService(this.props.spfxContext, this.props.api);
    private childEntities: types.IFormDataChildEntities[] = [
        { ObjectParentProperty: 'NAOAssignments', ParentIdProperty: 'NAORecommendationId', ChildIdProperty: 'UserId', ChildService: this.naoAssignmentService },
    ];

    constructor(props: IRecommendationAssignFormProps, state: IRecommendationAssignFormState) {
        super(props);
        this.state = new RecommendationAssignFormState();
    }
    //#region Render

    public render(): React.ReactElement<IRecommendationAssignFormProps> {
        return (
            <Panel isOpen={this.props.showForm} headerText={"Recommendation Assignments"} type={PanelType.medium} onRenderNavigation={() => <FormCommandBar onSave={this.saveData} onCancel={this.props.onCancelled} />}>
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
                {this.renderAssignments()}
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
                onChanged={(ev, newValue) => this.changeTextField(newValue, "Title")}
                disabled={true}
            />
        );
    }


    private renderAssignments() {
        const users = this.state.LookupData.Users;
        const fd_users: INAOAssignment[] = this.state.FormData['NAOAssignments'];
        if (users) {
            return (
                <CrEntityPicker
                    label="Assigned To"
                    className={styles.formField}
                    displayForUser={true}
                    entities={this.state.LookupData.Users}
                    itemLimit={10}
                    selectedEntities={fd_users && fd_users.map((owner) => { return owner.UserId; })}
                    onChange={(v) => this.changeMultiUserPicker(v, 'NAOAssignments', new NAOAssignment(), 'UserId')}
                    temp1={this.state.PickerTemp1}
                />
            );
        }
        else
            return null;
    }

    //#endregion Render


    //#region Data Load/Save

    private loadData = (): Promise<void> => {
        console.log('loadData - Id: ', this.props.recId);
        let x = this.naoRecommendationService.readWithExpandAssignments(this.props.recId).then((e: INAORecommendation): void => {
            console.log('rec ', e);
            this.setState({
                FormData: e,
                FormDataBeforeChanges: e,
                PickerTemp1: 1,
            });

        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Rec data`, err.message); });
        return x;
    }

    public componentDidMount(): void {
        this.setState({ Loading: true });
        let loadingPromises = [this.loadLookups()];
        if (this.props.recId) {
            loadingPromises.push(this.loadData());
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
            let f: INAORecommendation = { ...this.state.FormData };

            //remove all the child and parent entities before sending post/patch
            delete f['NAOAssignments']; //chile entity
            this.naoRecommendationService.update(f.ID, f).then(this.saveChildEntitiesAfterUpdate).then(this.onAfterUpdate).then(this.props.onSaved, (err) => {
                if (this.props.onError) this.props.onError(`Error updating item`, err.message);
            });
        }
    }

    private validateEntity = (): boolean => {
        return true;
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


    private cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }

    private changeTextField = (value: string, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true });
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