import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { sp } from '@pnp/sp';
import { FilteredReport2List, IObjectWithKey } from './FilteredReport2List';
import { IEntity } from '../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../cr/CrLoadingOverlay';
import { Selection } from '../cr/FilteredList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import styles from '../../styles/cr.module.scss';


export interface IReport2ListProps extends types.IBaseComponentProps {


    filterText?: string;
    onChangeFilterText: (value: string) => void;


    //superUserPermission:boolean;

}

export interface IReport2ListState<T> {
    SelectedEntity: number;
    SelectedEntityTitle: string;
    //SelectedGoElementId:number;
    EnableCreatePdf?: boolean;
    EnableDeletePdf?: boolean;
    EnableDownloadPdf?: boolean;
    PDFStatus?: string;

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
export class Report2ListState<T> implements IReport2ListState<T>{
    public SelectedEntity = null;
    public SelectedEntityTitle: string = null;
    //public SelectedGoElementId = null;
    public EnableCreatePdf = false;
    public EnableDeletePdf = false;
    public EnableDownloadPdf = false;
    public PDFStatus = "";

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

export default class Report2List extends React.Component<IReport2ListProps, IReport2ListState<IEntity>> {
    private _selection: Selection;
    private naoPublicationService: services.NAOPublicationService = new services.NAOPublicationService(this.props.spfxContext, this.props.api);
    private UploadFolder_Report: string = "";
    private naoOutput2Service: services.NAOOutput2Service = new services.NAOOutput2Service(this.props.spfxContext, this.props.api);

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
            key: 'CurrentPeriodId',
            name: 'CurrentPeriodId',
            fieldName: 'CurrentPeriodId',
            minWidth: 1,
            isResizable: true,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
    ];


    constructor(props: IReport2ListProps, state: IReport2ListState<IEntity>) {
        super(props);
        this.state = new Report2ListState<IEntity>();

        this._selection = new Selection({
            onSelectionChanged: () => {

                this.manageEnableDisableCreatePDF();
            }
        });
    }

    //#region Render

    public render(): React.ReactElement<IReport2ListProps> {

        return (
            <div className={`${styles.cr}`}>
                <div style={{ position: 'relative' }}>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderList()}
                    {this.renderStatus()}
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
            <FilteredReport2List
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

    private renderStatus() {
        let statusMsg = this.state.PDFStatus;
        return (
            <div style={{ paddingTop: '25px' }}>
                <div>{statusMsg}</div>
                { statusMsg === "Working... Please Wait" &&
                    <div>
                        <span style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }} onClick={this.loadPDFStatus} >Click to Refresh Status</span>
                    </div>
                }

            </div>
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










    private getSelectedEntityName = (): string => {
        let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; });
        return entity[0] ? entity[0].Title : null;
    }

    private toggleDeleteConfirm = (): void => {
        this.setState({ HideDeleteDialog: !this.state.HideDeleteDialog });
    }

    private deleteRecord = (): void => {

    }

    private manageEnableDisableCreatePDF = (): void => {
        if (this._selection.getSelectedCount() > 0) {

            //const sel = this._selection.getSelection();
            //console.log(sel);

            if (this.state.PDFStatus.search("Working... Please Wait") === 0) {
                this.setState({ EnableCreatePdf: false });
            }
            else {
                this.setState({ EnableCreatePdf: true });
            }


        }
        else {
            this.setState({ EnableCreatePdf: false });
        }
    }

    //#endregion Class Methods

    //#region Data Load


    private loadData = (): void => {
        this.setState({ Loading: true });


        const read: Promise<IEntity[]> = this.naoPublicationService.readAllWithFilters(0, false, false, false);
        read.then((entities: any): void => {
            this.setState({
                Loading: false, Entities: entities,
            });

        }, (err) => this.errorLoadingData(err));
    }

    private loadPDFStatus = (): void => {

        this.naoOutput2Service.getPDFStatus().then((res: string): void => {

            let pdfAvailable: boolean = false;
            if (res.search("Last PDF generated by") === 0) {
                //pdf generated, allow user to download+delete
                pdfAvailable = true;

            }

            console.log('Pdf status', res);
            this.setState({
                PDFStatus: res,
                EnableDownloadPdf: pdfAvailable,
                EnableDeletePdf: pdfAvailable,
            }, this.manageEnableDisableCreatePDF);


        }, (err) => {
            if (this.props.onError)
                this.props.onError(`Error creating PDF`, err.message);

        });
    }

    private errorLoadingData = (err: any, entityName?: string): void => {
        this.setState({ Loading: false });
        if (this.props.onError) this.props.onError(`Error loading ${entityName || 'items'}`, err.message);
    }
    public componentDidMount(): void {
        this.loadData();
        this.loadPDFStatus();
        //console.log('web title: ', this.props.spfxContext.pageContext.web.title);

    }
    // public componentDidUpdate(prevProps: IReport2ListProps): void {
    //     if (prevProps.dgAreaId !== this.props.dgAreaId || prevProps.justMine !== this.props.justMine || prevProps.incompleteOnly !== this.props.incompleteOnly || prevProps.Report2ListsSaveCounter !== this.props.Report2ListsSaveCounter) {
    //         //console.log('props changed, load data again');
    //         this._selection.setAllSelected(false);
    //         this.loadData();
    //     }
    // }



    //#endregion Data Load

    //#region Events Handlers



    private addItem = (): void => {
        if (this.state.SelectedEntity)
            this._selection.setKeySelected(this.state.SelectedEntity.toString(), false, false);
        this.setState({ SelectedEntity: null, ShowForm: true });
    }

    private editItem = (): void => {
        //this.setState({ ShowForm: true });
        this._selection.setAllSelected(true);
    }
    private managePeriod = (): void => {
        this.setState({ ShowManagePeriodForm: true });
    }

    private handleCreatePdf = (filteredItems: any[]): void => {
        if (this.props.onError) this.props.onError(null);

        // const xx = filteredItems.filter(x => x["ID"] == 555);
        // console.log(xx);

        //console.log('on create pdf', filteredItems);
        const selection = this._selection.getSelection();
        //console.log('selection', selection);
        let selectedIds: number[] = [];

        for (let sel of selection) {
            //console.log('sel', sel);
            const sel_id: number = Number(sel["ID"]);
            selectedIds.push(sel_id);

            //const index = filteredItems.indexOf(sel);
            //console.log('index', index);


        }

        const publicationIds: string = selectedIds.join(',');
        console.log('publicationIds', publicationIds);

        const spSiteUrl: string = this.props.spfxContext.pageContext.web.absoluteUrl;
        //console.log('spSiteUrl', spSiteUrl);
        this.naoOutput2Service.createPDF(publicationIds, spSiteUrl).then((res: string): void => {

            console.log('Pdf creation initialized', res);
            this.setState({
                PDFStatus: res,
                EnableDownloadPdf: false,
                EnableDeletePdf: false,
                EnableCreatePdf: false,
            });
            //this.loadData(); //no need


        }, (err) => {
            if (this.props.onError)
                this.props.onError(`Error creating PDF`, err.message);

        });


    }
    private handleDeletePdf = (): void => {
        console.log('in del pdf');

        if (this.props.onError) this.props.onError(null);

        this.naoOutput2Service.deletePDFInfo().then((res: string): void => {

            this.loadPDFStatus();
            //this.props.onSignOff();

        }, (err) => {
            if (this.props.onError)
                this.props.onError(`Error deleting PDF`, err.message);

        });


    }
    private handleDownloadPdf = (): void => {
        console.log('in download pdf');

        const pdfName: string = "NAO_Output_By_Publication.pdf";
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

    //#endregion Events Handlers
}


    


