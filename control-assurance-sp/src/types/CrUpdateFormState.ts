export interface ICrUpdateFormState<T> {
    FormData: T;
    ShowForm: boolean;
    Loading: boolean;
    ShowSaveConfirmation: boolean;
    ShowLoadPreviousPeriodConfirmation: boolean;
    ShowHelpPanel: boolean;
    UserHelpText: string;
}

export class CrUpdateFormState<T> implements ICrUpdateFormState<T>{
    public FormData: T;
    public ShowForm = false;
    public Loading = false;
    public ShowSaveConfirmation = false;
    public ShowLoadPreviousPeriodConfirmation = false;
    public ShowHelpPanel = false;
    public UserHelpText = "";

    constructor(formData: T, defaultShowForm?: boolean) {
        this.FormData = formData;
        this.ShowForm = defaultShowForm;
    }
}