import * as React from 'react';
import styles from '../../styles/cr.module.scss';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { SaveIndicator } from './SaveIndicator';
import { SaveStatus } from '../../types';

export interface IFormButtonsProps {
    primaryText?: string;
    primary2Text?: string;
    secondaryText?: string;

    primaryDisabled?: boolean;
    primary2Disabled?: boolean;
    secondaryDisabled?: boolean;
    
    onPrimaryClick: () => void;
    onPrimary2Click?: () => void;
    onSecondaryClick?: () => void;

    primaryStatus?: SaveStatus;
}

export class FormButtons extends React.Component<IFormButtonsProps, {}> {

    public render(): JSX.Element {
        return (
            <div>
                <PrimaryButton text={this.props.primaryText || 'Save'} className={styles.formButton} 
                    onClick={this.props.onPrimaryClick}
                    //onClick={this._alertClicked}
                    disabled={this.props.primaryDisabled} style={{ marginRight: '5px' }} />

                { this.props.onPrimary2Click &&  
                <PrimaryButton text={this.props.primary2Text || 'Save2'} className={styles.formButton}
                    onClick={this.props.onPrimary2Click}
                    disabled={this.props.primary2Disabled} style={{ marginRight: '5px' }} />
                }                

                { this.props.onSecondaryClick &&  
                <DefaultButton text={this.props.secondaryText || 'Cancel'} className={styles.formButton}
                    onClick={this.props.onSecondaryClick}
                    disabled={this.props.secondaryDisabled} />
                }

                <SaveIndicator saveStatus={this.props.primaryStatus} />
            </div>
        );
    }

}
