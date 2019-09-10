import { SaveStatus } from "./SaveStatus";
import { IEntity, /*IGroup, IDirectorate, IProject, IKeyWorkArea, IWorkStream, IUser, IUserDirectorate, IUserProject */} from ".";
import { IPeriod } from "./Period";
//import { IUserGroup } from "./UserGroup";

export interface ILookupData {
    Periods: IPeriod[];
}

export class LookupData implements ILookupData {
    public Periods = [];
}

export interface ICrFormState<T, V> {
    FormData: T;
    FormIsDirty: boolean;
    FormSaveStatus: SaveStatus;
    LookupData: ILookupData;
    ValidationErrors: V;
    FormDataBeforeChanges: T;
    Loading: boolean;
}

export class CrFormState<T, V> implements ICrFormState<T, V>{
    public FormData: T;
    public FormIsDirty = false;
    public FormSaveStatus = SaveStatus.None;
    public LookupData = new LookupData();
    public ValidationErrors: V;
    public FormDataBeforeChanges: T;
    public Loading = false;

    constructor(formData: T, validationErrors?: V, defaultValues?: { field: string, value: any }[]) {
        this.FormData = formData;
        this.ValidationErrors = validationErrors;
        this.FormDataBeforeChanges = formData;

        if (defaultValues)
            defaultValues.forEach(dv => {
                this.FormData[dv.field] = dv.value;
            });
    }
}

export interface ICrFormValidations {
    Valid: boolean;
    Title: string;
}

export class CrFormValidations implements ICrFormValidations {
    public Valid = true;
    public Title = null;
}
