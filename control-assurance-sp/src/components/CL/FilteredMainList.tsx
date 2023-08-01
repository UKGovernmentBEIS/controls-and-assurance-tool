import * as React from 'react';
import { DetailsList, SelectionMode, IColumn, ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import { SearchObjectService } from '../../services';
import { IEntity } from '../../types';
import { toolbarStyle, searchBoxStyle } from '../../types/AppGlobals';
export { IObjectWithKey, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { CommandBarButton } from 'office-ui-fabric-react/lib/Button';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import '../../styles/CustomFabric2.scss';

export interface IFilteredMainListProps {
    className?: string;
    columns: IColumn[];
    items: any[];
    filterText?: string;
    onFilterChange: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    selection?: ISelection;
    onAdd: () => void;
    onDelete: () => void;
    onArchive: () => void;
    editDisabled: boolean;
    deleteDisabled: boolean;
    createPermission: boolean;
    deletePermission: boolean;
    archivedPermission: boolean;
    caseType: string;
    moveToLeavingPermission?: boolean;
    createExtensionPermission?: boolean;
    onMoveToLeaving: () => void;
    onCreateExtension: () => void;
}

export interface IFilteredMainListState {
    Columns: IColumn[];
    FilteredItems: any[];
}

export class FilteredMainList extends React.Component<IFilteredMainListProps, IFilteredMainListState> {
    constructor(props: IFilteredMainListProps) {
        super(props);
        props.columns.forEach((c) => { c.onColumnClick = this._onColumnClick; });
        this.state = {
            Columns: props.columns,
            FilteredItems: props.items,
        };
    }

    public render(): JSX.Element {
        const { props, state } = this;
        return (
            <Fabric>
                <div className={toolbarStyle.controlWrapper}>
                    {props.caseType === "BusinessCases" && props.createPermission && props.editDisabled && props.deleteDisabled &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Add' }}
                            className={toolbarStyle.cmdBtn}
                            text="New Case"
                            onClick={props.onAdd}
                        />}

                    {props.caseType === "BusinessCases" && props.deletePermission && (props.editDisabled === false) &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Delete' }}
                            className={toolbarStyle.cmdBtn}
                            text="Delete"
                            onClick={props.onDelete}
                        />}

                    {props.caseType === "Engaged" && props.moveToLeavingPermission && (props.editDisabled === false) &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Leave' }}
                            className={toolbarStyle.cmdBtn}
                            text="Move to Leaving"
                            onClick={props.onMoveToLeaving}
                        />}

                    {props.caseType === "Engaged" && props.createExtensionPermission && (props.editDisabled === false) &&
                        <CommandBarButton
                            iconProps={{ iconName: 'AddTo' }}
                            className={toolbarStyle.cmdBtn}
                            text="Create Extension"
                            onClick={props.onCreateExtension}
                        />}

                    {(props.caseType === "BusinessCases" || props.caseType === "Engaged") && props.archivedPermission && (props.editDisabled === false) &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Archive' }}
                            className={toolbarStyle.cmdBtn}
                            text="Archive"
                            onClick={props.onArchive}
                        />}

                    <span style={searchBoxStyle}>
                        <SearchBox
                            placeholder="Filter items"
                            value={props.filterText ? props.filterText : ''}
                            onChange={props.onFilterChange}
                        />
                    </span>
                </div>

                <DetailsList
                    setKey={"state.FilteredItems"}
                    selectionMode={SelectionMode.single}
                    selection={props.selection}
                    columns={state.Columns}
                    items={state.FilteredItems}
                    onRenderItemColumn={this.renderItemColumn}
                />
            </Fabric>
        );
    }

    //#region Form initialisation

    public componentDidMount(): void {
        this.setState({ FilteredItems: SearchObjectService.filterEntities(this.props.items, this.props.filterText) });
    }

    public componentDidUpdate(prevProps: IFilteredMainListProps): void {

        if (prevProps.columns !== this.props.columns) {
            this.props.columns.forEach((c) => { c.onColumnClick = this._onColumnClick; });
            this.setState({ Columns: this.props.columns, FilteredItems: SearchObjectService.filterEntities(this.props.items, this.props.filterText) });
        }
        else if (prevProps.items !== this.props.items || prevProps.filterText !== this.props.filterText) {

            this.setState({ FilteredItems: SearchObjectService.filterEntities(this.props.items, this.props.filterText) });
        }
    }

    //#endregion

    //#region Form infrastructure

    private renderItemColumn = (item: IEntity, index: number, column: IColumn) => {

        let fieldContent = item[column.fieldName as keyof IEntity] as string;
        if (column.key === "CaseRef") {
            const id: number = item["ID"];
            return (
                <span><a className="titleLnk" onClick={(ev) => this.props.onItemTitleClick(id, fieldContent, this.state.FilteredItems)} > {fieldContent}</a> </span>
            );
        }
        else if (column.key === "Title1") {

            const title2: string = item["Title2"];

            return (
                <span>{fieldContent}<br />{title2}</span>
            );
        }
        else if (column.key === "StageActions1") {
            const stageActions2: string = item["StageActions2"];
            return (
                <span>{fieldContent}
                    {stageActions2.length > 0 &&
                        <React.Fragment>
                            <br />
                            <span>{stageActions2}</span>
                        </React.Fragment>
                    }
                </span>
            );
        }
        else {
            return <span>{fieldContent}</span>;
        }
    }

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

            let varA = (typeof a[sortBy] === 'string') ? a[sortBy].toLowerCase() : a[sortBy];
            let varB = (typeof b[sortBy] === 'string') ? b[sortBy].toLowerCase() : b[sortBy];
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


