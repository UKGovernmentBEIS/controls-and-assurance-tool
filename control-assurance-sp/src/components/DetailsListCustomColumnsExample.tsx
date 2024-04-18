import * as React from 'react';
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
  constructor(props: IWebPartComponentProps) {
    super(props);
    this.state = {
      sortedItems: [],
      columns: []
    };
  }
  public componentDidMount(): void {
    this.entityService.readAll().then((items: IEntity[]): void => {
      this.setState({
        sortedItems: items,
        columns: _buildColumns(items)
      });

    }, (err) => { console.log(err); });
  }

  public render() {
    const { sortedItems, columns } = this.state;
    console.log("Items: ", sortedItems);
    console.log("columns: ", columns);

    if (sortedItems.length > 0) {
      return (
        <React.Fragment>
          <h1>Test List</h1>
          {
            sortedItems.length > 0 &&
            <DetailsList
              items={sortedItems}
              setKey="set"
              columns={columns}
              onRenderItemColumn={this._renderItemColumn2}
              selectionMode={SelectionMode.none}
            />
          }

        </React.Fragment>

      );
    }
    else
      return null;
  }


  private _renderItemColumn2(item: IEntity, index: number, column: IColumn) {
    console.log("in _renderItemColumn: ", column.key);
    const fieldContent = item[column.fieldName as keyof IEntity] as string;

    switch (column.key) {
      case 'thumbnail':
        return <Image src={fieldContent} width={50} height={50} imageFit={ImageFit.cover} />;

      case 'Title':
        return (
          <React.Fragment>

            <span style={{ backgroundColor: "red", color: "white", width: "130px", display: "block", paddingLeft: "10px", paddingTop: "5px", paddingBottom: "5px" }}><img src={require('../images/greentick2626.png')} /> Unsatisfactory</span>
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
  return columns;
}


