import * as React from 'react';
import * as types from '../../../types';
import * as services from '../../../services';
import { IGoElementEvidence, GoElementEvidence } from '../../../types';
import { CrTextField } from '../../cr/CrTextField';
import { CrCheckbox } from '../../cr/CrCheckbox';
import { FieldErrorMessage } from '../../cr/FieldDecorators';
import { FormButtons } from '../../cr/FormButtons';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../../cr/FormCommandBar';
import { sp, ChunkedFileUploadProgressData } from '@pnp/sp';
import { UploadFolder_Evidence } from '../../../types/AppGlobals';
import styles from '../../../styles/cr.module.scss';

export interface IEvidenceSaveFormProps extends types.IBaseComponentProps {
    goElementId:number;
    goElementEvidenceId: number;
    showForm: boolean;
    onSaved?: () => void;
    onCancelled?: () => void;
}

export interface IErrorMessage{
    Details:string;
    Title:string;
    //Controls:string;
    //Team:string;

    FileUpload:string;
}
export class ErrorMessage implements IErrorMessage{
    public Details = null;
    public Title = null;
    public FileUpload = null;
}

export interface IEvidenceSaveFormState {
    Loading: boolean;
    FormData: IGoElementEvidence;
    FormDataBeforeChanges: IGoElementEvidence;
    FormIsDirty: boolean;
    UploadStatus:string;
    UploadProgress:number;
    ShowUploadProgress:boolean;
    ShowFileUpload:boolean;
    EditRequest:boolean;
    ErrMessages: IErrorMessage;
}

export class EvidenceSaveFormState implements IEvidenceSaveFormState {
    public Loading = false;
    //public LookupData = new PolicyLookupData();
    public FormData;
    public FormDataBeforeChanges;// = new GoElementEvidence();
    public FormIsDirty = false;
    public UploadStatus = "";
    public UploadProgress:number = 0;
    public ShowUploadProgress = false;
    public ShowFileUpload = false;
    public EditRequest = false;
    public ErrMessages = new ErrorMessage();

    constructor(goElementId: number) {
        this.FormData = new GoElementEvidence(goElementId);
        this.FormDataBeforeChanges = new GoElementEvidence(goElementId);
    }

}

export default class EvidenceSaveForm extends React.Component<IEvidenceSaveFormProps, IEvidenceSaveFormState> {

    private goElementEvidenceService: services.GoElementEvidenceService = new services.GoElementEvidenceService(this.props.spfxContext, this.props.api);

    constructor(props: IEvidenceSaveFormProps, state: IEvidenceSaveFormState) {
        super(props);
        //console.log('props goElementId ', props.goElementId);
        //console.log('props goElementEvidenceId ', props.goElementEvidenceId);
        this.state = new EvidenceSaveFormState(props.goElementId);
    }

    //#region Render


    public render(): React.ReactElement<IEvidenceSaveFormProps> {
        //const errors = this.state.ValidationErrors;
        return (
            <Panel isOpen={this.props.showForm} headerText={"Evidence"} type={PanelType.medium} onRenderNavigation={() => <FormCommandBar onSave={this.saveEvidence} onCancel={this.props.onCancelled} />}>
                <div className={styles.cr}>
                    {this.renderFormFields()}
                    <FormButtons
                        primaryText={"Save"}
                        onPrimaryClick={() => this.saveEvidence()}
                        onSecondaryClick={this.props.onCancelled}
                    />
                </div>
            </Panel>
        );
    }

    public renderFormFields() {
        return (
            <React.Fragment>
                {this.renderDetails()}                
                {this.renderControls()}
                {this.renderTeam()}
                {this.renderInfoHolder()}
                {this.renderAdditionalNotes()}
                {this.renderIsLinkCheckbox()}
                {this.renderLinkBox()}

                {this.renderFileUpload()}

            </React.Fragment>
        );
    }

    private renderDetails() {
        return (
            <CrTextField
                label="Details"
                required={true}
                className={styles.formField}
                value={this.state.FormData.Details}
                onChanged={(v) => this.changeTextField(v, "Details")}
                multiline={true}
                rows={3}
                errorMessage={this.state.ErrMessages.Details} 
            />
        );
    }
    private renderControls() {
        return (
            <CrTextField
                label="Controls"
                //required={true}
                className={styles.formField}
                value={this.state.FormData.Controls}
                onChanged={(v) => this.changeTextField(v, "Controls")}
            />
        );
    }

    private renderTeam() {
        return (
            <CrTextField
                label="Team"
                //required={true}
                className={styles.formField}
                value={this.state.FormData.Team}
                onChanged={(v) => this.changeTextField(v, "Team")}
            />
        );
    }

    private renderInfoHolder() {
        return (
            <CrTextField
                label="Info Holder"
                //required={true}
                className={styles.formField}
                value={this.state.FormData.InfoHolder}
                onChanged={(v) => this.changeTextField(v, "InfoHolder")}
            />
        );
    }
    private renderAdditionalNotes() {
        return (
            <CrTextField
                label="Additional Notes"
                //required={true}
                className={styles.formField}
                value={this.state.FormData.AdditionalNotes}
                onChanged={(v) => this.changeTextField(v, "AdditionalNotes")}
                multiline={true}
                rows={3}
            />
        );
    }

    private renderIsLinkCheckbox() {

        if(this.state.EditRequest === true) return null;
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
        if(this.state.ShowFileUpload == true)
            return null;
        
        if(this.state.FormData.IsLink === true){

            return (
                <CrTextField
                    label="Link"
                    required={true}
                    className={styles.formField}
                    value={this.state.FormData.Title}
                    onChanged={(v) => this.changeTextField(v, "Title")}
                    errorMessage={this.state.ErrMessages.Title} 
                />
            );
        }
        else
            return false;


    }

    private renderFileUpload() {
        if(this.state.ShowFileUpload == false)
            return null;

        return (
            <div style={{ marginTop:'20px', marginBottom: '20px' }}>
                <div>
                    <input type="file" name="fileUpload" id="fileUpload"></input>
                    {this.state.ErrMessages.FileUpload && <FieldErrorMessage value={this.state.ErrMessages.FileUpload} />}
                </div>
                {this.state.ShowUploadProgress && <div style={{minHeight:'80px', marginTop:'15px'}}>
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

    private uploadFile = (goElementEvidenceId:number, uploadedByUserId:number) => {
        this.setState({
            UploadStatus: "Uploading file ...",
            ShowUploadProgress: true
        });

        let myfile = (document.querySelector("#fileUpload") as HTMLInputElement).files[0];
        let fileName: string = `${goElementEvidenceId}_${myfile.name}`;
        //console.log(fileName);
        //const chunkSize:number = 10485760; //10mb
        const chunkSize: number = 1048576; //1mb
        if (myfile.size <= chunkSize) {
            sp.web.getFolderByServerRelativeUrl(UploadFolder_Evidence).files.add(fileName, myfile, true).then(f => {
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
                        this.afterFileUpload(goElementEvidenceId, fileName, uploadedByUserId);
                    });
                });
            });
        }
        else {
            sp.web.getFolderByServerRelativeUrl(UploadFolder_Evidence)
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
                        this.afterFileUpload(goElementEvidenceId, fileName, uploadedByUserId);
                    });
                }).catch(console.log);
        }
    }

    private progressUpload = (d: ChunkedFileUploadProgressData) => {
        console.log('progress', d.blockNumber, d.currentPointer, d.stage, d.totalBlocks);
        const progress:number = Number(((d.blockNumber / d.totalBlocks) * 100).toFixed());

        if(progress >= 99){
            this.setState({            
                UploadProgress: 99,
                UploadStatus: 'Almost done ...'
            });
        }
        else{

            this.setState({            
                UploadProgress: progress
            });
        }

        

    }
    private afterFileUpload = (goElementEvidenceId:number, fileName: string, uploadedByUserId: number):void => {
        //console.log('after uploading file ', fileName, miscFileID);

        const fdata = { ...this.state.FormData, "Title": fileName, "ID" : goElementEvidenceId, "UploadedByUserId": uploadedByUserId  };
        this.setState({ 
            FormData: fdata
         }, this.saveEvidence);

    }

    private saveEvidence = (): void => {

        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);

            let f: IGoElementEvidence = { ...this.state.FormData };

            //remove all the child and parent entities before sending post/patch
            //delete f.User; //parent entity

            if (f.ID === 0) {

                //firts create record in the db, so we can get the ID, then use the ID to append in the file name to make file name unique
                this.goElementEvidenceService.create(f).then(x=> {
                    //console.log(x);
                    if(this.state.ShowFileUpload === true){
                        this.uploadFile(x.ID, x.UploadedByUserId);
                    }
                    else{
                        //its a link instead of the file, so close the form
                        console.log('evidence saved as link');
                        this.props.onSaved();
                    }
                    
                });
                
            }
            else {

                //console.log('in update');

                this.goElementEvidenceService.update(f.ID, f).then(this.props.onSaved, (err) => {
                    if (this.props.onError) this.props.onError(`Error updating item`, err.message);
                });
            }
        }
    }

    private validateEntity = (): boolean => {
        let returnVal:boolean = true;
        let errMsg:IErrorMessage = {...this.state.ErrMessages};        

        if ((this.state.FormData.Details === null) || (this.state.FormData.Details === '' )) {
            //this.setState({ ErrMsgDetailsRequired: 'Details required' });
            errMsg.Details = "Details required";
            returnVal = false;
        }
        else{
            errMsg.Details = null;
        }
        
        if(this.state.ShowFileUpload === true && ((document.querySelector("#fileUpload") as HTMLInputElement).files[0]) == null){
            errMsg.FileUpload = "File required";
            returnVal = false;
        }
        else{
            errMsg.FileUpload = null;
        }
        if(this.state.EditRequest === false && this.state.FormData.IsLink === true && (this.state.FormData.Title === null || this.state.FormData.Title === '')  ){
            errMsg.Title = "Link Required";
            returnVal = false;
            console.log('error link required');
        }
        else{
            errMsg.Title = null;
            console.log('link validation ok');
        }

        //at the end set state
        this.setState({ ErrMessages: errMsg });

        return returnVal;
    }

    //#endregion Class Methods


    //#region Data Load

    private loadEvidence = (): Promise<void> => {
        let x = this.goElementEvidenceService.read(this.props.goElementEvidenceId).then((e: IGoElementEvidence): void => {

            this.setState({
                FormData: e,
                FormDataBeforeChanges: e,
            });

        }, (err) => { if (this.props.onError) this.props.onError(`Error loading evidence data`, err.message); });
        return x;
    }

    public componentDidMount(): void {
        this.setState({ Loading: true });
        let loadingPromises = [this.loadLookups()];
        if (this.props.goElementEvidenceId) {
            this.setState({ EditRequest: true });
            loadingPromises.push(this.loadEvidence());
        }
        else{
            this.setState({ ShowFileUpload: true });
        }
        Promise.all(loadingPromises).then(p => this.onAfterLoad(p[1])).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));

    }

    private loadLookups(): Promise<any> {

        let proms: any[] = [];
        return Promise.all(proms);
    }

    private onAfterLoad = (entity: types.IEntity): void => {

    }


    //#endregion Data Load

    //#region Form Operations

    private changeTextField = (value: string, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true });
    }

    protected changeCheckboxIsLink = (value: boolean, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), ShowFileUpload: !value /*, FormIsDirty: true*/ });
    }
    private cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }



    //#endregion Form Operations


}