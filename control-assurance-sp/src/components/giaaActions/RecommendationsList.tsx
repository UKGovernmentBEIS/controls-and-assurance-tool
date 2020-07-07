import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { sp } from '@pnp/sp';
import RecommendationSaveForm from './RecommendationSaveForm';
import { FilteredRecList, IObjectWithKey } from './FilteredRecList';
import { IEntity } from '../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../cr/CrLoadingOverlay';
import { Selection } from '../cr/FilteredList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import styles from '../../styles/cr.module.scss';


export interface IRecommendationsListProps extends types.IBaseComponentProps {

    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    giaaAuditReportId: number | string;
    incompleteOnly: boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine: boolean;
    onChangeJustMine: (value: boolean) => void;

    actionStatusTypeId:number;
    onChangeActionStatusType: (option: IDropdownOption)=> void;

    filterText?: string;
    onChangeFilterText: (value: string) => void;

    actionStatusTypes: IEntity[];

}

export interface IRecommendationsListState<T> {
    SelectedEntity: number;
    SelectedEntityTitle: string;
    //SelectedGoElementId:number;

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
export class RecommendationsListState<T> implements IRecommendationsListState<T>{
    public SelectedEntity = null;
    public SelectedEntityTitle: string = null;
    //public SelectedGoElementId = null;

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

export default class RecommendationsList extends React.Component<IRecommendationsListProps, IRecommendationsListState<IEntity>> {
    private _selection: Selection;
    private recService: services.GIAARecommendationService = new services.GIAARecommendationService(this.props.spfxContext, this.props.api);


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
            name: 'Ref',
            fieldName: 'Title',
            minWidth: 60,
            maxWidth: 60,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'RecommendationDetails',
            name: 'Recommendations/Actions',
            fieldName: 'RecommendationDetails',
            minWidth: 445,
            maxWidth: 445,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'Priority',
            name: 'Priority',
            fieldName: 'Priority',
            minWidth: 65,
            maxWidth: 65,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'TargetDate',
            name: 'Original Date',
            fieldName: 'TargetDate',
            minWidth: 78,
            maxWidth: 78,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },

        {
            key: 'RevisedDate',
            name: 'Revised Date',
            fieldName: 'RevisedDate',
            minWidth: 78,
            maxWidth: 78,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'ActionStatus',
            name: 'Action Status',
            fieldName: 'ActionStatus',
            minWidth: 78,
            maxWidth: 78,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'Owners',
            name: 'Owners',
            fieldName: 'Owners',
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            headerClassName: styles.bold,
        },



        {
            key: 'UpdateStatus',
            name: 'Period Update Status',
            fieldName: 'UpdateStatus',
            minWidth: 150,
            maxWidth: 150,
            isResizable: true,
            headerClassName: styles.bold,
        },
    ];


    constructor(props: IRecommendationsListProps, state: IRecommendationsListState<IEntity>) {
        super(props);
        this.state = new RecommendationsListState<IEntity>();
        
        this._selection = new Selection({
            onSelectionChanged: () => {
                if (this._selection.getSelectedCount() === 1) {

                    const sel = this._selection.getSelection()[0];
                    console.log(sel);
                    const key = Number(sel.key);
                    const title: string = sel["Title"];
                    //const goElementId = Number(sel["GoElementId"]);
                    

                    this.setState({ SelectedEntity: key, SelectedEntityTitle: title, EnableEdit:true, EnableDelete: true });
                }
                else {
                    this.setState({ SelectedEntity: null, SelectedEntityTitle: null, EnableEdit:false, EnableDelete: false });
                }
            }
        });
    }

    //#region Render

    public render(): React.ReactElement<IRecommendationsListProps> {

        return (
            <div className={`${styles.cr}`}>
                <div style={{ position: 'relative' }}>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderList()}
                    {this.state.ShowForm && this.renderForm()}

                    <ConfirmDialog hidden={this.state.HideDeleteDialog} title={`Are you sure you want to delete ${this.getSelectedEntityName()}?`} content={`Please note, all updates and related information will also be deleted.`} confirmButtonText="Delete" handleConfirm={this.deleteRecord} handleCancel={this.toggleDeleteConfirm} />
                </div>
            </div>
        );
    }

    private renderList() {

        const listColumns = this.getColumns();
        const listColumnsForData = this.getColumnsForData();

        let items: IObjectWithKey[] = this.state.Entities.map((e) => { return this.makeItem(e, listColumnsForData); });



        return (
            <FilteredRecList
                onItemTitleClick={this.props.onItemTitleClick}
                columns={listColumns}
                items={items}
                
                incompleteOnly={this.props.incompleteOnly}
                onChangeIncompleteOnly={this.props.onChangeIncompleteOnly}
                justMine={this.props.justMine}
                onChangeJustMine={this.props.onChangeJustMine}
                actionStatusTypeId={this.props.actionStatusTypeId}
                onChangeActionStatusType={this.props.onChangeActionStatusType}                    

                filterText={this.props.filterText}
                onFilterChange={this.props.onChangeFilterText}
                selection={this._selection}

                onAdd={this.addItem}
                onEdit={this.editItem}
                onDelete={this.checkDelete}
                editDisabled={!this.state.EnableEdit}
                deleteDisabled={!this.state.EnableDelete}

                actionStatusTypes={this.props.actionStatusTypes}

                
            />
        );
    }

    private renderForm() {


        return (
            <RecommendationSaveForm
                giaaAuditReportId={this.props.giaaAuditReportId}
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
        this.loadData();
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

        this.setState({ HideDeleteDialog: true });
        if (this.state.SelectedEntity) {
            this.recService.delete(this.state.SelectedEntity).then(this.loadData, (err) => {
                if (this.props.onError) this.props.onError(`Error deleting item ${this.state.SelectedEntity}`, err.message);
            });
        }

    }

    //#endregion Class Methods

    //#region Data Load


    private loadData = (): void => {
        this.setState({ Loading: true });


        const read: Promise<IEntity[]> = this.recService.readAllWithFilters(this.props.giaaAuditReportId, this.props.incompleteOnly, this.props.justMine, this.props.actionStatusTypeId);
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
    public componentDidUpdate(prevProps: IRecommendationsListProps): void {
        if (prevProps.actionStatusTypeId !== this.props.actionStatusTypeId || prevProps.justMine !== this.props.justMine || prevProps.incompleteOnly !== this.props.incompleteOnly) {
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

        this.toggleDeleteConfirm();

    }


    //#endregion Events Handlers

}
