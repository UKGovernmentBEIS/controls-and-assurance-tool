import * as React from 'react';
import { DetailsList, SelectionMode, IColumn, ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import { SearchObjectService } from '../../../services';
import { IEntity } from '../../../types';
import { ElementStatuses, RAGRatings } from '../../../types/AppGlobals';
export { IObjectWithKey, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { CommandBarButton } from 'office-ui-fabric-react/lib/Button';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import '../../../styles/CustomFabric2.scss';



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

export interface IFilteredSpecificAreasListProps {
    className?: string;
    columns: IColumn[];
    items: any[];
    filterText?: string;

    incompleteOnly: boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine: boolean;
    onChangeJustMine: (value: boolean) => void;
    onFilterChange: (value: string) => void;
    onItemTitleClick: (ID: number, goElementId: number, title: string, filteredItems: any[]) => void;

    selection?: ISelection;
    //onAdd: () => void;
    onAssign: () => void;
    //onDelete: () => void;


    assignDisabled: boolean;
    //deleteDisabled: boolean;
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

                <div className={classNames.controlWrapper}>

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
                            className={classNames.cmdBtn}
                            text="Assign"
                            onClick={props.onAssign}
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

            //let txtColor: string = "white";
            //let bgColor: string = "";
            let statusImg:string = "";

            if (fieldContent === ElementStatuses.ToBeCompleted) {
                //bgColor = "rgb(230,230,230)";
                //txtColor = "black";
                statusImg = this.statusImgNotStarted;
            }
            else if (fieldContent === ElementStatuses.InProgress) {
                //bgColor = "rgb(255,191,0)";
                //txtColor = "white";
                statusImg = this.statusImgInProgress;
            }
            // else if (fieldContent === ElementStatuses.ReqSignOff) {
            //     bgColor = "rgb(185,0,185)";
            //     txtColor = "white";
            // }
            else if (fieldContent === ElementStatuses.Completed) {
                //bgColor = "rgb(0,127,0)";
                //txtColor = "white";
                statusImg = this.statusImgCompleted;
            }

            return (
                // <span style={{ backgroundColor: bgColor, color: txtColor, width: "140px", display: "block", paddingLeft: "10px", paddingTop: "5px", paddingBottom: "5px" }}>
                //     {fieldContent}
                // </span>
                <img src={statusImg} />

            );
        }

        else if (column.key === "Rating") {
            //let txtColor: string = "white";
            //let bgColor: string = "";
            //const ragLabel = fieldContent;
            let ratingImg:string = "";

            if (fieldContent === RAGRatings.Unsatisfactory) {
                //bgColor = "rgb(237,31,39)";
                //txtColor = "white";
                ratingImg = this.ratingImg1;
            }
            else if (fieldContent === RAGRatings.Limited) {
                //bgColor = "rgb(255,127,40)";
                //txtColor = "white";
                ratingImg = this.ratingImg2;
            }
            else if (fieldContent === RAGRatings.Moderate) {
                //bgColor = "rgb(242,231,1)";
                //txtColor = "black";
                ratingImg = this.ratingImg3;
            }
            else if (fieldContent === RAGRatings.Substantial) {
                //bgColor = "rgb(30,148,66)";
                //txtColor = "white";
                ratingImg = this.ratingImg4;
            }
            else if (fieldContent === RAGRatings.Red) {
                //bgColor = "rgb(237,31,39)";
                //txtColor = "white";
                ratingImg = this.ratingImg5;
            }
            else if (fieldContent === RAGRatings.RedAmber) {
                //bgColor = "rgb(255,127,40)";
                //txtColor = "white";
                ratingImg = this.ratingImg6;
            }
            else if (fieldContent === RAGRatings.Amber) {
                //bgColor = "rgb(242,231,1)";
                //txtColor = "black";
                ratingImg = this.ratingImg7;
            }
            else if (fieldContent === RAGRatings.AmberGreen) {
                //bgColor = "rgb(30,148,66)";
                //txtColor = "white";
                ratingImg = this.ratingImg8;
            }
            else if (fieldContent === RAGRatings.Green) {
                //bgColor = "rgb(30,148,66)";
                //txtColor = "white";
                ratingImg = this.ratingImg9;
            }
            else {
                //no data
                //bgColor = "rgb(230,230,230)";
                //txtColor = "black";
                ratingImg = this.ratingImg0;
            }
            return (
                // <span style={{ backgroundColor: bgColor, color: txtColor, width: "140px", display: "block", paddingLeft: "10px", paddingTop: "5px", paddingBottom: "5px" }}>
                //     {ragLabel}
                // </span>

                // <span style={{ backgroundImage: `url('${this.redIcon}')`, backgroundRepeat:'no-repeat', color: txtColor, width: "140px", display: "block", paddingLeft: "10px", paddingTop: "5px", paddingBottom: "5px" }}>
                //     {ragLabel}
                // </span>
                <img src={ratingImg} />

            );
        }
        else if (column.key === "Title") {

            const id: number = item["ID"];
            const goElementId: number = item["GoElementId"];
            return (
                <span><a className="titleLnk" onClick={(ev) => this.props.onItemTitleClick(id, goElementId, fieldContent, this.state.FilteredItems)} > {fieldContent}</a> </span>
                // <span>{fieldContent}</span>
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
