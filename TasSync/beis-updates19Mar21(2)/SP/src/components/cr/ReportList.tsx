import * as React from 'react';
import { DetailsList, SelectionMode, IColumn, ISelection, IDetailsHeaderProps } from 'office-ui-fabric-react/lib/DetailsList';
import { SearchObjectService } from '../../services';
import { IEntity } from '../../types';
import { DetailsHeader } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsHeader';
import { ITooltipHostProps, TooltipHost } from "office-ui-fabric-react/lib/Tooltip";
export { Selection, IObjectWithKey, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import  '../../styles/CustomFabric2.scss';
import { CrDropdown } from './CrDropdown';

const classNames = mergeStyleSets({
    controlWrapper: {
      display: 'flex',
      flexWrap: 'wrap',
      backgroundColor: "rgb(244,244,244)",
      padding: "5px 0px 5px 10px",
      marginBottom:"5px"
    },
  });
  const controlStyles = {
    root: {
      margin: '0 10px 0 0',
      maxWidth: '301px',
    }
  };

  const controlStyles2 = {
    //root: {
      marginLeft: "auto",
      display:"inline-block",
      backgroundColor: "white"

    //}
  };

export interface IReportListProps {
    className?: string;
    columns: IColumn[];
    items: any[];
    filterText?: string;

    controls: boolean;
    onChangeControls: (value: boolean)=> void;
    assurances: boolean;
    onChangeAssurances: (value: boolean)=> void;
    assurance1: boolean;
    onChangeAssurance1: (value: boolean)=> void;
    assurance2: boolean;
    onChangeAssurance2: (value: boolean)=> void;
    assurance3: boolean;
    onChangeAssurance3: (value: boolean)=> void;

    highlightOnly: boolean;
    onChangeHighlightOnly: (value: boolean)=> void;
    
    breakdowns: boolean;
    onChangeBreakdowns: (value: boolean)=> void;

    onFilterChange: (value: string)=> void;

    onItemTitleClick: (value: string, entityNamePlural:string)=> void;
    entityNamePlural: string;
}

export interface IReportListState {
    Columns: IColumn[];
    FilteredItems: any[];
}

export class ReportList extends React.Component<IReportListProps, IReportListState> {

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
                        checked={this.props.highlightOnly}
                        onChanged={(isChecked) => this.props.onChangeHighlightOnly(isChecked)}
                        onText="Highlight Only"
                        offText="Highlight Only"
                        styles={controlStyles}
                    />
                    

                    <Toggle
                        
                        checked={this.props.breakdowns}
                        onChanged={(isChecked) => this.props.onChangeBreakdowns(isChecked)}
                        onText="Breakdowns"
                        offText="Breakdowns"
                        styles={controlStyles}
                    />
                    <Checkbox
                        label="Controls" 
                        styles={controlStyles}
                        checked={this.props.controls}
                        onChange={(ev, isChecked) => this.props.onChangeControls(isChecked)}
                    />
                    <Checkbox
                        label="Assurances" 
                        styles={controlStyles}
                        checked={this.props.assurances}
                        onChange={(ev, isChecked) => this.props.onChangeAssurances(isChecked)}
                    />
                    { (this.props.breakdowns === true && this.props.assurances === true) ? null : 
                    <Checkbox
                        label="Assurance1" 
                        styles={controlStyles}
                        checked={this.props.assurance1}
                        onChange={(ev, isChecked) => this.props.onChangeAssurance1(isChecked)}
                    />
                    }
                    { (this.props.breakdowns === true && this.props.assurances === true) ? null : 
                    <Checkbox
                        label="Assurance2" 
                        styles={controlStyles}
                        checked={this.props.assurance2}
                        onChange={(ev, isChecked) => this.props.onChangeAssurance2(isChecked)}
                    />
                    }
                    { (this.props.breakdowns === true && this.props.assurances === true) ? null : 
                    <Checkbox
                        label="Assurance3" 
                        styles={controlStyles}
                        checked={this.props.assurance3}
                        onChange={(ev, isChecked) => this.props.onChangeAssurance3(isChecked)}
                    />
                    }
                    <span style={controlStyles2}>
                    <SearchBox
                        placeholder="Filter items"
                        value={this.props.filterText ? this.props.filterText: ''}
                        onChange={this.props.onFilterChange}
                        //className={styles.listFilterBox}
                        //style={controlStyles2}
                    />
                    </span>

                </div>
                   

                <DetailsList className={props.className} selectionMode={SelectionMode.none} setKey={"state.FilteredItems"}
                    columns={state.Columns}                
                    
                    items={state.FilteredItems}
                    onRenderItemColumn={this.renderItemColumn}
                    //onRenderDetailsHeader={this.renderDetailsHeader}
                />
             </Fabric>
        );
    }

    //#region Form initialisation

    public componentDidMount(): void {
        this.setState({ FilteredItems: SearchObjectService.filterEntities(this.props.items, this.props.filterText) }, this._onLoadTrySort);
        
    }

    public componentDidUpdate(prevProps: IReportListProps): void {

        if(prevProps.columns !== this.props.columns){
            this.props.columns.forEach((c) => { c.onColumnClick = this._onColumnClick; });
            this.setState({ Columns: this.props.columns, FilteredItems: SearchObjectService.filterEntities(this.props.items, this.props.filterText) }, this._onLoadTrySort);
        }
        else if (prevProps.items !== this.props.items || prevProps.filterText !== this.props.filterText){

            this.setState({ FilteredItems: SearchObjectService.filterEntities(this.props.items, this.props.filterText) }, this._onLoadTrySort);
        }            
    }

    //#endregion

    //#region Form infrastructure

    private renderDetailsHeader (detailsHeaderProps: IDetailsHeaderProps) {

        return (
          <DetailsHeader
            //onRenderColumnHeaderTooltip={this.renderHeaderTooltip}
            //onRenderColumnHeaderTooltip={(tooltipHostProps: ITooltipHostProps) => <TooltipHost {...tooltipHostProps} />}
            onRenderColumnHeaderTooltip={(tooltipHostProps: ITooltipHostProps) => this.renderHeaderTooltip(tooltipHostProps) }
            {...detailsHeaderProps}
            
            
          />
        );
    }

    private renderHeaderTooltip (tooltipHostProps: ITooltipHostProps) {
        //console.log("helloooooooo", tooltipHostProps.children);
        return (
          <span
            style={{
              display: "flex",
              fontFamily: "Tahoma",
              fontSize: "40px",
              color: 'red',
              justifyContent: "center",
            }}
          >
            {tooltipHostProps.children}
          </span>
        );
    }

    private renderItemColumn = (item: IEntity, index: number, column: IColumn) => {

        //console.log("in renderItemColumn: ", column.key, item);      
        let fieldContent = item[column.fieldName as keyof IEntity] as string;
        

        if(column.key === "Aggregate" || column.key === "AggregateControls" || column.key === "AggregateAssurances" || column.key === "AggregateAssurance1" || column.key === "AggregateAssurance2" || column.key === "AggregateAssurance3"){
            let txtColor:string = "white";
            let bgColor:string = "";
            if(fieldContent === "Substantial") bgColor = "rgb(34,177,76)";
            else if(fieldContent === "Moderate"){
                txtColor = "black";
                bgColor = "rgb(255,242,0)";
            }
            else if(fieldContent === "Limited") bgColor = "rgb(255,127,39)";                
            else if(fieldContent === "Unsatisfactory") bgColor = "rgb(237,28,36)";
            else if(fieldContent === "No Data"){
                bgColor = "rgb(200,200,200)";
                txtColor = "rgb(93,93,93)";
            } 
        

            return (
                <span style={{backgroundColor: bgColor, color: txtColor, width: "140px", display: "block", paddingLeft: "10px", paddingTop: "5px", paddingBottom: "5px"}}>
                    {fieldContent}
                </span>
                
            );
        }
        else if(column.key === "Title"){
            
            if(this.props.entityNamePlural === "Themes"){
                return <span>{fieldContent}</span>;
            }
            else{
                return (
                    <span><a className="titleLnk" onClick={ (ev)=> this.props.onItemTitleClick(fieldContent, this.props.entityNamePlural) } > {fieldContent}</a> </span>
                );
            }
        }
        else{
            return <span>{fieldContent}</span>;
        }

    }

    //29Oct2019 - Start - Add
    private _onLoadTrySort = (): void => {
        const { Columns, FilteredItems } = this.state;
        let newItems: any[] = FilteredItems.slice();
        const newColumns: IColumn[] = Columns.slice();
        const currColumn: IColumn = newColumns.filter((currCol: IColumn, idx: number) => {
            //return Columns[0].key === currCol.key;
            return 'Title';
        })[0];

        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                //currColumn.isSortedDescending = !currColumn.isSortedDescending;
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
    //29Oct2019 - End - Add

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
