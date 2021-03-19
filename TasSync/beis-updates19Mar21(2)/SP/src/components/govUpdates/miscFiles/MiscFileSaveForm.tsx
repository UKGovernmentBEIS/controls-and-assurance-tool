import * as React from 'react';
import * as types from '../../../types';
import * as services from '../../../services';
import { IGoMiscFile, GoMiscFile } from '../../../types';
import { CrTextField } from '../../cr/CrTextField';
import { FieldErrorMessage } from '../../cr/FieldDecorators';
import { FormButtons } from '../../cr/FormButtons';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../../cr/FormCommandBar';
import { sp, ChunkedFileUploadProgressData } from '@pnp/sp';
import { getUploadFolder_MiscFiles } from '../../../types/AppGlobals';
import styles from '../../../styles/cr.module.scss';

export interface IMiscFileSaveFormProps extends types.IBaseComponentProps {
    miscFileID: number;
    showForm: boolean;
    onSaved?: () => void;
    onCancelled?: () => void;
}

export interface IErrorMessage{
    Details:string;
    FileUpload:string;
}
export class ErrorMessage implements IErrorMessage{
    public Details = null;
    public FileUpload = null;
}

export interface IMiscFileSaveFormState {
    Loading: boolean;
    //LookupData: IPolicyLookupData;
    FormData: IGoMiscFile;
    FormDataBeforeChanges: IGoMiscFile;
    FormIsDirty: boolean;
    UploadStatus:string;
    UploadProgress:number;
    ShowUploadProgress:boolean;
    ShowFileUpload:boolean;
    ErrMessages: IErrorMessage;
}

export class MiscFileSaveFormState implements IMiscFileSaveFormState {
    public Loading = false;
    //public LookupData = new PolicyLookupData();
    public FormData = new GoMiscFile();
    public FormDataBeforeChanges = new GoMiscFile();
    public FormIsDirty = false;
    public UploadStatus = "";
    public UploadProgress:number = 0;
    public ShowUploadProgress = false;
    public ShowFileUpload = false;
    public ErrMessages = new ErrorMessage();

}

export default class MiscFileSaveForm extends React.Component<IMiscFileSaveFormProps, IMiscFileSaveFormState> {

    private UploadFolder_MiscFiles:string = "";
    private goMiscFileService: services.GoMiscFileService = new services.GoMiscFileService(this.props.spfxContext, this.props.api);

    constructor(props: IMiscFileSaveFormProps, state: IMiscFileSaveFormState) {
        super(props);
        this.UploadFolder_MiscFiles = getUploadFolder_MiscFiles(props.spfxContext);
        this.state = new MiscFileSaveFormState();



    }

    //#region Render


    public render(): React.ReactElement<IMiscFileSaveFormProps> {
        //const errors = this.state.ValidationErrors;
        return (
            <Panel isOpen={this.props.showForm} headerText={"Misc File"} type={PanelType.medium} onRenderNavigation={() => <FormCommandBar onSave={this.saveMiscFile} onCancel={this.props.onCancelled} />}>
                <div className={styles.cr}>
                    {this.renderFormFields()}
                    <FormButtons
                        primaryText={"Save"}
                        onPrimaryClick={() => this.saveMiscFile()}
                        onSecondaryClick={this.props.onCancelled}
                    />
                </div>
            </Panel>
        );
    }

    public renderFormFields() {
        return (
            <React.Fragment>
                {this.renderMiscFileDetails()}
                {this.renderFileUpload()}

            </React.Fragment>
        );
    }

    private renderMiscFileDetails() {
        return (
            <CrTextField
                label="Misc File Details"
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

    private renderFileUpload() {
        if(this.state.ShowFileUpload == false)
            return null;

        return (
            <div style={{ marginBottom: '10px' }}>
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

    private uploadFile = (miscFileID:number, uploadedByUserId:number) => {
        this.setState({
            UploadStatus: "Uploading file ...",
            ShowUploadProgress: true
        });

        let myfile = (document.querySelector("#fileUpload") as HTMLInputElement).files[0];
        let fileName: string = `${miscFileID}_${myfile.name}`;
        //console.log(fileName);
        //const chunkSize:number = 10485760; //10mb
        const chunkSize: number = 1048576; //1mb
        if (myfile.size <= chunkSize) {
            sp.web.getFolderByServerRelativeUrl(this.UploadFolder_MiscFiles).files.add(fileName, myfile, true).then(f => {
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
                        this.afterFileUpload(miscFileID, fileName, uploadedByUserId);
                    });
                });
            });
        }
        else {
            sp.web.getFolderByServerRelativeUrl(this.UploadFolder_MiscFiles)
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
                        this.afterFileUpload(miscFileID, fileName, uploadedByUserId);
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
    private afterFileUpload = (miscFileID:number, fileName: string, uploadedByUserId: number):void => {
        //console.log('after uploading file ', fileName, miscFileID);

        const fdata = { ...this.state.FormData, "Title": fileName, "ID" : miscFileID, "UploadedByUserId": uploadedByUserId  };
        this.setState({ 
            FormData: fdata
         }, this.saveMiscFile);

    }

    private saveMiscFile = (): void => {

        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);

            let f: IGoMiscFile = { ...this.state.FormData };

            //remove all the child and parent entities before sending post/patch
            delete f.User; //parent entity

            if (f.ID === 0) {

                //firts create record in the db, so we can get the ID, then use the ID to append in the file name to make file name unique
                this.goMiscFileService.create(f).then(x=> {
                    //console.log(x);
                    this.uploadFile(x.ID, x.UploadedByUserId);
                });
                
            }
            else {

                //console.log('in update');

                this.goMiscFileService.update(f.ID, f).then(this.props.onSaved, (err) => {
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

        //at the end set state
        this.setState({ ErrMessages: errMsg });

        return returnVal;
    }

    //#endregion Class Methods


    //#region Data Load

    private loadMiscFile = (): Promise<void> => {
        let x = this.goMiscFileService.read(this.props.miscFileID).then((p: IGoMiscFile): void => {

            this.setState({
                FormData: p,
                FormDataBeforeChanges: p,
            });

        }, (err) => { if (this.props.onError) this.props.onError(`Error loading misc file data`, err.message); });
        return x;
    }

    public componentDidMount(): void {
        this.setState({ Loading: true });
        let loadingPromises = [this.loadLookups()];
        if (this.props.miscFileID) {
            loadingPromises.push(this.loadMiscFile());
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

    private cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }



    //#endregion Form Operations


}