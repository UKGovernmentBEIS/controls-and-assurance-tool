import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { BaseForm } from '../BaseForm';
import { CrTextField } from '../cr/CrTextField';
import { CrDatePicker } from '../cr/CrDatePicker';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import { IEntity } from '../../types';
import { EntityService } from '../../services';
import { CrDropdown } from '../cr/CrDropdown';
import { CrEntityPicker } from '../cr/CrEntityPicker';
import { CrCheckbox } from '../cr/CrCheckbox';
import { changeDatePicker } from '../../types/AppGlobals';
import styles from '../../styles/cr.module.scss';


export class EntityForm extends BaseForm<types.IEntityFormProps, types.ICrFormState<types.IEntity, types.ICrFormValidations>, types.IEntity> {
    protected entityService: services.EntityService<types.IEntity> = this.props.entityService;
    protected EntityName = this.props.entityName;

    constructor(props: types.IEntityFormProps, state: types.ICrFormState<types.IEntity, types.ICrFormValidations>) {
        super(props);
        this.state = new types.CrFormState(new types.Entity(), new types.CrFormValidations());
    }
    public renderFormFields() {
        const columns: IGenColumn[] = (this.props["columns"]).filter(c => c.columnDisplayType != ColumnDisplayType.ListOnly);


        return (
            <div>
                {columns && columns.map((c) =>
                    this.renderFormField(c)
                )}

            </div>
        );
    }

    private renderFormField(c: IGenColumn) {
        if (c.columnType === ColumnType.TextBox)
            return this.renderTextField(c);

        else if (c.columnType === ColumnType.DropDown)
            return this.renderDropdown(c);

        else if (c.columnType === ColumnType.TagPickerForUser)
            return this.renderTagPickerForUser(c);

        else if (c.columnType === ColumnType.TagPicker)
            return this.renderTagPicker(c);

        else if (c.columnType === ColumnType.Checkbox)
            return this.renderCheckbox(c);

        else if (c.columnType === ColumnType.DatePicker)
            return this.renderDateField(c);

        else
            return null;

    }

    protected renderTextField(c: IGenColumn) {

        let tempMultiline: boolean = false;
        let tempNumRows: number = 1;

        if (c.numRows != null && c.numRows > 1) {
            tempNumRows = c.numRows;
            tempMultiline = true;
        }

        if(c.fieldHiddenInForm === true) return null;
        return (
            <div key={`div_TextField_${c.fieldName}`}>
                <CrTextField key={c.fieldName}
                    disabled={(c.fieldDisabled) ? c.fieldDisabled : false}
                    label={c.name}
                    required={c.isRequired}
                    rows={tempNumRows}
                    multiline={tempMultiline}
                    //numbersOnly={c.numbersOnly}
                    maxLength={c.fieldMaxLength}
                    value={this.state.FormData[c.fieldName]}
                    onChanged={(v) => this.changeTextField(v, c.fieldName)}
                    errorMessage={this.state.ValidationErrors[c.fieldName]} />
                <br key={`div_TextField_${c.fieldName}_br`}
                />

            </div>
        );
    }

    protected renderDateField(c: IGenColumn) {
        return (
            <div key={`div_TextField_${c.fieldName}`}>
                <CrDatePicker
                    disabled={(c.fieldDisabled) ? c.fieldDisabled : false}
                    label={c.name}
                    className={styles.formField}
                    value={this.state.FormData[c.fieldName]}
                    onSelectDate={(v) => changeDatePicker(this, v, c.fieldName)}
                    required={c.isRequired}
                />

            </div>
        );
    }


    protected renderDropdown(c: IGenColumn) {
        const d = this.state.LookupData[c.parentEntityName];
        if (d) {
            return (
                <div key={`div_CrDropdown_${c.fieldName}`}>
                    <CrDropdown
                        disabled={(c.fieldDisabled) ? c.fieldDisabled : false}
                        key={c.idFieldName}
                        label={c.name}
                        placeholder="Select an Option"
                        required={c.isRequired}
                        options={services.LookupService.entitiesToSelectableOptions(d)}
                        selectedKey={this.state.FormData[c.idFieldName]}
                        onChanged={(v) => this.changeDropdown(v, c.idFieldName)}
                        errorMessage={this.state.ValidationErrors[c.idFieldName]} />

                    <br key={`div_CrDropdown_${c.fieldName}_br`} />
                </div>
            );
        }
        else
            return null;

    }

    protected renderTagPickerForUser(c: IGenColumn) {
        const d = this.state.LookupData[c.parentEntityName];
        if (d) {
            return (
                <div key={`div_CrEntityPicker_${c.fieldName}`}>
                    <CrEntityPicker
                        disabled={(c.fieldDisabled) ? c.fieldDisabled : false}
                        key={c.idFieldName}
                        label={c.name}
                        required={c.isRequired}
                        entities={d}
                        itemLimit={1}
                        displayForUser={true}
                        selectedEntities={this.state.FormData[c.idFieldName] && [this.state.FormData[c.idFieldName]]}
                        onChange={(v) => this.changeUserPicker(v, c.idFieldName)}
                        errorMessage={this.state.ValidationErrors[c.idFieldName]} />
                    <br key={`div_CrEntityPicker_${c.fieldName}_br`} />
                </div>
            );
        }
        else
            return null;
    }

    protected renderTagPicker(c: IGenColumn) {

        const d = this.state.LookupData[c.parentEntityName];
        if (d) {
            return (
                <div key={`div_CrEntityPicker2_${c.fieldName}`}>
                    <CrEntityPicker
                        disabled={(c.fieldDisabled) ? c.fieldDisabled : false}
                        key={c.idFieldName}
                        label={c.name}
                        required={c.isRequired}
                        entities={d}
                        itemLimit={1}
                        selectedEntities={this.state.FormData[c.idFieldName] && [this.state.FormData[c.idFieldName]]}
                        onChange={(v) => this.changeUserPicker(v, c.idFieldName)}
                        errorMessage={this.state.ValidationErrors[c.idFieldName]} />
                    <br key={`div_CrEntityPicker2_${c.fieldName}_br`} />
                </div>
            );
        }
        else
            return null;

    }

    protected renderCheckbox(c: IGenColumn) {
        return (

            <CrCheckbox
                disabled={(c.fieldDisabled) ? c.fieldDisabled : false}
                key={c.fieldName}
                className={`${styles.formField} ${styles.checkbox}`}
                label={c.name}
                checked={this.state.FormData[c.fieldName]}
                onChange={(ev, isChecked) => this.changeCheckbox(isChecked, c.fieldName)}
            />

        );
    }

    protected validateEntity = (): boolean => {
        const columns: IGenColumn[] = this.props["columns"];
        const { FormData, ValidationErrors } = this.state;
        let valid: boolean = true;

        columns.map((c) => {

            if (c.isParent === true) {
                if (c.isRequired === true && c.columnType !== ColumnType.DisplayInListOnly && (FormData[c.idFieldName] === null || FormData[c.idFieldName] === '' || FormData[c.idFieldName] === undefined)) {
                    ValidationErrors[c.idFieldName] = `${c.name} is required`;
                    valid = false;
                }
            }
            else if (c.isRequired === true && (FormData[c.fieldName] === null || FormData[c.fieldName] === '' || FormData[c.fieldName] === undefined)) {

                ValidationErrors[c.fieldName] = `${c.name} is required`;
                valid = false;
            }
            else
                ValidationErrors[c.fieldName] = null;

        });
        //const keys = Object.keys(ValidationErrors).length;

        ValidationErrors.Valid = valid;
        this.setState({ ValidationErrors: ValidationErrors });
        return valid;
    }

    protected loadLookups(): Promise<any> {
        const columns: IGenColumn[] = this.props["columns"];

        let proms: any[] = [];

        columns.map((c) => {
            if (c.isParent === true && c.columnType !== ColumnType.DisplayInListOnly) {
                proms.push(this.loadParentData(c.parentService, c.parentEntityName));


            }

        });
        return Promise.all(proms);
    }
    protected loadParentData = (entityService: EntityService<IEntity>, entityName: string): Promise<IEntity[]> => {
        return entityService.readAllForUser().then((data: IEntity[]): IEntity[] => {
            this.setState({ LookupData: this.cloneObject(this.state.LookupData, entityName, data) });
            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading ${entityName} lookup data`, err.message); });
    }

    protected onAfterLoad = (entity: types.IEntity): void => {
        const columns: IGenColumn[] = this.props["columns"];
        console.log('on after load....');
        columns.map((c) => {
            if (c.fieldDefaultValue) {
                if(c.columnType == ColumnType.TextBox){
                    this.setState({ FormData: this.cloneObject(this.state.FormData, c.fieldName, c.fieldDefaultValue) });
                }
                else
                {
                    //mostly used for dropdown
                    this.setState({ FormData: this.cloneObject(this.state.FormData, c.idFieldName, c.fieldDefaultValue) });
                }
                
            }

        });
    }
}
