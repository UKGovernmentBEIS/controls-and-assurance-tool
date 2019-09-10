import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { EntityService } from '../services/EntityService';
import { IEntity } from './Entity';

/* TasMay19 */
export interface IGenColumn extends IColumn{
    columnType: ColumnType;
    columnDisplayType?: ColumnDisplayType;
    numRows?: number;
    isRequired?: boolean;
    fieldMaxLength?: number;
    //numbersOnly?: boolean;
    isParent?: boolean;
    parentService?: EntityService<IEntity>;
    parentEntityName?: string;
    parentColumnName?: string;
    idFieldName?: string;
    fieldDisabled?: boolean;
    fieldDefaultValue?: any;
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

/* TasMay19 */
export enum ColumnDisplayType {
    ListAndForm,
    FormOnly,
    ListOnly
}

