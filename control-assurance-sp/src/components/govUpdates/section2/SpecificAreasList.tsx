import * as React from 'react';
import * as types from '../../../types';
import * as services from '../../../services';
import { sp } from '@pnp/sp';
//import MiscFileSaveForm from './MiscFileSaveForm';
import { FilteredSpecificAreasList, IObjectWithKey } from './FilteredSpecificAreasList';
import { IEntity } from '../../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../../cr/CrLoadingOverlay';
import { Selection } from '../../cr/FilteredList';
import { ConfirmDialog } from '../../cr/ConfirmDialog';
import styles from '../../../styles/cr.module.scss';


export interface ISpecificAreasListProps extends types.IBaseComponentProps {

    onItemTitleClick: (ID: number, goElementId:number, title: string, filteredItems: any[]) => void;
    goFormId: number | string;
    incompleteOnly: boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine: boolean;
    onChangeJustMine: (value: boolean) => void;

    filterText?: string;
    onChangeFilterText: (value: string) => void;

}

export interface ISpecificAreasListState<T> {
    SelectedEntity: number;
    SelectedEntityTitle: string;
    SelectedEntityChildren: number;
    ShowForm: boolean;
    EnableAssign?: boolean;
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
export class SpecificAreasListState<T> implements ISpecificAreasListState<T>{
    public SelectedEntity = null;
    public SelectedEntityTitle: string = null;
    public SelectedEntityChildren = null;
    public ShowForm = false;
    public HideDeleteDialog = true;
    public EnableAssign = false;
    public EnableDelete = false;
    public ShowChildForm = false;
    public CurrentPage = 1;
    public NextPageAvailable = false;
    public Entities: T[] = [];
    public Loading = false;
    public ListFilterText = null;
    public InitDataLoaded = false;
}

export default class SpecificAreasList extends React.Component<ISpecificAreasListProps, ISpecificAreasListState<IEntity>> {
    private _selection: Selection;
    private goDefElementService: services.GoDefElementService = new services.GoDefElementService(this.props.spfxContext, this.props.api);

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
            key: 'GoElementId',
            name: 'GoElementId',
            fieldName: 'GoElementId',
            minWidth: 1,
            isResizable: true,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
        {
            key: 'Title',
            name: 'Specific Evidence Areas',
            fieldName: 'Title',
            minWidth: 480,
            maxWidth: 480,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'Users',
            name: 'Assigned To',
            fieldName: 'Users',
            minWidth: 280,
            maxWidth: 280,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'Rating',
            name: 'Rating',
            fieldName: 'Rating',
            minWidth: 145,
            maxWidth: 145,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'CompletionStatus',
            name: 'Status',
            fieldName: 'CompletionStatus',
            minWidth: 120,
            maxWidth: 120,
            isResizable: true,
            headerClassName: styles.bold,
        },
    ];

    constructor(props: ISpecificAreasListProps, state: ISpecificAreasListState<IEntity>) {
        super(props);
        this.state = new SpecificAreasListState<IEntity>();

        this._selection = new Selection({
            onSelectionChanged: () => {
                if (this._selection.getSelectedCount() === 1) {

                    const sel = this._selection.getSelection()[0];
                    const key = Number(sel.key);
                    const title: string = sel["Title"];

                    this.setState({ SelectedEntity: key, SelectedEntityTitle: title, EnableAssign: true, EnableDelete: true });
                }
                else {
                    this.setState({ SelectedEntity: null, SelectedEntityTitle: null, EnableAssign: false, EnableDelete: false });
                }
            }
        });
    }

    //#region Render

    public render(): React.ReactElement<ISpecificAreasListProps> {

        return (
            <div className={`${styles.cr}`}>
                <div style={{ position: 'relative' }}>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderList()}
                    {this.state.ShowForm && this.renderForm()}

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
            <FilteredSpecificAreasList
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

                onAssign={this.handleAssign}

                assignDisabled={!this.state.EnableAssign}

                
            />
        );
    }

    private renderForm() {

        return (
            null

            // <MiscFileSaveForm
            //     showForm={this.state.ShowForm}
            //     miscFileID={this.state.SelectedEntity}
            //     onSaved={this.fileSaved}
            //     onCancelled={this.closePanel}
            //     {...this.props}
            // />
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

    private addFile = (): void => {
        if (this.state.SelectedEntity)
            this._selection.setKeySelected(this.state.SelectedEntity.toString(), false, false);
        this.setState({ SelectedEntity: null, ShowForm: true });
    }

    private handleAssign = (): void => {
        this.setState({ ShowForm: true });
    }



    private closePanel = (): void => {
        this.setState({ ShowForm: false });
    }

    private fileSaved = (): void => {
        //this.loadMiscFiles();
        this.closePanel();
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
        const read: Promise<IEntity[]> = this.goDefElementService.readAllWithFilters(this.props.goFormId, this.props.incompleteOnly, this.props.justMine);
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
    public componentDidUpdate(prevProps: ISpecificAreasListProps): void {
        if (prevProps.goFormId !== this.props.goFormId || prevProps.justMine !== this.props.justMine || prevProps.incompleteOnly !== this.props.incompleteOnly) {
            //console.log('props changed, load data again');
            this.loadData();
        }
    }



    //#endregion Data Load

    //#region Events Handlers

    //7Oct19 - no need for this method
    // private handleFilterChange = (value: string): void => {
    //     this.setState({ ListFilterText: value });
    // }



    //#endregion Events Handlers

}
