import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { IGIAAUpdate, GIAAUpdate, IEntity, Entity } from '../../types';
import { CrTextField } from '../cr/CrTextField';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { CrCheckbox } from '../cr/CrCheckbox';
import { FormButtons } from '../cr/FormButtons';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../cr/FormCommandBar';
import { CrDatePicker } from '../cr/CrDatePicker';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import { FieldErrorMessage } from '../cr/FieldDecorators';
import { GIAAUpdateTypes } from '../../types/AppGlobals';
import styles from '../../styles/cr.module.scss';
import GiaaUpdates from '../../webparts/giaaUpdates/components/GiaaUpdates';
import { sp, ChunkedFileUploadProgressData } from '@pnp/sp';
import { getUploadFolder_GIAAUpdateEvidence, getFolder_Help } from '../../types/AppGlobals';
import { changeDatePicker } from '../../types/AppGlobals';


export interface IUpdatesSaveFormProps extends types.IBaseComponentProps {

    giaaRecommendationId: number | string;
    updateType: string;
    defaultActionStatusTypeId: number;
    defaultRevDate:Date;
    targetDate:Date;
    entityId: number;
    showForm: boolean;
    onSaved?: (defaultGIAAActionStatusTypeId:number, defaultRevisedDate:Date) => void;
    onCancelled?: () => void;
}

export interface ILookupData {
    GIAAActionStatusTypes: IEntity[];
}
export class LookupData implements ILookupData {
    public GIAAActionStatusTypes = null;
}
export interface IErrorMessage {

    Details: string;
    RevisedDate: string;
    ActionStatus: string;
    FileUpload: string;
    RequestDateChangeTo:string;


}
export class ErrorMessage implements IErrorMessage {

    public Details = null;
    public RevisedDate = null;
    public ActionStatus = null;
    public FileUpload = null;
    public RequestDateChangeTo = null;
}
export interface IUpdatesSaveFormState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: IGIAAUpdate;
    FormDataBeforeChanges: IGIAAUpdate;
    FormIsDirty: boolean;
    ErrMessages: IErrorMessage;

    UploadStatus: string;
    UploadProgress: number;
    ShowUploadProgress: boolean;
    //ShowFileUpload: boolean;
}
export class UpdatesSaveFormState implements IUpdatesSaveFormState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData;
    public FormDataBeforeChanges;
    public FormIsDirty = false;
    public ErrMessages = new ErrorMessage();

    public UploadStatus = "";
    public UploadProgress: number = 0;
    public ShowUploadProgress = false;
    //public ShowFileUpload = false;

    constructor(giaaRecommendationId: number, updateType: string) {
        this.FormData = new GIAAUpdate(giaaRecommendationId, updateType);
        this.FormDataBeforeChanges = new GIAAUpdate(giaaRecommendationId, updateType);

    }
}

export default class UpdatesSaveForm extends React.Component<IUpdatesSaveFormProps, IUpdatesSaveFormState> {

    private giaaActionStatusTypeService: services.GIAAActionStatusTypeService = new services.GIAAActionStatusTypeService(this.props.spfxContext, this.props.api);
    private giaaUpdateService: services.GIAAUpdateService = new services.GIAAUpdateService(this.props.spfxContext, this.props.api);
    

    private Folder_Help: string = "";
    private UploadFolder_Evidence: string = "";

    constructor(props: IUpdatesSaveFormProps, state: IUpdatesSaveFormState) {
        super(props);

        this.UploadFolder_Evidence = getUploadFolder_GIAAUpdateEvidence(props.spfxContext);
        this.Folder_Help = getFolder_Help(props.spfxContext);

        this.state = new UpdatesSaveFormState(Number(props.giaaRecommendationId), props.updateType);
    }

    public render(): React.ReactElement<IUpdatesSaveFormProps> {
        //const errors = this.state.ValidationErrors;
        return (
            <Panel isOpen={this.props.showForm} headerText={this.getHeaderText()} type={PanelType.medium} onRenderNavigation={() => <FormCommandBar onSave={this.saveData} onCancel={this.props.onCancelled} />}>
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
                {this.renderReqCloseCheckBox()}
                {this.renderReqDateChangeCheckBox()}
                {this.renderReqDateChangeTo()}
                {this.renderMarkAllReqCloseCheckBox()}
                {this.renderGIAAActionStatusTypes()}
                {this.renderRevisedDate()}
                {this.renderUpdateDetails()}
                {this.renderLinkRiskManagement()}
                {this.renderEvLabel()}
                {this.renderEvCheckBox()}
                {this.renderEvLinkBox()}
                {this.renderFileUpload()}

            </React.Fragment>
        );
    }

    private renderReqCloseCheckBox() {
        if (this.props.updateType !== GIAAUpdateTypes.ActionUpdate) return null;

        if(this.state.FormData.RequestDateChange === true) return null;

        return (
            <React.Fragment>

                <CrCheckbox
                    className={`${styles.formField} ${styles.checkbox}`}
                    label="Please check this box if you wish to ask internal audit to close the action. Please include your evidence below as indicated by the mandatory fields."
                    checked={this.state.FormData.RequestClose}
                    onChange={(ev, isChecked) => this.changeCheckbox_Req(isChecked, "RequestClose")}


                />



            </React.Fragment>
        );

    }

    private renderReqDateChangeCheckBox() {
        if (this.props.updateType !== GIAAUpdateTypes.ActionUpdate) return null;

        if(this.state.FormData.RequestClose === true) return null;

        return (
            <React.Fragment>

                <CrCheckbox
                    className={`${styles.formField} ${styles.checkbox}`}
                    label="Please check this box if you wish to ask internal audit to change the implementation date for the action. Please select a revised date and provide a reason below."
                    checked={this.state.FormData.RequestDateChange}
                    onChange={(ev, isChecked) => this.changeCheckbox_Req(isChecked, "RequestDateChange")}


                />



            </React.Fragment>
        );

    }

    private renderReqDateChangeTo() {
        if (this.props.updateType !== GIAAUpdateTypes.ActionUpdate) return null;

        if(this.state.FormData.RequestClose === true) return null;

        let required:boolean = false;
        if(this.state.FormData.RequestDateChange === true){
            required = true;
            console.log('RequestDateChangeTo set to required');
        }

        return (
            <CrDatePicker
                //label="Revised Date"
                className={styles.formField}
                required={required}
                value={this.state.FormData.RequestDateChangeTo}
                onSelectDate={(v) => changeDatePicker(this, v, "RequestDateChangeTo")}
                errorMessage={this.state.ErrMessages.RequestDateChangeTo}
            />
        );
    }

    
    private renderMarkAllReqCloseCheckBox() {
        if (this.props.updateType !== GIAAUpdateTypes.Status_DateUpdate) return null;

        return (
            <React.Fragment>

                <CrCheckbox
                    className={`${styles.formField} ${styles.checkbox}`}
                    label="Mark any outstanding status close or revise implementation date requests from action owners"
                    checked={this.state.FormData.MarkAllReqClosed}
                    onChange={(ev, isChecked) => this.changeCheckbox(isChecked, "MarkAllReqClosed")}


                />



            </React.Fragment>
        );

    }
    private renderGIAAActionStatusTypes() {
        if (this.props.updateType !== GIAAUpdateTypes.Status_DateUpdate) return null;

        const giaaActionStatusTypes = this.state.LookupData.GIAAActionStatusTypes;
        if (giaaActionStatusTypes) {
            return (
                <CrDropdown
                    label="Revised Recommendation Status"
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

    private renderRevisedDate() {
        if (this.props.updateType !== GIAAUpdateTypes.Status_DateUpdate) return null;

        return (
            <CrDatePicker
                label="Revised Implementation Date"
                className={styles.formField}
                //required={true}
                value={this.state.FormData.RevisedDate}
                onSelectDate={(v) => changeDatePicker(this, v, "RevisedDate")}
                errorMessage={this.state.ErrMessages.RevisedDate}
            />
        );
    }

    private renderUpdateDetails() {

        let lbl: string = "";
        if (this.props.updateType === GIAAUpdateTypes.ActionUpdate)
            lbl = "Action Update Details";
        else if (this.props.updateType === GIAAUpdateTypes.Status_DateUpdate)
            lbl = "Reason for Revision";
        else if (this.props.updateType === GIAAUpdateTypes.GIAAComment)
            lbl = "GIAA Comment";
        else
            lbl = "Add Comment or Feedback";

        return (
            <CrTextField
                label={lbl}
                className={styles.formField}
                value={this.state.FormData.UpdateDetails}
                onChanged={(v) => this.changeTextField(v, "UpdateDetails")}
                multiline={true}
                required={true}
                errorMessage={this.state.ErrMessages.Details}
                rows={3}
            />
        );
    }


    private renderLinkRiskManagement() {

        if (this.props.updateType !== GIAAUpdateTypes.ActionUpdate) return null;
        return (
            <CrTextField
                label="Link to Risk Management"
                className={styles.formField}
                value={this.state.FormData.Link}
                onChanged={(v) => this.changeTextField(v, "Link")}
            />
        );
    }

    private renderEvLabel() {
        let lbl: string = "";
        if (this.props.updateType === GIAAUpdateTypes.ActionUpdate){
            if(this.state.FormData.RequestClose === true){
                lbl = "Upload Evidence";
            }
            else{
                lbl = "Optional link or evidence upload";
            }
            
        }
            
        else if (this.props.updateType === GIAAUpdateTypes.Status_DateUpdate)
            lbl = "Provide supporting evidence if necessary";
        else if (this.props.updateType === GIAAUpdateTypes.GIAAComment)
            lbl = "Optional link or supporting pdf upload";
        else
            lbl = "Optional link or supporting pdf upload";

        return (
            <div>{lbl}</div>
        );
    }
    private renderEvCheckBox() {
        if (this.props.updateType === GIAAUpdateTypes.Status_DateUpdate) return null;

        if(this.state.FormData.RequestClose === true) return null;

        return (
            <React.Fragment>

                <CrCheckbox
                    className={`${styles.formField} ${styles.checkbox}`}
                    label="Provide a link instead of uploading a file"
                    checked={this.state.FormData.EvIsLink}
                    onChange={(ev, isChecked) => this.changeCheckbox(isChecked, "EvIsLink")}


                />



            </React.Fragment>
        );

    }

    private renderEvLinkBox() {
        // if (this.state.ShowFileUpload == true)
        //     return null;

        if (this.state.FormData.EvIsLink === true) {

            return (
                <CrTextField
                    label="Link"
                    //required={true}
                    className={styles.formField}
                    value={this.state.FormData.EvFileName}
                    onChanged={(v) => this.changeTextField(v, "EvFileName")}
                //errorMessage={this.state.ErrMessages.Title}
                />
            );
        }
        else
            return false;


    }

    private renderFileUpload() {
        // if (this.state.ShowFileUpload == false)
        //     return null;

        if (this.state.FormData.EvIsLink === true)
            return null;

        return (
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <div>
                    <input type="file" name="fileUpload" id="fileUpload" accept="application/pdf"></input>
                    {this.state.ErrMessages.FileUpload && <FieldErrorMessage value={this.state.ErrMessages.FileUpload} />}
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

    private getHeaderText = (): string => {
        if (this.props.updateType === GIAAUpdateTypes.ActionUpdate)
            return "Add new action update";
        else if (this.props.updateType === GIAAUpdateTypes.Status_DateUpdate)
            return "Status/Implementation Date Update";
        else if (this.props.updateType === GIAAUpdateTypes.GIAAComment)
            return "Add GIAA Comments";
        else
            return "Add Comment or Feedback";

    }






    //#region Data Save


    private saveData = (): void => {


        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);

            let f: IGIAAUpdate = { ...this.state.FormData };

            //remove all the child and parent entities before sending post/patch
            //delete f.User; //parent entity

            if (f.ID === 0) {
                let myfile = (document.querySelector("#fileUpload") as HTMLInputElement);
                //firts create record in the db, so we can get the ID, then use the ID to append in the file name to make file name unique
                this.giaaUpdateService.create(f).then(x => {
                    //console.log(x);
                    if ((f.EvIsLink === false) && myfile.files[0]) {
                        this.uploadFile(x.ID, x.UpdatedById);
                    }
                    else {
                        //its a link instead of the file, so close the form
                        console.log('evidence saved as link');
                        this.props.onSaved(f.GIAAActionStatusTypeId, f.RevisedDate);
                    }

                });

            }
            else {

                //console.log('in update');

                this.giaaUpdateService.updatePut(f.ID, f).then(() =>this.props.onSaved(f.GIAAActionStatusTypeId, f.RevisedDate), (err) => {
                    if (this.props.onError) this.props.onError(`Error updating item`, err.message);
                });
            }
        }
    }

    private uploadFile = (updateId: number, uploadedByUserId: number) => {
        this.setState({
            UploadStatus: "Uploading file ...",
            ShowUploadProgress: true
        });

        let myfile = (document.querySelector("#fileUpload") as HTMLInputElement).files[0];
        let fileName: string = `${updateId}_${myfile.name}`;
        //console.log(fileName);
        //const chunkSize:number = 10485760; //10mb
        const chunkSize: number = 1048576; //1mb
        if (myfile.size <= chunkSize) {
            sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Evidence).files.add(fileName, myfile, true).then(f => {
                console.log("File Uploaded..");
                this.setState({
                    UploadStatus: "Almost done ...",
                    UploadProgress: 99
                });
                f.file.getItem().then(item => {
                    item.update({
                        Title: fileName
                    }).then((myupdate) => {
                        console.log(myupdate);
                        this.setState({
                            UploadStatus: "File Uploaded.",
                            UploadProgress: 100
                        });
                        //console.log("Metadata Updated");
                        this.afterFileUpload(updateId, fileName, uploadedByUserId);
                    });
                });
            });
        }
        else {
            sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Evidence)
                .files.addChunked(fileName, myfile, this.progressUpload, true, chunkSize)
                .then(({ file }) => file.getItem()).then((item: any) => {
                    console.log("File Uploaded");
                    return item.update({
                        Title: fileName
                    }).then((myupdate) => {
                        console.log(myupdate);
                        this.setState({
                            UploadStatus: "File Uploaded.",
                            UploadProgress: 100
                        });
                        //console.log("Metadata Updated");
                        this.afterFileUpload(updateId, fileName, uploadedByUserId);
                    });
                }).catch(console.log);
        }
    }

    private progressUpload = (d: ChunkedFileUploadProgressData) => {
        console.log('progress', d.blockNumber, d.currentPointer, d.stage, d.totalBlocks);
        const progress: number = Number(((d.blockNumber / d.totalBlocks) * 100).toFixed());

        if (progress >= 99) {
            this.setState({
                UploadProgress: 99,
                UploadStatus: 'Almost done ...'
            });
        }
        else {

            this.setState({
                UploadProgress: progress
            });
        }



    }
    private afterFileUpload = (updateId: number, fileName: string, uploadedByUserId: number): void => {
        //console.log('after uploading file ', fileName, miscFileID);

        const fdata = { ...this.state.FormData, "EvFileName": fileName, "ID": updateId, "UpdatedById": uploadedByUserId };
        this.setState({
            FormData: fdata
        }, this.saveData);

    }

    //#endregion Data Save

    //#region Data Load

    public componentDidMount(): void {
        this.setState({ Loading: true });
        let loadingPromises = [this.loadLookups()];
        // if (this.props.entityId) {
        //     loadingPromises.push(this.loadData());
        // }
        Promise.all(loadingPromises).then(p => this.onAfterLoad(p[1])).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));

    }

    private loadLookups(): Promise<any> {

        let proms: any[] = [];
        proms.push(this.loadGIAAActionStatusTypes());
        return Promise.all(proms);
    }

    private loadGIAAActionStatusTypes = (): void => {
        this.giaaActionStatusTypeService.readAll().then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "GIAAActionStatusTypes", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading GIAAActionStatusTypes lookup data`, err.message); });
    }

    private onAfterLoad = (entity: types.IEntity): void => {

        //console.log('after load', this.state.LookupData.Users);
        if(this.props.updateType === GIAAUpdateTypes.ActionUpdate){
            //console.log('onAfterLoad', this.props.defaultActionStatusTypeId);
            //this.setState({ FormData: this.cloneObject(this.state.FormData, "GIAAActionStatusTypeId", this.props.defaultActionStatusTypeId), FormIsDirty: true });

            //console.log('onAfterLoad - defaultRevDate', this.props.defaultRevDate);
            //this.setState({ FormData: this.cloneObject(this.state.FormData, "RequestDateChangeTo", this.props.defaultRevDate), FormIsDirty: true });
        }
        else if(this.props.updateType === GIAAUpdateTypes.Status_DateUpdate){
            console.log('onAfterLoad - defaultActionStatusTypeId', this.props.defaultActionStatusTypeId);
            console.log('onAfterLoad - defaultRevDate', this.props.defaultRevDate);

            let fd: IGIAAUpdate = this.cloneObject(this.state.FormData, "RevisedDate", this.props.defaultRevDate);
            fd = this.cloneObject(fd, "GIAAActionStatusTypeId", this.props.defaultActionStatusTypeId);

            //check if targetDate is greaterthan today date and status is open then set status to overdue
            //console.log('props.targetDate', this.props.targetDate);
            //console.log('new Date', new Date());
            if(this.props.targetDate < new Date() && fd.GIAAActionStatusTypeId === 1){
                console.log('target date is greater than todays date and status is open, so set status to overdue');
                fd = this.cloneObject(fd, "GIAAActionStatusTypeId", 3); //3 is overdue
            }
            

            this.setState({ FormData: fd, FormIsDirty: true });

            
        }

    }

    //#endregion Data Load

    //#region Form Operations


    private clearValidations =(): void => {
        let errMsg: IErrorMessage = { ...this.state.ErrMessages };
        errMsg.ActionStatus = null;
        errMsg.Details = null;
        errMsg.FileUpload = null;
        errMsg.RevisedDate = null;
        errMsg.RequestDateChangeTo = null;
        this.setState({ ErrMessages: errMsg });
    }

    private validateEntity = (): boolean => {
        let returnVal: boolean = true;
        let errMsg: IErrorMessage = { ...this.state.ErrMessages };

        if ((this.state.FormData.UpdateDetails === null) || (this.state.FormData.UpdateDetails === '')) {
            errMsg.Details = "Details required";
            returnVal = false;
        }
        else {
            errMsg.Details = null;
        }

        if(this.props.updateType === GIAAUpdateTypes.Status_DateUpdate && this.state.FormData.GIAAActionStatusTypeId === null){
            errMsg.ActionStatus = "Revised Recommendation Status required";
            returnVal = false;
        }
        else{
            errMsg.ActionStatus = null;
        }

        if(this.state.FormData.RequestDateChange === true && this.state.FormData.RequestDateChangeTo === null){
            errMsg.RequestDateChangeTo = "Date required";
            returnVal = false;
        }
        else{
            errMsg.RequestDateChangeTo = null;
        }


        // if(this.props.updateType === GIAAUpdateTypes.RevisedDate && this.state.FormData.RevisedDate === null){
        //     errMsg.RevisedDate = "Revised Date required";
        //     returnVal = false;
        // }
        // else{
        //     errMsg.RevisedDate = null;
        // }



        if(this.props.updateType === GIAAUpdateTypes.ActionUpdate && this.state.FormData.RequestClose === true){

            const file = (document.querySelector("#fileUpload") as HTMLInputElement).files[0];

            if(file == null){
                errMsg.FileUpload = "PDF file required";
                returnVal = false;                    
            }
            else{
                const fileName = file.name;
                console.log("fileName", fileName);
                const ext = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
                console.log("File Ext", ext);

                if(ext === "pdf"){
                    errMsg.FileUpload = null;
                }
                else{
                    errMsg.FileUpload = "PDF file required";
                    returnVal = false;                    
                }

                    
            }

        }
        else {
            errMsg.FileUpload = null;
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
    //     this.setState({ FormData: this.cloneObject(this.state.FormData, f, date), FormIsDirty: true });
    // }
    protected changeCheckbox = (value: boolean, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), /*ShowFileUpload: !value , FormIsDirty: true*/ });
    }
    private changeCheckbox_Req = (value: boolean, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true }, this.clearValidations);
    }


    //#endregion Form Operations

}