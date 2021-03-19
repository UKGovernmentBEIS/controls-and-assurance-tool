import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { sp } from '@pnp/sp';

import { FilteredGroupsList, IObjectWithKey } from './FilteredGroupsList';
import { IEntity } from '../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../cr/CrLoadingOverlay';
import { Selection } from '../cr/FilteredList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { MessageDialog } from '../cr/MessageDialog';
import styles from '../../styles/cr.module.scss';


export interface IGroupsListProps extends types.IBaseComponentProps {

    parentActionId:number;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;

    filterText?: string;
    onChangeFilterText: (value: string) => void;

}

export interface IGroupsListState<T> {
    SelectedEntity: number;
    SelectedEntityTitle: string;

    SelectedEntityChildren: number;
    ShowForm: boolean;
    ShowFormGroupActions: boolean;
    EnableEdit?: boolean;
    EnableDelete?: boolean;
    HideDeleteDisallowed: boolean;
    HideDeleteDialog: boolean;
    ShowChildForm: boolean;
    CurrentPage?: number;
    NextPageAvailable?: boolean;
    Entities: T[];
    Loading: boolean;
    ListFilterText?: string;
    InitDataLoaded: boolean;

    
    
}
export class GroupsListState<T> implements IGroupsListState<T>{
    public SelectedEntity = null;
    public SelectedEntityTitle: string = null;

    public SelectedEntityChildren = null;
    public ShowForm = false;
    public ShowFormGroupActions = false;
    public HideDeleteDialog = true;
    public HideDeleteDisallowed = true;
    public EnableEdit = false;
    public EnableDelete = false;
    public ShowChildForm = false;
    public CurrentPage = 1;
    public NextPageAvailable = false;
    public Entities: T[] = [];
    public Loading = false;
    public ListFilterText = null;
    public InitDataLoaded = false;

    
    
}

export default class GroupsList extends React.Component<IGroupsListProps, IGroupsListState<IEntity>> {
    private _selection: Selection;
    private mainService: services.IAPActionService = new services.IAPActionService(this.props.spfxContext, this.props.api);

    private ChildEntityName: { Plural: string, Singular: string } = { Plural: 'Updates', Singular: 'Update' };

    private listColumns: IUpdatesListColumn[] = [
        //use fieldName as key

        {
            key: 'ID',
            name: 'ID',
            fieldName: 'ID',
            minWidth: 1,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },

        {
            key: 'OwnerIds',
            name: 'OwnerIds',
            fieldName: 'OwnerIds',
            minWidth: 1,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
        {
            key: 'Title',
            name: 'Group',
            fieldName: 'Title',
            minWidth: 100,
            maxWidth: 100,
            isResizable: true,
            isMultiline:true,
            headerClassName: styles.bold,
        },

        {
            key: 'Status',
            name: 'Status',
            fieldName: 'Status',
            minWidth: 100,
            maxWidth: 100,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'CompletionDate',
            name: 'Completion Date',
            fieldName: 'CompletionDate',
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'ActionOwners',
            name: 'Action Owners',
            fieldName: 'ActionOwners',
            minWidth: 300,
            maxWidth: 300,
            isMultiline: true,
            isResizable: true,
            headerClassName: styles.bold,
        },


    ];


    constructor(props: IGroupsListProps, state: IGroupsListState<IEntity>) {
        super(props);
        this.state = new GroupsListState<IEntity>();
        
        this._selection = new Selection({
            onSelectionChanged: () => {

            }
        });
    }

    //#region Render

    public render(): React.ReactElement<IGroupsListProps> {

        return (
            <div className={`${styles.cr}`}>
                <div style={{ position: 'relative' }}>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderList()}
                </div>
            </div>
        );
    }

    private renderList() {

        const listColumns = this.getColumns();
        const listColumnsForData = this.getColumnsForData();

        let items: IObjectWithKey[] = this.state.Entities.map((e) => { return this.makeItem(e, listColumnsForData); });



        return (
            <FilteredGroupsList
                onItemTitleClick={this.props.onItemTitleClick}
                columns={listColumns}
                items={items}

                filterText={this.props.filterText}
                onFilterChange={this.props.onChangeFilterText}
                selection={this._selection}
                
            />
        );
    }



    //#endregion Render

    //#region Class Methods

    private makeItem = (e: IEntity, listColumns: IUpdatesListColumn[]): any => {

        let item: any = { key: e["ID"] };

        listColumns.map((c) => {
            let fieldContent: string = String(e[c.fieldName]);
            item = {
                [c.fieldName]: fieldContent,
                ...item
            };
        });
        return item;
    }

    private getColumns(): IUpdatesListColumn[] {

        let listColumns: IUpdatesListColumn[];
        listColumns = this.listColumns.filter(c => c.columnDisplayType !== ColumnDisplayTypes.Hidden);
        return listColumns;
    }

    private getColumnsForData(): IUpdatesListColumn[] {
        //separate method for data because we want to add Hidden Columns in the data, so hidden columns data can be filtered
        const listColumns: IUpdatesListColumn[] = this.listColumns;
        return listColumns;
    }

    //#endregion Class Methods

    //#region Data Load


    private loadData = (): void => {
        this.setState({ Loading: true });

        const read: Promise<IEntity[]> = this.mainService.readAllGroups(this.props.parentActionId);
        read.then((entities: any): void => {
            this.setState({
                Loading: false, Entities: entities,
            });

        }, (err) => this.errorLoadingData(err));
    }
    private errorLoadingData = (err: any, entityName?: string): void => {
        this.setState({ Loading: false });
        if (this.props.onError) this.props.onError(`Error loading ${entityName || 'items'}`, err.message);
    }
    public componentDidMount(): void {
        this.loadData();
        //console.log('web title: ', this.props.spfxContext.pageContext.web.title);

    }




    //#endregion Data Load

    //#region Events Handlers




    //#endregion Events Handlers

}
