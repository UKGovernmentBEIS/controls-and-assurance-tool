import * as React from 'react';
import * as types from '../types';
import * as services from '../services';
import styles from '../styles/cr.module.scss';
import { Selection } from './cr/FilteredList';
import { ConfirmDialog } from './cr/ConfirmDialog';
import { ListCommandBar } from './cr/ListCommandBar';
import { MessageDialog } from './cr/MessageDialog';
import { CrLoadingOverlay } from './cr/CrLoadingOverlay';
import { ActionButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

export interface IBaseListProps extends types.IBaseComponentProps {
    allowAdd?: boolean;
    onRowSelectionCheckEditDel?: (key: number) => Promise<boolean>;

    //new props for paging
    pageSize?: number;
}

export default abstract class BaseList<P extends IBaseListProps, S extends types.ICrListState<types.IEntity>> extends React.Component<P, S> {
    protected abstract entityService: services.EntityService<types.IEntity>;
    protected readonly ragWidth: number = 130;
    protected readonly dateWidth: number = 75;
    protected readonly userWidth: number = 100;
    protected _selection: Selection;
    protected EntityName: { Plural: string, Singular: string } = { Plural: '', Singular: '' };
    protected ChildEntityName: { Api: string, Plural: string, Singular: string } = { Api: '', Plural: '', Singular: '' };
    protected AddChild: { Name: string } = { Name: '' };

    constructor(props: P) {
        super(props);
        this._selection = new Selection({
            onSelectionChanged: () => {
                if (this._selection.getSelectedCount() === 1) {

                    let key = Number(this._selection.getSelection()[0].key);


                    if(this.props.allowAdd === true){
                        if(this.props.onRowSelectionCheckEditDel){
                            this.props.onRowSelectionCheckEditDel(key).then((result: boolean) => {

                                if(result=== true){
                                    this.setState({ SelectedEntity: key, EnableEdit: true, EnableDelete: true });        
                                }
                                else{
                                    this.setState({ SelectedEntity: null, EnableEdit: false, EnableDelete: false });            
                                }
                            });
                        }
                        else{
                            //write permission is allowed but allowEditDel function is not provided
                            //in this case also allow edit/del
                            this.setState({ SelectedEntity: key, EnableEdit: true, EnableDelete: true });
                        }
                    }

                } else {
                    this.setState({ SelectedEntity: null, EnableEdit: false, EnableDelete: false });
                }
            }
        });
    }

    public render(): React.ReactElement<P> {
        return (
            <div className={`${styles.cr} ${styles.crList}`}>
                <ListCommandBar
                    allowAdd={this.props.allowAdd}
                    onAdd={this.addEntity}
                    onEdit={this.editEntity}
                    onDelete={this.checkDelete}
                    onFilterChange={this.onFilterChange}
                    editDisabled={!this.state.EnableEdit}
                    deleteDisabled={!this.state.EnableDelete}
                    onAddChild={this.addEntityChild}
                    addChildName={this.AddChild.Name} />
                <div style={{ position: 'relative' }}>
                    <h2 className={styles.listTitle}>{this.EntityName.Plural}</h2>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderList()}
                    { this.props.pageSize && this.state.NextPageAvailable === true &&
                        //  <a style={{float:"right", marginTop: "10px", cursor:"pointer"}} onClick={ ()=> { this.loadEntities(); } }>Load More</a> 
                        <ActionButton style={{float:"right", marginTop: "10px"}} onClick={ ()=> {this.loadEntities(); } }>Show More &darr;</ActionButton>     
                    }
                </div>
                {this.state.ShowForm && this.renderForm()}
                {this.state.ShowChildForm && this.renderChildForm()}
                <MessageDialog hidden={this.state.HideDeleteDisallowed} title={`${this.EntityName.Singular} cannot be deleted`} content={`${this.EntityName.Singular} '${this.getSelectedEntityName()}' has ${this.state.SelectedEntityChildren} ${this.state.SelectedEntityChildren === 1 ? this.ChildEntityName.Singular.toLowerCase() : this.ChildEntityName.Plural.toLowerCase()} belonging to it.`} handleOk={this.toggleDeleteDisallowed} />
                <ConfirmDialog hidden={this.state.HideDeleteDialog} title={`Are you sure you want to delete ${this.getSelectedEntityName()}?`} content={`Deleting a ${this.EntityName.Singular.toLowerCase()} cannot be undone.`} confirmButtonText="Delete" handleConfirm={this.deleteEntity} handleCancel={this.toggleDeleteConfirm} />
            </div>
        );
    }

    protected abstract renderList(): JSX.Element;

    protected abstract renderForm(): JSX.Element;

    protected renderChildForm(): JSX.Element { return null; }

    //#region Form initialisation

    public componentDidMount(): void {
        this.loadEntities();
    }


    protected loadEntities = (): void => {
        this.setState({ Loading: true });
        this.entityService.readAll().then((entities: any): void => {
            this.setState({ Loading: false, Entities: entities });
        }, (err) => this.errorLoadingEntities(err));
    }

    protected errorLoadingEntities = (err: any, entityName?: string): void => {
        this.setState({ Loading: false });
        if (this.props.onError) this.props.onError(`Error loading ${entityName || 'items'}`, err.message);
    }

    //#endregion

    //#region Form infrastructure

    protected getSelectedEntityName = (): string => {
        let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; });
        return entity[0] ? entity[0].Title : null;
    }

    protected addEntity = (): void => {
        if (this.state.SelectedEntity)
            this._selection.setKeySelected(this.state.SelectedEntity.toString(), false, false);
        this.setState({ SelectedEntity: null, ShowForm: true });
    }

    protected editEntity = (): void => {
        this.setState({ ShowForm: true });
    }

    protected deleteEntity = (): void => {
        if (this.props.onError) this.props.onError(null);
        this.setState({ HideDeleteDialog: true });
        if (this.state.SelectedEntity) {
            this.entityService.delete(this.state.SelectedEntity).then(this.loadEntities, (err) => {
                if (this.props.onError) this.props.onError(`Error deleting item ${this.state.SelectedEntity}`, err.message);
            });
        }
    }

    protected addEntityChild = (): void => {
        if (this.state.SelectedEntity)
            this.setState({ ShowChildForm: true });
    }

    protected entitySaved = (): void => {
        this.loadEntities();
        this.closePanel();
    }

    protected childEntitySaved = (): void => {
        this.loadEntities();
        this.closeChildPanel();
    }

    protected closePanel = (): void => {
        this.setState({ ShowForm: false });
    }

    protected closeChildPanel = (): void => {
        this.setState({ ShowChildForm: false });
    }

    protected toggleDeleteConfirm = (): void => {
        this.setState({ HideDeleteDialog: !this.state.HideDeleteDialog });
    }

    protected toggleDeleteDisallowed = (): void => {
        this.setState({ HideDeleteDisallowed: !this.state.HideDeleteDisallowed });
    }

    protected checkDelete = (): void => {
        if(this.ChildEntityName.Api)
        {
            this.entityService.numberOfChildren(this.state.SelectedEntity, this.ChildEntityName.Api).then((numberOfChildren: number) => {
                if (numberOfChildren > 0)
                    this.setState({ SelectedEntityChildren: numberOfChildren }, this.toggleDeleteDisallowed);
                else
                    this.toggleDeleteConfirm();
            });
        }
        else{
            this.toggleDeleteConfirm();
        }

    }

    protected onFilterChange = (value: string): void => {
        this.setState({ ListFilterText: value });
    }

    //#endregion
}
