import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { IEntity, Entity, IDirectorate, IGIAAImport, IGIAAImportInfo, GIAAImport } from '../../types';
import { CrTextField } from '../cr/CrTextField';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { FormButtons } from '../cr/FormButtons';
import { CrCheckbox } from '../cr/CrCheckbox';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../cr/FormCommandBar';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import { FieldErrorMessage } from '../cr/FieldDecorators';


import { CrDatePicker } from '../cr/CrDatePicker';
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
    //LookupData: ILookupData;
    //FormData: IGIAAImport;
    //FormDataBeforeChanges: IGIAAAuditReport;
    FormIsDirty: boolean;
    ErrMessages: IErrorMessage;
}
export class MainImportFormState implements IMainImportFormState {
    public Loading = false;
    //public LookupData = new LookupData();
    //public FormData = null;
    public ImportInfo = null;
    //public FormDataBeforeChanges = new GIAAAuditReport();
    public FormIsDirty = false;
    public ErrMessages = new ErrorMessage();
}

export default class MainImportForm extends React.Component<IMainImportFormProps, IMainImportFormState> {

    //private giaaAuditReportService: services.GIAAAuditReportService = new services.GIAAAuditReportService(this.props.spfxContext, this.props.api);
    private gIAAImportService: services.GIAAImportService = new services.GIAAImportService(this.props.spfxContext, this.props.api);

    constructor(props: IMainImportFormProps, state: IMainImportFormState) {
        super(props);
        this.state = new MainImportFormState();
    }

    //#region render


    public render(): React.ReactElement<IMainImportFormProps> {
        //const errors = this.state.ValidationErrors;
        return (
            <Panel isOpen={this.props.showForm} headerText={"Import GIAA Audit Reports"} type={PanelType.medium}
            //  onRenderNavigation={() => <FormCommandBar saveText='Import' onSave={this.saveData} onCancel={this.props.onCancelled} />}

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
                        {/* <PrimaryButton text="Check Updates Req" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.sendImportRequest("Check Updates Req")}
                        /> */}
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
        //console.log('loadData - Id: ', this.props.entityId);
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
            //console.log(x);

            this.loadData();


        });
    }
    private importData = (): void => {

        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);



            const file = (document.querySelector("#fileUpload") as HTMLInputElement).files[0];


            const reader = new FileReader();
            // reader.addEventListener('load', (event) => {
            //   //img.src = event.target.result;
            //   //const r = event.target.res
            //   //console.log('r', r);
            // });

            reader.onload = (e) => {
                // e.target.result should contain the text
                const xmlContents: string = String(e.target['result']);
                this.sendImportRequest(xmlContents);
                // const giaaImport = new GIAAImport();
                // giaaImport.XMLContents = xmlContents;

                // this.gIAAImportService.create(giaaImport).then(x => {
                //     //console.log(x);

                //     this.loadData();


                // });

                console.log('xml', xmlContents);

            };

            reader.readAsText(file);




            // while(true){

            //     setTimeout(() => {
            //         console.log('renderInProgressDetails timtout');
            //         this.loadData();
            //         if(this.state.ImportInfo.Status !== "InProgress"){
            //             return;
            //         }
            //     }, 5000);
            // }





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