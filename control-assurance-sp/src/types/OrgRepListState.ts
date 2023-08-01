import { IDirectorateGroup } from "./DirectorateGroup";
import { IDirectorate } from "./Directorate";
import { ITeam } from "./Team";

export interface IOrgRepListState<T> {
    SelectedEntity: number;
    SelectedEntityChildren: number;
    ShowForm: boolean;
    HideDeleteDialog: boolean;
    HideDeleteDisallowed: boolean;
    EnableEdit?: boolean;
    EnableDelete?: boolean;
    ShowChildForm: boolean;
    CurrentPage?: number;
    NextPageAvailable?: boolean;
    Entities: T[];
    Loading: boolean;
    ListFilterText?: string;
    DGAreas: IDirectorateGroup[];
    SelectedDGArea: number;
    Directorates: IDirectorate[];
    SelectedDirectorate: number;
    Teams: ITeam[];
    SelectedTeam: number;
    InitDataLoaded: boolean;
}

export class OrgRepListState<T> implements IOrgRepListState<T>{
    public SelectedEntity = null;
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
    public DGAreas: IDirectorateGroup[] = [];
    public SelectedDGArea = 0;
    public Directorates = [];
    public SelectedDirectorate = 0;
    public Teams = [];
    public SelectedTeam = 0;
    public InitDataLoaded = false;
}