import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { EntityService } from '../services/EntityService';
import { IEntity } from './Entity';

export interface IGenColumn extends IColumn{
    columnType: ColumnType;
    columnDisplayType?: ColumnDisplayType;
    numRows?: number;
    isRequired?: boolean;
    fieldMaxLength?: number;
    isParent?: boolean;
    parentService?: EntityService<IEntity>;
    parentEntityName?: string;
    parentColumnName?: string;
    idFieldName?: string;
    fieldDisabled?: boolean;
    fieldHiddenInForm?: boolean;
    fieldDefaultValue?: any;
    showDateAndTimeInList?: boolean;
}

export enum ColumnType {
    TextBox,
    DropDown,
    Checkbox,
    DatePicker,
    TagPicker,
    TagPickerForUser,
    DisplayInListOnly
}

export enum ColumnDisplayType {
    ListAndForm,
    FormOnly,
    ListOnly
}

