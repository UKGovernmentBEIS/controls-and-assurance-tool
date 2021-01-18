import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { IEntity, IUser, IIAPAction, IAPAction, IIAPAssignment, IAPAssignment, IDirectorate, IIAPActionDirectorate, IAPActionDirectorate, ILinkLocalType } from '../../types';
import { CrTextField } from '../cr/CrTextField';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { FormButtons } from '../cr/FormButtons';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../cr/FormCommandBar';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import { CrCheckbox } from '../cr/CrCheckbox';
import { CrDatePicker } from '../cr/CrDatePicker';
import { getUploadFolder_IAPFiles, getFolder_Help } from '../../types/AppGlobals';
import { sp, ChunkedFileUploadProgressData } from '@pnp/sp';
import styles from '../../styles/cr.module.scss';

export interface IMainSaveFormGroupActionsProps extends types.IBaseComponentProps {
    //periodID: number | string;
    entityId: number;
    showForm: boolean;
    onSaved?: () => void;
    onCancelled?: () => void;
}

export interface ILookupData {
    IAPStatusTypes: IEntity[];
    Directorates: IDirectorate[];
    Users: IUser[];
}
export class LookupData implements ILookupData {
    public Users = null;
    public Directorates = null;
    public IAPStatusTypes = null;
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
export interface IMainSaveFormGroupActionsState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: IIAPAction;
    //ClearSuggestedStatus:boolean;
    FormDataBeforeChanges: IIAPAction;
    FormIsDirty: boolean;

    ArrLinks: ILinkLocalType[];
    UploadStatus: string;
    UploadProgress: number;
    ShowUploadProgress: boolean;
    ShowFileUpload: boolean;
    EditRequest: boolean;

    ErrMessages: IErrorMessage;
    ArrAOGroups: number[];
}
export class MainSaveFormGroupActionsState implements IMainSaveFormGroupActionsState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData = new IAPAction(1, 1, 2); //IAPTypeId 2 is Group Actions
    public FormDataBeforeChanges = new IAPAction(1, 1, 2); //IAPTypeId 2 is Group Actions
    public FormIsDirty = false;
    //public ClearSuggestedStatus = false;
    public ArrLinks: ILinkLocalType[] = [];

    public UploadStatus = "";
    public UploadProgress: number = 0;
    public ShowUploadProgress = false;
    public ShowFileUpload = false;
    public EditRequest = false;


    public ErrMessages = new ErrorMessage();

    public ArrAOGroups: number[] = [];
}

export default class MainSaveFormGroupActions extends React.Component<IMainSaveFormGroupActionsProps, IMainSaveFormGroupActionsState> {
    private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);
    private directorateService: services.DirectorateService = new services.DirectorateService(this.props.spfxContext, this.props.api);
    private iapUpdateService: services.IAPActionService = new services.IAPActionService(this.props.spfxContext, this.props.api);
    private iapStatusTypeService: services.IAPStatusTypeService = new services.IAPStatusTypeService(this.props.spfxContext, this.props.api);
    private iapAssignmentService: services.IAPAssignmentService = new services.IAPAssignmentService(this.props.spfxContext, this.props.api);
    private iapActionDirectorateService: services.IAPActionDirectorateService = new services.IAPActionDirectorateService(this.props.spfxContext, this.props.api);

    private UploadFolder_Files: string = "";
    private Folder_Help: string = "";


    private childEntities: types.IFormDataChildEntities[] = [
        { ObjectParentProperty: 'IAPAssignments', ParentIdProperty: 'IAPActionId', ChildIdProperty: 'UserId', ChildService: this.iapAssignmentService },
        { ObjectParentProperty: 'IAPActionDirectorates', ParentIdProperty: 'IAPActionId', ChildIdProperty: 'DirectorateId', ChildService: this.iapActionDirectorateService },
    ];

    constructor(props: IMainSaveFormGroupActionsProps, state: IMainSaveFormGroupActionsState) {
        super(props);
        this.UploadFolder_Files = getUploadFolder_IAPFiles(props.spfxContext);
        this.Folder_Help = getFolder_Help(props.spfxContext);

        this.state = new MainSaveFormGroupActionsState();
    }

    //#region Render

    public render(): React.ReactElement<IMainSaveFormGroupActionsProps> {
        //const errors = this.state.ValidationErrors;
        return (
            <Panel isOpen={this.props.showForm} headerText={"Group Actions"} type={PanelType.medium} onRenderNavigation={() => <FormCommandBar onSave={this.saveData} onCancel={this.props.onCancelled} />}>
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
                {this.renderLinks()}
                {this.renderCompletionDate()}
                {this.renderOriginalCompletionDate()}
                {this.renderMonthlyUpdateRequiredCheckbox()}
                {this.renderMonthlyUpdateRequiredIfNotCompletedCheckbox()}
                {this.renderIAPStatusTypes()}
                {/* {this.renderUsers()} */}
                {this.renderAOGroups()}
                {this.renderDirectorates()}
                {this.renderIsArchiveCheckbox()}
                {/* {this.renderIsLinkCheckbox()}
                {this.renderLinkBox()}
                {this.renderFileUpload()} */}



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
                errorMessage={this.state.ErrMessages.Title}
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
                errorMessage={this.state.ErrMessages.Details}
            />
        );
    }

    public renderLinks() {


        return (
            <div>

                <div style={{ display: 'flex' }}>
                    <div style={{ width: '50%', paddingRight: '5px' }}>
                        <span>Link Text</span>

                    </div>
                    <div style={{ width: '50%', paddingLeft: '5px' }}>
                        <span>Actual URL</span>

                    </div>

                </div>


                {this.state.ArrLinks.map((c, i) =>
                    this.renderLink(c, i)
                )}

                {<div className={styles.formField}>
                    <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={this.addBlankLinkItem} >Add fields For another link</span>
                </div>}

            </div>
        );
    }

    private renderLink(item: ILinkLocalType, index: number) {

        return (

            <div key={`div_renderLink_${index}`} style={{ display: 'flex', marginTop: '5px' }}>
                <div key={`divCol1_renderLink_${index}`} style={{ width: '50%', paddingRight: '5px' }}>
                    <CrTextField key={`div_TextField1_${index}`} value={item.Description}
                        onChanged={(v) => this.changeTextField_Link(v, index, "Description")} />

                </div>
                <div key={`divCol2_renderLink_${index}`} style={{ width: '50%', paddingLeft: '5px' }}>

                    <CrTextField key={`div_TextField2_${index}`} value={item.URL}
                        onChanged={(v) => this.changeTextField_Link(v, index, "URL")} />

                </div>

            </div>

        );
    }

    private renderCompletionDate() {

        return (
            <CrDatePicker
                label="To Be Completed By"
                className={styles.formField}
                value={this.state.FormData.CompletionDate}
                onSelectDate={(v) => this.changeDatePicker(v, "CompletionDate")}
                required={true}
                errorMessage={this.state.ErrMessages.CompletionDate}
            />
        );
    }

    private renderOriginalCompletionDate() {

        if (this.state.EditRequest === false) return null;

        return (
            <CrDatePicker
                label="Original Completion Date"
                className={styles.formField}
                value={this.state.FormData.OriginalCompletionDate}
                onSelectDate={(v) => this.changeDatePicker(v, "OriginalCompletionDate")}
                disabled={true}
            //errorMessage={this.state.ErrMessages.TargetDate}
            />
        );
    }

    private renderIAPStatusTypes() {
        const iapStatusTypes = this.state.LookupData.IAPStatusTypes;
        if (iapStatusTypes) {
            return (
                <CrDropdown
                    label="Status"
                    placeholder="Select an Option"
                    required={true}
                    className={styles.formField}
                    options={services.LookupService.entitiesToSelectableOptions(iapStatusTypes)}
                    selectedKey={this.state.FormData.IAPStatusTypeId}
                    onChanged={(v) => this.changeDropdown(v, "IAPStatusTypeId")}
                    errorMessage={this.state.ErrMessages.Status}
                    disabled={this.state.EditRequest}
                />
            );
        }
        else
            return null;
    }

    private renderDirectorates() {
        const directorates = this.state.LookupData.Directorates;
        const fd_dirs: IIAPActionDirectorate[] = this.state.FormData.IAPActionDirectorates;

        if (directorates) {
            return (
                <CrDropdown
                    label="Directorate(s)"
                    placeholder="Select"
                    multiSelect
                    className={styles.formField}
                    options={services.LookupService.entitiesToSelectableOptions(directorates)}


                    selectedKeys={fd_dirs && fd_dirs.map((x) => { return x.DirectorateId; })}
                    onChanged={(v) => this.changeMultiDropdown(v, 'IAPActionDirectorates', new IAPActionDirectorate(), 'DirectorateId')}

                //required={true}
                //errorMessage={this.state.ErrMessages.Directorate}
                />
            );
        }
        else
            return null;
    }

    // private renderUsers() {
    //     const users = this.state.LookupData.Users;
    //     const fd_users: IIAPAssignment[] = this.state.FormData['IAPAssignments'];
    //     //console.log('fd_users', fd_users);
    //     if (users) {
    //         return (
    //             <CrEntityPicker
    //                 label="Action Owners"
    //                 className={styles.formField}
    //                 displayForUser={true}
    //                 entities={this.state.LookupData.Users}
    //                 itemLimit={10}
    //                 selectedEntities={fd_users && fd_users.map((ass) => { return ass.UserId; })}
    //                 onChange={(v) => this.changeMultiUserPicker(v, 'IAPAssignments', new IAPAssignment(), 'UserId')}
    //             />
    //         );
    //     }
    //     else
    //         return null;
    // }

    public renderAOGroups() {

        const users = this.state.LookupData.Users;
        if (users) {

            return (
                <div>

                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '100%' }}>
                            <span>Action Owners per Group</span>

                        </div>
                    </div>


                    {this.state.ArrAOGroups.map((c, i) =>
                        this.renderAOGroup(c, i)
                    )}

                    {<div className={styles.formField}>
                        <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={this.addBlankItemInArrAOGroups} >Add another group</span>
                    </div>}

                </div>
            );

        }
        else
            return null;


    }

    private renderAOGroup(item: number, index: number) {

        console.log('renderAOGroup-item', item);
        let fd_users: IIAPAssignment[] = this.state.FormData['IAPAssignments'];
        if (fd_users) {
            fd_users = fd_users.filter(x => x.GroupNum === item);
        }

        return (

            <div key={`div_renderLink_${index}`} style={{ display: 'flex', marginTop: '5px' }}>
                <div key={`divCol1_renderLink_${index}`} style={{ width: '100%', }}>

                    <CrEntityPicker
                        //label="Action Owners"
                        //className={styles.formField}
                        displayForUser={true}
                        entities={this.state.LookupData.Users}
                        itemLimit={10}
                        selectedEntities={fd_users && fd_users.map((ass) => { return ass.UserId; })}
                        onChange={(v) => this.changeMultiUserPicker(v, item)}
                    />

                </div>

            </div>

        );
    }

    private renderMonthlyUpdateRequiredCheckbox() {

        return (
            <div>

                <CrCheckbox
                    className={`${styles.formField} ${styles.checkbox}`}
                    label="Monthly Updates Required"
                    checked={this.state.FormData.MonthlyUpdateRequired}
                    onChange={(ev, isChecked) => this.changeCheckbox_monthly(isChecked, "MonthlyUpdateRequired")}


                />

            </div>
        );

    }

    private renderMonthlyUpdateRequiredIfNotCompletedCheckbox() {

        return (
            <div>

                <CrCheckbox
                    className={`${styles.formField} ${styles.checkbox}`}
                    label="Monthly Updates Required if not completed by completion date"
                    checked={this.state.FormData.MonthlyUpdateRequiredIfNotCompleted}
                    onChange={(ev, isChecked) => this.changeCheckbox_monthly(isChecked, "MonthlyUpdateRequiredIfNotCompleted")}


                />

            </div>
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

    private renderIsLinkCheckbox() {

        if (this.state.EditRequest === true) return null;
        return (
            <div>

                <CrCheckbox
                    className={`${styles.formField} ${styles.checkbox}`}
                    label="Provide a link instead of uploading a file"
                    checked={this.state.FormData.IsLink}
                    onChange={(ev, isChecked) => this.changeCheckboxIsLink(isChecked, "IsLink")}


                />

            </div>
        );
    }

    private renderLinkBox() {
        if (this.state.ShowFileUpload == true)
            return null;

        if (this.state.FormData.IsLink === true) {

            return (
                <CrTextField
                    label="Link"
                    required={true}
                    className={styles.formField}
                    value={this.state.FormData.Attachment}
                    onChanged={(v) => this.changeTextField(v, "Attachment")}
                //errorMessage={this.state.ErrMessages.Attachment}
                />
            );
        }
        else
            return false;


    }

    private renderFileUpload() {
        if (this.state.ShowFileUpload == false)
            return null;

        return (
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <div>
                    <input type="file" name="fileUpload" id="fileUpload" accept="application/pdf"></input>
                    {/* {this.state.ErrMessages.FileUpload && <FieldErrorMessage value={this.state.ErrMessages.FileUpload} />} */}
                    <div style={{ paddingTop: '10px' }}>
                        Please upload all evidence files as PDFs. For guidance on savings documents as PDFs, please click <span onClick={this.viewHelpPDF} style={{ textDecoration: 'underline', cursor: 'pointer' }}>here</span>.
                    </div>
                </div>
                {this.state.ShowUploadProgress && <div style={{ minHeight: '80px', marginTop: '15px' }}>
                    <div>
                        {this.state.UploadStatus}
                    </div>
                    <div>
                        {this.state.UploadProgress} %
                    </div>
                </div>}

            </div>
        );
    }



    //#endregion Render

    //#region Class Methods

    private viewHelpPDF = () => {
        console.log('help pdf');
        const fileName: string = "HowToConvertDocumentsToPDF.pdf";

        const f = sp.web.getFolderByServerRelativeUrl(this.Folder_Help).files.getByName(fileName);

        f.get().then(t => {
            console.log(t);
            const serverRelativeUrl = t["ServerRelativeUrl"];
            console.log(serverRelativeUrl);

            const a = document.createElement('a');
            //document.body.appendChild(a);
            a.href = serverRelativeUrl;
            a.target = "_blank";
            a.download = fileName;

            document.body.appendChild(a);
            console.log(a);
            //a.click();
            //document.body.removeChild(a);


            setTimeout(() => {
                window.URL.revokeObjectURL(serverRelativeUrl);
                window.open(serverRelativeUrl, '_blank');
                document.body.removeChild(a);
            }, 1);


        });

    }

    //#endregion Class Methods

    //#region Data Load/Save

    private loadData = (): Promise<void> => {
        console.log('loadData - Id: ', this.props.entityId);
        let x = this.iapUpdateService.readWithExpandAssignments(this.props.entityId).then((e: IIAPAction): void => {

            console.log('data ', e);

            let arrLinks: ILinkLocalType[] = [];

            //unpack links from single value
            if (e.ActionLinks !== null && e.ActionLinks !== '') {
                let arr1 = e.ActionLinks.split('>');

                //console.log('arr1', arr1);

                for (let i = 0; i < arr1.length; i++) {

                    let itemStr: string = arr1[i];
                    //console.log('arr1 Loop itemStr', itemStr);
                    if (itemStr.trim() === '') {
                        continue;
                    }
                    //console.log('after continue');
                    let arr2 = itemStr.split('<');
                    //console.log('after arr2 Split', arr2);
                    let item: ILinkLocalType = { Description: '', URL: '' };
                    item.Description = arr2[0];
                    item.URL = arr2[1];

                    //console.log('item filled with data', item);

                    arrLinks.push(item);

                    //console.log('item pushed to arrLinks', arrLinks);

                }
            }



            this.iapAssignmentService.readAllAssignmentsForParentAction(e.ID).then((ass: IAPAssignment[]): void => {
                console.log('ass', ass);

                const newFD = this.cloneObject(e, 'IAPAssignments', ass);
                console.log('newFD', newFD);

                //make unique group arr
                let groupNumArr: number[] = ass.map(a => Number(a['GroupNum']));
                console.log('groupNumArr', groupNumArr);


                const uniqueGroupNumArr = groupNumArr.filter((item, pos) => {
                    //console.log('groupNumArr.indexOf(item)', groupNumArr.indexOf(item));
                    return groupNumArr.indexOf(item) == pos;
                });

                console.log('uniqueGroupNumArr', uniqueGroupNumArr);


                this.setState({
                    ArrAOGroups: uniqueGroupNumArr,
                }, () => {
                    console.log('after setting ArrAOGroups');
                    this.setState({
                        FormData: newFD,
                        FormDataBeforeChanges: newFD,
                        ArrLinks: arrLinks,
                    }, this.addBlankItems_Links_And_Groups);
                });


                //this.setState({ FormData: this.cloneObject(this.state.FormData, 'IAPAssignments', new_fd_users), FormIsDirty: true });

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
        proms.push(this.loadIAPStatusTypes());
        proms.push(this.loadDirectorates());
        proms.push(this.loadUsers());
        return Promise.all(proms);
    }

    private loadDirectorates = (): void => {
        this.directorateService.readAll().then((data: IDirectorate[]): IDirectorate[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Directorates", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Directorates lookup data`, err.message); });
    }

    private loadIAPStatusTypes = (): void => {
        this.iapStatusTypeService.readAll().then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "IAPStatusTypes", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading IAPStatusTypes lookup data`, err.message); });
    }

    private loadUsers = (): void => {
        this.userService.readAll().then((data: IUser[]): IUser[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Users", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Users lookup data`, err.message); });
    }




    private onAfterLoad = (entity: types.IEntity): void => {

        //console.log('after load', this.state.LookupData.Users);
        if (this.props.entityId === null) {
            this.addBlankItems_Links_And_Groups();
        }
        

    }


    private saveData = (): void => {


        this.saveActionLinksToSingleValue();

    }

    private saveActionLinksToSingleValue = (): void => {

        let singleStr: string = "";
        const arrLinks = this.state.ArrLinks;

        for (let i = 0; i < arrLinks.length; i++) {
            let item: ILinkLocalType = arrLinks[i];
            if (item.Description.trim() === '' && item.URL.trim() === '') {
                //ignore this item
            }
            else {
                if (item.URL.trim() !== '') {
                    let description: string = item.Description !== '' ? item.Description : item.URL;
                    //use '<' for separator between description and url, And use '>' for next item separator
                    singleStr += `${description}<${item.URL.trim()}>`;
                }
            }
        }

        //set single value in state
        const fd = { ...this.state.FormData };
        fd.ActionLinks = singleStr;

        this.setState({ FormData: fd }, this.saveDataFinal);

    }


    private saveDataFinal = (): void => {

        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);

            let f: IIAPAction = { ...this.state.FormData };

            //remove all the child and parent entities before sending post/patch
            //delete f['IAPAssignments']; //chile entity
            //delete f.IAPActionDirectorates;

            if (f.ID === 0) {


                this.iapUpdateService.create(f).then(this.saveChildEntitiesAfterCreate).then(this.props.onSaved, (err) => {
                    if (this.props.onError) this.props.onError(`Error creating item`, err.message);
                });

            }
            else {

                //console.log('in update');

                this.iapUpdateService.updatePut(f.ID, f).then(this.props.onSaved, (err) => {
                    if (this.props.onError) this.props.onError(`Error updating item`, err.message);
                });

                // this.iapUpdateService.update(f.ID, f).then(this.saveChildEntitiesAfterUpdate).then(this.onAfterUpdate).then(this.props.onSaved, (err) => {
                //     if (this.props.onError) this.props.onError(`Error updating item`, err.message);
                // });
            }
        }

    }

    private saveChildEntitiesAfterCreate = (parentEntity: IIAPAction): Promise<any> => {
        return Promise.resolve();

        // let promises = [];
        // if (this.childEntities) {
        //     this.childEntities.forEach((ce) => {
        //         this.state.FormData[ce.ObjectParentProperty].forEach((c) => {
        //             c[ce.ParentIdProperty] = parentEntity.ID;
        //             if (c.ID === 0)
        //                 promises.push(ce.ChildService.create(c));
        //         });
        //     });
        //     return Promise.all(promises).then(() => parentEntity);
        // }
    }
    private saveChildEntitiesAfterUpdate = (): Promise<any> => {

        return Promise.resolve();

        // let promises = [];
        // if (this.childEntities) {
        //     this.childEntities.forEach((ce) => {
        //         this.state.FormData[ce.ObjectParentProperty].forEach((c) => {
        //             if (c.ID === 0) {
        //                 c[ce.ParentIdProperty] = this.state.FormData.ID;
        //                 promises.push(ce.ChildService.create(c));
        //             }
        //             else {
        //                 //no need to update
        //             }
        //         });

        //         this.state.FormDataBeforeChanges[ce.ObjectParentProperty].forEach((c) => {
        //             if (this.state.FormData[ce.ObjectParentProperty].map(i => i[ce.ChildIdProperty]).indexOf(c[ce.ChildIdProperty]) === -1) {
        //                 promises.push(ce.ChildService.delete(c.ID));
        //             }

        //         });
        //     });
        //     return Promise.all(promises).then(() => this.state.FormData);
        // }
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

        if ((this.state.FormData.Details === null) || (this.state.FormData.Details === '')) {
            errMsg.Details = "Details required";
            returnVal = false;
        }
        else {
            errMsg.Details = null;
        }

        if ((this.state.FormData.CompletionDate === null)) {
            errMsg.CompletionDate = "Date required";
            returnVal = false;
        }
        else {
            errMsg.CompletionDate = null;
        }

        if ((this.state.FormData.IAPStatusTypeId === null)) {
            errMsg.Status = "Status required";
            returnVal = false;
        }
        else {
            errMsg.Status = null;
        }





        //at the end set state
        this.setState({ ErrMessages: errMsg });

        return returnVal;


    }

    private addBlankItems_Links_And_Groups =  () => {
        this.addBlankLinkItem();
        this.addBlankItemInArrAOGroups();
    }
    private addBlankLinkItem = () => {
        console.log('in addBlankLinkItem');
        const arrCopy = [...this.state.ArrLinks, { Description: '', URL: '' }];
        this.setState({ ArrLinks: arrCopy });
        //const item: ILinkLocalType = { Description: 'des', URL: 'url' };
        //arrCopy.push()
    }
    private addBlankItemInArrAOGroups = () => {
        console.log('in addBlankItemInArrAOGroups');
        let newItem:number = 0;
        if(this.state.ArrAOGroups.length > 0){
            const lastItem:number = this.state.ArrAOGroups[this.state.ArrAOGroups.length-1];
            newItem = lastItem+1;
        }
        else{
            newItem = 1;
        }

        console.log('newItem', newItem);

        //const newItem: number = this.state.ArrAOGroups.length + 1;
        const arrCopy = [...this.state.ArrAOGroups, newItem];
        this.setState({ ArrAOGroups: arrCopy });

    }

    private cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }

    private changeTextField = (value: string, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true });
    }
    private changeTextField_Link = (value: string, index: number, type: string): void => {
        const arrCopy = [...this.state.ArrLinks];
        const item: ILinkLocalType = arrCopy[index];
        if (type === "Description") {
            item.Description = value;
        }
        else {
            item.URL = value;
        }

        this.setState({ ArrLinks: arrCopy });
    }
    protected changeDatePicker = (date: Date, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, date), FormIsDirty: true });
    }

    private changeDropdown = (option: IDropdownOption, f: string, index?: number): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, option.key), FormIsDirty: true });
    }
    protected changeCheckboxIsLink = (value: boolean, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), ShowFileUpload: !value, FormIsDirty: true });
    }
    private changeCheckbox_monthly = (value: boolean, f: string): void => {
        if (f === "MonthlyUpdateRequired") {
            if (value === true) {
                let xx = { ...this.state.FormData };
                xx.MonthlyUpdateRequired = true;
                xx.MonthlyUpdateRequiredIfNotCompleted = false;
                this.setState({ FormData: xx, FormIsDirty: true });

            }
            else {
                this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true });
            }
        }
        else {
            //f="MonthlyUpdateRequiredIfNotCompleted"

            if (value === true) {
                let xx = { ...this.state.FormData };
                xx.MonthlyUpdateRequired = false;
                xx.MonthlyUpdateRequiredIfNotCompleted = true;
                this.setState({ FormData: xx, FormIsDirty: true });
            }
            else {
                this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true });
            }
        }

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


    private changeMultiUserPicker = (values: number[], groupNum: number): void => {

        console.log('groupNum', groupNum);
        console.log('value', values);
        //to avoid same user to add multiple times
        const valuesUnique = values.filter((item, pos) => {
            console.log('value.indexOf(item)', values.indexOf(item));
            return values.indexOf(item) == pos;
        });
        console.log('valuesUnique', valuesUnique);
        values = valuesUnique;



        const loadedUsers = this.cloneObject(this.state.FormDataBeforeChanges);
        let newUsers = [];
        values.forEach((userId) => {

            console.log('test1', loadedUsers['IAPAssignments']);
            //console.log('test2', loadedUsers['IAPAssignments'].map(ass => ass['UserId']) );
            //console.log('test3', loadedUsers['IAPAssignments'].map(ass => ass['UserId']).indexOf(userId) );

            let existingUser = loadedUsers['IAPAssignments'] ? loadedUsers['IAPAssignments'].map(user => user['UserId']).indexOf(userId) : -1;
            console.log('existingUser', existingUser);
            if (existingUser !== -1) {
                //existing user which is saved in db
                console.log('test4', loadedUsers['IAPAssignments'][existingUser]);
                newUsers.push(loadedUsers['IAPAssignments'][existingUser]);
            }
            else {
                //-1
                const newUser = new IAPAssignment();
                //let newUser = { ...newEntity };
                newUser['UserId'] = userId;
                newUser['GroupNum'] = groupNum;
                newUsers.push(newUser);
            }
        });
        const fd_users: IAPAssignment[] = this.state.FormData['IAPAssignments'];
        console.log('fd_users', fd_users);
        if (fd_users) {
            const fd_users_not_g: IAPAssignment[] = fd_users.filter(x => x.GroupNum !== groupNum);
            console.log('fd_users_not_g', fd_users_not_g);
            let new_fd_users = [...fd_users_not_g, ...newUsers];
            console.log('new_fd_users', new_fd_users);

            this.setState({ FormData: this.cloneObject(this.state.FormData, 'IAPAssignments', new_fd_users), FormIsDirty: true });
        }
        else {

            console.log('newUsers', newUsers);
            this.setState({ FormData: this.cloneObject(this.state.FormData, 'IAPAssignments', newUsers), FormIsDirty: true });
        }





    }

    //#endregion Form Operations

}