import { IEntityFormProps } from "./EntityFormProps";
import { IDefElement } from "./DefElement";
import { IFForm } from ".";

export interface IBaseProgressUpdateFormProps extends IEntityFormProps {

    externalUserLoggedIn?: boolean;
    isArchivedPeriod: boolean;
    entityUpdateId?: number;
    entityName?: string;
    signOffPeriod: Date;
    defaultShowForm?: boolean;

    DefElement?: IDefElement;
    formId: number;
    form: IFForm;
    onElementSave: ()=> void;
}