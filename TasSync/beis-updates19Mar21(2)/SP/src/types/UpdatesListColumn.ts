import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';


export interface IUpdatesListColumn extends IColumn{
    columnDisplayType?: ColumnDisplayTypes;
}

export enum ColumnDisplayTypes {
    Hidden,
}

