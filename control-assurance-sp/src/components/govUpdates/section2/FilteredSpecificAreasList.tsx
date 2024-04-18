import * as React from 'react';
import { DetailsList, SelectionMode, IColumn, ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import { SearchObjectService } from '../../../services';
import { IEntity } from '../../../types';
import { ElementStatuses, RAGRatings, searchBoxStyle, toolbarStyle } from '../../../types/AppGlobals';
export { IObjectWithKey, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { CommandBarButton } from 'office-ui-fabric-react/lib/Button';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import '../../../styles/CustomFabric2.scss';

const controlStyles = {
    root: {
        margin: '5px 10px 0 0', //top, right, bottom, left
        maxWidth: '301px',
    }
};

export interface IFilteredSpecificAreasListProps {
    className?: string;
    columns: IColumn[];
    items: any[];
    filterText?: string;
    incompleteOnly: boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine: boolean;
    onChangeJustMine: (value: boolean) => void;
    onFilterChange: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
    onItemTitleClick: (ID: number, goElementId: number, title: string, filteredItems: any[]) => void;
    selection?: ISelection;
    onAssign: () => void;
    assignDisabled: boolean;
}

export interface IFilteredSpecificAreasListState {
    Columns: IColumn[];
    FilteredItems: any[];
}

export class FilteredSpecificAreasList extends React.Component<IFilteredSpecificAreasListProps, IFilteredSpecificAreasListState> {

    private ratingImg1: string = require('../../../images/goelement/list/rating/1.png');
    private ratingImg2: string = require('../../../images/goelement/list/rating/2.png');
    private ratingImg3: string = require('../../../images/goelement/list/rating/3.png');
    private ratingImg4: string = require('../../../images/goelement/list/rating/4.png');
    private ratingImg5: string = require('../../../images/goelement/list/rating/5.png');
    private ratingImg6: string = require('../../../images/goelement/list/rating/6.png');
    private ratingImg7: string = require('../../../images/goelement/list/rating/7.png');
    private ratingImg8: string = require('../../../images/goelement/list/rating/8.png');
    private ratingImg9: string = require('../../../images/goelement/list/rating/9.png');
    private ratingImg0: string = require('../../../images/goelement/list/rating/0.png');
    private statusImgNotStarted: string = require('../../../images/goelement/list/status/notstarted.png');
    private statusImgInProgress: string = require('../../../images/goelement/list/status/inprogress.png');
    private statusImgCompleted: string = require('../../../images/goelement/list/status/completed.png');
    constructor(props: IFilteredSpecificAreasListProps) {
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
                    <Toggle
                        onText="Incomplete Only"
                        offText="Incomplete Only"
                        styles={controlStyles}
                        checked={props.incompleteOnly}
                        onChanged={(isChecked) => props.onChangeIncompleteOnly(isChecked)}
                    />

                    <Toggle
                        onText="Just Mine"
                        offText="Just Mine"
                        styles={controlStyles}
                        checked={props.justMine}
                        onChanged={(isChecked) => props.onChangeJustMine(isChecked)}
                    />

                    {(props.assignDisabled === false) &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Assign' }}
                            className={toolbarStyle.cmdBtn}
                            text="Assign"
                            onClick={props.onAssign}
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

    public componentDidUpdate(prevProps: IFilteredSpecificAreasListProps): void {

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

        if (column.key === "CompletionStatus") {
            let statusImg: string = "";

            if (fieldContent === ElementStatuses.ToBeCompleted) {
                statusImg = this.statusImgNotStarted;
            }
            else if (fieldContent === ElementStatuses.InProgress) {
                statusImg = this.statusImgInProgress;
            }
            else if (fieldContent === ElementStatuses.Completed) {
                statusImg = this.statusImgCompleted;
            }

            return (
                <img src={statusImg} />
            );
        }

        else if (column.key === "Rating") {
            let ratingImg: string = "";

            if (fieldContent === RAGRatings.Unsatisfactory) {
                ratingImg = this.ratingImg1;
            }
            else if (fieldContent === RAGRatings.Limited) {
                ratingImg = this.ratingImg2;
            }
            else if (fieldContent === RAGRatings.Moderate) {
                ratingImg = this.ratingImg3;
            }
            else if (fieldContent === RAGRatings.Substantial) {
                ratingImg = this.ratingImg4;
            }
            else if (fieldContent === RAGRatings.Red) {
                ratingImg = this.ratingImg5;
            }
            else if (fieldContent === RAGRatings.RedAmber) {
                ratingImg = this.ratingImg6;
            }
            else if (fieldContent === RAGRatings.Amber) {
                ratingImg = this.ratingImg7;
            }
            else if (fieldContent === RAGRatings.AmberGreen) {
                ratingImg = this.ratingImg8;
            }
            else if (fieldContent === RAGRatings.Green) {
                ratingImg = this.ratingImg9;
            }
            else {
                //no data
                ratingImg = this.ratingImg0;
            }
            return (
                <img src={ratingImg} />
            );
        }
        else if (column.key === "Title") {

            const id: number = item["ID"];
            const goElementId: number = item["GoElementId"];
            return (
                <span><a className="titleLnk" onClick={(ev) => this.props.onItemTitleClick(id, goElementId, fieldContent, this.state.FilteredItems)} > {fieldContent}</a> </span>
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
