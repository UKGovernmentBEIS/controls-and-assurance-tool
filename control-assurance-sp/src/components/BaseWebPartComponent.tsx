import * as React from 'react';
import * as types from '../types';
import styles from '../styles/cr.module.scss';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { CrLoadingOverlay } from './cr/CrLoadingOverlay';

export default abstract class BaseWebPartComponent<P extends types.IWebPartComponentProps, S extends types.IWebPartComponentState> extends React.Component<P, S> {
    constructor(props: P) {
        super(props);
    }

    public render(): React.ReactElement<P> {
        return (
            <div className={styles.cr}>
                {this.state.Error && <MessageBar messageBarType={MessageBarType.error}>{this.state.Error}</MessageBar>}
                {this.renderWebPart()}
            </div>
        );
    }

    public abstract renderWebPart(): React.ReactElement<P>;

    protected clearErrors = (): void => {
        this.setState({ Error: null });
    }

    protected onError = (errorUserMessage: string, errorDetail?: string): void => {
        this.setState({ Error: errorUserMessage });
        if (errorDetail) console.log(`${errorUserMessage}: ${errorDetail}`);
    }
}
