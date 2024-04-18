import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { FilteredExportDefnList, IObjectWithKey } from './FilteredExportDefnList';
import { IEntity } from '../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../cr/CrLoadingOverlay';
import { Selection } from '../cr/FilteredList';
import styles from '../../styles/cr.module.scss';

export interface IExportDefnListProps extends types.IBaseComponentProps {
    moduleName: string;
    periodId?: number;
    dgAreaId?: number;
    periodTitle?: string;
    dgAreaTitle?: string;
    filterText?: string;
    onChangeFilterText: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => void;
    onAfterCreatePressed: () => void;
}

export interface IExportDefnListState<T> {
    SelectedEntity: number;
    SelectedEntityTitle: string;
    ShowForm: boolean;
    EnableCreate?: boolean;
    Entities: T[];
    Loading: boolean;
    ListFilterText?: string;
    InitDataLoaded: boolean;
}
export class ExportDefnListState<T> implements IExportDefnListState<T>{
    public SelectedEntity = null;
    public SelectedEntityTitle: string = null;
    public ShowForm = false;
    public HideDeleteDialog = true;
    public EnableCreatePdf = false;
    public EnableDeletePdf = false;
    public EnableDownloadPdf = false;
    public Entities: T[] = [];
    public Loading = false;
    public ListFilterText = null;
    public InitDataLoaded = false;
}

export default class ExportDefnList extends React.Component<IExportDefnListProps, IExportDefnListState<IEntity>> {
    private _selection: Selection;
    private exportDefinationService: services.ExportDefinationService = new services.ExportDefinationService(this.props.spfxContext, this.props.api);

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
            minWidth: 500,
            maxWidth: 500,
            isResizable: true,
            headerClassName: styles.bold,
        },
    ];

    constructor(props: IExportDefnListProps, state: IExportDefnListState<IEntity>) {
        super(props);
        this.state = new ExportDefnListState<IEntity>();
        this._selection = new Selection({
            onSelectionChanged: () => {
                if (this._selection.getSelectedCount() === 1) {
                    const sel = this._selection.getSelection()[0];
                    console.log(sel);
                    const key = Number(sel.key);
                    const title: string = sel["Title"];
                    this.setState({ SelectedEntity: key, SelectedEntityTitle: title, EnableCreate: true });
                }
                else {
                    this.setState({ SelectedEntity: null, SelectedEntityTitle: null, EnableCreate: false });
                }
            }
        });
    }

    //#region Render

    public render(): React.ReactElement<IExportDefnListProps> {
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
            <FilteredExportDefnList
                columns={listColumns}
                items={items}
                filterText={this.props.filterText}
                onFilterChange={this.props.onChangeFilterText}
                selection={this._selection}
                onCreate={this.handleCreate}
                createDisabled={!this.state.EnableCreate}
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

    private handleCreate = (): void => {
        if (this.props.onError) this.props.onError(null);
        if (this.state.SelectedEntity) {
            const outputId: number = this.state.SelectedEntity;
            const spSiteUrl: string = this.props.spfxContext.pageContext.web.absoluteUrl;
            console.log('spSiteUrl', spSiteUrl);
            this.exportDefinationService.createExport(outputId, this.props.periodId, this.props.dgAreaId, this.props.periodTitle, this.props.dgAreaTitle, spSiteUrl).then((res: string): void => {
                console.log('export creation initialized');
                this.props.onAfterCreatePressed();
            }, (err) => {
                if (this.props.onError)
                    this.props.onError(`Error creating export`, err.message);
            });
        }
    }

    //#endregion Class Methods

    //#region Data Load

    private loadData = (): void => {
        this.setState({ Loading: true });
        const read: Promise<IEntity[]> = this.exportDefinationService.readAllByModule(this.props.moduleName);
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

    //#endregion Data Load

}
