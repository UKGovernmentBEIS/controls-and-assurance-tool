import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { sp } from '@pnp/sp';
import MainSaveForm from './MainSaveForm';
import { FilteredMainList, IObjectWithKey } from './FilteredMainList';
import { IEntity } from '../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../cr/CrLoadingOverlay';
import { Selection } from '../cr/FilteredList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { MessageDialog } from '../cr/MessageDialog';
import styles from '../../styles/cr.module.scss';


export interface IMainListProps extends types.IBaseComponentProps {

    isArchive: boolean;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    userIdsArr:number[];

    filterText?: string;
    onChangeFilterText: (value: string) => void;

    onMainSaved: () => void;
    mainListsSaveCounter:number;

    superUserPermission: boolean;
    currentUserId: number;

}

export interface IMainListState<T> {
    SelectedEntity: number;
    SelectedEntityTitle: string;
    //SelectedGoElementId:number;

    SelectedEntityChildren: number;
    ShowForm: boolean;
    EnableEdit?: boolean;
    EnableDelete?: boolean;
    HideDeleteDisallowed: boolean;
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
    //public SelectedGoElementId = null;

    public SelectedEntityChildren = null;
    public ShowForm = false;
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
    private mainService: services.IAPActionService = new services.IAPActionService(this.props.spfxContext, this.props.api);

    private ChildEntityName: { Plural: string, Singular: string } = { Plural: 'Updates', Singular: 'Update' };

    private listColumns: IUpdatesListColumn[] = [
        //use fieldName as key

        {
            key: 'ID',
            name: 'ID',
            fieldName: 'ID',
            minWidth: 1,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
        {
            key: 'IAPTypeId',
            name: 'IAPTypeId',
            fieldName: 'IAPTypeId',
            minWidth: 1,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
        {
            key: 'CreatedById',
            name: 'CreatedById',
            fieldName: 'CreatedById',
            minWidth: 1,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
        {
            key: 'OwnerIds',
            name: 'OwnerIds',
            fieldName: 'OwnerIds',
            minWidth: 1,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
        {
            key: 'Title',
            name: 'Title',
            fieldName: 'Title',
            minWidth: 400,
            maxWidth: 400,
            isResizable: true,
            isMultiline:true,
            headerClassName: styles.bold,
        },
        {
            key: 'Type',
            name: 'Type',
            fieldName: 'Type',
            minWidth: 90,
            maxWidth: 90,
            isResizable: true,
            isMultiline:true,
            headerClassName: styles.bold,
        },
        // {
        //     key: 'Priority',
        //     name: 'Priority',
        //     fieldName: 'Priority',
        //     minWidth: 90,
        //     maxWidth: 90,
        //     isResizable: true,
        //     headerClassName: styles.bold,
        // },
        {
            key: 'Status',
            name: 'Status',
            fieldName: 'Status',
            minWidth: 100,
            maxWidth: 100,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'CreatedBy',
            name: 'Created By',
            fieldName: 'CreatedBy',
            minWidth: 100,
            maxWidth: 100,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'CreatedOn',
            name: 'Created On',
            fieldName: 'CreatedOn',
            minWidth: 80,
            maxWidth: 80,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'ActionOwners',
            name: 'Action Owners',
            fieldName: 'ActionOwners',
            minWidth: 150,
            maxWidth: 150,
            isMultiline: true,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'Directorates',
            name: 'Directorates',
            fieldName: 'Directorates',
            minWidth: 200,
            maxWidth: 200,
            isMultiline: true,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'Update',
            name: 'Update',
            fieldName: 'Update',
            minWidth: 80,
            maxWidth: 80,
            isMultiline: true,
            isResizable: true,
            headerClassName: styles.bold,
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
                    const iapTypeId: number = Number(sel["IAPTypeId"]);
                    const createdById:number = Number(sel["CreatedById"]);

                    

                    if(iapTypeId === 1){
                        
                        if(this.props.superUserPermission === true || (this.props.currentUserId === createdById)){
                            this.setState({ SelectedEntity: key, SelectedEntityTitle: title, EnableEdit:true, EnableDelete: true });
                        }
                        else{
                            //no edit/del permission
                            this.setState({ SelectedEntity: key, SelectedEntityTitle: title, EnableEdit:false, EnableDelete: false });    
                        }
                        
                    }
                    else{
                        this.setState({ SelectedEntity: key, SelectedEntityTitle: title, EnableEdit:false, EnableDelete: false });
                    }
                    

                    
                }
                else {
                    this.setState({ SelectedEntity: null, SelectedEntityTitle: null, EnableEdit:false, EnableDelete: false });
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

                    <MessageDialog hidden={this.state.HideDeleteDisallowed} title={`This action cannot be deleted`} content={`Action '${this.getSelectedEntityName()}' has ${this.state.SelectedEntityChildren} ${this.state.SelectedEntityChildren === 1 ? this.ChildEntityName.Singular.toLowerCase() : this.ChildEntityName.Plural.toLowerCase()} belonging to it.`} handleOk={this.toggleDeleteDisallowed} />
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

                filterText={this.props.filterText}
                onFilterChange={this.props.onChangeFilterText}
                selection={this._selection}

                onAdd={this.addItem}
                onEdit={this.editItem}
                onDelete={this.checkDelete}
                editDisabled={!this.state.EnableEdit}
                deleteDisabled={!this.state.EnableDelete}

                
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
        this.setState({ ShowForm: false });
    }

    private formSaved = (): void => {
        this.setState({ ShowForm: false, }, this.props.onMainSaved);
        //this.loadData();
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

        const userIds:string = this.props.userIdsArr.join(',');

        const read: Promise<IEntity[]> = this.mainService.readAllWithFilters(userIds, this.props.isArchive);
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
        if (prevProps.userIdsArr !== this.props.userIdsArr || prevProps.mainListsSaveCounter !== this.props.mainListsSaveCounter) {
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

    private editItem = (): void => {
        this.setState({ ShowForm: true });
    }

    private checkDelete = (): void => {

        this.mainService.numberOfChildren(this.state.SelectedEntity, 'IAPActionUpdates').then((numberOfChildren: number) => {
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
