import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { Selection } from '../cr/FilteredList';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { PeriodListCommandBar } from './PeriodListCommandBar';
import { MessageDialog } from '../cr/MessageDialog';
import { CrLoadingOverlay } from '../cr/CrLoadingOverlay';
import { ActionButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { IPeriod, Period } from '../../types';

export interface IBasePeriodListProps extends types.IBaseComponentProps {
    allowAdd?: boolean;
    onRowSelectionCheckEditDel?: (key: number) => Promise<boolean>;

    //new props for paging
    pageSize?: number;
}

export default abstract class BasePeriodList<P extends IBasePeriodListProps, S extends types.ICrListState<types.IEntity>> extends React.Component<P, S> {
    protected abstract entityService: services.EntityService<IPeriod>;
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


                    if (this.props.allowAdd === true) {
                        if (this.props.onRowSelectionCheckEditDel) {
                            this.props.onRowSelectionCheckEditDel(key).then((result: boolean) => {

                                if (result === true) {
                                    this.setState({ SelectedEntity: key, EnableEdit: true, EnableDelete: true });
                                }
                                else {
                                    this.setState({ SelectedEntity: null, EnableEdit: false, EnableDelete: false });
                                }
                            });
                        }
                        else {
                            //write permission is allowed but allowEditDel function is not provided
                            //in this case also allow edit/del
                            this.setState({ SelectedEntity: key, EnableEdit: true, EnableDelete: true, EnableMakeCurrent: true });
                        }
                    }

                } else {
                    this.setState({ SelectedEntity: null, EnableEdit: false, EnableDelete: false, EnableMakeCurrent: false });
                }
            }
        });
    }

    public render(): React.ReactElement<P> {
        return (
            <div className={`${styles.cr} ${styles.crList}`}>
                <PeriodListCommandBar
                    allowAdd={this.props.allowAdd}
                    onAdd={this.addEntity}
                    onEdit={this.editEntity}
                    onDelete={this.checkDelete}
                    onMakeCurrent={this.checkMakeCurrentPeriod}
                    onFilterChange={this.onFilterChange}
                    editDisabled={!this.state.EnableEdit}
                    deleteDisabled={!this.state.EnableDelete}
                    makeCurrentDisabled={!this.state.EnableMakeCurrent}
                    onAddChild={this.addEntityChild}
                    addChildName={this.AddChild.Name} />
                <div style={{ position: 'relative' }}>
                    <h2 className={styles.listTitle}>{this.EntityName.Plural}</h2>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderList()}
                    {this.props.pageSize && this.state.NextPageAvailable === true &&
                        //  <a style={{float:"right", marginTop: "10px", cursor:"pointer"}} onClick={ ()=> { this.loadEntities(); } }>Load More</a> 
                        <ActionButton style={{ float: "right", marginTop: "10px" }} onClick={() => { this.loadEntities(); }}>Show More &darr;</ActionButton>
                    }
                </div>
                {this.state.ShowForm && this.renderForm()}
                {this.state.ShowChildForm && this.renderChildForm()}

                <MessageDialog hidden={this.state.HideDeleteDisallowed} title={`${this.EntityName.Singular} cannot be deleted`} content={`${this.EntityName.Singular} '${this.getSelectedEntityName()}' is not a Design Period. Note: Only a Design Period can be deleted.`} handleOk={this.toggleDeleteDisallowed} />
                <MessageDialog hidden={this.state.HideMakeCurrentDisallowed} title={`${this.EntityName.Singular} cannot be converted to Current Period`} content={`${this.EntityName.Singular} '${this.getSelectedEntityName()}' is not a Design Period. Note: Only a Design Period can be converted to a Current Period.`} handleOk={this.toggleMakeCurrentDisallowed} />
                <ConfirmDialog hidden={this.state.HideDeleteDialog} title={`Are you sure you want to delete ${this.getSelectedEntityName()}?`} content={`Deleting a ${this.EntityName.Singular.toLowerCase()} cannot be undone.`} confirmButtonText="Delete" handleConfirm={this.deleteEntity} handleCancel={this.toggleDeleteConfirm} />
                <ConfirmDialog hidden={this.state.HideConfirmMakeCurrent} title={`Are you sure you want to mark ${this.getSelectedEntityName()} as a current period?`} content={` Note: Setting ${this.EntityName.Singular.toLowerCase()} as Current, cannot be undone.`} confirmButtonText="Make Current" handleConfirm={this.makeCurrentPeriod} handleCancel={this.toggleConfirmMakeCurrent} />

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
            //console.log(entities);
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

    protected makeCurrentPeriod = (): void => {
        if (this.props.onError) this.props.onError(null);
        this.setState({ HideConfirmMakeCurrent: true });
        if (this.state.SelectedEntity) {

            let period: IPeriod = new Period();
            period.ID = this.state.SelectedEntity;
            period.PeriodStatus = "MAKE_CURRENT";

            this.entityService.update(this.state.SelectedEntity, period).then(this.loadEntities, (err) => {
                if (this.props.onError) this.props.onError(`Error `, err.message);
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
    protected toggleConfirmMakeCurrent = (): void => {
        this.setState({ HideConfirmMakeCurrent: !this.state.HideConfirmMakeCurrent });
    }

    protected toggleDeleteDisallowed = (): void => {
        this.setState({ HideDeleteDisallowed: !this.state.HideDeleteDisallowed });
    }
    protected toggleMakeCurrentDisallowed = (): void => {
        this.setState({ HideMakeCurrentDisallowed: !this.state.HideMakeCurrentDisallowed });
    }

    protected checkDelete = (): void => {

        this.entityService.read(this.state.SelectedEntity).then((p: IPeriod): void => {
            if (p.PeriodStatus === "Design Period") {
                //allow delete
                this.toggleDeleteConfirm();
            }
            else {
                //dont allow delete
                this.toggleDeleteDisallowed();
            }

        }, (err) => { });
    }

    protected checkMakeCurrentPeriod = (): void => {

        this.entityService.read(this.state.SelectedEntity).then((p: IPeriod): void => {
            if (p.PeriodStatus === "Design Period") {
                //allow delete
                this.toggleConfirmMakeCurrent();
            }
            else {
                //dont allow delete
                this.toggleMakeCurrentDisallowed();
            }

        }, (err) => { });
    }

    protected onFilterChange = (value: string): void => {
        this.setState({ ListFilterText: value });
    }

    //#endregion
}
