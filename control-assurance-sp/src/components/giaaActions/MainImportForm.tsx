import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { IGIAAImportInfo, GIAAImport } from '../../types';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FieldErrorMessage } from '../cr/FieldDecorators';
import styles from '../../styles/cr.module.scss';

export interface IMainImportFormProps extends types.IBaseComponentProps {
    showForm: boolean;
    onSaved?: () => void;
    onCancelled?: () => void;
}

export interface ILookupData {
}
export class LookupData implements ILookupData {
}
export interface IErrorMessage {
    FileUpload: string;
}
export class ErrorMessage implements IErrorMessage {
    public FileUpload = null;
}
export interface IMainImportFormState {
    Loading: boolean;
    ImportInfo: IGIAAImportInfo;
    FormIsDirty: boolean;
    ErrMessages: IErrorMessage;
}
export class MainImportFormState implements IMainImportFormState {
    public Loading = false;
    public ImportInfo = null;
    public FormIsDirty = false;
    public ErrMessages = new ErrorMessage();
}

export default class MainImportForm extends React.Component<IMainImportFormProps, IMainImportFormState> {
    private gIAAImportService: services.GIAAImportService = new services.GIAAImportService(this.props.spfxContext, this.props.api);
    constructor(props: IMainImportFormProps, state: IMainImportFormState) {
        super(props);
        this.state = new MainImportFormState();
    }

    //#region render


    public render(): React.ReactElement<IMainImportFormProps> {
        return (
            <Panel isOpen={this.props.showForm} headerText={"Import GIAA Audit Reports"} type={PanelType.medium}
            >
                <div className={styles.cr}>
                    {this.renderFormFields()}
                    {this.renderFormButtons()}
                    {this.renderLastImportInfo()}
                </div>
            </Panel>
        );
    }

    public renderFormFields() {

        const info = this.state.ImportInfo;
        if (info === null) return null;

        if (info.Status === "InProgress") {
            return (
                <React.Fragment>
                    {this.renderInProgressDetails()}

                </React.Fragment>
            );
        }
        else {
            return (
                <React.Fragment>
                    {this.renderFileUpload()}
                </React.Fragment>
            );
        }
    }

    private renderInProgressDetails() {

        return (
            <div style={{ paddingTop: '10px', paddingBottom: '20px' }}>
                Import in progress.
                <br />
                {this.state.ImportInfo.LogDetails}

                <div style={{ paddingTop: '15px' }}>
                    To refresh status <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => this.loadData()} >Click here</span>
                </div>
            </div>
        );
    }

    private renderFileUpload() {

        return (
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <div>
                    <input type="file" name="fileUpload" id="fileUpload" accept="application/xml"></input>
                    {this.state.ErrMessages.FileUpload && <FieldErrorMessage value={this.state.ErrMessages.FileUpload} />}
                    <div style={{ paddingTop: '10px' }}>
                        Please upload the xml file.
                    </div>
                </div>
            </div>
        );
    }

    private renderFormButtons() {
        const info = this.state.ImportInfo;
        if (info === null) return null;

        return (
            <React.Fragment>

                {info.Status !== "InProgress" &&
                    <React.Fragment>
                        <PrimaryButton text="Import" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.importData()}
                        />
                    </React.Fragment>
                }

                <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
                    onClick={this.props.onSaved}
                />
            </React.Fragment>
        );
    }

    private renderLastImportInfo() {
        const info = this.state.ImportInfo;
        if (info === null) return null;

        if (info.ID === 0 || info.Status === "InProgress") return null;

        return (
            <div style={{ paddingTop: "30px" }}>
                <div>
                    <span>Last Import Status:</span>&nbsp;<span>{info.LastImportStatus}</span>
                </div>
                <div>
                    <span>Last Import Date:</span>&nbsp;<span>{info.LastImportDate}</span>
                </div>
                <div>
                    <span>Last Import By:</span>&nbsp;<span>{info.LastImportBy}</span>
                </div>
                <div>
                    <span>Log Details:</span>&nbsp;<span>{info.LogDetails}</span>
                </div>
            </div>
        );
    }

    //#endregion render


    //#region Data Load/Save

    public componentDidMount(): void {
        this.loadData();
    }

    private loadData = (): Promise<void> => {
        let x = this.gIAAImportService.getImportInfo().then((e: IGIAAImportInfo): void => {
            console.log('data ', e);
            this.setState({
                ImportInfo: e,
            });

        }, (err) => { if (this.props.onError) this.props.onError(`Error loading data`, err.message); });
        return x;
    }

    private sendImportRequest = (xmlContents: string): void => {
        console.log('in sendImportRequest');
        const giaaImport = new GIAAImport();
        giaaImport.XMLContents = xmlContents;

        this.gIAAImportService.create(giaaImport).then(x => {
            this.loadData();
        });
    }
    private importData = (): void => {

        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);

            const file = (document.querySelector("#fileUpload") as HTMLInputElement).files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                // e.target.result should contain the text
                const xmlContents: string = String(e.target['result']);
                this.sendImportRequest(xmlContents);
                console.log('xml', xmlContents);
            };
            reader.readAsText(file);
        }
    }

    private validateEntity = (): boolean => {

        let returnVal: boolean = true;
        let errMsg: IErrorMessage = { ...this.state.ErrMessages };
        const file = (document.querySelector("#fileUpload") as HTMLInputElement).files[0];
        if (file == null) {
            errMsg.FileUpload = "XML file required";
            returnVal = false;
        }
        else {
            const fileName = file.name;
            console.log("fileName", fileName);
            const ext = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
            console.log("File Ext", ext);

            if (ext === "xml") {
                errMsg.FileUpload = null;
            }
            else {
                errMsg.FileUpload = "XML file required";
                returnVal = false;
            }
        }

        //at the end set state
        this.setState({ ErrMessages: errMsg });
        return returnVal;
    }

    //#endregion Data Load/Save
}