import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { IDirectorate, INAOPublication, NAOPublication, INAOPublicationDirectorate, NAOPublicationDirectorate, ILinkLocalType } from '../../types';
import { CrTextField } from '../cr/CrTextField';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { FormButtons } from '../cr/FormButtons';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { FormCommandBar } from '../cr/FormCommandBar';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import { CrCheckbox } from '../cr/CrCheckbox';
import { CrDatePicker } from '../cr/CrDatePicker';
import { changeDatePicker } from '../../types/AppGlobals';
//import { Stack, IStackProps, IStackStyles } from 'office-ui-fabric-react/lib/Stack';
import styles from '../../styles/cr.module.scss';
import { ThemeSettingName } from 'office-ui-fabric-react/lib/Styling';
//import { ILink } from 'office-ui-fabric-react/lib/Link';

export interface IMainSaveFormProps extends types.IBaseComponentProps {
    //periodID: number | string;
    entityId: number;
    showForm: boolean;
    onSaved?: () => void;
    onCancelled?: () => void;
}

export interface ILookupData {
    Directorates: IDirectorate[];
    NAOTypes: types.IEntity[];
}
export class LookupData implements ILookupData {
    public Directorates = null;
    public NAOTypes = null;
}
export interface IErrorMessage {
    Title: string;
    Directorate: string;
    Type: string;
    Year: string;
    CurrentPeriodTitle: string;
    CurrentPeriodStartDate: string;
    CurrentPeriodEndDate: string;
    //Link: string;
}
export class ErrorMessage implements IErrorMessage {
    public Title = null;
    public Directorate = null;
    public Type = null;
    public Year = null;
    public CurrentPeriodTitle = null;
    public CurrentPeriodStartDate = null;
    public CurrentPeriodEndDate = null;
}

export interface IMainSaveFormState {
    Loading: boolean;
    LookupData: ILookupData;
    FormData: INAOPublication;
    //ClearSuggestedStatus:boolean;
    FormDataBeforeChanges: INAOPublication;
    FormIsDirty: boolean;
    ArrLinks: ILinkLocalType[];
    ErrMessages: IErrorMessage;
}
export class MainSaveFormState implements IMainSaveFormState {
    public Loading = false;
    public LookupData = new LookupData();
    public FormData = new NAOPublication();
    public FormDataBeforeChanges = new NAOPublication();
    public FormIsDirty = false;
    public ArrLinks: ILinkLocalType[] = [];
    //public ClearSuggestedStatus = false;
    public ErrMessages = new ErrorMessage();
}

export default class MainSaveForm extends React.Component<IMainSaveFormProps, IMainSaveFormState> {
    private directorateService: services.DirectorateService = new services.DirectorateService(this.props.spfxContext, this.props.api);
    private naoTypeService: services.NAOTypeService = new services.NAOTypeService(this.props.spfxContext, this.props.api);
    private naoPublicationService: services.NAOPublicationService = new services.NAOPublicationService(this.props.spfxContext, this.props.api);
    private naoPublicationDirectorateService: services.NAOPublicationDirectorateService = new services.NAOPublicationDirectorateService(this.props.spfxContext, this.props.api);

    private saveInProgress:boolean = false;

    private childEntities: types.IFormDataChildEntities[] = [
        { ObjectParentProperty: 'NAOPublicationDirectorates', ParentIdProperty: 'NAOPublicationId', ChildIdProperty: 'DirectorateId', ChildService: this.naoPublicationDirectorateService },
    ];

    // private stackTokens = { childrenGap: 10 };
    // private stackStyles: Partial<IStackStyles> = { root: { width: '100%' } };
    // private columnProps: Partial<IStackProps> = {
    //     tokens: { childrenGap: 15 },
    //     styles: { root: { width: 300 } },
    // };


    constructor(props: IMainSaveFormProps, state: IMainSaveFormState) {
        super(props);
        this.state = new MainSaveFormState();
    }

    //#region Render

    public render(): React.ReactElement<IMainSaveFormProps> {
        //const errors = this.state.ValidationErrors;
        return (
            <Panel isOpen={this.props.showForm} headerText={"NAO/PAC Publication"} type={PanelType.medium} onRenderNavigation={() => <FormCommandBar onSave={this.saveData} onCancel={this.props.onCancelled} />}>
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
                {this.renderPublicationSummary()}
                {this.renderDirectorates()}
                {this.renderNAOTypes()}
                {this.renderYear()}

                {this.renderLinks()}

                {this.renderPeriodTitle()}
                {this.renderCurrentPeriodDates()}
                {this.renderContactDetails()}
                {this.renderIsArchiveCheckbox()}

            </React.Fragment>
        );
    }

    private renderTitle() {
        console.log('in renderTitle');
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

    private renderPublicationSummary() {

        return (
            <CrTextField
                label="Publication Summary"
                //required={true}
                className={styles.formField}
                value={this.state.FormData.PublicationSummary}
                onChanged={(v) => this.changeTextField(v, "PublicationSummary")}
                multiline={true}
                rows={5}
            //errorMessage={this.state.ErrMessages.Title}
            />
        );
    }

    private renderDirectorates() {
        const directorates = this.state.LookupData.Directorates;
        const fd_dirs: INAOPublicationDirectorate[] = this.state.FormData.NAOPublicationDirectorates;

        if (directorates) {
            return (
                <CrDropdown
                    label="Directorate(s)"
                    placeholder="Select"
                    multiSelect
                    className={styles.formField}
                    options={services.LookupService.entitiesToSelectableOptions(directorates)}


                    selectedKeys={fd_dirs && fd_dirs.map((x) => { return x.DirectorateId; })}
                    onChanged={(v) => this.changeMultiDropdown(v, 'NAOPublicationDirectorates', new NAOPublicationDirectorate(), 'DirectorateId')}


                    //selectedKey={this.state.FormData.DirectorateId}
                    //onChanged={(v) => this.changeDropdown(v, "DirectorateId")}

                    required={true}
                    errorMessage={this.state.ErrMessages.Directorate}
                />
            );
        }
        else
            return null;
    }

    private renderNAOTypes() {
        const NAOTypes = this.state.LookupData.NAOTypes;
        if (NAOTypes) {
            return (
                <CrDropdown
                    label="Type"
                    placeholder="Select an Option"
                    required={true}
                    className={styles.formField}
                    options={services.LookupService.entitiesToSelectableOptions(NAOTypes)}
                    selectedKey={this.state.FormData.NAOTypeId}
                    onChanged={(v) => this.changeDropdown(v, "NAOTypeId")}
                    errorMessage={this.state.ErrMessages.Type}
                />
            );
        }
        else
            return null;
    }

    private renderYear() {

        return (
            <CrTextField
                label="Year"
                required={true}
                className={styles.formField}
                value={this.state.FormData.Year}
                onChanged={(v) => this.changeTextField(v, "Year")}
                errorMessage={this.state.ErrMessages.Year}
            />
        );
    }




    public renderLinks() {


        return (
            <div>

                <div style={{ display: 'flex' }}>
                    <div style={{ width: '50%', paddingRight: '5px' }}>
                        <span>Publication Link Text</span>

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

    private renderPeriodTitle() {

        return (
            <CrTextField
                label="Period Title"
                required={true}
                className={styles.formField}
                value={this.state.FormData.CurrentPeriodTitle}
                onChanged={(v) => this.changeTextField(v, "CurrentPeriodTitle")}
                errorMessage={this.state.ErrMessages.CurrentPeriodTitle}
            />
        );
    }

    private renderCurrentPeriodDates() {

        return (

            <div style={{ display: 'flex', marginTop: '5px' }}>
                <div style={{ width: '50%', paddingRight: '5px' }}>
                    <CrDatePicker
                        label="Period Start Date"
                        className={styles.formField}
                        value={this.state.FormData.CurrentPeriodStartDate}
                        onSelectDate={(v) => changeDatePicker(this, v, "CurrentPeriodStartDate")}
                        required={true}
                        errorMessage={this.state.ErrMessages.CurrentPeriodStartDate}
                    />

                </div>
                <div style={{ width: '50%', paddingLeft: '5px' }}>

                    <CrDatePicker
                        label="Period End Date"
                        className={styles.formField}
                        value={this.state.FormData.CurrentPeriodEndDate}
                        onSelectDate={(v) => changeDatePicker(this, v, "CurrentPeriodEndDate")}
                        required={true}
                        errorMessage={this.state.ErrMessages.CurrentPeriodEndDate}
                    />

                </div>

            </div>

        );
    }



    private addBlankLinkItem = () => {
        console.log('in addBlankLinkItem');
        const arrCopy = [...this.state.ArrLinks, { Description: '', URL: '' }];
        this.setState({ ArrLinks: arrCopy });
        //const item: ILinkLocalType = { Description: 'des', URL: 'url' };
        //arrCopy.push()
    }


    // private renderLink(item: ILinkLocalType, index: number) {

    //     return (
    //         <div key={`div_renderLink_${index}`}>
    //             <Stack key={`stack_renderLink_${index}`} horizontal tokens={this.stackTokens} styles={this.stackStyles}>
    //                 <Stack.Item key={`stackItem_renderLink_${index}`} grow={1}>
    //                     <CrTextField key={`div_TextField1_${index}`} label="Publication Link Text" value={item.Description}
    //                         onChanged={(v) => this.changeTextField_Link(v, index, "Description")} />
    //                 </Stack.Item>
    //                 <Stack.Item grow={1}>
    //                     <CrTextField key={`div_TextField2_${index}`} label="Actual URL" value={item.URL}
    //                          onChanged={(v) => this.changeTextField_Link(v, index, "URL")} />
    //                 </Stack.Item>

    //             </Stack>
    //         </div>
    //     );
    // }
    // private renderLink(){
    //     return(
    //         <Stack horizontal tokens={this.stackTokens} styles={this.stackStyles}>
    //         <Stack {...this.columnProps}>
    //           <CrTextField label="Standard" value="" />
    //           <CrTextField label="Standard" value="" />
    //           <CrTextField label="Standard" value="" />
    //         </Stack>
    //         <Stack {...this.columnProps}>
    //         <CrTextField label="Standard" value="" />
    //         <CrTextField label="Standard" value="" />
    //         <CrTextField label="Standard" value="" />

    //         </Stack>
    //       </Stack>
    //     );
    // }

    private renderContactDetails() {

        return (
            <CrTextField
                label="Contact Details"
                className={styles.formField}
                value={this.state.FormData.ContactDetails}
                onChanged={(v) => this.changeTextField(v, "ContactDetails")}
                multiline={true}
                rows={3}
            />
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


    //#endregion Render


    //#region Data Load/Save

    private loadData = (): Promise<void> => {
        console.log('loadData - Id: ', this.props.entityId);
        let x = this.naoPublicationService.readWithExpandDirectorates(this.props.entityId).then((e: INAOPublication): void => {

            console.log('publication ', e);

            let arrLinks: ILinkLocalType[] = [];

            //unpack publication links from single value
            if (e.PublicationLink !== null && e.PublicationLink !== '') {
                let arr1 = e.PublicationLink.split('>');

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



            this.setState({
                FormData: e,
                FormDataBeforeChanges: e,
                ArrLinks: arrLinks,
            });

        }, (err) => { if (this.props.onError) this.props.onError(`Error loading GoElement data`, err.message); });
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
        proms.push(this.loadDirectorates());
        proms.push(this.loadNAOTypes());
        return Promise.all(proms);
    }

    // private loadIDirectorates = (): Promise<IDirectorate[]> => {
    //     return this.directorateService.readAll().then((data: IDirectorate[]): IDirectorate[] => {
    //         this.setState({ LookupData: this.cloneObject(this.state.LookupData, "IDirectorates", data) });
    //         return data;
    //     }, (err) => { if (this.props.onError) this.props.onError(`Error loading Users lookup data`, err.message); });
    // }

    private loadDirectorates = (): void => {
        this.directorateService.readAll().then((data: IDirectorate[]): IDirectorate[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "Directorates", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Directorates lookup data`, err.message); });
    }

    private loadNAOTypes = (): void => {
        this.naoTypeService.readAll().then((data: types.IEntity[]): types.IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, "NAOTypes", data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading NAOTypes lookup data`, err.message); });
    }


    private onAfterLoad = (entity: types.IEntity): void => {

        //console.log('after load', this.state.LookupData.Users);
        //const arrCopy = [...this.state.ArrLinks];
        this.addBlankLinkItem();

    }


    private saveData = (): void => {
        if(this.saveInProgress === false){
            this.saveInProgress = true;
            this.savePublicationLinksToSingleValue();    
        }

        
        //console.log('after savePublicationLinksToSingleValue');
        
    }

    private savePublicationLinksToSingleValue = (): void => {

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
        fd.PublicationLink = singleStr;

        this.setState({ FormData: fd }, this.saveDataFinal);

    }

    private saveDataFinal = (): void => {

        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);

            let f: INAOPublication = { ...this.state.FormData };

            //remove all the child and parent entities before sending post/patch
            delete f.NAOPublicationDirectorates;
            delete f.NAOPeriods;

            if (f.ID === 0) {


                this.naoPublicationService.create(f).then(this.saveChildEntitiesAfterCreate).then(this.onAfterCreate).then(this.props.onSaved, (err) => {
                    if (this.props.onError){
                        this.saveInProgress = false;
                        this.props.onError(`Error creating item`, err.message);
                    } 
                });

            }
            else {


                this.naoPublicationService.updatePut(f.ID, f).then(this.saveChildEntitiesAfterUpdate).then(this.onAfterUpdate).then(this.props.onSaved, (err) => {
                    if (this.props.onError){
                        this.saveInProgress = false;
                        this.props.onError(`Error updating item`, err.message);
                    }
                });

            }
        }

    }

    private saveChildEntitiesAfterCreate = (parentEntity: INAOPublication): Promise<any> => {
        let promises = [];

        if (this.childEntities) {
            this.childEntities.forEach((ce) => {


                const assignments = this.state.FormData[ce.ObjectParentProperty];

                if (assignments) {

                    this.state.FormData[ce.ObjectParentProperty].forEach((c) => {
                        c[ce.ParentIdProperty] = parentEntity.ID;
                        if (c.ID === 0) {
                            promises.push(ce.ChildService.create(c));

                        }

                    });
                }


            });

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
            return Promise.all(promises).then(() => this.state.FormData);
        }
    }

    private onAfterUpdate(): Promise<any> { return Promise.resolve(); }

    private onAfterCreate(): Promise<any> {
        console.log('onAfterCreate');
        return Promise.resolve();
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

        if ((this.state.FormData.NAOPublicationDirectorates.length === 0)) {
            errMsg.Directorate = "Directorate(s) required";
            returnVal = false;
        }
        else {
            errMsg.Directorate = null;
        }

        if ((this.state.FormData.NAOTypeId === null)) {
            errMsg.Type = "Type required";
            returnVal = false;
        }
        else {
            errMsg.Type = null;
        }

        if ((this.state.FormData.Year === null) || (this.state.FormData.Year === '')) {
            errMsg.Year = "Year required";
            returnVal = false;
            console.log('Year required');
        }
        else {
            errMsg.Year = null;
        }

        if ((this.state.FormData.CurrentPeriodTitle === null) || (this.state.FormData.CurrentPeriodTitle === '')) {
            errMsg.CurrentPeriodTitle = "Period Title required";
            returnVal = false;
        }
        else {
            errMsg.CurrentPeriodTitle = null;
        }

        if ((this.state.FormData.CurrentPeriodStartDate === null)) {
            errMsg.CurrentPeriodStartDate = "Period Start Date required";
            returnVal = false;
        }
        else {
            errMsg.CurrentPeriodStartDate = null;
        }

        if ((this.state.FormData.CurrentPeriodEndDate === null)) {
            errMsg.CurrentPeriodEndDate = "Period End Date required";
            returnVal = false;
        }
        else {
            errMsg.CurrentPeriodEndDate = null;
        }



        //at the end set state
        this.setState({ ErrMessages: errMsg });

        if(returnVal === false){
            this.saveInProgress = false;
        }

        return returnVal;


    }

    private cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
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

    private changeTextField = (value: string, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true });
    }

    private changeDropdown = (option: IDropdownOption, f: string, index?: number): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, option.key), FormIsDirty: true });
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

    private changeCheckbox = (value: boolean, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true });
    }

    // private changeDatePicker = (date: Date, f: string): void => {
    //     this.setState({ FormData: this.cloneObject(this.state.FormData, f, date), FormIsDirty: true });
    // }
    //#endregion Form Operations

}