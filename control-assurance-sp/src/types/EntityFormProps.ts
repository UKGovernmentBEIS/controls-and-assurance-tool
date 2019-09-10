import { IBaseComponentProps } from "./BaseComponentProps";

export interface IEntityFormProps extends IBaseComponentProps {
    showForm?: boolean;
    entityName?: string;
    entityId?: number;
    onSaved?: () => void;
    onCancelled?: () => void;
    defaultValues?: { field: string, value: any }[];
}