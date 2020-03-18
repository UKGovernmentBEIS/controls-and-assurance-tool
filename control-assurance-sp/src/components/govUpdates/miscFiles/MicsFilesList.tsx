import * as React from 'react';
import * as types from '../../../types';
import * as services from '../../../services';
import { sp } from '@pnp/sp';
import MiscFileSaveForm from './MiscFileSaveForm';
import { FilteredMiscFilesList, IObjectWithKey } from './FilteredMiscFilesList';
import { IEntity } from '../../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../../cr/CrLoadingOverlay';
import { Selection } from '../../cr/FilteredList';
import { ConfirmDialog } from '../../cr/ConfirmDialog';
import styles from '../../../styles/cr.module.scss';
import { DateService } from '../../../services';
import { getUploadFolder_MiscFiles } from '../../../types/AppGlobals';


export interface IMiscFilesListProps extends types.IBaseComponentProps {

    //onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    filterText?: string;
    onChangeFilterText: (value: string) => void;

}

export interface IMiscFilesListState<T> {
    SelectedEntity: number;
    SelectedEntityTitle: string;
    SelectedEntityChildren: number;
    ShowForm: boolean;
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
export class MiscFilesListState<T> implements IMiscFilesListState<T>{
    public SelectedEntity = null;
    public SelectedEntityTitle: string = null;
    public SelectedEntityChildren = null;
    public ShowForm = false;
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

export default class MiscFilesList extends React.Component<IMiscFilesListProps, IMiscFilesListState<IEntity>> {
    private UploadFolder_MiscFiles = "";
    private _selection: Selection;
    private goMiscFileService: services.GoMiscFileService = new services.GoMiscFileService(this.props.spfxContext, this.props.api);

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
            name: 'File Name',
            fieldName: 'Title',
            minWidth: 200,
            maxWidth: 300,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'Details',
            name: 'Details',
            fieldName: 'Details',
            minWidth: 200,
            maxWidth: 300,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,

        },
        {
            key: 'UploadedByUser',
            name: 'Uploaded By',
            fieldName: 'UploadedByUser',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'DateUploaded',
            name: 'Upload Date',
            fieldName: 'DateUploaded',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            headerClassName: styles.bold,

        },


    ];

    constructor(props: IMiscFilesListProps, state: IMiscFilesListState<IEntity>) {
        super(props);
        this.state = new MiscFilesListState<IEntity>();

        this.UploadFolder_MiscFiles = getUploadFolder_MiscFiles(props.spfxContext);
        //console.log("this.UploadFolder_MiscFiles", this.UploadFolder_MiscFiles);
        
        this._selection = new Selection({
            onSelectionChanged: () => {
                if (this._selection.getSelectedCount() === 1) {

                    const sel = this._selection.getSelection()[0];
                    const key = Number(sel.key);
                    const title: string = sel["Title"];

                    this.setState({ SelectedEntity: key, SelectedEntityTitle: title, EnableEdit: true, EnableDelete: true });
                }
                else {
                    this.setState({ SelectedEntity: null, SelectedEntityTitle: null, EnableEdit: false, EnableDelete: false });
                }
            }
        });


        
        //const webTitle = getUploadFolder_MiscFiles(props.spfxContext);
        //console.log("webTitle", `'${webTitle}'`);
        //console.log("props.spfxContext.pageContext.web.title ", `'${props.spfxContext.pageContext.web.title}'`);
    }

    //#region Render

    public render(): React.ReactElement<IMiscFilesListProps> {

        return (
            <div className={`${styles.cr}`}>
                <div style={{ position: 'relative' }}>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderList()}
                    {this.state.ShowForm && this.renderForm()}

                    <ConfirmDialog hidden={this.state.HideDeleteDialog} title={`Are you sure you want to delete ${this.getSelectedEntityName()}?`} content={`A deleted file cannot be un-deleted.`} confirmButtonText="Delete" handleConfirm={this.deleteFile} handleCancel={this.toggleDeleteConfirm} />
                </div>
            </div>
        );
    }

    private renderList() {

        const listColumns = this.getColumns();
        const listColumnsForData = this.getColumnsForData();

        let items: IObjectWithKey[] = this.state.Entities.map((e) => { return this.makeItem(e, listColumnsForData); });



        return (
            <FilteredMiscFilesList
                //onItemTitleClick={this.props.onItemTitleClick}
                columns={listColumns}
                items={items}
                filterText={this.props.filterText}
                onFilterChange={this.props.onChangeFilterText}
                selection={this._selection}
                onAdd={this.addFile}
                onEdit={this.editFile}
                onDelete={this.toggleDeleteConfirm}
                onView={this.viewFile}
                editDisabled={!this.state.EnableEdit}
                deleteDisabled={!this.state.EnableDelete}
                
            />
        );
    }

    private renderForm() {

        return (

            <MiscFileSaveForm
                showForm={this.state.ShowForm}
                miscFileID={this.state.SelectedEntity}
                onSaved={this.fileSaved}
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
            if (c.fieldName === "UploadedByUser") {
                item = {
                    [c.fieldName]: e["User"]["Title"],
                    ...item
                };
            }
            else if (c.fieldName === "DateUploaded") {
                item = {
                    [c.fieldName]: DateService.dateToUkDateTime(e[c.fieldName]),
                    ...item
                };
            }
            else {
                item = {
                    [c.fieldName]: fieldContent,
                    ...item
                };
            }

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

    private editFile = (): void => {
        this.setState({ ShowForm: true });
    }

    private viewFile = (): void => {
        console.log('in view.');
        const fileName:string = this.state.SelectedEntityTitle;

        const f = sp.web.getFolderByServerRelativeUrl(this.UploadFolder_MiscFiles).files.getByName(fileName);
    
        f.get().then(t => {
            console.log(t);
            const serverRelativeUrl = t["ServerRelativeUrl"];
            console.log(serverRelativeUrl);
      
            const a = document.createElement('a');
            //document.body.appendChild(a);
            a.href = serverRelativeUrl;
            a.target = "_blank";
            a.download = fileName;
            
            document.body.appendChild(a);
            console.log(a);
            //a.click();
            //document.body.removeChild(a);
            
            
            setTimeout(() => {
              window.URL.revokeObjectURL(serverRelativeUrl);
              window.open(serverRelativeUrl, '_blank');
              document.body.removeChild(a);
            }, 1);
            
      
          });
  

    }

    private closePanel = (): void => {
        this.setState({ ShowForm: false });
    }

    private fileSaved = (): void => {
        this.loadMiscFiles();
        this.closePanel();
    }

    private getSelectedEntityName = (): string => {
        let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; });
        return entity[0] ? entity[0].Title : null;
    }

    private toggleDeleteConfirm = (): void => {
        this.setState({ HideDeleteDialog: !this.state.HideDeleteDialog });
    }

    private deleteFile = (): void => {
        if (this.props.onError) this.props.onError(null);
        this.setState({ HideDeleteDialog: true });
        if (this.state.SelectedEntity) {

            const fileName: string = this.state.SelectedEntityTitle;
            //console.log(fileName);

            sp.web.getFolderByServerRelativeUrl(this.UploadFolder_MiscFiles).files.getByName(fileName).delete().then(df => {
                //console.log('file deleted', df);

                this.goMiscFileService.delete(this.state.SelectedEntity).then(this.loadMiscFiles, (err) => {
                    if (this.props.onError) this.props.onError(`Cannot delete this file. `, err.message);
                });
            });


        }
    }

    //#endregion Class Methods

    //#region Data Load


    private loadMiscFiles = (): void => {
        this.setState({ Loading: true });
        const read: Promise<IEntity[]> = this.goMiscFileService.readAllExpandAll();
        read.then((entities: any): void => {
            console.log(entities);
            this.setState({
                Loading: false, Entities: entities,
                //ListFilterText: this.props.filterText
            });

        }, (err) => this.errorLoadingMiscFiles(err));
    }
    private errorLoadingMiscFiles = (err: any, entityName?: string): void => {
        this.setState({ Loading: false });
        if (this.props.onError) this.props.onError(`Error loading ${entityName || 'items'}`, err.message);
    }
    public componentDidMount(): void {
        this.loadMiscFiles();
        //console.log('web title: ', this.props.spfxContext.pageContext.web.title);

    }
    public componentDidUpdate(prevProps: IMiscFilesListProps): void {

    }



    //#endregion Data Load

    //#region Events Handlers

    //7Oct19 - no need for this method
    // private handleFilterChange = (value: string): void => {
    //     this.setState({ ListFilterText: value });
    // }



    //#endregion Events Handlers

}
