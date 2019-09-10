import * as React from 'react';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { FieldErrorMessage } from './FieldDecorators';

export interface ICrCheckboxProps extends ICheckboxProps {
    errorMessage?: string;
}

export class CrCheckbox extends React.Component<ICrCheckboxProps, {}> {
    public render(): JSX.Element {
        const { className, ...otherProps } = this.props;
        return (
            <div className={className}>
                <Checkbox {...otherProps} />
                {this.props.errorMessage && <FieldErrorMessage value={this.props.errorMessage} />}
            </div>
        );
    }
}