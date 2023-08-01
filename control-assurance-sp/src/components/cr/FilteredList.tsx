import * as React from 'react';
import { DetailsList, SelectionMode, IColumn, ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import { SearchObjectService } from '../../services';
export { Selection, IObjectWithKey, IColumn } from 'office-ui-fabric-react/lib/DetailsList';

export interface IFilteredListProps {
    className?: string;
    columns: IColumn[];
    items: any[];
    filterText?: string;
    selection?: ISelection;
}

export interface IFilteredListState {
    Columns: IColumn[];
    FilteredItems: any[];
}

export class FilteredList extends React.Component<IFilteredListProps, IFilteredListState> {

    constructor(props: IFilteredListProps) {
        super(props);
        props.columns.forEach((c) => { c.onColumnClick = this._onColumnClick; });
        this.state = {
            Columns: props.columns,
            FilteredItems: props.items
        };
    }

    public render(): JSX.Element {
        const { props, state } = this;
        return (<DetailsList className={props.className} selectionMode={SelectionMode.single} selection={props.selection} setKey={"state.FilteredItems"} columns={state.Columns} items={state.FilteredItems} />);
    }

    //#region Form initialisation

    public componentDidMount(): void {
        this.setState({ FilteredItems: SearchObjectService.filterEntities(this.props.items, this.props.filterText) });
    }

    public componentDidUpdate(prevProps: IFilteredListProps): void {
        if (prevProps.items !== this.props.items || prevProps.filterText !== this.props.filterText)
            this.setState({ FilteredItems: SearchObjectService.filterEntities(this.props.items, this.props.filterText) });
    }

    //#endregion

    //#region Form infrastructure

    private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        const { Columns, FilteredItems } = this.state;
        let newItems: any[] = FilteredItems.slice();
        const newColumns: IColumn[] = Columns.slice();
        const currColumn: IColumn = newColumns.filter((currCol: IColumn, idx: number) => {
            return column.key === currCol.key;
        })[0];
        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
        });
        newItems = this._sortItems(newItems, currColumn.fieldName || '', currColumn.isSortedDescending);
        this.setState({
            Columns: newColumns,
            FilteredItems: newItems
        });
    }

    private _sortItems = (items: any[], sortBy: string, descending = false): any[] => {
        return items.sort((a, b) => {
            if (!a.hasOwnProperty(sortBy) || !b.hasOwnProperty(sortBy)) {
                // property doesn't exist on either object
                return 0;
            }

            const varA = (typeof a[sortBy] === 'string') ? a[sortBy].toLowerCase() : a[sortBy];
            const varB = (typeof b[sortBy] === 'string') ? b[sortBy].toLowerCase() : b[sortBy];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return ((descending) ? (comparison * -1) : comparison);
        });
    }

    //#endregion
}
