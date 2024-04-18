import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';

export interface IOrgRepColumn extends IColumn{
    columnDisplayType: ColumnDisplayTypes;
    aggregateControls?: boolean;
    aggregateAssurances?: boolean;
    aggregateAssurance1?: boolean;
    aggregateAssurance2?: boolean;
    aggregateAssurance3?: boolean;
}

export enum ColumnDisplayTypes {
    BreakdownsOn,
    BreakdownsOff,
    BreakdownsOnAndOff,
    StackedBarOn,
    StackedBarOff,
    StackedBarOnAndOff,
    Hidden,
}

