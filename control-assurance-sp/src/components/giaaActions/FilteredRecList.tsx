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
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
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

const filterDrpsStyle = {

    width: "120px",
    //marginRight: "10px",
    //marginBottom: "10px"



};

export interface IFilteredRecListProps {
    className?: string;
    columns: IColumn[];
    items: any[];
    filterText?: string;

    incompleteOnly: boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine: boolean;
    onChangeJustMine: (value: boolean) => void;

    actionStatusTypeId:number;
    onChangeActionStatusType: (option: IDropdownOption)=> void;


    onFilterChange: (value: string) => void;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;

    actionStatusTypes: IEntity[];

    selection?: ISelection;

    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;

    editDisabled: boolean;
    deleteDisabled: boolean;

    //onAdd: () => void;
    //onAssign: () => void;
    //onDelete: () => void;


    //assignDisabled: boolean;
    //deleteDisabled: boolean;
}

export interface IFilteredRecListState {
    Columns: IColumn[];
    FilteredItems: any[];
}

export class FilteredRecList extends React.Component<IFilteredRecListProps, IFilteredRecListState> {


    private statusImgNotStarted: string = require('../../images/goelement/list/status/notstarted.png');
    private statusImgInProgress: string = require('../../images/goelement/list/status/inprogress.png');
    private statusImgCompleted: string = require('../../images/goelement/list/status/completed.png');


    constructor(props: IFilteredRecListProps) {
        super(props);

        props.columns.forEach((c) => { c.onColumnClick = this._onColumnClick; });
        this.state = {
            Columns: props.columns,
            FilteredItems: props.items,
        };


    }

    public render(): JSX.Element {
        const { props, state } = this;
        let dgActionStatusTypeOptions = this.props.actionStatusTypes.map((x) => { return { key: x.ID, text: x.Title }; });
        dgActionStatusTypeOptions = [{ key: 0, text: "All Statuses" }, ...dgActionStatusTypeOptions];

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

                    <CrDropdown
                        options={dgActionStatusTypeOptions}
                        selectedKey={props.actionStatusTypeId}
                        onChanged={(v)=> props.onChangeActionStatusType(v)}
                        style={filterDrpsStyle}
                    />

                    {props.editDisabled && props.deleteDisabled &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Add' }}
                            className={classNames.cmdBtn}
                            text="New"
                            onClick={props.onAdd}
                        />}

                    {(props.editDisabled === false) &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Edit' }}
                            className={classNames.cmdBtn}
                            text="Edit"
                            onClick={props.onEdit}
                        />}



                    {(props.deleteDisabled === false) &&
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

    public componentDidUpdate(prevProps: IFilteredRecListProps): void {

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


        if (column.key === "UpdateStatus") {

            //let txtColor: string = "white";
            //let bgColor: string = "";
            let statusImg: string = "";

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
        else if (column.key === "DGArea") {
            const directorate = item["Directorate"];
            return <span>{fieldContent} - {directorate}</span>;
        }


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
