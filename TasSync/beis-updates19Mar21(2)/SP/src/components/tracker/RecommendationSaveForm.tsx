import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { IDirectorate, INAORecommendation, NAORecommendation, IUser, INAOAssignment, NAOAssignment } from '../../types';
import { CrTextField } from '../cr/CrTextField';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { FormButtons } from '../cr/FormButtons';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../cr/FormCommandBar';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import styles from '../../styles/cr.module.scss';

export interface IRecommendationSaveFormProps extends types.IBaseComponentProps {

    naoPublicationId: number | string;
    periodId: number | string;
    entityId: number;
    showForm: boolean;
    onSaved?: () => void;
    onCancelled?: () => void;
}

export interface ILookupData {
    NAORecStatusTypes: types.IEntity[];
    Users: IUser[];
}
export class LookupData implements ILookupData {
    public NAORecStatusTypes = null;
    public Users = null;
    
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
    UpdateTargetDate: string;
    UpdateNAORecStatusTypeId:number;
    //ClearSuggestedStatus:boolean;
    FormDataBeforeChanges: INAORecommendation;
    FormIsDirty: boolean;
    ErrMessages: IErrorMessage;
}
export class RecommendationSaveFormState implements IRecommendationSaveFormState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData = new NAORecommendation();
    public FormDataBeforeChanges = new NAORecommendation();
    public UpdateTargetDate = "";
    public UpdateNAORecStatusTypeId = null;
    public FormIsDirty = false;
    //public ClearSuggestedStatus = false;
    public ErrMessages = new ErrorMessage();
}

export default class RecommendationSaveForm extends React.Component<IRecommendationSaveFormProps, IRecommendationSaveFormState> {
    private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);
    private naoRecStatusTypeService: services.NAORecStatusTypeService = new services.NAORecStatusTypeService(this.props.spfxContext, this.props.api);
    private naoRecommendationService: services.NAORecommendationService = new services.NAORecommendationService(this.props.spfxContext, this.props.api);
    private naoAssignmentService: services.NAOAssignmentService = new services.NAOAssignmentService(this.props.spfxContext, this.props.api);



    private childEntities: types.IFormDataChildEntities[] = [
        { ObjectParentProperty: 'NAOAssignments', ParentIdProperty: 'NAORecommendationId', ChildIdProperty: 'UserId', ChildService: this.naoAssignmentService },
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
                {this.renderConclusion()}
                {this.renderRecommendationDetails()}                
                {this.renderOriginalTargetDate()}
                {this.renderTargetDate()}
                {this.renderNAORecStatusTypes()}
                {this.renderAssignments()}

            </React.Fragment>
        );
    }

    private renderTitle() {
        //console.log('in renderTitle');
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
                label="Recommendation"
                className={styles.formField}
                value={this.state.FormData.RecommendationDetails}
                onChanged={(v) => this.changeTextField(v, "RecommendationDetails")}
                multiline={true}
                required={true}
                //errorMessage={this.state.ErrMessages.RecommendationDetails}
                rows={5}
            />
        );
    }

    private renderConclusion() {

        return (
            <CrTextField
                label="Conclusion"
                className={styles.formField}
                value={this.state.FormData.Conclusion}
                onChanged={(v) => this.changeTextField(v, "Conclusion")}
                multiline={true}
                //required={true}
                //errorMessage={this.state.ErrMessages.RecommendationDetails}
                rows={5}
            />
        );
    }

    private renderOriginalTargetDate() {

        return (
            <CrTextField
                label="Original Target Date"
                required={true}
                className={styles.formField}
                value={this.state.FormData.OriginalTargetDate}
                onChanged={(v) => this.changeTextField(v, "OriginalTargetDate")}
                //errorMessage={this.state.ErrMessages.Title}
            />
        );

    }

    private renderTargetDate() {

        return (
            <CrTextField
                label="Target Date"
                required={true}
                className={styles.formField}
                value={this.state.UpdateTargetDate}
                onChanged={(v) => this.changeTargetDate(v)}
                //value={this.state.FormData.TargetDate}
                //onChanged={(v) => this.changeTextField(v, "TargetDate")}
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
                    selectedKey={this.state.UpdateNAORecStatusTypeId}
                    onChanged={(v) => this.changeRecStatusTypeId(v)}
                    //selectedKey={this.state.FormData.NAORecStatusTypeId}
                    //onChanged={(v) => this.changeDropdown(v, "NAORecStatusTypeId")}
                    //errorMessage={this.state.ErrMessages.Directorate}
                />
            );
        }
        else
            return null;
    }

    private renderAssignments() {
        const users = this.state.LookupData.Users;
        const fd_users: INAOAssignment[] = this.state.FormData['NAOAssignments'];
        //console.log('fd_users', fd_users);
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
        let x = this.naoRecommendationService.readWithExpand(this.props.entityId, this.props.periodId).then((e: INAORecommendation): void => {

            let tdate:string = "";
            let updateRecStatusId:number = null;
            try{
                tdate = e['NAOUpdates'][0]['TargetDate'];
                updateRecStatusId = e['NAOUpdates'][0]['NAORecStatusTypeId'];
            }
            catch(err)
            {
                console.log('exception on load data');
            }
            
            console.log('rec ', e);
            this.setState({
                FormData: e,
                FormDataBeforeChanges: e,
                UpdateTargetDate: tdate,
                UpdateNAORecStatusTypeId: updateRecStatusId,
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
        proms.push(this.loadUsers());
        
        return Promise.all(proms);
    }

    private loadUsers = (): void => {
        this.userService.readAll().then((data: IUser[]): IUser[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Users", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Users lookup data`, err.message); });
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
            delete f['NAOAssignments']; //chile entity
            delete f['NAOUpdates']; //chile entity

            if (f.ID === 0) {

                f.NAOPublicationId = Number(this.props.naoPublicationId);

                this.naoRecommendationService.create(f).then(this.saveChildEntitiesAfterCreate).then(this.onAfterCreate).then(this.props.onSaved, (err) => {
                    if (this.props.onError) this.props.onError(`Error creating item`, err.message);
                });

            }
            else {

                this.naoRecommendationService.update(f.ID, f).then(this.saveChildEntitiesAfterUpdate).then(this.onAfterUpdate).then(this.props.onSaved, (err) => {
                    if (this.props.onError) this.props.onError(`Error updating item`, err.message);
                });
            }
        }

    }

    private saveChildEntitiesAfterCreate = (parentEntity: INAORecommendation): Promise<any> => {
        let promises = [];

        if (this.childEntities) {
            this.childEntities.forEach((ce) => {


                const assignments = this.state.FormData[ce.ObjectParentProperty];

                if(assignments){

                    this.state.FormData[ce.ObjectParentProperty].forEach((c) => {
                        c[ce.ParentIdProperty] = parentEntity.ID;
                        if (c.ID === 0){
                            promises.push(ce.ChildService.create(c));
                            
                        }
                            
                    });
                }


            });


            this.updateTargetDateAndRecStatus(parentEntity.ID);

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

            this.updateTargetDateAndRecStatus(this.state.FormData.ID);

            return Promise.all(promises).then(() => this.state.FormData);
        }
    }

    private onAfterUpdate(): Promise<any> { return Promise.resolve(); }

    private onAfterCreate(): Promise<any>  
    {
        console.log('onAfterCreate');
         return Promise.resolve(); 
    }

    private updateTargetDateAndRecStatus(recId:number){

        this.naoRecommendationService.updateTargetDateAndRecStatus(recId, this.props.periodId, this.state.UpdateTargetDate, this.state.UpdateNAORecStatusTypeId).then((res: string): void => {
    
            console.log('updateTargetDateAndRecStatus');

        }, (err) => {});


    }



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

    private changeTargetDate = (value: string): void => {

        // const fd = {...this.state.FormData};
        // if(fd){
        //     fd['NAOUpdates'][0]['TargetDate'] = value;
        //     this.setState({ FormData: fd, FormIsDirty: true });
        // }

        this.setState({
            UpdateTargetDate: value
        });

    }

    private changeRecStatusTypeId = (option: IDropdownOption): void => {

        let vv:number = null;
        try{
            vv = Number(option.key);

        }catch(Err)
        {}

        this.setState({
            UpdateNAORecStatusTypeId: vv
        });

    }

    //#endregion Form Operations

}