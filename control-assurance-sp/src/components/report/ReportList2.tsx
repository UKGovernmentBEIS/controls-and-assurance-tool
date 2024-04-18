import * as React from 'react';
import { DetailsList, SelectionMode, IColumn, ISelection, IDetailsHeaderProps } from 'office-ui-fabric-react/lib/DetailsList';
import { SearchObjectService } from '../../services';
import { IEntity } from '../../types';
export { Selection, IObjectWithKey, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { RagRatingBar } from '../cr/RagRatingBar';
import '../../styles/CustomFabric2.scss';

const classNames = mergeStyleSets({
    controlWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        backgroundColor: "rgb(244,244,244)",
        padding: "5px 0px 5px 10px",
        marginBottom: "5px"
    },
});
const controlStyles = {
    root: {
        margin: '0 10px 0 0',
        maxWidth: '301px',
    }
};

const controlStyles2 = {
    marginLeft: "auto",
    display: "inline-block",
    backgroundColor: "white"
};

export interface IReportListProps {
    className?: string;
    columns: IColumn[];
    items: any[];
    filterText?: string;
    stackedBar: boolean;
    onChangeStackedBar: (value: boolean) => void;
    onFilterChange: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
    onItemTitleClick: (value: string, entityNamePlural: string) => void;
    entityNamePlural: string;
}

export interface IReportListState {
    Columns: IColumn[];
    FilteredItems: any[];
}

export class ReportList2 extends React.Component<IReportListProps, IReportListState> {

    private color1: string = "rgb(34,177,76)";
    private color1Label: string = "Substantial";
    private color2: string = "rgb(255,201,14)";
    private color2Label: string = "Moderate";
    private color3: string = "rgb(255,127,39)";
    private color3Label: string = "Limited";
    private color4: string = "rgb(237,28,36)";
    private color4Label: string = "Unsatisfactory";
    private color5: string = "rgb(0,162,232)";
    private color5Label: string = "Not Applicable";
    private barDefaultBackgroundColor: string = "rgb(200,200,200)";
    constructor(props: IReportListProps) {
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

                <div className={classNames.controlWrapper}>

                    <Toggle
                        checked={this.props.stackedBar}
                        onChanged={(isChecked) => this.props.onChangeStackedBar(isChecked)}
                        onText="Stacked Bar View"
                        offText="Stacked Bar View"
                        styles={controlStyles}
                    />
                    <span style={controlStyles2}>
                        <SearchBox
                            placeholder="Filter items"
                            value={this.props.filterText ? this.props.filterText : ''}
                            onChange={this.props.onFilterChange}
                        />
                    </span>
                </div>

                <DetailsList className={props.className} selectionMode={SelectionMode.none} setKey={"state.FilteredItems"}
                    columns={state.Columns}
                    items={state.FilteredItems}
                    onRenderItemColumn={this.renderItemColumn}
                />

                <div>
                    <div style={{ paddingTop: '40px', paddingBottom: '10px', fontWeight: 'bold' }}>
                        Legend
                    </div>
                    {/* row1 */}
                    <div style={{ display: 'flex', width: '500px', marginTop: '10px' }}>
                        <div style={{ minWidth: '150px' }}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '13px', height: '13px', marginTop: '3px', backgroundColor: this.color1 }}></div>
                                <div style={{ paddingLeft: '10px' }}>{`${this.color1Label}`}</div>
                            </div>
                        </div>
                        <div style={{ paddingLeft: '10%' }}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '13px', height: '13px', marginTop: '3px', backgroundColor: this.color2 }}></div>
                                <div style={{ paddingLeft: '10px' }}>{`${this.color2Label}`}</div>
                            </div>
                        </div>
                    </div>

                    {/* row2 */}
                    <div style={{ display: 'flex', width: '500px', marginTop: '10px' }}>
                        <div style={{ minWidth: '150px' }}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '13px', height: '13px', marginTop: '3px', backgroundColor: this.color3 }}></div>
                                <div style={{ paddingLeft: '10px' }}>{`${this.color3Label}`}</div>
                            </div>
                        </div>
                        <div style={{ paddingLeft: '10%' }}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '13px', height: '13px', marginTop: '3px', backgroundColor: this.color4 }}></div>
                                <div style={{ paddingLeft: '10px' }}>{`${this.color4Label}`}</div>
                            </div>
                        </div>
                    </div>

                    {/* row3 */}
                    <div style={{ display: 'flex', width: '500px', marginTop: '10px' }}>
                        <div style={{ minWidth: '150px' }}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '13px', height: '13px', marginTop: '3px', backgroundColor: this.color5 }}></div>
                                <div style={{ paddingLeft: '10px' }}>{`${this.color5Label}`}</div>
                            </div>
                        </div>
                        <div style={{ paddingLeft: '10%' }}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '13px', height: '13px', marginTop: '3px', backgroundColor: this.barDefaultBackgroundColor }}></div>
                                <div style={{ paddingLeft: '10px' }}>{`Not Completed`}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fabric>
        );
    }

    //#region Form initialisation

    public componentDidMount(): void {
        this.setState({ FilteredItems: SearchObjectService.filterEntities(this.props.items, this.props.filterText) }, this._onLoadTrySort);
    }

    public componentDidUpdate(prevProps: IReportListProps): void {

        if (prevProps.columns !== this.props.columns) {
            this.props.columns.forEach((c) => { c.onColumnClick = this._onColumnClick; });
            this.setState({ Columns: this.props.columns, FilteredItems: SearchObjectService.filterEntities(this.props.items, this.props.filterText) }, this._onLoadTrySort);
        }
        else if (prevProps.items !== this.props.items || prevProps.filterText !== this.props.filterText) {

            this.setState({ FilteredItems: SearchObjectService.filterEntities(this.props.items, this.props.filterText) }, this._onLoadTrySort);
        }
    }

    //#endregion

    //#region Form infrastructure

    private renderItemColumn = (item: IEntity, index: number, column: IColumn) => {
        let fieldContent = item[column.fieldName as keyof IEntity] as string;

        if (column.key === "ControlsBar") {

            const totalAUnsatisfactory: number = Number(item["TotalAUnsatisfactory"]);
            const totalALimited: number = Number(item["TotalALimited"]);
            const totalAModerate: number = Number(item["TotalAModerate"]);
            const totalASubstantial: number = Number(item["TotalASubstantial"]);
            const totalANotApplicable: number = Number(item["TotalANotApplicable"]);
            return (
                <RagRatingBar
                    barWidth='208px'
                    barHeight={this.props.stackedBar === true ? '28px' : '14px'}
                    barDefaultBackgroundColor={this.barDefaultBackgroundColor}
                    noDataLabel='Not Completed'
                    color1={this.color1}
                    color1Percentage={totalASubstantial}
                    color1Label='Substantial'
                    color2={this.color2}
                    color2Percentage={totalAModerate}
                    color2Label='Moderate'
                    color3={this.color3}
                    color3Percentage={totalALimited}
                    color3Label='Limited'
                    color4={this.color4}
                    color4Percentage={totalAUnsatisfactory}
                    color4Label='Unsatisfactory'
                    color5={this.color5}
                    color5Percentage={totalANotApplicable}
                    color5Label='Not Applicable'
                    showInfoSection={false}
                    displayPercentageBarView={!this.props.stackedBar}
                />
            );
        }
        else if (column.key === "AssuranceBar") {

            const totalB1Unsatisfactory: number = Number(item["TotalB1Unsatisfactory"]);
            const totalB1Limited: number = Number(item["TotalB1Limited"]);
            const totalB1Moderate: number = Number(item["TotalB1Moderate"]);
            const totalB1Substantial: number = Number(item["TotalB1Substantial"]);
            const totalB1NotApplicable: number = Number(item["TotalB1NotApplicable"]);

            return (
                <RagRatingBar
                    barWidth='208px'
                    barHeight={this.props.stackedBar === true ? '28px' : '14px'}
                    barDefaultBackgroundColor='lightgray'
                    noDataLabel='Not Completed'
                    color1={this.color1}
                    color1Percentage={totalB1Substantial}
                    color1Label='Substantial'
                    color2={this.color2}
                    color2Percentage={totalB1Moderate}
                    color2Label='Moderate'
                    color3={this.color3}
                    color3Percentage={totalB1Limited}
                    color3Label='Limited'
                    color4={this.color4}
                    color4Percentage={totalB1Unsatisfactory}
                    color4Label='Unsatisfactory'
                    color5={this.color5}
                    color5Percentage={totalB1NotApplicable}
                    color5Label='Not Applicable'
                    showInfoSection={false}
                    displayPercentageBarView={!this.props.stackedBar}
                />
            );
        }
        else if (column.key === "Title") {

            if (this.props.entityNamePlural === "Themes") {
                return <span>{fieldContent}</span>;
            }
            else {
                return (
                    <span><a className="titleLnk" onClick={(ev) => this.props.onItemTitleClick(fieldContent, this.props.entityNamePlural)} > {fieldContent}</a> </span>
                );
            }
        }
        else {
            return <span>{fieldContent}</span>;
        }

    }

    private _onLoadTrySort = (): void => {
        const { Columns, FilteredItems } = this.state;
        let newItems: any[] = FilteredItems.slice();
        const newColumns: IColumn[] = Columns.slice();
        const currColumn: IColumn = newColumns.filter((currCol: IColumn, idx: number) => {
            return 'Title';
        })[0];

        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = false;
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
