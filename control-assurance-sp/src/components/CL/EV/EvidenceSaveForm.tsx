import * as React from 'react';
import * as types from '../../../types';
import * as services from '../../../services';
import { ICLCaseEvidence, CLCaseEvidence } from '../../../types';
import { CrTextField } from '../../cr/CrTextField';
import { CrCheckbox } from '../../cr/CrCheckbox';
import { FieldErrorMessage } from '../../cr/FieldDecorators';
import { CrChoiceGroup, IChoiceGroupOption } from '../../cr/CrChoiceGroup';
import { FormButtons } from '../../cr/FormButtons';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../../cr/FormCommandBar';
import { sp, ChunkedFileUploadProgressData } from '@pnp/sp';
import { getUploadFolder_CLRoot, getFolder_Help } from '../../../types/AppGlobals';
import styles from '../../../styles/cr.module.scss';
import '../../../styles/CustomFabric.scss';
import { TooltipHost } from 'office-ui-fabric-react';

export interface IEvidenceSaveFormProps extends types.IBaseComponentProps {
    parentId: number;
    caseId: number;
    workerId?: number;
    evidenceId: number;
    showForm: boolean;
    evidenceType?:string;
    onSaved?: () => void;
    onCancelled?: () => void;
}

export interface IErrorMessage {
    Details: string;
    Title: string;
    //Controls:string;
    //Team:string;

    FileUpload: string;
}
export class ErrorMessage implements IErrorMessage {
    public Details = null;
    public Title = null;
    public FileUpload = null;
}

export interface IEvidenceSaveFormState {
    Loading: boolean;
    FormData: ICLCaseEvidence;
    FormDataBeforeChanges: ICLCaseEvidence;
    FormIsDirty: boolean;
    UploadStatus: string;
    UploadProgress: number;
    ShowUploadProgress: boolean;
    //ShowFileUpload: boolean;
    EditRequest: boolean;
    ErrMessages: IErrorMessage;

}

export class EvidenceSaveFormState implements IEvidenceSaveFormState {
    public Loading = false;
    //public LookupData = new PolicyLookupData();
    public FormData;
    public FormDataBeforeChanges;// = new GoElementEvidence();
    public FormIsDirty = false;
    public UploadStatus = "";
    public UploadProgress: number = 0;
    public ShowUploadProgress = false;
    //public ShowFileUpload = false;
    public EditRequest = false;
    public ErrMessages = new ErrorMessage();

    constructor(parentId: number, workerId:number, evidenceType:string) {
        let defaultAttachmentType:string = "None";
        if(evidenceType === "IR35" || evidenceType === "ContractorSecurityCheck"){
            defaultAttachmentType = "PDF";
        }
        this.FormData = new CLCaseEvidence(parentId, evidenceType, defaultAttachmentType, workerId);
        this.FormDataBeforeChanges = new CLCaseEvidence(parentId, evidenceType, defaultAttachmentType, workerId);
    }

}

export default class EvidenceSaveForm extends React.Component<IEvidenceSaveFormProps, IEvidenceSaveFormState> {

    private UploadFolder_Evidence: string = "";
    private Folder_Help: string = "";

    private cLCaseEvidenceService: services.CLCaseEvidenceService = new services.CLCaseEvidenceService(this.props.spfxContext, this.props.api);

    constructor(props: IEvidenceSaveFormProps, state: IEvidenceSaveFormState) {
        super(props);
        this.UploadFolder_Evidence = `${getUploadFolder_CLRoot(props.spfxContext)}/${this.props.caseId}`;
        this.Folder_Help = getFolder_Help(props.spfxContext);

        this.state = new EvidenceSaveFormState(props.parentId, props.workerId, props.evidenceType);
    }

    //#region Render


    public render(): React.ReactElement<IEvidenceSaveFormProps> {
        console.log('in render - evidenceType',this.props.evidenceType);
        //const errors = this.state.ValidationErrors;
        const headerText: string = (this.props.evidenceType === "IR35" || this.props.evidenceType === "ContractorSecurityCheck") ? "Evidence" : "Case Discussion, General Comments and Attachments";
        
        return (
            <Panel isOpen={this.props.showForm} headerText={headerText} type={PanelType.medium} onRenderNavigation={() => <FormCommandBar onSave={this.saveEvidence} onCancel={this.props.onCancelled} saveDisabled={this.state.ShowUploadProgress} />}>
                <div className={styles.cr}>
                    {this.renderFormFields()}
                    <FormButtons
                        primaryText={"Save"}
                        primaryDisabled={this.state.ShowUploadProgress}
                        onPrimaryClick={() => this.saveEvidence()}
                        onSecondaryClick={this.props.onCancelled}
                    />
                    {this.renderInfoText()}
                </div>
            </Panel>
        );
    }

    public renderInfoText(){
        if(this.state.FormData.ID > 0 && this.state.EditRequest === true && this.state.FormData.AttachmentType === "PDF" ){
            const fileName = this.state.FormData.Title;
            return(
                <div style={{marginTop: '20px'}}>
                    This evidence is linked to file "{fileName}". <br/>
                    To change the file, please delete this evidence record and add again. 
                </div>
            );
        }
        return null;
    }
    public renderFormFields() {
        return (
            <React.Fragment>
                {this.renderDetails()}
                {this.renderAttachmentTypeChoiceOptions()}
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


    private renderAttachmentTypeChoiceOptions() {


        let options:IChoiceGroupOption[] = [
            { key: 'None', text: 'None' },
            { key: 'PDF', text: 'PDF File' },
            { key: 'Link', text: 'Link' },
        ];

        if(this.props.evidenceType === "IR35" || this.props.evidenceType === "ContractorSecurityCheck"){
            options = options.filter(x => x.key !== 'None');
        }

        const fd = this.state.FormData;

        return (
            <div>


                <CrChoiceGroup
                    label="Attachment"
                    className="inlineflex"
                    options={options}
                    disabled={this.state.EditRequest}
                    selectedKey={fd.AttachmentType}
                    onChange={(ev, option) => this.changeChoiceGroup(ev, option, "AttachmentType")}
                                />



            </div>
        );
    }

    // private renderIsLinkCheckbox() {

    //     if (this.state.EditRequest === true) return null;
    //     return (
    //         <div>

    //             <CrCheckbox
    //                 className={`${styles.formField} ${styles.checkbox}`}
    //                 label="Provide a link instead of uploading a file"
    //                 checked={this.state.FormData.IsLink}
    //                 onChange={(ev, isChecked) => this.changeCheckboxIsLink(isChecked, "IsLink")}


    //             />

    //         </div>
    //     );
    // }

    private renderLinkBox() {
        // if (this.state.ShowFileUpload == true)
        //     return null;

        if (this.state.FormData.AttachmentType === "Link") {

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
        // if (this.state.ShowFileUpload == false)
        //     return null;

        if(this.state.EditRequest === true) return null;
        if (this.state.FormData.AttachmentType !== "PDF")
        return null;

        return (
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <div>
                    <input type="file" name="fileUpload" id="fileUpload" accept="application/pdf"></input>
                    {this.state.ErrMessages.FileUpload && <FieldErrorMessage value={this.state.ErrMessages.FileUpload} />}
                    <div style={{paddingTop:'10px'}}>
                        {/* Please upload all evidence files as PDFs. For guidance on savings documents as PDFs, please click <span onClick={this.viewHelpPDF} style={{textDecoration:'underline', cursor:'pointer'}}>here</span>. */}
                        Please upload all evidence as PDFs. For guidance on saving documents and emails please click <span onClick={this.viewHelpPDF} style={{textDecoration:'underline', cursor:'pointer'}}>here</span>.

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
        const fileName:string = "HowToConvertDocumentsToPDF.pdf";

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

    private uploadFile = (goElementEvidenceId: number, uploadedByUserId: number) => {
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
                        this.afterFileUpload(goElementEvidenceId, fileName, uploadedByUserId);
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
                        this.afterFileUpload(goElementEvidenceId, fileName, uploadedByUserId);
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
    private afterFileUpload = (goElementEvidenceId: number, fileName: string, uploadedByUserId: number): void => {
        //console.log('after uploading file ', fileName, miscFileID);

        const fdata = { ...this.state.FormData, "Title": fileName, "ID": goElementEvidenceId, "UploadedByUserId": uploadedByUserId };
        this.setState({
            FormData: fdata
        }, this.saveEvidence);

    }

    private saveEvidence = (): void => {

        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);

            let f: ICLCaseEvidence = { ...this.state.FormData };

            //remove all the child and parent entities before sending post/patch
            //delete f.User; //parent entity

            if (f.ID === 0) {

                //firts create record in the db, so we can get the ID, then use the ID to append in the file name to make file name unique
                this.cLCaseEvidenceService.create(f).then(x => {
                    //console.log(x);
                    if (this.state.FormData.AttachmentType === "PDF") {
                        this.uploadFile(x.ID, x.UploadedByUserId);
                    }
                    else {
                        //its a link instead of the file, so close the form
                        console.log('evidence saved as link');
                        this.props.onSaved();
                    }

                });

            }
            else {

                //console.log('in update');

                this.cLCaseEvidenceService.updatePut(f.ID, f).then(this.props.onSaved, (err) => {
                    if (this.props.onError) this.props.onError(`Error updating item`, err.message);
                });
            }
        }
    }

    private validateEntity = (): boolean => {
        let returnVal: boolean = true;
        let errMsg: IErrorMessage = { ...this.state.ErrMessages };

        if ((this.state.FormData.Details === null) || (this.state.FormData.Details === '')) {
            //this.setState({ ErrMsgDetailsRequired: 'Details required' });
            errMsg.Details = "Details required";
            returnVal = false;
        }
        else {
            errMsg.Details = null;
        }

        if (this.state.EditRequest === false && this.state.FormData.AttachmentType === "PDF") {

            //((document.querySelector("#fileUpload") as HTMLInputElement).files[0]) == null
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
        
        if (this.state.FormData.AttachmentType === "Link") {
            if (this.state.FormData.Title === null || this.state.FormData.Title === '') {

                errMsg.Title = "Link Required";
                returnVal = false;
                console.log('error link required');
            }
            else {
                const x: string = this.state.FormData.Title.toLowerCase();
                if (x.search("http") === 0) {
                    //ok
                }
                else{
                    errMsg.Title = "Link should start with http:// or https://";
                    returnVal = false;
                    console.log('Link should start with http:// or https://');
                }
            }

        }
        else {
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
        let x = this.cLCaseEvidenceService.read(this.props.evidenceId).then((e: ICLCaseEvidence): void => {

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
        if (this.props.evidenceId) {
            this.setState({ EditRequest: true });
            loadingPromises.push(this.loadEvidence());
        }
        else {
            //this.setState({ ShowFileUpload: true });
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

    // protected changeCheckboxIsLink = (value: boolean, f: string): void => {
    //     this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), ShowFileUpload: !value /*, FormIsDirty: true*/ });
    // }
    private cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }
    protected changeChoiceGroup = (ev, option: IChoiceGroupOption, f: string): void => {
        const selectedKey = option.key;
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, selectedKey)/*, FormIsDirty: true*/ });

    }



    //#endregion Form Operations


}