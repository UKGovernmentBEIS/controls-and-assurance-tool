import * as React from 'react';
import { DetailsList, SelectionMode, IColumn, ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import { SearchObjectService } from '../../services';
import { IEntity } from '../../types';
import { ElementStatuses, RAGRatings } from '../../types/AppGlobals';
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



export interface IFilteredMainListProps {
    className?: string;
    columns: IColumn[];
    items: any[];
    filterText?: string;

    incompleteOnly: boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine: boolean;
    onChangeJustMine: (value: boolean) => void;
    onFilterChange: (value: string) => void;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;

    selection?: ISelection;

    onAdd: () => void;
    onImport: () => void;
    onCheckUpdatesReq: () => void;
    onEdit: () => void;
    onDelete: () => void;

    editDisabled: boolean;
    deleteDisabled: boolean;

    superUserPermission: boolean;
    updatesReqInProgress:boolean;

    //onAdd: () => void;
    //onAssign: () => void;
    //onDelete: () => void;


    //assignDisabled: boolean;
    //deleteDisabled: boolean;
}

export interface IFilteredMainListState {
    Columns: IColumn[];
    FilteredItems: any[];
}

export class FilteredMainList extends React.Component<IFilteredMainListProps, IFilteredMainListState> {


    private statusImgNotStarted: string = require('../../images/goelement/list/status/notstarted.png');
    private statusImgInProgress: string = require('../../images/goelement/list/status/inprogress.png');
    private statusImgCompleted: string = require('../../images/goelement/list/status/completed.png');


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

                <div className={classNames.controlWrapper}>

                    <Toggle
                        onText="Incomplete Only"
                        offText="Incomplete Only"
                        styles={controlStyles}
                        checked={props.incompleteOnly}
                        onChanged={(isChecked) => props.onChangeIncompleteOnly(isChecked)}
                    />

                    <Toggle
                        onText="Just my actions"
                        offText="Just my actions"
                        styles={controlStyles}
                        checked={props.justMine}
                        onChanged={(isChecked) => props.onChangeJustMine(isChecked)}
                    />

                    {props.superUserPermission && props.editDisabled && props.deleteDisabled &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Add' }}
                            className={classNames.cmdBtn}
                            text="New"
                            onClick={props.onAdd}
                        />}

                    {props.superUserPermission && props.editDisabled && props.deleteDisabled &&
                        <CommandBarButton
                            iconProps={{ iconName: 'BuildQueueNew' }}
                            className={classNames.cmdBtn}
                            text="Import"
                            onClick={props.onImport}
                        />}

                    {props.superUserPermission && props.editDisabled && props.deleteDisabled &&
                        <CommandBarButton
                            iconProps={{ iconName: 'WorkFlow' }}
                            className={classNames.cmdBtn}
                            text="Check if req upd"
                            onClick={props.onCheckUpdatesReq}
                            disabled={props.updatesReqInProgress}
                        />}

                    {props.superUserPermission && (props.editDisabled === false) &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Edit' }}
                            className={classNames.cmdBtn}
                            text="Edit"
                            onClick={props.onEdit}
                        />}



                    {props.superUserPermission && (props.deleteDisabled === false) &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Delete' }}
                            className={classNames.cmdBtn}
                            text="Delete"
                            onClick={props.onDelete}
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

        if (column.key === "Assurance") {
            let txtColor: string = "white";
            let bgColor: string = "";
            let txt: string = "";
            //const giaaAssuranceId: number = Number(fieldContent);
            if (fieldContent === 'Advisory') {
                bgColor = "rgb(128,0,128)";
                txtColor = "white";
                txt = "Advisory";
            }
            else if (fieldContent === 'Limited') {

                bgColor = "rgb(255,128,41)";
                txtColor = "white";
                txt = "Limited";
            }
            else if (fieldContent === 'Moderate') {
                bgColor = "rgb(242,231,2)";
                txtColor = "black";
                txt = "Moderate";
            }
            else if (fieldContent === 'Substantial') {
                bgColor = "rgb(31,148,67)";
                txtColor = "white";
                txt = "Substantial";
            }
            else if (fieldContent === 'Unsatisfactory') {
                bgColor = "rgb(255,0,0)";
                txtColor = "white";
                txt = "Unsatisfactory";
            }
            else {
                bgColor = "rgb(166,166,166)";
                txtColor = "white";
                txt = "NoData";
            }
            return (
                <span style={{ backgroundColor: bgColor, color: txtColor, width: "140px", display: "block", paddingLeft: "10px", paddingTop: "5px", paddingBottom: "5px" }}>
                    {txt}
                </span>
            );
        }

        // else if (column.key === "UpdateStatus") {

        //     //let txtColor: string = "white";
        //     //let bgColor: string = "";
        //     let statusImg: string = "";

        //     if (fieldContent === ElementStatuses.ToBeCompleted) {
        //         //bgColor = "rgb(230,230,230)";
        //         //txtColor = "black";
        //         statusImg = this.statusImgNotStarted;
        //     }
        //     else if (fieldContent === ElementStatuses.InProgress) {
        //         //bgColor = "rgb(255,191,0)";
        //         //txtColor = "white";
        //         statusImg = this.statusImgInProgress;
        //     }
        //     // else if (fieldContent === ElementStatuses.ReqSignOff) {
        //     //     bgColor = "rgb(185,0,185)";
        //     //     txtColor = "white";
        //     // }
        //     else if (fieldContent === ElementStatuses.Completed) {
        //         //bgColor = "rgb(0,127,0)";
        //         //txtColor = "white";
        //         statusImg = this.statusImgCompleted;
        //     }

        //     return (
        //         // <span style={{ backgroundColor: bgColor, color: txtColor, width: "140px", display: "block", paddingLeft: "10px", paddingTop: "5px", paddingBottom: "5px" }}>
        //         //     {fieldContent}
        //         // </span>
        //         <img src={statusImg} />

        //     );
        // }
        // else if (column.key === "DGArea") {
        //     const directorate = item["Directorate"];
        //     return <span>{fieldContent} - {directorate}</span>;
        // }


        else if (column.key === "Title") {

            const id: number = item["ID"];

            return (
                <span><a className="titleLnk" onClick={(ev) => this.props.onItemTitleClick(id, fieldContent, this.state.FilteredItems)} > {fieldContent}</a> </span>
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
