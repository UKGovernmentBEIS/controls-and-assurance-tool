import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { EntityService } from '../services/EntityService';
import { IEntity } from './Entity';


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
    Hidden,
}

