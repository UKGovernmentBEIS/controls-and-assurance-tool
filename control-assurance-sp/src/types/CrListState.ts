export interface ICrListState<T> {
    SelectedEntity: number;
    SelectedEntityChildren: number;
    ShowForm: boolean;
    Entities: T[];
    HideDeleteDialog: boolean;
    HideDeleteDisallowed: boolean;
    HideMakeCurrentDisallowed: boolean;
    EnableEdit?: boolean;
    EnableDelete?: boolean;
    EnableMakeCurrent?: boolean;
    HideConfirmMakeCurrent?: boolean;
    ListFilterText?: string;
    Loading: boolean;
    ShowChildForm: boolean;
    CurrentPage?: number;
    NextPageAvailable?: boolean;
}

export class CrListState<T> implements ICrListState<T>{
    public SelectedEntity = null;
    public SelectedEntityChildren = null;
    public ShowForm = false;
    public Entities: T[] = [];
    public HideDeleteDialog = true;
    public HideDeleteDisallowed = true;
    public HideMakeCurrentDisallowed = true;
    public EnableEdit = false;
    public EnableDelete = false;
    public EnableMakeCurrent = false;
    public HideConfirmMakeCurrent = true;
    public ListFilterText = null;
    public Loading = false;
    public ShowChildForm = false;
    public CurrentPage = 1;
    public NextPageAvailable = false;
}