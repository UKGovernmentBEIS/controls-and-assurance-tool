import * as React from 'react';
import * as types from '../../types';
import { ReportList2, IObjectWithKey } from './ReportList2';
import BaseReportList, { IBaseReportListProps } from '../BaseReportList';
import { EntityService } from '../../services';
import { IEntity } from '../../types';
import { IOrgRepColumn, ColumnDisplayTypes } from '../../types/OrgRepColumn';
import { SearchObjectService } from '../../services';


export interface IOrgGenReportProps extends IBaseReportListProps {
    entityService: EntityService<types.IEntity>;
    entityNamePlural: string;
    periodId: number | string;

    entityReadAllExpandAll?: boolean;
    columns: IOrgRepColumn[];

    onItemTitleClick: (value: string, entityNamePlural: string) => void;
    filterText?: string;

    stackedBar: boolean;
    onChangeStackedBar: (value: boolean) => void;


}

export interface IOrgGenReportState extends types.IOrgRepListState<types.IEntity> { }

export default class OrgGenReport2 extends BaseReportList<IOrgGenReportProps, IOrgGenReportState> {
    protected entityService: EntityService<types.IEntity> = this.props.entityService;
    //protected ListTitle = this.props.entityNamePlural;
    //protected EntityName = { Plural: this.props.entityNamePlural, Singular: this.props.entityNameSingular };


    constructor(props: IOrgGenReportProps, state: IOrgGenReportState) {
        super(props);
        this.state = new types.OrgRepListState<types.IEntity>();
    }

    public renderList() {

        const listColumns = this.getColumns();
        const listColumnsForData = this.getColumnsForData();

        let items: IObjectWithKey[] = this.state.Entities.map((e) => { return this.makeItem(e, listColumnsForData); });


        return (
            <ReportList2
                entityNamePlural={this.props.entityNamePlural}
                onItemTitleClick={this.props.onItemTitleClick}
                columns={listColumns}
                items={items}
                stackedBar={this.props.stackedBar}
                onChangeStackedBar={this.props.onChangeStackedBar}
                filterText={this.state.ListFilterText}
                onFilterChange={this.handleFilterChange}

            />
        );
    }


    public makeItem = (e: IEntity, listColumns: IOrgRepColumn[]): any => {

        let item: any = { key: e["ID"] };


        listColumns.map((c) => {
            let fieldContent: string = String(e[c.fieldName]);

            item = {
                [c.fieldName]: fieldContent,
                ...item
            };


        });
        //console.log(item);

        return item;
    }
    private getColumns(): IOrgRepColumn[] {

        let listColumns: IOrgRepColumn[];

        listColumns = this.props.columns.filter(c => c.columnDisplayType !== ColumnDisplayTypes.Hidden);

        // if (this.props.stackedBar === true){
        //     listColumns = this.props.columns.filter(c => c.columnDisplayType !== ColumnDisplayTypes.StackedBarOff && c.columnDisplayType !== ColumnDisplayTypes.Hidden);

        // }
            
        // else {
        //     listColumns = this.props.columns.filter(c => c.columnDisplayType !== ColumnDisplayTypes.BreakdownsOn)
        //         .filter(c => c.columnDisplayType === ColumnDisplayTypes.BreakdownsOnAndOff
        //             || c.aggregateControls === this.props.controls
        //             || c.aggregateAssurances === this.props.assurances
        //             || c.aggregateAssurance1 === this.props.assurance1
        //             || c.aggregateAssurance2 === this.props.assurance2
        //             || c.aggregateAssurance3 === this.props.assurance3
        //         );
        // }
        //console.log(listColumns);
        return listColumns;
    }

    private getColumnsForData(): IOrgRepColumn[] {
        //separate method for data because we want to add Hidden Column in data, so that can be filtered
        let listColumns: IOrgRepColumn[];
        listColumns = this.props.columns;

        // if (this.props.breakdowns === true)
        //     listColumns = this.props.columns.filter(c => c.columnDisplayType !== ColumnDisplayTypes.BreakdownsOff);
        // else {
        //     listColumns = this.props.columns.filter(c => c.columnDisplayType !== ColumnDisplayTypes.BreakdownsOn)
        //         .filter(c => c.columnDisplayType === ColumnDisplayTypes.BreakdownsOnAndOff
        //             || c.columnDisplayType === ColumnDisplayTypes.Hidden
        //             || c.aggregateControls === this.props.controls
        //             || c.aggregateAssurances === this.props.assurances
        //             || c.aggregateAssurance1 === this.props.assurance1
        //             || c.aggregateAssurance2 === this.props.assurance2
        //             || c.aggregateAssurance3 === this.props.assurance3
        //         );
        // }
        //console.log(listColumns);
        return listColumns;
    }




    protected loadEntities = (): void => {
        this.setState({ Loading: true });
        const read: Promise<IEntity[]> = this.entityService.readAllWithArgs(this.props.periodId, true);
        read.then((entities: any): void => {
            //console.log(entities);
            this.setState({ Loading: false, Entities: entities, ListFilterText: this.props.filterText });

        }, (err) => this.errorLoadingEntities(err));
    }
    public componentDidUpdate(prevProps: IOrgGenReportProps): void {
        if (prevProps.periodId !== this.props.periodId) {
            this.loadEntities();
        }
    }


    //#region Events Handlers

    private handleFilterChange = (value: string): void => {
        //this.setState({ FilterText: value, FilteredItems: SearchObjectService.filterEntities(this.props.items, value) });
        this.setState({ ListFilterText: value });
    }

    //#endregion Events Handlers

}
