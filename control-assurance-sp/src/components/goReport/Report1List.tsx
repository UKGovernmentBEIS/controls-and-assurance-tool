import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { sp } from '@pnp/sp';
import { FilteredReport1List, IObjectWithKey } from './FilteredReport1List';
import { IEntity } from '../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../cr/CrLoadingOverlay';
import { Selection } from '../cr/FilteredList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { getUploadFolder_Report } from '../../types/AppGlobals';
import styles from '../../styles/cr.module.scss';



export interface IReport1ListProps extends types.IBaseComponentProps {

    //onItemTitleClick: (ID: number, goElementId:number, title: string, filteredItems: any[]) => void;
    periodId: number | string;
    filterText?: string;
    onChangeFilterText: (value: string) => void;

}

export interface IReport1ListState<T> {
    SelectedEntity: number;
    SelectedEntityTitle: string;

    ShowForm: boolean;
    EnableCreatePdf?: boolean;
    EnableDeletePdf?: boolean;
    EnableDownloadPdf?: boolean;
    HideDeleteDialog: boolean;
    //ShowChildForm: boolean;
    //CurrentPage?: number;
    //NextPageAvailable?: boolean;
    Entities: T[];
    Loading: boolean;
    ListFilterText?: string;
    InitDataLoaded: boolean;
}
export class Report1ListState<T> implements IReport1ListState<T>{
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

export default class Report1List extends React.Component<IReport1ListProps, IReport1ListState<IEntity>> {
    private _selection: Selection;
    private UploadFolder_Report:string = "";
    private goFormService: services.GoFormService = new services.GoFormService(this.props.spfxContext, this.props.api);


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
            name: 'DGArea',
            fieldName: 'Title',
            minWidth: 480,
            maxWidth: 480,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'PdfStatus',
            name: 'PDF Status',
            fieldName: 'PdfStatus',
            minWidth: 200,
            maxWidth: 200,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'PdfName',
            name: 'PdfName',
            fieldName: 'PdfName',
            minWidth: 1,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
        {
            key: 'OverviewStatus',
            name: 'Overview Status',
            fieldName: 'OverviewStatus',
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'SpecificAreaStatus',
            name: 'Specific Area Status',
            fieldName: 'SpecificAreaStatus',
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'SignOffStatus',
            name: 'Sign Off Status',
            fieldName: 'SignOffStatus',
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            headerClassName: styles.bold,
        },
    ];


    constructor(props: IReport1ListProps, state: IReport1ListState<IEntity>) {
        super(props);
        this.state = new Report1ListState<IEntity>();
        this.UploadFolder_Report = getUploadFolder_Report(props.spfxContext);
        
        this._selection = new Selection({
            onSelectionChanged: () => {
                if (this._selection.getSelectedCount() === 1) {

                    const sel = this._selection.getSelection()[0];
                    console.log(sel);
                    const key = Number(sel.key);
                    const title: string = sel["Title"];
                    const pdfStatus: string = sel["PdfStatus"];

                    let pdfCreated:boolean = false;
                    if(pdfStatus.search("Cr") === 0)
                        pdfCreated = true;
                    

                    this.setState({ SelectedEntity: key, SelectedEntityTitle: title, EnableCreatePdf: true, EnableDeletePdf:pdfCreated, EnableDownloadPdf:pdfCreated });
                }
                else {
                    this.setState({ SelectedEntity: null, SelectedEntityTitle: null, EnableCreatePdf: false, EnableDeletePdf:false, EnableDownloadPdf:false });
                }
            }
        });
    }

    //#region Render

    public render(): React.ReactElement<IReport1ListProps> {

        return (
            <div className={`${styles.cr}`}>
                <div style={{ position: 'relative' }}>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderList()}
                    {this.state.ShowForm && this.renderForm()}

                    <ConfirmDialog hidden={this.state.HideDeleteDialog} title="Delete PDF" content={`Are you sure you want to delete ${this.getSelectedEntityName()} PDF?`} confirmButtonText="Delete PDF" handleConfirm={this.deletePdf} handleCancel={this.toggleDeletePdfConfirm} />
                </div>
            </div>
        );
    }

    private renderList() {

        const listColumns = this.getColumns();
        const listColumnsForData = this.getColumnsForData();

        let items: IObjectWithKey[] = this.state.Entities.map((e) => { return this.makeItem(e, listColumnsForData); });



        return (
            <FilteredReport1List
                //onItemTitleClick={this.props.onItemTitleClick}
                columns={listColumns}
                items={items}
            
                filterText={this.props.filterText}
                onFilterChange={this.props.onChangeFilterText}
                selection={this._selection}

                onCreatePdf={this.handleCreatePdf}
                onDeletePdf={this.handleDeletePdf}
                onDownloadPdf={this.handleDownloadPdf}

                createPdfDisabled={!this.state.EnableCreatePdf}
                deletePdfDisabled={!this.state.EnableDeletePdf}
                downloadPdfDisabled={!this.state.EnableDownloadPdf}



                
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



    private handleCreatePdf = (): void => {
        if (this.props.onError) this.props.onError(null);
        if (this.state.SelectedEntity) {
            const goFormId:number = this.state.SelectedEntity;
            const spSiteUrl: string = this.props.spfxContext.pageContext.web.absoluteUrl;
            console.log('spSiteUrl', spSiteUrl);

            this.goFormService.createPDF(goFormId, spSiteUrl).then((res: string): void => {
    
                console.log('Pdf creation initialized');
                this.loadData();
                //this.props.onSignOff();
    
            }, (err) => {
                if (this.props.onError)
                    this.props.onError(`Error creating PDF`, err.message);
    
            });
        }
    }
    private handleDeletePdf = (): void => {
        console.log('in del pdf');
    }
    private handleDownloadPdf = (): void => {
        console.log('in download pdf');
        let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; });
        if(entity[0]){
            const pdfStatus:string = entity[0]["PdfStatus"];
            if(pdfStatus.search("Cr") === 0){
                //status is Cr
                const pdfName:string = entity[0]["PdfName"];
                //download pdf

                const f = sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Report).files.getByName(pdfName);
    
                f.get().then(t => {
                    //console.log(t);
                    const serverRelativeUrl = t["ServerRelativeUrl"];
                    //console.log(serverRelativeUrl);
              
                    const a = document.createElement('a');
                    //document.body.appendChild(a);
                    a.href = serverRelativeUrl;
                    a.target = "_blank";
                    a.download = pdfName;
                    
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

    private assignFormSaved = (): void => {
        this.loadData();
        this.closePanel();
    }

    private getSelectedEntityName = (): string => {
        let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; });
        return entity[0] ? entity[0].Title : null;
    }

    private toggleDeletePdfConfirm = (): void => {
        this.setState({ HideDeleteDialog: !this.state.HideDeleteDialog });
    }

    private deletePdf = (): void => {

    }

    //#endregion Class Methods

    //#region Data Load


    private loadData = (): void => {
        this.setState({ Loading: true });
        const read: Promise<IEntity[]> = this.goFormService.readAllReport1(this.props.periodId);
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
    public componentDidUpdate(prevProps: IReport1ListProps): void {
        if (prevProps.periodId !== this.props.periodId) {
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
