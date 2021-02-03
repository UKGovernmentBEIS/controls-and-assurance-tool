import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { sp } from '@pnp/sp';
import MainSaveForm from './MainSaveForm';
import MainImportForm from './MainImportForm';
import { FilteredMainList, IObjectWithKey } from './FilteredMainList';
import { GIAAImport, IEntity } from '../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../cr/CrLoadingOverlay';
import { Selection } from '../cr/FilteredList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { MessageDialog } from '../cr/MessageDialog';
import styles from '../../styles/cr.module.scss';


export interface IMainListProps extends types.IBaseComponentProps {

    isArchive: boolean;
    //giaaPeriodId: number | string;
    dgAreaId: number | string;
    incompleteOnly: boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine: boolean;
    onChangeJustMine: (value: boolean) => void;

    filterText?: string;
    onChangeFilterText: (value: string) => void;

    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    onMainSaved: () => void;
    mainListsSaveCounter: number;
    onCheckUpdatesReq: () => void;

    superUserPermission: boolean;
    updatesReqInProgress:boolean;

}

export interface IMainListState<T> {
    SelectedEntity: number;
    SelectedEntityTitle: string;
    //SelectedGoElementId:number;

    SelectedEntityChildren: number;
    ShowForm: boolean;
    ShowImportForm: boolean;
    EnableEdit?: boolean;
    EnableDelete?: boolean;
    HideDeleteDialog: boolean;
    HideDeleteDisallowed: boolean;
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
    //public SelectedGoElementId = null;

    public SelectedEntityChildren = null;
    public ShowForm = false;
    public ShowImportForm = false;
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

export default class MainList extends React.Component<IMainListProps, IMainListState<IEntity>> {
    private _selection: Selection;
    private mainService: services.GIAAAuditReportService = new services.GIAAAuditReportService(this.props.spfxContext, this.props.api);
    private gIAAImportService: services.GIAAImportService = new services.GIAAImportService(this.props.spfxContext, this.props.api);

    private ChildEntityName: { Plural: string, Singular: string } = { Plural: 'Recommendations', Singular: 'Recommendation' };

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
        // {
        //     key: 'Directorate',
        //     name: 'Directorate',
        //     fieldName: 'Directorate',
        //     minWidth: 1,
        //     columnDisplayType: ColumnDisplayTypes.Hidden,
        // },
        {
            key: 'NumberStr',
            name: 'Num',
            fieldName: 'NumberStr',
            minWidth: 80,
            maxWidth: 80,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'Title',
            name: 'Title',
            fieldName: 'Title',
            minWidth: 230,
            maxWidth: 230,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'Directorate',
            name: 'Directorate(s)',
            fieldName: 'Directorate',
            minWidth: 120,
            maxWidth: 120,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },

        {
            key: 'IssueDateStr',
            name: 'Issue Date',
            fieldName: 'IssueDateStr',
            minWidth: 85,
            maxWidth: 85,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'Year',
            name: 'Year',
            fieldName: 'Year',
            minWidth: 80,
            maxWidth: 80,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'CompletePercent',
            name: 'Completed',
            fieldName: 'CompletePercent',
            minWidth: 70,
            maxWidth: 70,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'AssignedTo',
            name: 'Action Owners',
            fieldName: 'AssignedTo',
            minWidth: 120,
            maxWidth: 120,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },

        {
            key: 'UpdateStatus',
            name: 'Update Status',
            fieldName: 'UpdateStatus',
            minWidth: 90,
            maxWidth: 90,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'Assurance',
            name: 'Assurance',
            fieldName: 'Assurance',
            minWidth: 70,
            maxWidth: 70,
            isResizable: true,
            headerClassName: styles.bold,
        },

        // {
        //     key: 'GIAAAssuranceId',
        //     name: 'Assurance',
        //     fieldName: 'GIAAAssuranceId',
        //     minWidth: 150,
        //     maxWidth: 150,
        //     isResizable: true,
        //     headerClassName: styles.bold,
        // },


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
                    //const goElementId = Number(sel["GoElementId"]);


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
                    {this.state.ShowImportForm && this.renderImportForm()}

                    <MessageDialog hidden={this.state.HideDeleteDisallowed} title={`This report cannot be deleted`} content={`GIAA Audit Report '${this.getSelectedEntityName()}' has ${this.state.SelectedEntityChildren} ${this.state.SelectedEntityChildren === 1 ? this.ChildEntityName.Singular.toLowerCase() : this.ChildEntityName.Plural.toLowerCase()} belonging to it.`} handleOk={this.toggleDeleteDisallowed} />
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
                onImport={this.importItems}
                onCheckUpdatesReq={this.props.onCheckUpdatesReq}
                onEdit={this.editItem}
                onDelete={this.checkDelete}
                editDisabled={!this.state.EnableEdit}
                deleteDisabled={!this.state.EnableDelete}
                superUserPermission={this.props.superUserPermission}
                updatesReqInProgress={this.props.updatesReqInProgress}


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

    private renderImportForm() {
        return (
            <MainImportForm
                showForm={this.state.ShowImportForm}
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



    // private handleAssign = (): void => {
    //     this.setState({ ShowForm: true });
    // }



    private closePanel = (): void => {
        this.setState({ ShowForm: false, ShowImportForm: false });
    }

    private formSaved = (): void => {
        //this.loadData();

        this.setState({ ShowForm: false, ShowImportForm: false }, this.props.onMainSaved);


        //this.props.onMainSaved();
        //this.closePanel();



    }

    private getSelectedEntityName = (): string => {
        let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; });
        return entity[0] ? entity[0].Title : null;
    }



    private deleteRecord = (): void => {

        this.setState({ HideDeleteDialog: true });
        if (this.state.SelectedEntity) {
            this.mainService.delete(this.state.SelectedEntity).then(this.loadData, (err) => {
                if (this.props.onError) this.props.onError(`Error deleting item ${this.state.SelectedEntity}`, err.message);
            });
        }

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
        //console.log('web title: ', this.props.spfxContext.pageContext.web.title);

    }
    public componentDidUpdate(prevProps: IMainListProps): void {
        if (prevProps.dgAreaId !== this.props.dgAreaId || prevProps.justMine !== this.props.justMine || prevProps.incompleteOnly !== this.props.incompleteOnly || prevProps.mainListsSaveCounter !== this.props.mainListsSaveCounter) {
            //console.log('props changed, load data again');
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
    private importItems = (): void => {
        if (this.state.SelectedEntity)
            this._selection.setKeySelected(this.state.SelectedEntity.toString(), false, false);
        this.setState({ SelectedEntity: null, ShowImportForm: true });
    }



    private editItem = (): void => {
        this.setState({ ShowForm: true });
    }
    private checkDelete = (): void => {

        this.mainService.numberOfChildren(this.state.SelectedEntity, 'GIAARecommendations').then((numberOfChildren: number) => {
            //console.log(numberOfChildren);
            if (numberOfChildren > 0) {
                this.setState({ SelectedEntityChildren: numberOfChildren }, this.toggleDeleteDisallowed);

            }
            else {
                this.toggleDeleteConfirm();
            }

        });

    }

    private toggleDeleteDisallowed = (): void => {
        this.setState({ HideDeleteDisallowed: !this.state.HideDeleteDisallowed });
    }
    private toggleDeleteConfirm = (): void => {
        this.setState({ HideDeleteDialog: !this.state.HideDeleteDialog });
    }


    //#endregion Events Handlers

}
