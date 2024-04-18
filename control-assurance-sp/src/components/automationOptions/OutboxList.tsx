import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { FilteredOutboxList, IObjectWithKey } from './FilteredOutboxList';
import { IEntity } from '../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../cr/CrLoadingOverlay';
import { Selection } from '../cr/FilteredList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { getUploadFolder_Report } from '../../types/AppGlobals';
import styles from '../../styles/cr.module.scss';

export interface IOutboxListProps extends types.IBaseComponentProps {
    filterText?: string;
    onChangeFilterText: (event?: React.ChangeEvent<HTMLInputElement>, value?: string) => void;
    outboxListRefreshCounter: number;
}

export interface IOutboxListState<T> {
    SelectedEntity: number;
    SelectedEntityTitle: string;
    EnableDelete?: boolean;
    PDFStatus?: string;
    SelectedEntityChildren: number;
    ShowForm: boolean;
    ShowManagePeriodForm: boolean;
    EnableEdit?: boolean;
    HideDeleteDialog: boolean;
    ShowChildForm: boolean;
    CurrentPage?: number;
    NextPageAvailable?: boolean;
    Entities: T[];
    Loading: boolean;
    ListFilterText?: string;
    InitDataLoaded: boolean;
}
export class OutboxListState<T> implements IOutboxListState<T>{
    public SelectedEntity = null;
    public SelectedEntityTitle: string = null;
    public EnableDelete = false;
    public PDFStatus = "";
    public SelectedEntityChildren = null;
    public ShowForm = false;
    public ShowManagePeriodForm = false;
    public HideDeleteDialog = true;
    public EnableEdit = false;
    public ShowChildForm = false;
    public CurrentPage = 1;
    public NextPageAvailable = false;
    public Entities: T[] = [];
    public Loading = false;
    public ListFilterText = null;
    public InitDataLoaded = false;
}

export default class OutboxList extends React.Component<IOutboxListProps, IOutboxListState<IEntity>> {
    private _selection: Selection;
    private emailOutboxService: services.EmailOutboxService = new services.EmailOutboxService(this.props.spfxContext, this.props.api);

    private listColumns: IUpdatesListColumn[] = [

        {
            key: 'ID',
            name: 'ID',
            fieldName: 'ID',
            minWidth: 1,
            isResizable: true,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
        {
            key: 'Title',
            name: 'Title',
            fieldName: 'Title',
            minWidth: 180,
            maxWidth: 180,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'SubjectAndDescription',
            name: 'Subject/Desc',
            fieldName: 'SubjectAndDescription',
            minWidth: 320,
            maxWidth: 320,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'ModuleName',
            name: 'Module',
            fieldName: 'ModuleName',
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'PersonName',
            name: 'Person Name',
            fieldName: 'PersonName',
            minWidth: 180,
            maxWidth: 180,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'EmailTo',
            name: 'Email',
            fieldName: 'EmailTo',
            minWidth: 220,
            maxWidth: 220,
            isResizable: true,
            headerClassName: styles.bold,
        },


    ];

    constructor(props: IOutboxListProps, state: IOutboxListState<IEntity>) {
        super(props);
        this.state = new OutboxListState<IEntity>();
        this._selection = new Selection({
            onSelectionChanged: () => {
                this.manageEnableDisableCreatePDF();
            }
        });
    }

    //#region Render

    public render(): React.ReactElement<IOutboxListProps> {
        return (
            <div className={`${styles.cr}`}>
                <div style={{ position: 'relative' }}>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderList()}
                    <ConfirmDialog hidden={this.state.HideDeleteDialog} title={`Are you sure you want to delete selected items?`} content={`This action cannot be reversed.`} confirmButtonText="Delete" handleConfirm={this.handleDelete} handleCancel={this.toggleDeleteConfirm} />
                </div>
            </div>
        );
    }

    private renderList() {
        const listColumns = this.getColumns();
        const listColumnsForData = this.getColumnsForData();
        let items: IObjectWithKey[] = this.state.Entities.map((e) => { return this.makeItem(e, listColumnsForData); });

        return (
            <FilteredOutboxList
                columns={listColumns}
                items={items}
                filterText={this.props.filterText}
                onFilterChange={this.props.onChangeFilterText}
                selection={this._selection}
                onDelete={this.toggleDeleteConfirm}
                deleteDisabled={!this.state.EnableDelete}
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

    private toggleDeleteConfirm = (): void => {
        this.setState({ HideDeleteDialog: !this.state.HideDeleteDialog });
    }

    private manageEnableDisableCreatePDF = (): void => {
        if (this._selection.getSelectedCount() > 0) {
            this.setState({ EnableDelete: true });

        }
        else {
            this.setState({ EnableDelete: false });
        }
    }

    //#endregion Class Methods

    //#region Data Load


    private loadData = (): void => {
        this.setState({ Loading: true });
        const read: Promise<IEntity[]> = this.emailOutboxService.readAll();
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
    }
    public componentDidUpdate(prevProps: IOutboxListProps): void {
        if (prevProps.outboxListRefreshCounter !== this.props.outboxListRefreshCounter) {
            this._selection.setAllSelected(false);
            this.loadData();
        }
    }

    //#endregion Data Load

    //#region Events Handlers

    private handleDelete = (): void => {
        if (this.props.onError) this.props.onError(null);
        this.toggleDeleteConfirm();
        const selection = this._selection.getSelection();
        let selectedIds: number[] = [];

        for (let sel of selection) {
            const sel_id: number = Number(sel["ID"]);
            selectedIds.push(sel_id);
        }
        const itemIds: string = selectedIds.join(',');
        console.log('itemIds', itemIds);
        this.emailOutboxService.deleteItems(itemIds).then((res: string): void => {
            this.loadData();
        }, (err) => {
            if (this.props.onError)
                this.props.onError(`Error deleting items`, err.message);
        });
    }

    //#endregion Events Handlers
}





