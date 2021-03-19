import * as React from 'react';
import styles from '../../styles/FieldDecorators.module.scss';

export interface IFieldErrorMessageProps {
    value: string;
}

export class FieldErrorMessage extends React.Component<IFieldErrorMessageProps, {}> {
    public render(): JSX.Element {
        return (
            <div className={styles.fieldDecorators}>
                <div className={`${styles.errorMessage} ms-slideDownIn20`}>
                    {this.props.value && <p><span>{this.props.value}</span></p>}
                </div>
            </div>
        );
    }
}

export interface IFieldHistoryProps {
    value: string;
}

export class FieldHistory extends React.Component<IFieldHistoryProps, {}> {
    public render(): JSX.Element {
        return (
            <div className={styles.fieldDecorators}>
                {this.props.value && <div className={styles.history}>Last month: <span>{this.props.value}</span></div>}
            </div>
        );
    }
}

export interface ITextFieldCharCounterProps {
    maxChars: number;
    text: string;
}

export class TextFieldCharCounter extends React.Component<ITextFieldCharCounterProps, {}> {
    public render(): JSX.Element {
        return (
            <div style={{ textAlign: 'right' }}>{(this.props.text) ? (this.props.maxChars - this.props.text.length) + ' characters remaining' : `${this.props.maxChars} characters remaining`}</div>
        );
    }
}
