import * as React from 'react';
import { DetailsList, SelectionMode, IColumn, ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import { SearchObjectService } from '../../services';
import { IEntity } from '../../types';
export { IObjectWithKey, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { CommandBarButton } from 'office-ui-fabric-react/lib/Button';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import '../../styles/CustomFabric2.scss';



const classNames = mergeStyleSets({
    controlWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        backgroundColor: "rgb(244,244,244)",
        padding: "5px 0px 5px 10px",
        marginBottom: "5px"
    },
    cmdBtn: {
        border: 'none'
    }
});
const controlStyles = {
    root: {
        margin: '5px 10px 0 0', //top, right, bottom, left
        maxWidth: '301px',
    }
};

const controlStylesB = {
    marginLeft: "auto",
    //display: "inline-block",
};

const controlStyles2 = {
    //root: {
    marginLeft: "auto",
    display: "inline-block",
    backgroundColor: "white"

    //}
};

export interface IFilteredReport1ListProps {
    className?: string;
    columns: IColumn[];
    items: any[];
    filterText?: string;
    onFilterChange: (value: string) => void;
    //onItemTitleClick: (ID: number, goElementId: number, title: string, filteredItems: any[]) => void;

    selection?: ISelection;

    onCreatePdf: () => void;
    createPdfDisabled: boolean;

    onDeletePdf: () => void;
    deletePdfDisabled: boolean;

    onDownloadPdf: () => void;
    downloadPdfDisabled: boolean;
}

export interface IFilteredReport1ListState {
    Columns: IColumn[];
    FilteredItems: any[];
}

export class FilteredReport1List extends React.Component<IFilteredReport1ListProps, IFilteredReport1ListState> {

    private statusImgNotStarted: string = require('../../images/report1/notstarted.png');
    private statusImgInProgress: string = require('../../images/report1/inprogress.png');
    private statusImgCompleted: string = require('../../images/report1/completed.png');
    private statusImgSignedOff: string = require('../../images/report1/signedoff.png');
    private statusImgNA: string = require('../../images/report1/na.png');


    constructor(props: IFilteredReport1ListProps) {
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

                    {(props.createPdfDisabled === false) &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Edit' }}
                            className={classNames.cmdBtn}
                            text="Create PDF"
                            onClick={props.onCreatePdf}
                        />}

                    {(props.deletePdfDisabled === false) &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Delete' }}
                            className={classNames.cmdBtn}
                            text="Delete PDF"
                            onClick={props.onDeletePdf}
                        />}

                    {(props.downloadPdfDisabled === false) &&
                        <CommandBarButton
                            iconProps={{ iconName: 'View' }}
                            className={classNames.cmdBtn}
                            text="Download PDF"
                            onClick={props.onDownloadPdf}
                        />}

                    <span style={controlStyles2}>



                        <SearchBox
                            placeholder="Filter items"
                            value={props.filterText ? props.filterText : ''}
                            onChange={props.onFilterChange}
                        //className={styles.listFilterBox}
                        //style={controlStyles2}
                        />
                    </span>

                </div>


                <DetailsList
                    //className="noHScroll"
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

    public componentDidUpdate(prevProps: IFilteredReport1ListProps): void {

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

        let txtColor: string = "white";
        let bgColor: string = "";

        if (column.key === "PeriodUpdateStatus") {


            if (fieldContent === "Not Started") {
                bgColor = "rgb(166,166,166)";
            }
            else if (fieldContent === "Partly Updated") {
                bgColor = "rgb(255,191,0)";
                txtColor = "black";
            }
            else if (fieldContent === "Updated") {
                bgColor = "rgb(0,127,0)";
            }

            return (
                <span style={{ backgroundColor: bgColor, color: txtColor, width: "140px", display: "block", paddingLeft: "10px", paddingTop: "5px", paddingBottom: "5px" }}>
                    {fieldContent}
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
