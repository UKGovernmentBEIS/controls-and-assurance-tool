import * as React from 'react';
import * as types from '../types';
import * as services from '../services';
import styles from '../styles/cr.module.scss';
import { CrLoadingOverlay } from './cr/CrLoadingOverlay';

export interface IBaseReportListProps extends types.IBaseComponentProps {
    
}

export default abstract class BaseReportList<P extends IBaseReportListProps, S extends types.IOrgRepListState<types.IEntity>> extends React.Component<P, S> {
    protected abstract entityService: services.EntityService<types.IEntity>;

    constructor(props: P) {
        super(props);
    }
    public render(): React.ReactElement<P> {
        return (
            <div className={`${styles.cr} ${styles.crList}`}>
                <div style={{ position: 'relative' }}>
                    <CrLoadingOverlay isLoading={this.state.Loading} />
                    {this.renderList()}
                </div>
            </div>
        );
    }

    protected abstract renderList(): JSX.Element;

    //#region Form initialisation

    public componentDidMount(): void {
        this.loadEntities();
    }
    protected loadEntities = (): void => {
        this.setState({ Loading: true });
        this.entityService.readAll().then((entities: any): void => {
            this.setState({ Loading: false, Entities: entities });
        }, (err) => this.errorLoadingEntities(err));
    }

    protected errorLoadingEntities = (err: any, entityName?: string): void => {
        this.setState({ Loading: false });
        if (this.props.onError) this.props.onError(`Error loading ${entityName || 'items'}`, err.message);
    }

    //#endregion

    //#region Form infrastructure

    protected onFilterChange = (value: string): void => {
        this.setState({ ListFilterText: value });
    }

    //#endregion
}
