import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { sp } from '@pnp/sp';
import { FilteredAvailExportsList, IObjectWithKey } from './FilteredAvailExportsList';
import { IEntity } from '../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../cr/CrLoadingOverlay';
import { Selection } from '../cr/FilteredList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { getUploadFolder_Report } from '../../types/AppGlobals';
import styles from '../../styles/cr.module.scss';



export interface IAvailExportsListProps extends types.IBaseComponentProps {

    //onItemTitleClick: (ID: number, goElementId:number, title: string, filteredItems: any[]) => void;
    moduleName:string;
    filterText?: string;
    onChangeFilterText: (value: string) => void;

    listRefreshNeededCounter: number;

}

export interface IAvailExportsListState<T> {
    SelectedEntity: number;
    SelectedEntityTitle: string;

    ShowForm: boolean;
    EnableDelete?: boolean;
    EnableDownload?: boolean;
    HideDeleteDialog: boolean;

    Entities: T[];
    Loading: boolean;
    ListFilterText?: string;
    InitDataLoaded: boolean;
}
export class AvailExportsListState<T> implements IAvailExportsListState<T>{
    public SelectedEntity = null;
    public SelectedEntityTitle: string = null;

    public ShowForm = false;
    public HideDeleteDialog = true;
    public EnableDelete = false;
    public EnableDownload = false;
    //public ShowChildForm = false;
    //public CurrentPage = 1;
    //public NextPageAvailable = false;
    public Entities: T[] = [];
    public Loading = false;
    public ListFilterText = null;
    public InitDataLoaded = false;
}

export default class AvailExportsList extends React.Component<IAvailExportsListProps, IAvailExportsListState<IEntity>> {
    private _selection: Selection;
    private UploadFolder_Report:string = "";
    private availableExportService: services.AvailableExportService = new services.AvailableExportService(this.props.spfxContext, this.props.api);


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
            minWidth: 350,
            maxWidth: 350,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'OutputFileStatus',
            name: 'Export Status',
            fieldName: 'OutputFileStatus',
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'CreatedBy',
            name: 'Created By',
            fieldName: 'CreatedBy',
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'Parameters',
            name: 'Parameters',
            fieldName: 'Parameters',
            minWidth: 200,
            maxWidth: 200,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'OutputFileName',
            name: 'File Name',
            fieldName: 'OutputFileName',
            minWidth: 1,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
        {
            key: 'CreatedOn',
            name: 'CreatedOn',
            fieldName: 'CreatedOn',
            minWidth: 1,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
        // {
        //     key: 'PeriodUpdateStatus',
        //     name: 'Period Update Status',
        //     fieldName: 'PeriodUpdateStatus',
        //     minWidth: 300,
        //     maxWidth: 300,
        //     isResizable: true,
        //     headerClassName: styles.bold,
        // },


    ];


    constructor(props: IAvailExportsListProps, state: IAvailExportsListState<IEntity>) {
        super(props);
        this.state = new AvailExportsListState<IEntity>();
        this.UploadFolder_Report = getUploadFolder_Report(props.spfxContext);
        
        this._selection = new Selection({
            onSelectionChanged: () => {
                if (this._selection.getSelectedCount() === 1) {

                    const sel = this._selection.getSelection()[0];
                    console.log(sel);
                    const key = Number(sel.key);
                    const title: string = sel["Title"];
                    const outputStatus: string = sel["OutputFileStatus"];

                    let outputCreated:boolean = false;
                    if(outputStatus.search("Cr") === 0)
                        outputCreated = true;
            
                    let enableDelete:boolean = false;                        
                    if(outputStatus.search("Cr") === 0 || outputStatus.search("Err") === 0)
                        enableDelete = true;
                    

                    this.setState({ SelectedEntity: key, SelectedEntityTitle: title, EnableDelete:enableDelete, EnableDownload:outputCreated });
                }
                else {
                    this.setState({ SelectedEntity: null, SelectedEntityTitle: null, EnableDelete:false, EnableDownload:false });
                }
            }
        });
    }

    //#region Render

    public render(): React.ReactElement<IAvailExportsListProps> {

        return (
            <div className={`${styles.cr}`}>
                <div style={{ position: 'relative' }}>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderList()}
                    {this.state.ShowForm && this.renderForm()}

                    <ConfirmDialog hidden={this.state.HideDeleteDialog} title="Delete Export" content={`Are you sure you want to delete ${this.getSelectedEntityName()} export?`} confirmButtonText="Delete" handleConfirm={this.deleteOutput} handleCancel={this.toggleDeleteConfirm} />
                </div>
            </div>
        );
    }

    private renderList() {

        const listColumns = this.getColumns();
        const listColumnsForData = this.getColumnsForData();

        let items: IObjectWithKey[] = this.state.Entities.map((e) => { return this.makeItem(e, listColumnsForData); });



        return (
            <FilteredAvailExportsList
                //onItemTitleClick={this.props.onItemTitleClick}
                columns={listColumns}
                items={items}
            
                filterText={this.props.filterText}
                onFilterChange={this.props.onChangeFilterText}
                selection={this._selection}

                onDelete={this.handleDelete}
                onDownload={this.handleDownload}

                deleteDisabled={!this.state.EnableDelete}
                downloadDisabled={!this.state.EnableDownload}

                onRefresh={this.handleRefresh}

                
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



    private handleRefresh = () : void =>{
        console.log('refresh list');
        this.loadData();
    }

    private handleDelete = (): void => {
        console.log('in del pdf');

        if (this.props.onError) this.props.onError(null);
        //this.setState({ HideDeleteDialog: true });
        let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; });
        if(entity[0]){

            const outputStatus:string = entity[0]["OutputFileStatus"];

            
            //console.log(fileName);

            
                //console.log('file deleted', df);

                this.availableExportService.delete(this.state.SelectedEntity).then(() => {
                    this.loadData();

                    if(outputStatus.search("Cr") === 0){
                        const outputFileName:string = entity[0]["OutputFileName"];
                        sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Report).files.getByName(outputFileName).delete().then(df => {
                        }); 

                    }
                

                } , (err) => {
                    if (this.props.onError) this.props.onError(`Cannot delete this file. `, err.message);
                });
            


        }

    }

    private handleDownload = (): void => {
        console.log('in download');
        let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; });
        if(entity[0]){
            const outputStatus:string = entity[0]["OutputFileStatus"];
            if(outputStatus.search("Cr") === 0){
                //status is Cr
                const outputFileName:string = entity[0]["OutputFileName"];
                //download pdf

                const f = sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Report).files.getByName(outputFileName);
    
                f.get().then(t => {
                    //console.log(t);
                    const serverRelativeUrl = t["ServerRelativeUrl"];
                    //console.log(serverRelativeUrl);
              
                    const a = document.createElement('a');
                    //document.body.appendChild(a);
                    a.href = serverRelativeUrl;
                    a.target = "_blank";
                    a.download = outputFileName;
                    
                    document.body.appendChild(a);
                    //console.log(a);
                    //a.click();
                    //document.body.removeChild(a);
                    
                    
                    setTimeout(() => {
                      window.URL.revokeObjectURL(serverRelativeUrl);
                      window.open(serverRelativeUrl, '_blank');
                      document.body.removeChild(a);
                    }, 1);
                    
              
                  });





            }
            else{
                console.log("Output not created");
            }
        
                
        }
    }



    private closePanel = (): void => {
        this.setState({ ShowForm: false });
    }



    private getSelectedEntityName = (): string => {
        let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; });
        return entity[0] ? entity[0].Title : null;
    }

    private toggleDeleteConfirm = (): void => {
        this.setState({ HideDeleteDialog: !this.state.HideDeleteDialog });
    }

    private deleteOutput = (): void => {

    }

    //#endregion Class Methods

    //#region Data Load


    private loadData = (): void => {
        this.setState({ Loading: true });
        const read: Promise<IEntity[]> = this.availableExportService.readAllByModule(this.props.moduleName);
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
    public componentDidUpdate(prevProps: IAvailExportsListProps): void {
        if (prevProps.listRefreshNeededCounter !== this.props.listRefreshNeededCounter) {
            //console.log('props changed, load data again');
            this._selection.setAllSelected(false);
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
