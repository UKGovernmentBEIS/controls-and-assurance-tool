import * as React from 'react';
import * as types from '../../types';
import { EntityForm } from './EntityForm';
import { FilteredList, IObjectWithKey } from '../cr/FilteredList';
import BaseList, { IBaseListProps } from '../BaseList';
import { EntityService, DateService } from '../../services';
import { IEntity } from '../../types';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';

export interface IEntityListProps extends IBaseListProps {
    entityService: EntityService<types.IEntity>;
    entityNamePlural: string;
    entityNameSingular: string;
    childEntityNameApi: string;
    childEntityNamePlural: string;
    childEntityNameSingular: string;
    entityReadAllExpandAll?: boolean;
    entityReadAllWithArg1?: any;
    entityReadAllWithArg2?: any;
    columns: IGenColumn[];
    displayIDColumn?: boolean;
    idColumnWidth?: number;
}

export interface IEntityListState extends types.ICrListState<types.IEntity> { }

export default class EntityList extends BaseList<IEntityListProps, IEntityListState> {
    protected entityService: EntityService<types.IEntity> = this.props.entityService;
    protected ListTitle = this.props.entityNamePlural;
    protected EntityName = { Plural: this.props.entityNamePlural, Singular: this.props.entityNameSingular };
    protected ChildEntityName = { Api: this.props.childEntityNameApi, Plural: this.props.childEntityNamePlural, Singular: this.props.childEntityNameSingular };

    constructor(props: IEntityListProps, state: IEntityListState) {
        super(props);
        this.checkDelete = this.checkDelete.bind(this);
        this.state = new types.CrListState<types.IEntity>();
    }

    public makeItem = (e: IEntity): any => {
        let item = { key: e["ID"] };
        let listColumns = this.props.columns.filter(c => c.columnDisplayType != ColumnDisplayType.FormOnly);
        listColumns.map((c) => {
            if (c.isParent === true) {

                if (c.columnType === ColumnType.DatePicker) {
                    if (c.showDateAndTimeInList === true) {

                        item = {
                            [c.fieldName]: (e[c.parentEntityName]) ? DateService.dateToUkDateTime(e[c.parentEntityName][c.parentColumnName]) : null,
                            ...item
                        };
                    }
                    else {
                        item = {
                            [c.fieldName]: (e[c.parentEntityName]) ? DateService.dateToUkDate(e[c.parentEntityName][c.parentColumnName]) : null,
                            ...item
                        };
                    }

                }
                else {

                    item = {
                        [c.fieldName]: (e[c.parentEntityName]) ? e[c.parentEntityName][c.parentColumnName] : null,
                        ...item
                    };
                }
            }
            else {
                if (c.columnType === ColumnType.Checkbox) {
                    item = {
                        [c.fieldName]: (e[c.fieldName] === true) ? "Yes" : "No",
                        ...item
                    };
                }
                else if (c.columnType === ColumnType.DatePicker) {
                    if (c.showDateAndTimeInList === true) {

                        item = {
                            [c.fieldName]: DateService.dateToUkDateTime(e[c.fieldName]),
                            ...item
                        };
                    }
                    else {
                        item = {
                            [c.fieldName]: DateService.dateToUkDate(e[c.fieldName]),
                            ...item
                        };
                    }

                }
                else {
                    item = {
                        [c.fieldName]: String(e[c.fieldName]),
                        ...item
                    };
                }
            }
        });

        return item;
    }
    public renderList() {

        const items: IObjectWithKey[] = this.state.Entities.map((e) => { return this.makeItem(e); });
        let listColumns = this.props.columns.filter(c => c.columnDisplayType != ColumnDisplayType.FormOnly);
        if (this.props.displayIDColumn === true)
            listColumns = [{ key: '-1', columnType: ColumnType.TextBox, name: 'ID', fieldName: 'key', minWidth: this.props.idColumnWidth ? this.props.idColumnWidth : 30, maxWidth: this.props.idColumnWidth ? this.props.idColumnWidth : 30, isResizable: true }, ...this.props.columns];

        return (<FilteredList columns={listColumns} items={items} selection={this._selection} filterText={this.state.ListFilterText} />);
    }

    public renderForm() {

        return (<EntityForm {...this.props} showForm={this.state.ShowForm} entityName={this.EntityName.Singular} entityId={this.state.SelectedEntity} onSaved={this.entitySaved} onCancelled={this.closePanel} />);
    }

    protected loadEntities_all = (): void => {
        this.setState({ Loading: true });
        let read: any;

        if (this.props.entityReadAllWithArg1) {
            if (this.props.entityReadAllWithArg2) {
                //2 arguments present, so pass 2
                read = this.entityService.readAllWithArgs(this.props.entityReadAllWithArg1, this.props.entityReadAllWithArg2);
            }
            else {
                //only pass aug1
                read = this.entityService.readAllWithArgs(this.props.entityReadAllWithArg1);
            }
        }

        else if (this.props.entityReadAllExpandAll === true)
            read = this.entityService.readAllExpandAll();
        else
            read = this.entityService.readAll();

        read.then((entities: any): void => {
            this.setState({ Loading: false, Entities: entities });

        }, (err) => this.errorLoadingEntities(err));
    }

    protected loadEntities_paged = (): void => {
        this.setState({ Loading: true });
        let read: any;


        let qryString: string;

        const skip: number = this.props.pageSize * (this.state.CurrentPage - 1); //default CurrentPage value is 1, so if page size 10, then 10 * (1-1) = 0
        qryString = `?$top=${this.props.pageSize}&$skip=${skip}`;

        if (this.props.entityReadAllExpandAll === true)
            read = this.entityService.readAllExpandAll(qryString);
        else
            read = this.entityService.readAll(qryString);

        read.then((entities: any[]): void => {
            const newRecords = entities.length;
            let nextPageAvailable: boolean = true;
            if (newRecords < this.props.pageSize)
                nextPageAvailable = false;


            const totalEntities = [...this.state.Entities, ...entities];
            this.setState({ CurrentPage: (this.state.CurrentPage + 1), NextPageAvailable: nextPageAvailable, Entities: totalEntities, Loading: false });

        }, (err) => this.errorLoadingEntities(err));
    }

    protected loadEntities = (): void => {

        if (this.props.pageSize) {
            this.loadEntities_paged();
        }
        else {
            this.loadEntities_all();
        }
    }

    public componentDidUpdate(prevProps: IEntityListProps): void {
        if (prevProps.entityReadAllWithArg1 !== this.props.entityReadAllWithArg1 || prevProps.entityReadAllWithArg2 !== this.props.entityReadAllWithArg2) {
            this.loadEntities();
        }

        if (prevProps.entityService !== this.props.entityService) {
            this.entityService = this.props.entityService;
            this.EntityName = { Plural: this.props.entityNamePlural, Singular: this.props.entityNameSingular };
            this.ChildEntityName = { Api: this.props.childEntityNameApi, Plural: this.props.childEntityNamePlural, Singular: this.props.childEntityNameSingular };
            this.loadEntities();
        }
    }
}
