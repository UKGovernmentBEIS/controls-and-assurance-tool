import * as React from 'react';
import * as types from '../types';
import { IPeriod, IEntity } from '../types';
import * as services from '../services';
import styles from '../styles/cr.module.scss';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { FormButtons } from './cr/FormButtons';
import { IComboBoxOption } from 'office-ui-fabric-react/lib/ComboBox';
import { FieldErrorMessage } from './cr/FieldDecorators';
import { ICrMultiDropdownWithTextValue } from './cr/CrMultiDropdownWithText';
import { CrLoadingOverlay } from './cr/CrLoadingOverlay';
import { FormCommandBar } from './cr/FormCommandBar';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

export interface IEntityFormState extends types.ICrFormState<types.IEntity, types.ICrFormValidations> { }

export abstract class BaseForm<P extends types.IEntityFormProps, S extends IEntityFormState, E extends types.IEntity> extends React.Component<P, S> {
    protected abstract entityService: services.EntityService<E>;
    protected periodService: services.PeriodService = new services.PeriodService(this.props.spfxContext, this.props.api);


    protected abstract EntityName: string;
    protected childEntities: types.IFormDataChildEntities[];

    constructor(props: P) {
        super(props);
    }

    public render(): React.ReactElement<P> {
        const errors = this.state.ValidationErrors;
        return (
            <Panel isOpen={this.props.showForm} headerText={this.EntityName} type={PanelType.medium} onRenderNavigation={() => <FormCommandBar onSave={this.saveEntity} onCancel={this.props.onCancelled} />}>
                <div className={styles.cr}>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderFormFields()}
                    <FormButtons primaryStatus={this.state.FormSaveStatus} primaryDisabled={!this.state.FormIsDirty || this.state.FormSaveStatus === types.SaveStatus.Pending} secondaryDisabled={this.state.FormSaveStatus === types.SaveStatus.Pending} onPrimaryClick={this.saveEntity} onSecondaryClick={this.props.onCancelled} />
                    {!errors.Valid && <FieldErrorMessage value="The values you have entered have the following errors:" />}
                    {!errors.Valid && Object.keys(errors).map((e, i) => { if (e !== 'FormMessage' && errors[e] !== null) return (<FieldErrorMessage key={i} value={errors[e]} />); })}
                </div>
            </Panel>
        );
    }

    public abstract renderFormFields(): JSX.Element;

    //#region Form initialisation

    public componentDidMount(): void {
        this.setState({ Loading: true });
        let loadingPromises = [this.loadLookups()];
        if (this.props.entityId) {
            loadingPromises.push(this.loadEntity(this.props.entityId));
        }
        Promise.all(loadingPromises).then(p => this.onAfterLoad(p[1])).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));
    }

    protected loadLookups(): Promise<any> { return Promise.resolve(); }

    protected loadEntity = (id: number): Promise<void | E> => {
        let x = this.entityService.read(id, true, true).then((entity: E): E => {
            this.setState({ FormIsDirty: false, FormData: this.cloneObject(entity), FormDataBeforeChanges: this.cloneObject(entity) });
            //console.log(entity);
            return entity;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading form data`, err.message); });

        return x;
    }

    protected onAfterLoad = (entity: E): void => { };



    // protected loadPeriods = (): Promise<void |IPeriod[]> => {
    //     return this.periodService.readAll().then((at: IPeriod[]): IPeriod[] => {
    //         this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'Periods', at) });
    //         return at;
    //     }, (err) => { if (this.props.onError) this.props.onError(`Error loading attribute types lookup data`, err.message); });
    // }













    //#endregion

    //#region Form change handlers

    protected changeTextField = (value: string, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true });
    }

    protected changeNumberField = (value: number, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true });
    }

    protected changeDatePicker = (date: Date, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, date), FormIsDirty: true });
    }

    protected changeDropdown = (option: IDropdownOption, f: string, index?: number): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, option.key), FormIsDirty: true });
    }

    protected changeComboBox = (option: IComboBoxOption, f: string, index?: number): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, option.key), FormIsDirty: true });
    }

    protected changeChoiceGroup = (option: IChoiceGroupOption, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, Number(option.key)), FormIsDirty: true });
    }

    protected changeCheckbox = (value: boolean, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value), FormIsDirty: true });
    }

    protected changeUserPicker = (value: number[], f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value.length === 1 ? value[0] : null), FormIsDirty: true });
    }

    protected changeMultiUserPicker = (value: number[], f: string, newEntity: object, userIdProperty: string): void => {
        const loadedUsers = this.cloneObject(this.state.FormDataBeforeChanges);
        let newUsers = [];
        value.forEach((userId) => {
            let existingUser = loadedUsers[f] ? loadedUsers[f].map(user => user[userIdProperty]).indexOf(userId) : -1;
            if (existingUser !== -1)
                newUsers.push(loadedUsers[f][existingUser]);
            else {
                let newUser = { ...newEntity };
                newUser[userIdProperty] = userId;
                newUsers.push(newUser);
            }
        });
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, newUsers), FormIsDirty: true });
    }

    protected changeMultiDropdown = (item: IDropdownOption, f: string, newEntity: object, optionIdProperty: string): void => {
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

    protected changeMultiDropdownWithText = (value: ICrMultiDropdownWithTextValue[], f: string, newEntity: object, optionIdProperty: string, textValueProperty: string): void => {
        const formValues = this.cloneObject(this.state.FormData);
        let newChoices = [];
        value.forEach((val) => {
            let existingValue = formValues[f] ? formValues[f].map(v => v[optionIdProperty]).indexOf(val.Key) : -1;
            if (existingValue !== -1) {
                let editChoice = this.cloneObject(formValues[f][existingValue]);
                editChoice[textValueProperty] = val.Text;
                newChoices.push(editChoice);
            }
            else {
                let newChoice = { ...newEntity };
                newChoice[optionIdProperty] = val.Key;
                newChoice[textValueProperty] = val.Text;
                newChoices.push(newChoice);
            }
        });
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, newChoices), FormIsDirty: true });
    }

    //#endregion

    //#region Validations

    protected validSqlDecimal(num: number, decimalPrecision?: number, decimalScale?: number): boolean {
        if (num.toString().indexOf('.') !== -1) {
            let p = num.toString().split('.')[0];
            let s = num.toString().split('.')[1];
            if (p.length <= ((decimalPrecision || 18) - (decimalScale || 4)) && s.length <= (decimalScale || 4))
                return true;
            return false;
        } else {
            if (num.toString().length <= ((decimalPrecision || 18) - (decimalScale || 4)))
                return true;
            return false;
        }
    }

    protected validateEntity = (): boolean => {
        return true;
    }

    //#endregion

    //#region Form operations

    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }
    protected cloneArray(array): any[] { return [...array]; }
    protected onBeforeSave(entity: E): void { }
    protected onAfterCreate(entity: E): Promise<any> { return Promise.resolve(); }
    protected onAfterUpdate(): Promise<any> { return Promise.resolve(); }

    protected saveEntity = (): void => {
        if (this.validateEntity()) {
            if (this.props.onError) this.props.onError(null);
            this.setState({ FormSaveStatus: types.SaveStatus.Pending });
            const d = this.cloneObject(this.state.FormData); // Typescript version 2.4.2 (current SPFx) does not allow this here: { ...this.state.FormData };
            if (this.entityService.parentEntities) this.entityService.parentEntities.forEach(p => delete d[p]);
            if (this.childEntities) this.childEntities.forEach(c => delete d[c.ObjectParentProperty]);
            this.onBeforeSave(d);
            if (d.ID === 0) {
                this.entityService.create(d).then(this.saveChildEntitiesAfterCreate).then(this.onAfterCreate).then(this.props.onSaved, (err) => {
                    this.setState({ FormSaveStatus: types.SaveStatus.Error });
                    if (this.props.onError) this.props.onError(`Error creating item`, err.message);
                });
            }
            else {
                this.entityService.update(d.ID, d).then(this.saveChildEntitiesAfterUpdate).then(this.onAfterUpdate).then(this.props.onSaved, (err) => {
                    this.setState({ FormSaveStatus: types.SaveStatus.Error });
                    if (this.props.onError) this.props.onError(`Error updating item`, err.message);
                });
            }
        }
    }

    protected saveChildEntitiesAfterCreate = (parentEntity: E): Promise<any> => {
        let promises = [];
        if (this.childEntities) {
            this.childEntities.forEach((ce) => {
                this.state.FormData[ce.ObjectParentProperty].forEach((c) => {
                    c[ce.ParentIdProperty] = parentEntity.ID;
                    if (c.ID === 0)
                        promises.push(ce.ChildService.create(c));
                });
            });
            return Promise.all(promises).then(() => parentEntity);
        }
    }

    protected saveChildEntitiesAfterUpdate = (): Promise<any> => {
        let promises = [];
        if (this.childEntities) {
            this.childEntities.forEach((ce) => {
                this.state.FormData[ce.ObjectParentProperty].forEach((c) => {
                    if (c.ID === 0) {
                        c[ce.ParentIdProperty] = this.state.FormData.ID;
                        promises.push(ce.ChildService.create(c));
                    } else {
                        const loadedObject = this.state.FormDataBeforeChanges[ce.ObjectParentProperty].filter(o => o.ID === c.ID);
                        if (loadedObject && JSON.stringify(loadedObject[0]) !== JSON.stringify(c))
                            promises.push(ce.ChildService.update(c.ID, c));
                    }
                });
                this.state.FormDataBeforeChanges[ce.ObjectParentProperty].forEach((c) => {
                    if (this.state.FormData[ce.ObjectParentProperty].map(i => i[ce.ChildIdProperty]).indexOf(c[ce.ChildIdProperty]) === -1)
                        promises.push(ce.ChildService.delete(c.ID));
                });
            });
            return Promise.all(promises).then(() => this.state.FormData);
        }
    }

    //#endregion
}
