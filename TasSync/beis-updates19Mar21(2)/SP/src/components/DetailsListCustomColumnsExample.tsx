import * as React from 'react';
//import { createListItems, IExampleItem } from 'office-ui-fabric-react/lib/utilities/exampleData';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { DetailsList, buildColumns, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';

import { IWebPartComponentProps } from '../types/WebPartComponentProps';
import * as services from '../services';
import { IEntity } from '../types';



export interface IDetailsListCustomColumnsExampleState {
  sortedItems: any[];
  columns: IColumn[];
}

export class DetailsListCustomColumnsExample extends React.Component<IWebPartComponentProps, IDetailsListCustomColumnsExampleState> {
  private entityService = new services.PeriodService(this.props.spfxContext, this.props.api);
  
  //private checkIconGreen: string = require('../images/greentick2626.png');

  constructor(props: IWebPartComponentProps) {
    super(props);

    //const items = createListItems(500);
    this.state = {
      sortedItems: [],
      columns: []
    };



  }
  public componentDidMount(): void {

    this.entityService.readAll().then((items: IEntity[]): void => {
      //this.setState({ LookupData: this.cloneObject(this.state.LookupData, 'Periods', p) });
      //console.log("After Read: ", items);
      this.setState({ 
        sortedItems: items,
        columns: _buildColumns(items)
       });


    }, (err) => { console.log(err); });

    //this.setState({ Loading: true });
    //let loadingPromises = [this.loadUserPermissions(), this.loadLookups()];
    //Promise.all(loadingPromises).then(p => this.onAfterLoad()).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));
    
}

  public render() {
    const { sortedItems, columns } = this.state;
    console.log("Items: ", sortedItems);
    console.log("columns: ", columns);

    if(sortedItems.length > 0){
      return (

      
      
        <React.Fragment>
          <h1>Test List</h1>
          {
            sortedItems.length>0 &&
            <DetailsList
            items={sortedItems}
            setKey="set"
            columns={columns}
            onRenderItemColumn={this._renderItemColumn2}
            selectionMode={SelectionMode.none}
            //onColumnHeaderClick={this._onColumnClick}
            //onItemInvoked={this._onItemInvoked}
            //onColumnHeaderContextMenu={this._onColumnHeaderContextMenu}
            //ariaLabelForSelectionColumn="Toggle selection"
            //ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          />
          }
  
        </React.Fragment>
  
      );
    }
    else
      return null;




  }

  private _onColumnClick = (event: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const { columns } = this.state;
    let { sortedItems } = this.state;
    let isSortedDescending = column.isSortedDescending;

    // If we've sorted this column, flip it.
    if (column.isSorted) {
      isSortedDescending = !isSortedDescending;
    }

    // Sort the items.
    sortedItems = _copyAndSort(sortedItems, column.fieldName!, isSortedDescending);

    // Reset the items and columns to match the state.
    this.setState({
      sortedItems: sortedItems,
      columns: columns.map(col => {
        col.isSorted = col.key === column.key;

        if (col.isSorted) {
          col.isSortedDescending = isSortedDescending;
        }

        return col;
      })
    });
  }

  private _onColumnHeaderContextMenu(column: IColumn | undefined, ev: React.MouseEvent<HTMLElement> | undefined): void {
    console.log(`column ${column!.key} contextmenu opened.`);
  }

  private _onItemInvoked(item: any, index: number | undefined): void {
    alert(`Item ${item.name} at index ${index} has been invoked.`);
  }

  private _renderItemColumn2(item: IEntity, index: number, column: IColumn) {

    console.log("in _renderItemColumn: ", column.key);
  
    const fieldContent = item[column.fieldName as keyof IEntity] as string;
  
    switch (column.key) {
      case 'thumbnail':
        return <Image src={fieldContent} width={50} height={50} imageFit={ImageFit.cover} />;
  
      case 'Title':
        return (
          // <Link href="#">{fieldContent}</Link>
          <React.Fragment>
            
            <span style={{backgroundColor: "red", color: "white", width: "130px", display: "block", paddingLeft: "10px", paddingTop: "5px", paddingBottom: "5px"}}><img src={require('../images/greentick2626.png')} /> Unsatisfactory</span>
          </React.Fragment>
        );
  
      case 'color':
        return (
          <span data-selection-disabled={true} className={mergeStyles({ color: fieldContent, height: '100%', display: 'block' })}>
            {fieldContent}
          </span>
        );
  
      default:
        return <span>{fieldContent}</span>;
    }
  }

  
}

function _buildColumns(items: any[]): IColumn[] {
  const columns = buildColumns(items);

  // const thumbnailColumn = columns.filter(column => column.name === 'thumbnail')[0];

  // // Special case one column's definition.
  // thumbnailColumn.name = '';
  // thumbnailColumn.maxWidth = 50;

  return columns;
}

function _renderItemColumn(item: IEntity, index: number, column: IColumn) {

  console.log("in _renderItemColumn: ", column.key);

  const fieldContent = item[column.fieldName as keyof IEntity] as string;

  switch (column.key) {
    case 'thumbnail':
      return <Image src={fieldContent} width={50} height={50} imageFit={ImageFit.cover} />;

    case 'Title':
      return (
        // <Link href="#">{fieldContent}</Link>
        <React.Fragment>
          
          <span style={{backgroundColor: "red", color: "white", width: "130px", display: "block", paddingLeft: "10px", paddingTop: "5px", paddingBottom: "5px"}}><img src={require('../images/greentick2626.png')} /> Unsatisfactory</span>
        </React.Fragment>
      );

    case 'color':
      return (
        <span data-selection-disabled={true} className={mergeStyles({ color: fieldContent, height: '100%', display: 'block' })}>
          {fieldContent}
        </span>
      );

    default:
      return <span>{fieldContent}</span>;
  }
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}
