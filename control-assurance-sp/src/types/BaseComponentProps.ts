import { IWebPartComponentProps } from './WebPartComponentProps';
import { EntityService } from '../services';
import { IEntity } from './Entity';

export interface IBaseComponentProps extends IWebPartComponentProps {
    entityService?: EntityService<IEntity>;
    onError?: (userMessage: string, details?: string) => void;
    onLoading?: (isLoading: boolean) => void;
}