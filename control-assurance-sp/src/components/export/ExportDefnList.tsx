import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { sp } from '@pnp/sp';
import { FilteredExportDefnList, IObjectWithKey } from './FilteredExportDefnList';
import { IEntity } from '../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../cr/CrLoadingOverlay';
import { Selection } from '../cr/FilteredList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { getUploadFolder_Report } from '../../types/AppGlobals';
import styles from '../../styles/cr.module.scss';



export interface IExportDefnListProps extends types.IBaseComponentProps {

    //onItemTitleClick: (ID: number, goElementId:number, title: string, filteredItems: any[]) => void;
    //periodId: number | string;
    moduleName: string;
    periodId?: number;
    dgAreaId?: number;
    periodTitle?: string;
    dgAreaTitle?: string;

    filterText?: string;
    onChangeFilterText: (value: string) => void;

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
    //public ShowChildForm = false;
    //public CurrentPage = 1;
    //public NextPageAvailable = false;
    public Entities: T[] = [];
    public Loading = false;
    public ListFilterText = null;
    public InitDataLoaded = false;
}

export default class ExportDefnList extends React.Component<IExportDefnListProps, IExportDefnListState<IEntity>> {
    private _selection: Selection;
    private UploadFolder_Report:string = "";
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
        this.UploadFolder_Report = getUploadFolder_Report(props.spfxContext);
        
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
                    {this.state.ShowForm && this.renderForm()}

                    {/* <ConfirmDialog hidden={this.state.HideDeleteDialog} title="Delete PDF" content={`Are you sure you want to delete ${this.getSelectedEntityName()} PDF?`} confirmButtonText="Delete PDF" handleConfirm={this.deletePdf} handleCancel={this.toggleDeletePdfConfirm} /> */}
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
                //onItemTitleClick={this.props.onItemTitleClick}
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

    private renderForm() {

        return null;

        // return (
        //     <GoElementAssignForm
        //         showForm={this.state.ShowForm}
        //         goElementId={this.state.SelectedGoElementId}
        //         onSaved={this.assignFormSaved}
        //         onCancelled={this.closePanel}
        //         {...this.props}
        //     />
        // );

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
            const outputId:number = this.state.SelectedEntity;
            const spSiteUrl: string = this.props.spfxContext.pageContext.web.absoluteUrl;
            console.log('spSiteUrl', spSiteUrl);

            this.exportDefinationService.createExport(outputId, this.props.periodId, this.props.dgAreaId, this.props.periodTitle, this.props.dgAreaTitle, spSiteUrl).then((res: string): void => {
    
                console.log('export creation initialized');
                this.props.onAfterCreatePressed();
                //this.loadData();
                //this.props.onSignOff();
    
            }, (err) => {
                if (this.props.onError)
                    this.props.onError(`Error creating export`, err.message);
    
            });
        }
    }




    private closePanel = (): void => {
        this.setState({ ShowForm: false });
    }


    private getSelectedEntityName = (): string => {
        let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; });
        return entity[0] ? entity[0].Title : null;
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
        //console.log('web title: ', this.props.spfxContext.pageContext.web.title);

    }
    // public componentDidUpdate(prevProps: IReport1ListProps): void {
    //     if (prevProps.periodId !== this.props.periodId) {
    //         //console.log('props changed, load data again');
    //         this._selection.setAllSelected(false);
    //         this.loadData();
    //     }
    // }



    //#endregion Data Load

    //#region Events Handlers
    // private handleFilterChange = (value: string): void => {
    //     this.setState({ ListFilterText: value });
    // }



    //#endregion Events Handlers

}
