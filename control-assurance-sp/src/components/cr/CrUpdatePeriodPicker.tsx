import * as React from 'react';
import * as moment from 'moment';
import * as services from '../../services';
import { CrDropdown, IDropdownOption } from './CrDropdown';
import { UpdatePeriodInterval } from '../../types';

export interface ICrUpdatePeriodPickerProps {
    period?: UpdatePeriodInterval;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    value?: Date;
    onChanged?: (date: Date) => void;
    errorMessage?: string;
}

export class CrUpdatePeriodPicker extends React.Component<ICrUpdatePeriodPickerProps, {}> {
    constructor(props: ICrUpdatePeriodPickerProps) {
        super(props);
        this._changeDateDropdown = this._changeDateDropdown.bind(this);
    }

    public render(): JSX.Element {
        let thisPeriod: Date, lastPeriod: Date;
        if (this.props.period === undefined || this.props.period === UpdatePeriodInterval.Monthly) {
            lastPeriod = services.DateService.lastPeriod(UpdatePeriodInterval.Monthly);
            thisPeriod = services.DateService.currentPeriod(UpdatePeriodInterval.Monthly);
        }
        if (this.props.period === UpdatePeriodInterval.Weekly) {
            lastPeriod = services.DateService.lastPeriod(UpdatePeriodInterval.Weekly);
            thisPeriod = services.DateService.currentPeriod(UpdatePeriodInterval.Weekly);
        }
        const reportPeriods = [
            { key: moment(lastPeriod).toISOString(), text: moment(lastPeriod).format(services.DateService.monthNameFormat) },
            { key: moment(thisPeriod).toISOString(), text: moment(thisPeriod).format(services.DateService.monthNameFormat) }
        ];
        return (
            <CrDropdown
                label={this.props.label}
                required={this.props.required}
                disabled={this.props.disabled}
                className={this.props.className}
                placeholder={this.props.placeholder}
                options={reportPeriods}
                selectedKey={moment(this.props.value).toISOString()}
                onChanged={this._changeDateDropdown}
                errorMessage={this.props.errorMessage}
            />
        );
    }

    private _changeDateDropdown(option: IDropdownOption, index?: number): void {
        const d = new Date(option.key.toString());
        if (this.props.onChanged) this.props.onChanged(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)));
    }
}
