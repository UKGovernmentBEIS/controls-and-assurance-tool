import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import { sp } from '@pnp/sp';
import UpdateSaveForm from './UpdateSaveForm';
import { FilteredUpdatesList, IObjectWithKey } from './FilteredUpdatesList';
import { IEntity } from '../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../cr/CrLoadingOverlay';
import { Selection } from '../cr/FilteredList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { MessageDialog } from '../cr/MessageDialog';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { GIAAUpdateTypes } from '../../types/AppGlobals';
import { getUploadFolder_GIAAUpdateEvidence } from '../../types/AppGlobals';
import styles from '../../styles/cr.module.scss';
import { ThemeSettingName } from 'office-ui-fabric-react/lib/Styling';


export interface IUpdatesListProps extends types.IBaseComponentProps {


    //onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    giaaRecommendationId: number | string;
    defaultGIAAActionStatusTypeId:number;
    defaultRevisedDate:Date;
    targetDate:Date;

    filterText?: string;
    onChangeFilterText: (value: string) => void;

    superUserPermission:boolean;
    giaaStaffPermission:boolean;
    actionOwnerPermission:boolean;


}

export interface IUpdatesListState<T> {
    DefaultGIAAActionStatusTypeId:number;
    DefaultRevisedDate:Date;

    SelectedEntity: number;
    SelectedEntityTitle: string;
    //SelectedGoElementId:number;

    SelectedEntityChildren: number;
    ShowForm: boolean;
    FormType: string;
    EnableView?: boolean;
    EnableDelete?: boolean;
    HideDeleteDialog: boolean;
    ShowChildForm: boolean;
    CurrentPage?: number;
    NextPageAvailable?: boolean;
    Entities: T[];
    Loading: boolean;
    ListFilterText?: string;
    InitDataLoaded: boolean;

    HideActionUpdatePermissionDialog: boolean;
    HideReviseImplementationDatePermissionDialogue:boolean;
    HideGiaaCommentsPermissionDialogue:boolean;
}
export class UpdatesListState<T> implements IUpdatesListState<T>{
    public DefaultGIAAActionStatusTypeId:number = null;
    public DefaultRevisedDate:Date = null;

    public SelectedEntity = null;
    public SelectedEntityTitle: string = null;
    //public SelectedGoElementId = null;

    public SelectedEntityChildren = null;
    public FormType = '';
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
    public HideActionUpdatePermissionDialog = true;
    public HideReviseImplementationDatePermissionDialogue = true;
    public HideGiaaCommentsPermissionDialogue = true;
}

export default class UpdatesList extends React.Component<IUpdatesListProps, IUpdatesListState<IEntity>> {
    private _selection: Selection;
    private updateService: services.GIAAUpdateService = new services.GIAAUpdateService(this.props.spfxContext, this.props.api);

    private UploadFolder_Evidence:string = "";

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
            key: 'EvIsLink',
            name: 'EvIsLink',
            fieldName: 'EvIsLink',
            minWidth: 1,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
        {
            key: 'UpdateType',
            name: 'UpdateType',
            fieldName: 'UpdateType',
            minWidth: 120,
            maxWidth: 120,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'UpdateBy',
            name: 'By',
            fieldName: 'UpdateBy',
            minWidth: 100,
            maxWidth: 100,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'UpdateDate',
            name: 'Date/Time',
            fieldName: 'UpdateDate',
            minWidth: 100,
            maxWidth: 100,
            isResizable: true,
            headerClassName: styles.bold,
        },

        {
            key: 'UpdateDetails',
            name: 'Details',
            fieldName: 'UpdateDetails',
            minWidth: 270,
            maxWidth: 270,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'Requests',
            name: 'Requests',
            fieldName: 'Requests',
            minWidth: 145,
            maxWidth: 145,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,
        },
        {
            key: 'Status',
            name: 'Status',
            fieldName: 'Status',
            minWidth: 65,
            maxWidth: 65,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'RevisedDate',
            name: 'Revised Date',
            fieldName: 'RevisedDate',
            minWidth: 78,
            maxWidth: 78,
            isResizable: true,
            headerClassName: styles.bold,
        },
        {
            key: 'Evidence',
            name: 'Evidence_',
            fieldName: 'Evidence',
            minWidth: 180,
            maxWidth: 180,
            isMultiline:true,
            isResizable: true,
            headerClassName: styles.bold,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
        {
            key: 'EvType',
            name: 'Evidence',
            fieldName: 'EvType',
            minWidth: 80,
            maxWidth: 80,
            isMultiline:true,
            isResizable: true,
            headerClassName: styles.bold,
        },


    ];


    constructor(props: IUpdatesListProps, state: IUpdatesListState<IEntity>) {
        super(props);
        this.state = new UpdatesListState<IEntity>();
        this.UploadFolder_Evidence = getUploadFolder_GIAAUpdateEvidence(props.spfxContext);
        
        this._selection = new Selection({
            onSelectionChanged: () => {
                if (this._selection.getSelectedCount() === 1) {

                    const sel = this._selection.getSelection()[0];
                    console.log(sel);
                    const key = Number(sel.key);
                    const title: string = sel["UpdateType"];
                    
                    //const evIsLink:boolean = sel["EvIsLink"];
                    const evidence:string = sel["Evidence"];
                    
                    let enableView:boolean = false;
                    if(evidence != ""){
                        enableView = true;
                    }

                    this.setState({ SelectedEntity: key, SelectedEntityTitle: title, EnableView:enableView, EnableDelete: true });
                }
                else {
                    this.setState({ SelectedEntity: null, SelectedEntityTitle: null, EnableView:false, EnableDelete: false });
                }
            }
        });
    }

    //#region Render

    public render(): React.ReactElement<IUpdatesListProps> {

        return (
            <div className={`${styles.cr}`}>
                <div style={{ position: 'relative' }}>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderList()}
                    {this.state.ShowForm && this.renderForm()}

                    <ConfirmDialog hidden={this.state.HideDeleteDialog} title={`Are you sure you want to delete this record?`} content={`A deleted record cannot be un-deleted.`} confirmButtonText="Delete" handleConfirm={this.handleDelete} handleCancel={this.toggleDeleteConfirm} />
                    <MessageDialog hidden={this.state.HideActionUpdatePermissionDialog} title={`Not Allowed!`} content='Only the Super User, GIAA Actions Super User and recommendation Action Owners can provide updates.' handleOk={this.toggle_HideActionUpdatePermissionDialog} />
                    {/* <MessageDialog hidden={this.state.HideReviseImplementationDatePermissionDialogue} title={`Not Allowed!`} content='Only the Super User, GIAA Actions Super User or GIAA Staff can revise the implementation date.' handleOk={this.toggle_HideReviseImplementationDatePermissionDialogue} /> */}
                    <MessageDialog hidden={this.state.HideGiaaCommentsPermissionDialogue} title={null} content='Only the Super User, GIAA Actions Super User and GIAA Staff can add GIAA Comments.' handleOk={this.toggle_HideGiaaCommentsPermissionDialogue} />
                </div>
            </div>
        );
    }

    private renderList() {

        const listColumns = this.getColumns();
        const listColumnsForData = this.getColumnsForData();

        let items: IObjectWithKey[] = this.state.Entities.map((e) => { return this.makeItem(e, listColumnsForData); });



        return (
            <FilteredUpdatesList
                
                columns={listColumns}
                items={items}
                

                filterText={this.props.filterText}
                onFilterChange={this.props.onChangeFilterText}
                selection={this._selection}

                onAddActionUpdate={this.handleAddActionUpdate}
                onAddStatus_DateUpdate={this.handleAddStatus_RevisedDate}
                onAddGIAAComments={this.handleAddGIAAComments}
                onAddMiscComments={this.handleAddMiscComments}

                onView={this.handleView}
                viewDisabled={!this.state.EnableView}
                deleteDisabled={!this.state.EnableDelete}
                onDelete={this.toggleDeleteConfirm}

                //editDisabled={!this.state.EnableEdit}
                superUserPermission={this.props.superUserPermission}
                giaaStaffPermission={this.props.giaaStaffPermission}




                
            />
        );
    }

    private renderForm() {

        const d1 = this.state.DefaultGIAAActionStatusTypeId;
        const d2 = this.state.DefaultRevisedDate;
        console.log('in render form d1, d2', d1, d2);
        return (
            <UpdateSaveForm
                giaaRecommendationId={this.props.giaaRecommendationId}
                defaultActionStatusTypeId={d1}
                defaultRevDate={d2}
                targetDate={this.props.targetDate}
                updateType={this.state.FormType}
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

    private formSaved = (defaultGIAAActionStatusTypeId: number, defaultRevisedDate:Date): void => {
        console.log('form Saved defaultGIAAActionStatusTypeId, defaultRevisedDate', defaultGIAAActionStatusTypeId, defaultRevisedDate);
        if(defaultGIAAActionStatusTypeId !== null){

            this.setState({ DefaultGIAAActionStatusTypeId: defaultGIAAActionStatusTypeId });
            console.log('state updated DefaultGIAAActionStatusTypeId', defaultGIAAActionStatusTypeId);
        }
        if(defaultRevisedDate !== null){
            this.setState({ DefaultRevisedDate: defaultRevisedDate });
            console.log('state updated DefaultRevisedDate', defaultRevisedDate);
        }
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

    private isSelectedEntityALink = (): boolean => {
        let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; });
        return entity[0] ? entity[0]["EvIsLink"] : null;
    }
    private getSelectedEntityEv = (): string => {
        let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; });
        return entity[0]["Evidence"];
    }



    //#endregion Class Methods

    //#region Data Load


    private loadData = (): void => {
        this.setState({ Loading: true });


        const read: Promise<IEntity[]> = this.updateService.readAllForList(Number(this.props.giaaRecommendationId));
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
        this.setState( { DefaultGIAAActionStatusTypeId: this.props.defaultGIAAActionStatusTypeId, DefaultRevisedDate: this.props.defaultRevisedDate });
        this.loadData();
        //console.log('web title: ', this.props.spfxContext.pageContext.web.title);

    }
    public componentDidUpdate(prevProps: IUpdatesListProps): void {
        if (prevProps.giaaRecommendationId !== this.props.giaaRecommendationId) {
            console.log('props changed, load data again');
            this._selection.setAllSelected(false);
            this.loadData();
        }
    }



    //#endregion Data Load

    //#region Events Handlers



    private handleAddActionUpdate = (): void => {


        if(this.props.superUserPermission === true || this.props.actionOwnerPermission === true){

            if (this.state.SelectedEntity)
                this._selection.setKeySelected(this.state.SelectedEntity.toString(), false, false);
            const formType:string = GIAAUpdateTypes.ActionUpdate;
            this.setState({ SelectedEntity: null, ShowForm: true, FormType: formType });

        }
        else{
            this.toggle_HideActionUpdatePermissionDialog();
            console.log('Only the Super User, GIAA Actions Super User and recommendation Action Owners can provide updates');
        }


    }
    private handleAddStatus_RevisedDate = (): void => {

        if(this.props.superUserPermission === true || this.props.giaaStaffPermission === true){

            if (this.state.SelectedEntity)
                this._selection.setKeySelected(this.state.SelectedEntity.toString(), false, false);
            const formType:string = GIAAUpdateTypes.Status_DateUpdate;
            this.setState({ SelectedEntity: null, ShowForm: true, FormType: formType });

        }
        else{
            this.toggle_HideReviseImplementationDatePermissionDialogue();
            console.log('Only the Super User, GIAA Actions Super User, GIAA Staff and recommendation Action Owners can revise the implementation date');
        }


    }
    private handleAddGIAAComments = (): void => {

        if(this.props.superUserPermission === true || this.props.giaaStaffPermission === true){

            if (this.state.SelectedEntity)
                this._selection.setKeySelected(this.state.SelectedEntity.toString(), false, false);
            const formType:string = GIAAUpdateTypes.GIAAComment;
            this.setState({ SelectedEntity: null, ShowForm: true, FormType: formType });

        }
        else{
            this.toggle_HideGiaaCommentsPermissionDialogue();
            console.log('Only the Super User, GIAA Actions Super User and GIAA Staff can add GIAA Comments');
        }


    }
    private handleAddMiscComments = (): void => {
        if (this.state.SelectedEntity)
            this._selection.setKeySelected(this.state.SelectedEntity.toString(), false, false);
        const formType:string = GIAAUpdateTypes.MiscComment;
        this.setState({ SelectedEntity: null, ShowForm: true, FormType: formType });
    }


    private handleView = (): void => {
        console.log('in view.');
        const fileName:string = this.getSelectedEntityEv();
        if(this.isSelectedEntityALink() === true){
            console.log('selected evidence is a link');

            const a = document.createElement('a');
            //document.body.appendChild(a);
            a.href = fileName;
            a.target = "_blank";
            //a.download = fileName;
            
            document.body.appendChild(a);
            console.log(a);
            //a.click();
            //document.body.removeChild(a);
            
            
            setTimeout(() => {
              window.URL.revokeObjectURL(fileName);
              window.open(fileName, '_blank');
              document.body.removeChild(a);
            }, 1);




        }
        else{
            const f = sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Evidence).files.getByName(fileName);
    
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

    }



    private handleDelete = (): void => {

        if (this.props.onError) this.props.onError(null);
        this.setState({ HideDeleteDialog: true });
        if (this.state.SelectedEntity) {

            //const fileName: string = this.state.SelectedEntityTitle;
            //console.log(fileName);

            let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; })[0];
            const fileName: string = entity["Evidence"];
            console.log("FileName", fileName);
            if (fileName !== "") {
                if (Boolean(entity["EvIsLink"]) === true) {
                    console.log("selected file is a link");
                    this.updateService.delete(this.state.SelectedEntity).then(this.loadData, (err) => {
                        if (this.props.onError) this.props.onError(`Cannot delete record. `, err.message);
                    });
                }
                else {
                    console.log("selected file is an attachment");
                    sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Evidence).files.getByName(fileName).delete().then(df => {
                        //console.log('file deleted', df);

                        this.updateService.delete(this.state.SelectedEntity).then(this.loadData, (err) => {
                            if (this.props.onError) this.props.onError(`Cannot delete record. `, err.message);
                        });
                    });
                }

            }
            else{

                console.log("selected file has not attachment");
                this.updateService.delete(this.state.SelectedEntity).then(this.loadData, (err) => {
                    if (this.props.onError) this.props.onError(`Cannot delete record. `, err.message);
                });
            }

        }

        // if (this.props.onError) this.props.onError(null);
        // this.setState({ HideDeleteDialog: true });
        // if (this.state.SelectedEntity) {

        //     const fileName: string = this.state.SelectedEntityTitle;
        //     //console.log(fileName);

        //     if(this.isSelectedEntityALink() === true){

        //         console.log('deleting eveidence (link)');
        //         this.updateService.delete(this.state.SelectedEntity).then(this.loadData, (err) => {
        //             if (this.props.onError) this.props.onError(`Cannot delete record. `, err.message);
        //         });
        //     }
        //     else{

        //         sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Evidence).files.getByName(fileName).delete().then(df => {
        //             //console.log('file deleted', df);
    
        //             this.updateService.delete(this.state.SelectedEntity).then(this.loadData, (err) => {
        //                 if (this.props.onError) this.props.onError(`Cannot delete record. `, err.message);
        //             });
        //         });
        //     }



        // }
    }

    private toggle_HideActionUpdatePermissionDialog = (): void => {
        this.setState({ HideActionUpdatePermissionDialog: !this.state.HideActionUpdatePermissionDialog });
    }

    private toggle_HideReviseImplementationDatePermissionDialogue = (): void => {
        this.setState({ HideReviseImplementationDatePermissionDialogue: !this.state.HideReviseImplementationDatePermissionDialogue });
    }

    private toggle_HideGiaaCommentsPermissionDialogue = (): void => {
        this.setState({ HideGiaaCommentsPermissionDialogue: !this.state.HideGiaaCommentsPermissionDialogue });
    }




    //#endregion Events Handlers

}
