import * as React from 'react';
import styles from '../../styles/cr.module.scss';
import { Dropdown, IDropdownProps } from 'office-ui-fabric-react/lib/Dropdown';
import { FieldErrorMessage, FieldHistory } from './FieldDecorators';

export { IDropdownProps, IDropdownOption, DropdownMenuItemType } from 'office-ui-fabric-react/lib/Dropdown';

export interface ICrDropdownProps extends IDropdownProps {
    placeholder?: string;
    history?: string;
    errorMessage?: string;
}

export class CrDropdown extends React.Component<ICrDropdownProps, {}> {
    public render(): JSX.Element {
        const { errorMessage, ...otherProps } = this.props;
        return (
            <div className={this.props.className}>
                <div className={styles.cr}>
                    <Dropdown
                        {...otherProps}
                        placeHolder={this.props.placeholder}
                        className={errorMessage && styles.dropdownInvalid}
                    />
                    {this.props.history && <FieldHistory value={this.props.history} />}
                    {errorMessage && <FieldErrorMessage value={errorMessage} />}
                </div>
            </div>
        );
    }
}