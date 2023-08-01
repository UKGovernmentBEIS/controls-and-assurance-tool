import * as React from 'react';
import moment from 'moment';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { FieldErrorMessage, FieldHistory } from './FieldDecorators';

export interface ICrDatePickerProps {
    label?: string;
    required?: boolean;
    className?: string;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    value?: Date;
    onSelectDate?: (date: Date) => void;
    history?: string;
    errorMessage?: string;
    maxWidth?: string;
}

export class CrDatePicker extends React.Component<ICrDatePickerProps, {}> {
    private maxWidth:string = this.props.maxWidth ? this.props.maxWidth : '350px';
    public render(): JSX.Element {
        return (
            <div className={this.props.className}>
                {this.props.label && <Label required={this.props.required}>{this.props.label}</Label>}
                <div style={{ maxWidth: this.maxWidth }}>
                    <DatePicker
                    
                        className={this.props.errorMessage && styles.datePickerInvalid}
                        disabled={this.props.disabled}
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        allowTextInput={true}
                        parseDateFromString={this._parseCrDate}
                        formatDate={(date: Date) => date && moment(date).format(services.DateService.ukDateFormat)}
                        value={this.props.value}
                        onSelectDate={this.props.onSelectDate}

                         />
                        
                </div>
                {this.props.history && <FieldHistory value={this.props.history} />}
                {this.props.errorMessage && <FieldErrorMessage value={this.props.errorMessage} />}
            </div>
        );
    }

    private _parseCrDate(value: string): Date {
        console.log('_parseCrDate', value);
        let ukDateFormat = new RegExp(/^[0-3][0-9]\/[01][0-9]\/20[0-9]{2}$/);
        //if (!ukDateFormat.test(value)) return;
        //console.log('_parseCrDate 2');
        let values = value.split('/');
        //console.log('_parseCrDate 3');
        if (parseInt(values[0]) > 31 || parseInt(values[1]) > 12) return;
        //console.log('_parseCrDate 4');
        return new Date(parseInt(values[2]), parseInt(values[1]) - 1, parseInt(values[0]));
    }
}
