import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import MainSaveForm from './MainSaveForm';
import ManagePeriodForm from './ManagePeriodForm';
import { FilteredMainList, IObjectWithKey } from './FilteredMainList';
import { IEntity } from '../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../cr/CrLoadingOverlay';
import { Selection } from '../cr/FilteredList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import styles from '../../styles/cr.module.scss';

export interface IMainListProps extends types.IBaseComponentProps {

    isArchive: boolean;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    dgAreaId: number | string;
    incompleteOnly: boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine: boolean;
    onChangeJustMine: (value: boolean) => void;
    filterText?: string;
    onChangeFilterText: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
    onMainSaved: () => void;
    mainListsSaveCounter: number;
    superUserPermission: boolean;
}

export interface IMainListState<T> {
    SelectedEntity: number;
    SelectedEntityTitle: string;
    SelectedEntityChildren: number;
    ShowForm: boolean;
    ShowManagePeriodForm: boolean;
    EnableEdit?: boolean;
    EnableDelete?: boolean;
    HideDeleteDialog: boolean;
    ShowChildForm: boolean;
    CurrentPage?: number;
    NextPageAvailable?: boolean;
    Entities: T[];
    Loading: boolean;
    ListFilterText?: string;
    InitDataLoaded: boolean;
}
export class MainListState<T> implements IMainListState<T>{
    public SelectedEntity = null;
    public SelectedEntityTitle: string = null;
    public SelectedEntityChildren = null;
    public ShowForm = false;
    public ShowManagePeriodForm = false;
    public HideDeleteDialog = true;
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

export default class MainList extends React.Component<IMainListProps, IMainListState<IEntity>> {
    private _selection: Selection;
    private mainService: services.NAOPublicationService = new services.NAOPublicationService(this.props.spfxContext, this.props.api);


    private listColumns: IUpdatesListColumn[] = [
        //use fieldName as key
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
            minWidth: 330,
            maxWidth: 330,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'DGArea',
            name: 'DGArea(s)',
            fieldName: 'DGArea',
            minWidth: 145,
            maxWidth: 145,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'Type',
            name: 'Type',
            fieldName: 'Type',
            minWidth: 90,
            maxWidth: 90,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'Year',
            name: 'Year',
            fieldName: 'Year',
            minWidth: 50,
            maxWidth: 50,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'CompletePercent',
            name: 'Implemented',
            fieldName: 'CompletePercent',
            minWidth: 72,
            maxWidth: 72,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'AssignedTo',
            name: 'Assigned To',
            fieldName: 'AssignedTo',
            minWidth: 120,
            maxWidth: 120,
            isMultiline: true,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'PeriodEnd',
            name: 'Period End',
            fieldName: 'PeriodEnd',
            minWidth: 70,
            maxWidth: 70,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'UpdateStatus',
            name: 'Period Update Status',
            fieldName: 'UpdateStatus',
            minWidth: 120,
            maxWidth: 120,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'CurrentPeriodId',
            name: 'CurrentPeriodId',
            fieldName: 'CurrentPeriodId',
            minWidth: 1,
            isResizable: true,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
    ];


    constructor(props: IMainListProps, state: IMainListState<IEntity>) {
        super(props);
        this.state = new MainListState<IEntity>();

        this._selection = new Selection({
            onSelectionChanged: () => {
                if (this._selection.getSelectedCount() === 1) {

                    const sel = this._selection.getSelection()[0];
                    console.log(sel);
                    const key = Number(sel.key);
                    const title: string = sel["Title"];

                    this.setState({ SelectedEntity: key, SelectedEntityTitle: title, EnableEdit: true, EnableDelete: true });
                }
                else {
                    this.setState({ SelectedEntity: null, SelectedEntityTitle: null, EnableEdit: false, EnableDelete: false });
                }
            }
        });
    }

    //#region Render

    public render(): React.ReactElement<IMainListProps> {

        return (
            <div className={`${styles.cr}`}>
                <div style={{ position: 'relative' }}>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderList()}
                    {this.state.ShowForm && this.renderForm()}
                    {this.state.ShowManagePeriodForm && this.renderManagePeriodForm()}
                    <ConfirmDialog hidden={this.state.HideDeleteDialog} title={`Are you sure you want to delete ${this.getSelectedEntityName()}?`} content={`A deleted record cannot be un-deleted.`} confirmButtonText="Delete" handleConfirm={this.deleteRecord} handleCancel={this.toggleDeleteConfirm} />
                </div>
            </div>
        );
    }

    private renderList() {

        const listColumns = this.getColumns();
        const listColumnsForData = this.getColumnsForData();
        let items: IObjectWithKey[] = this.state.Entities.map((e) => { return this.makeItem(e, listColumnsForData); });

        return (
            <FilteredMainList
                onItemTitleClick={this.props.onItemTitleClick}
                columns={listColumns}
                items={items}
                incompleteOnly={this.props.incompleteOnly}
                onChangeIncompleteOnly={this.props.onChangeIncompleteOnly}
                justMine={this.props.justMine}
                onChangeJustMine={this.props.onChangeJustMine}
                filterText={this.props.filterText}
                onFilterChange={this.props.onChangeFilterText}
                selection={this._selection}
                onAdd={this.addItem}
                onEdit={this.editItem}
                onManagePeriod={this.managePeriod}
                editDisabled={!this.state.EnableEdit}
                deleteDisabled={!this.state.EnableDelete}
                superUserPermission={this.props.superUserPermission}
            />
        );
    }

    private renderForm() {
        return (
            <MainSaveForm
                showForm={this.state.ShowForm}
                entityId={this.state.SelectedEntity}
                onSaved={this.formSaved}
                onCancelled={this.closePanel}
                {...this.props}
            />
        );
    }

    private renderManagePeriodForm() {
        return (
            <ManagePeriodForm
                showForm={this.state.ShowManagePeriodForm}
                entityId={this.state.SelectedEntity}
                onSaved={this.formSaved}
                onCancelled={this.closePanel}
                {...this.props}
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

    private closePanel = (): void => {
        this.setState({ ShowForm: false, ShowManagePeriodForm: false });
    }

    private formSaved = (): void => {
        this.setState({ ShowForm: false, ShowManagePeriodForm: false }, this.props.onMainSaved);
    }

    private getSelectedEntityName = (): string => {
        let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; });
        return entity[0] ? entity[0].Title : null;
    }

    private toggleDeleteConfirm = (): void => {
        this.setState({ HideDeleteDialog: !this.state.HideDeleteDialog });
    }

    private deleteRecord = (): void => {
    }

    //#endregion Class Methods

    //#region Data Load


    private loadData = (): void => {
        this.setState({ Loading: true });
        const read: Promise<IEntity[]> = this.mainService.readAllWithFilters(this.props.dgAreaId, this.props.incompleteOnly, this.props.justMine, this.props.isArchive);
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
    public componentDidUpdate(prevProps: IMainListProps): void {
        if (prevProps.dgAreaId !== this.props.dgAreaId || prevProps.justMine !== this.props.justMine || prevProps.incompleteOnly !== this.props.incompleteOnly || prevProps.mainListsSaveCounter !== this.props.mainListsSaveCounter) {
            this._selection.setAllSelected(false);
            this.loadData();
        }
    }

    //#endregion Data Load

    //#region Events Handlers

    private addItem = (): void => {
        if (this.state.SelectedEntity)
            this._selection.setKeySelected(this.state.SelectedEntity.toString(), false, false);
        this.setState({ SelectedEntity: null, ShowForm: true });
    }

    private editItem = (): void => {
        this.setState({ ShowForm: true });
    }
    private managePeriod = (): void => {
        this.setState({ ShowManagePeriodForm: true });
    }
    //#endregion Events Handlers
}
