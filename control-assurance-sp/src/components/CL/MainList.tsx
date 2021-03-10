import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { sp } from '@pnp/sp';
import { FilteredMainList, IObjectWithKey } from './FilteredMainList';
import { GIAAImport, IEntity } from '../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../cr/CrLoadingOverlay';
import { Selection } from '../cr/FilteredList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { MessageDialog } from '../cr/MessageDialog';
import styles from '../../styles/cr.module.scss';


export interface IMainListProps extends types.IBaseComponentProps {

    filterText?: string;
    onChangeFilterText: (value: string) => void;

    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    onMoveToLeaving?: (ID: number, caseId: number) => void;
    onCreateExtension?: (ID: number, caseId: number) => void;
    //onMainSaved: () => void;
    currentUserId: number;
    superUserPermission: boolean;
    createPermission: boolean;
    caseType: string;

}

export interface IMainListState<T> {
    SelectedEntity: number;
    SelectedEntityTitle: string;

    SelectedEntityChildren: number;
    ShowForm: boolean;
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
    MoveToLeavingPermission:boolean;
    CreateExtensionPermission:boolean;
}
export class MainListState<T> implements IMainListState<T>{
    public SelectedEntity = null;
    public SelectedEntityTitle: string = null;

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
    public MoveToLeavingPermission = false;
    public CreateExtensionPermission = false;
}

export default class MainList extends React.Component<IMainListProps, IMainListState<IEntity>> {
    private _selection: Selection;
    private mainService: services.CLCaseService = new services.CLCaseService(this.props.spfxContext, this.props.api);

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
        {
            key: 'CaseId',
            name: 'CaseId',
            fieldName: 'CaseId',
            minWidth: 1,
            isResizable: true,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },

        {
            key: 'CaseRef',
            name: 'Case Ref',
            fieldName: 'CaseRef',
            minWidth: 80,
            maxWidth: 80,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'Title1',
            name: 'Title',
            fieldName: 'Title1',
            minWidth: 230,
            maxWidth: 230,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'Title2',
            name: 'Title',
            fieldName: 'Title2',
            minWidth: 230,
            maxWidth: 230,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
        {
            key: 'Stage',
            name: 'Stage',
            fieldName: 'Stage',
            minWidth: 80,
            maxWidth: 80,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },

        {
            key: 'StageActions1',
            name: 'Stage Actions',
            fieldName: 'StageActions1',
            minWidth: 110,
            maxWidth: 110,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },

        {
            key: 'StageActions2',
            name: 'Stage Actions',
            fieldName: 'StageActions2',
            minWidth: 100,
            maxWidth: 100,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },

        {
            key: 'Worker',
            name: 'Worker',
            fieldName: 'Worker',
            minWidth: 100,
            maxWidth: 100,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },

        {
            key: 'CreatedOn',
            name: 'CreatedOn',
            fieldName: 'CreatedOn',
            minWidth: 85,
            maxWidth: 85,
            isResizable: true,
            headerClassName: styles.bold,
        },
        // {
        //     key: 'CostCenter',
        //     name: 'Cost Center',
        //     fieldName: 'CostCenter',
        //     minWidth: 100,
        //     maxWidth: 100,
        //     isMultiline: true,
        //     isResizable: true,
        //     headerClassName: styles.bold,
        // },
        {
            key: 'HiringManager',
            name: 'Hiring Manager',
            fieldName: 'HiringManager',
            minWidth: 100,
            maxWidth: 100,
            isMultiline: true,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'StartDate',
            name: 'StartDate',
            fieldName: 'StartDate',
            minWidth: 85,
            maxWidth: 85,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'EndDate',
            name: 'EndDate',
            fieldName: 'EndDate',
            minWidth: 85,
            maxWidth: 85,
            isResizable: true,
            headerClassName: styles.bold,
        },


        {
            key: 'HiringManagerId',
            name: 'HiringManagerId',
            fieldName: 'HiringManagerId',
            minWidth: 1,
            maxWidth: 1,
            headerClassName: styles.bold,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },

        {
            key: 'EngagedChecksDone',
            name: 'EngagedChecksDone',
            fieldName: 'EngagedChecksDone',
            minWidth: 1,
            maxWidth: 1,
            headerClassName: styles.bold,
            columnDisplayType: ColumnDisplayTypes.Hidden,
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

                    //move to leaving permission - only superuser or hiring manager have permission
                    const hiringMgrUserId: number = Number(sel["HiringManagerId"]);
                    console.log('hiringMgrUserId', hiringMgrUserId);

                    //console.log('sel["EngagedChecksDone"]', sel["EngagedChecksDone"]);
                    //const engagedChecksDone:boolean =  sel["EngagedChecksDone"];
                    const engagedChecksDone:boolean = (sel["EngagedChecksDone"] === '1');
                    console.log('engagedChecksDone', engagedChecksDone);

                    let moveToLeavingPermission:boolean = false;
                    if(engagedChecksDone === true && (this.props.superUserPermission === true || (this.props.currentUserId === hiringMgrUserId))){
                    
                        console.log('MoveToLeavingPermission is true');
                        moveToLeavingPermission = true;
                    }


                    this.setState({ SelectedEntity: key, SelectedEntityTitle: title, EnableEdit: true, EnableDelete: true, MoveToLeavingPermission: moveToLeavingPermission, CreateExtensionPermission: moveToLeavingPermission });
                }
                else {
                    this.setState({ SelectedEntity: null, SelectedEntityTitle: null, EnableEdit: false, EnableDelete: false, MoveToLeavingPermission: false, CreateExtensionPermission: false });
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
                editDisabled={!this.state.EnableEdit}
                deleteDisabled={!this.state.EnableDelete}
                createPermission={true}
                caseType={this.props.caseType}

                moveToLeavingPermission={this.state.MoveToLeavingPermission}
                onMoveToLeaving={this.moveToLeaving}

                createExtensionPermission={this.state.CreateExtensionPermission}
                onCreateExtension={this.createExtension}

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



    //#endregion Class Methods

    //#region Data Load


    private loadData = (): void => {
        this.setState({ Loading: true });


        const read: Promise<IEntity[]> = this.mainService.readAllWithFilters(this.props.caseType);
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
    // public componentDidUpdate(prevProps: IMainListProps): void {
    //     if (prevProps.dgAreaId !== this.props.dgAreaId || prevProps.justMine !== this.props.justMine || prevProps.incompleteOnly !== this.props.incompleteOnly || prevProps.mainListsSaveCounter !== this.props.mainListsSaveCounter) {
    //         //console.log('props changed, load data again');
    //         this._selection.setAllSelected(false);
    //         this.loadData();
    //     }
    // }



    //#endregion Data Load

    //#region Events Handlers



    private addItem = (): void => {
        console.log('on add');
        this.props.onItemTitleClick(0, null, null);
        // if (this.state.SelectedEntity)
        //     this._selection.setKeySelected(this.state.SelectedEntity.toString(), false, false);
        // this.setState({ SelectedEntity: null, ShowForm: true });
    }

    private moveToLeaving = (): void => {
        console.log('on move to leaving', this.state.SelectedEntity, this.state.SelectedEntityTitle);
        const record = this.state.Entities.filter(x => x.ID === this.state.SelectedEntity)[0];
        console.log(record);
        this.props.onMoveToLeaving(this.state.SelectedEntity, Number(record['CaseId']));

    }

    private createExtension = (): void => {
        console.log('on createExtension', this.state.SelectedEntity, this.state.SelectedEntityTitle);
        const record = this.state.Entities.filter(x => x.ID === this.state.SelectedEntity)[0];
        console.log(record);
        this.props.onCreateExtension(this.state.SelectedEntity, Number(record['CaseId']));


    }



    private toggleDeleteDisallowed = (): void => {
        this.setState({ HideDeleteDisallowed: !this.state.HideDeleteDisallowed });
    }
    private toggleDeleteConfirm = (): void => {
        this.setState({ HideDeleteDialog: !this.state.HideDeleteDialog });
    }


    //#endregion Events Handlers

}
