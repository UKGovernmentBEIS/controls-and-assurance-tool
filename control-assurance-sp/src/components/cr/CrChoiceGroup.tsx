import * as React from 'react';
import styles from '../../styles/cr.module.scss';
import { ChoiceGroup, IChoiceGroupProps } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { FieldErrorMessage, FieldHistory } from './FieldDecorators';

export { IChoiceGroupProps, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

export interface ICrChoiceGroupProps extends IChoiceGroupProps {
    history?: string;
    errorMessage?: string;
}

export class CrChoiceGroup extends React.Component<ICrChoiceGroupProps, {}> {
    public render(): JSX.Element {
        const { className, ...otherProps } = this.props;
        return (
            <div className={this.props.className}>
                <div className={styles.cr}>
                    <ChoiceGroup {...otherProps}  />
                    {this.props.history && <FieldHistory value={this.props.history} />}
                    {this.props.errorMessage && <FieldErrorMessage value={this.props.errorMessage} />}
                </div>
            </div>
        );
    }
}