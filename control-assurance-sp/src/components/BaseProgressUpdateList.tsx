import * as React from 'react';
import * as services from '../services';
import { IDefElement, IBaseComponentProps, IEntity, IFForm } from '../types';
import styles from '../styles/cr.module.scss';
import { CrLoadingOverlay } from './cr/CrLoadingOverlay';

export interface IBaseProgressUpdateListProps extends IBaseComponentProps {
    externalUserLoggedIn?: boolean;
    isArchivedPeriod: boolean;
    signOffPeriod: Date;
    entityId? : number;
    title: string;
    formId: number;
    form: IFForm;
    onElementSave: ()=> void;
}

export interface IBaseProgressUpdateListState {
    Loading: boolean;
    DefElements: IDefElement[];
    ShowEntityForm: boolean;
    OpenedElementId: number;
}

export class BaseProgressUpdateListState implements IBaseProgressUpdateListState {
    public DefElements: IDefElement[] = [];
    public Loading = false;
    public ShowEntityForm: boolean = false;
    public OpenedElementId = 0;
}

export abstract class BaseProgressUpdateList<P extends IBaseProgressUpdateListProps, S extends IBaseProgressUpdateListState> extends React.Component<P, S> {
    protected abstract entityService: services.EntityService<IEntity>;
    protected abstract updateListTitle: string;
    constructor(props: P) {
        super(props);
    }

    public render(): React.ReactElement<IBaseProgressUpdateListProps> {
        const { DefElements } = this.state;
        return (
            <div className={`${styles.cr} ${styles.crList}`}>
        
                {DefElements.length > 0 &&
                    <div style={{ position: 'relative' }}>
                        {this.updateListTitle && <h1 className='ms-font-xl'>{this.updateListTitle}</h1>}
                        <CrLoadingOverlay isLoading={this.state.Loading} />
                        {this.state.DefElements.map((m, i) => {
                            return this.renderElementForm(m.ID, m.Title, m, false);
                        })}
                    </div>
                }
            </div>
        );
    }

    public abstract renderElementForm(entityId: number, entityName?: string, defElement?: IDefElement, showForm?: boolean);

    //#region Form initialisation

    public componentDidMount(): void {
             this.loadDefElements(this.props.entityId);
    }

    public componentDidUpdate(prevProps: P): void {
    }

    protected abstract loadDefElements(parentId: number): void;

    protected errorLoadingEntities = (err: any, entityName?: string): void => {
        this.setState({ Loading: false });
        if (this.props.onError) this.props.onError(`Error loading ${entityName || 'items'}`, err.message);
    }

    //#endregion

    //#region Form infrastructure

    protected closeEntityForm = (): void => {
        this.setState({ ShowEntityForm: false });
    }

    protected openEntityForm = (): void => {
        this.setState({ ShowEntityForm: true });
    }

    //#endregion
}
