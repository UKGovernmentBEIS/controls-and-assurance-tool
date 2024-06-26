import * as React from 'react';
import * as types from '../../../types';
import * as services from '../../../services';
import { sp } from '@pnp/sp';
import EvidenceSaveForm from './EvidenceSaveForm';
import { FilteredEvidenceList, IObjectWithKey } from './FilteredEvidenceList';
import { IEntity } from '../../../types';
import { IUpdatesListColumn, ColumnDisplayTypes } from '../../../types/UpdatesListColumn';
import { CrLoadingOverlay } from '../../cr/CrLoadingOverlay';
import { Selection } from '../../cr/FilteredList';
import { ConfirmDialog } from '../../cr/ConfirmDialog';
import styles from '../../../styles/cr.module.scss';
import { getUploadFolder_NAOUpdateEvidence } from '../../../types/AppGlobals';

export interface IEvidenceListProps extends types.IBaseComponentProps {
    entityReadAllWithArg1: any;
    filterText?: string;
    onChangeFilterText: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => void;
    viewOnly: boolean;
}

export interface IEvidenceListState<T> {
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
export class EvidenceListState<T> implements IEvidenceListState<T>{
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

export default class EvidenceList extends React.Component<IEvidenceListProps, IEvidenceListState<IEntity>> {
    private UploadFolder_Evidence: string = "";
    private _selection: Selection;
    private naoUpdateEvidenceService: services.NAOUpdateEvidenceService = new services.NAOUpdateEvidenceService(this.props.spfxContext, this.props.api);

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
            minWidth: 1,
            isResizable: true,
            columnDisplayType: ColumnDisplayTypes.Hidden,
        },
        {
            key: 'Details',
            name: 'Title',
            fieldName: 'Details',
            minWidth: 300,
            maxWidth: 400,
            isResizable: true,
            isMultiline: true,
            headerClassName: styles.bold,

        },
        {
            key: 'AdditionalNotes',
            name: 'Additional Notes',
            fieldName: 'AdditionalNotes',
            minWidth: 300,
            maxWidth: 400,
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
    ];

    constructor(props: IEvidenceListProps, state: IEvidenceListState<IEntity>) {
        super(props);
        this.state = new EvidenceListState<IEntity>();
        this.UploadFolder_Evidence = getUploadFolder_NAOUpdateEvidence(props.spfxContext);
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
    }

    //#region Render

    public render(): React.ReactElement<IEvidenceListProps> {

        return (
            <div className={`${styles.cr}`}>
                <div style={{ position: 'relative' }}>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderList()}
                    {this.state.ShowForm && this.renderForm()}

                    <ConfirmDialog hidden={this.state.HideDeleteDialog} title={`Are you sure you want to delete this evidence?`} content={`A deleted evidence cannot be un-deleted.`} confirmButtonText="Delete" handleConfirm={this.deleteFile} handleCancel={this.toggleDeleteConfirm} />
                </div>
            </div>
        );
    }

    private renderList() {
        const listColumns = this.getColumns();
        const listColumnsForData = this.getColumnsForData();
        let items: IObjectWithKey[] = this.state.Entities.map((e) => { return this.makeItem(e, listColumnsForData); });

        return (
            <FilteredEvidenceList
                isViewOnly={this.props.viewOnly}
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
            <EvidenceSaveForm
                showForm={this.state.ShowForm}
                goElementId={this.props.entityReadAllWithArg1}
                goElementEvidenceId={this.state.SelectedEntity}
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
        const fileName: string = this.state.SelectedEntityTitle;
        if (this.isSelectedEntityALink() === true) {
            console.log('selected evidence is a link');
            const a = document.createElement('a');
            a.href = fileName;
            a.target = "_blank";
            document.body.appendChild(a);
            console.log(a);
            setTimeout(() => {
                window.URL.revokeObjectURL(fileName);
                window.open(fileName, '_blank');
                document.body.removeChild(a);
            }, 1);
        }
        else {
            const f = sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Evidence).files.getByName(fileName);

            f.get().then(t => {
                console.log(t);
                const serverRelativeUrl = t["ServerRelativeUrl"];
                console.log(serverRelativeUrl);
                const a = document.createElement('a');
                a.href = serverRelativeUrl;
                a.target = "_blank";
                a.download = fileName;
                document.body.appendChild(a);
                console.log(a);
                setTimeout(() => {
                    window.URL.revokeObjectURL(serverRelativeUrl);
                    window.open(serverRelativeUrl, '_blank');
                    document.body.removeChild(a);
                }, 1);
            });
        }
    }

    private closePanel = (): void => {
        this.setState({ ShowForm: false });
    }

    private fileSaved = (): void => {
        this.loadEvidences();
        this.closePanel();
    }

    private isSelectedEntityALink = (): boolean => {
        let entity = this.state.Entities.filter((e) => { return e.ID === this.state.SelectedEntity; });
        return entity[0] ? entity[0]["IsLink"] : null;
    }

    private toggleDeleteConfirm = (): void => {
        this.setState({ HideDeleteDialog: !this.state.HideDeleteDialog });
    }

    private deleteFile = (): void => {
        if (this.props.onError) this.props.onError(null);
        this.setState({ HideDeleteDialog: true });
        if (this.state.SelectedEntity) {
            const fileName: string = this.state.SelectedEntityTitle;

            if (this.isSelectedEntityALink() === true) {
                console.log('deleting eveidence (link)');
                this.naoUpdateEvidenceService.delete(this.state.SelectedEntity).then(this.loadEvidences, (err) => {
                    if (this.props.onError) this.props.onError(`Cannot delete this evidence. `, err.message);
                });
            }
            else {

                this.naoUpdateEvidenceService.delete(this.state.SelectedEntity).then(() => {
                    this.loadEvidences();
                    sp.web.getFolderByServerRelativeUrl(this.UploadFolder_Evidence).files.getByName(fileName).delete().then(df => {
                    });


                }, (err) => {
                    if (this.props.onError) this.props.onError(`Cannot delete this evidence. `, err.message);
                });

            }
        }
    }

    //#endregion Class Methods

    //#region Data Load
    private loadEvidences = (): void => {
        this.setState({ Loading: true });
        const read: Promise<IEntity[]> = this.naoUpdateEvidenceService.readAllByNAOUpdate(this.props.entityReadAllWithArg1);
        read.then((entities: any): void => {
            console.log(entities);
            this.setState({
                Loading: false, Entities: entities,
            });

        }, (err) => this.errorLoadingEvidences(err));
    }
    private errorLoadingEvidences = (err: any, entityName?: string): void => {
        this.setState({ Loading: false });
        if (this.props.onError) this.props.onError(`Error loading evidences`, err.message);
    }
    public componentDidMount(): void {
        this.loadEvidences();
    }
    public componentDidUpdate(prevProps: IEvidenceListProps): void {
        console.log("in component DidUpdate", this.props.entityReadAllWithArg1);
        if (prevProps.entityReadAllWithArg1 !== this.props.entityReadAllWithArg1) {
            console.log("in component DidUpdate load");
            this.loadEvidences();
        }
    }

    //#endregion Data Load

}
