//import { CrFormState, ICrFormState } from "./CrFormState";


export interface ICrUpdateFormState<T/*, V*/> {
    FormData: T;
    //ValidationErrors: V;
    ShowForm: boolean;
    Loading: boolean;
    ShowSaveConfirmation: boolean;
    ShowLoadPreviousPeriodConfirmation:boolean;
    ShowHelpPanel: boolean;
    UserHelpText: string;
    //ParentEntity: E;
    //LastSignedOffUpdate: T;
    
    //HideClearFormDialog: boolean;
    //UpdatePeriod: Date;
}

export class CrUpdateFormState<T/*, V*/> implements ICrUpdateFormState<T/*, V*/>{
    public FormData: T;
    //public ValidationErrors: V;
    public ShowForm = false;
    public Loading = false;
    public ShowSaveConfirmation = false;
    public ShowLoadPreviousPeriodConfirmation = false;
    public ShowHelpPanel = false;
    public UserHelpText = "";

    //public LastSignedOffUpdate: T;
    
    //public HideClearFormDialog = true;
    //public UpdatePeriod: Date;

    constructor(formData: T/*, validationErrors?: V*/, defaultShowForm?: boolean) {
        this.FormData = formData;
        this.ShowForm = defaultShowForm;


        //may need following, in that case add defaultValues to constructor
        // if (defaultValues)
        // defaultValues.forEach(dv => {
        //     this.FormData[dv.field] = dv.value;
        // });
    }
}