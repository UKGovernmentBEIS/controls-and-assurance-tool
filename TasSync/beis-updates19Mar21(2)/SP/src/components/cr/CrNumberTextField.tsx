import * as React from 'react';
import styles from '../../styles/CrNumberTextField.module.scss';
import { FieldHistory, FieldErrorMessage } from './FieldDecorators';
import { CrTextField } from '../cr/CrTextField';

export interface ICrNumberTextFieldProps {
    label: string;
    className?: string;
    value: number | string;
    disabled?: boolean;
    required?: boolean;
    maxLength?: number;
    onChanged?: (value: string) => void;
    history?: string;
    errorMessage?: string;
    suffix?: string;
}

export class CrNumberTextField extends React.Component<ICrNumberTextFieldProps, {}> {
    public render(): JSX.Element {
        const n = Number(this.props.value);
        const h = Number(this.props.history);
        return (
            <div className={this.props.className}>
                <div className={styles.numberTextField}>
                    <div style={{ maxWidth: '350px' }}>
                        <CrTextField
                            className={this.props.errorMessage && styles.invalid}
                            label={this.props.label}
                            required={this.props.required}
                            placeholder="Numbers only"
                            disabled={this.props.disabled}
                            maxLength={this.props.maxLength}
                            value={this.props.value && this.props.value.toString()}
                            onChanged={this.props.onChanged}
                            suffix={this.props.suffix}
                        />
                    </div>
                    {!isNaN(n) && n >= 1000 && <div className={styles.formattedNumber} style={{ paddingLeft: '12px' }}>{n.toLocaleString('en-GB')}</div>}
                    {this.props.history !== undefined && this.props.history !== null && <FieldHistory value={h.toLocaleString('en-GB')} />}
                    {this.props.errorMessage && <FieldErrorMessage value={this.props.errorMessage} />}
                </div>
            </div>
        );
    }
}