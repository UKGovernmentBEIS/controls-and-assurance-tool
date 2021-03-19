import * as React from 'react';
import { SaveStatus } from '../../types';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import styles from '../../styles/SaveIndicator.module.scss';

export interface ISaveIndicatorProps {
    saveStatus: SaveStatus;
}

export interface ISaveIndicatorState {
    SaveStatus: SaveStatus;
}

export class SaveIndicator extends React.Component<ISaveIndicatorProps, ISaveIndicatorState> {
    constructor(props: ISaveIndicatorProps) {
        super(props);
        this.state = { SaveStatus: SaveStatus.None };
        this.onSaveSuccess = this.onSaveSuccess.bind(this);
        this.onSaveError = this.onSaveError.bind(this);
    }

    public render(): JSX.Element {
        return (
            <div className={styles.saveIndicator}>
                {this.props.saveStatus === SaveStatus.Pending &&
                    <div className={styles.flexContainer}>
                        <Spinner className={styles.saveIcon} size={SpinnerSize.small} />
                        <div>Saving...</div>
                    </div>}
                {this.state.SaveStatus === SaveStatus.Success &&
                    <div className={styles.flexContainer}>
                        <Icon className={styles.saveIcon} iconName="Accept" />
                        <div>Saved</div>
                    </div>}
                {this.state.SaveStatus === SaveStatus.Error &&
                    <div className={styles.flexContainer}>
                        <Icon className={styles.saveIcon} iconName="Error" />
                        <div>Error</div>
                    </div>}
            </div>
        );
    }

    public componentWillReceiveProps(nextProps): void {
        if (this.props.saveStatus === SaveStatus.Pending && nextProps.saveStatus === SaveStatus.Success) {
            this.onSaveSuccess();
        }
        if (this.props.saveStatus === SaveStatus.Pending && nextProps.saveStatus === SaveStatus.Error) {
            this.onSaveError();
        }
    }

    public onSaveSuccess(): void {
        this.setState({ SaveStatus: SaveStatus.Success }, () => setTimeout(() => { this.setState({ SaveStatus: SaveStatus.None }); }, 2000));
    }

    public onSaveError(): void {
        this.setState({ SaveStatus: SaveStatus.Error }, () => setTimeout(() => { this.setState({ SaveStatus: SaveStatus.None }); }, 2000));
    }
}
