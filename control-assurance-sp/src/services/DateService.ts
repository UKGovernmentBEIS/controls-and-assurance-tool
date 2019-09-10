import * as moment from 'moment';
import { UpdatePeriodInterval } from '../types';

export class DateService {

	public static ukDateFormat: string = 'DD/MM/YYYY'; // For momentJS formatting
	public static ukTimeFormat: string = 'HH:mm'; // For momentJS formatting
	public static ukDateTimeFormat: string = 'DD/MM/YYYY HH:mm'; // For momentJS formatting
	public static isDateString: RegExp = new RegExp(/^[0-9]{4}-[01][0-9]-[0-3][0-9]T[0-2][0-9]:[0-5][0-9]:[0-5][0-9](\.[0-9]{1,7})?[+-]?([01][0-9]:[0-5][0-9])?Z?$/);
	public static isoDatePart: string = 'YYYY-MM-DD';
	public static monthNumberFormat: string = 'YYYYMM';
	public static monthNameFormat: string = 'MMMM YYYY';

	public static currentPeriod(interval: UpdatePeriodInterval) {
		const now = new Date();
		if (interval === UpdatePeriodInterval.Annually)
			return new Date(Date.UTC(now.getFullYear() + 1, 0, 0, 0, 0, 0));
		if (interval === UpdatePeriodInterval.Quarterly)
			return null; // TODO
		if (interval === UpdatePeriodInterval.Monthly)
			return new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 0, 0, 0));
		if (interval === UpdatePeriodInterval.Weekly)
			return moment().endOf('week').toDate(); // Untested
	}

	public static lastPeriod(interval: UpdatePeriodInterval) {
		const now = new Date();
		if (interval === UpdatePeriodInterval.Annually)
			return new Date(Date.UTC(now.getFullYear(), 0, 0, 0, 0));
		if (interval === UpdatePeriodInterval.Quarterly)
			return null; // TODO
		if (interval === UpdatePeriodInterval.Monthly)
			return new Date(Date.UTC(now.getFullYear(), now.getMonth(), 0, 0, 0, 0));
		if (interval === UpdatePeriodInterval.Weekly)
			return moment(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0))).endOf('week').toDate(); // Untested
	}

	public static parseUkDate(value: string): Date {
		let ukDateFormat = new RegExp(/^[0-3][0-9]\/[01][0-9]\/20[0-9]{2}$/);
		if (!ukDateFormat.test(value)) return;
		let values = value.split('/');
		if (parseInt(values[0]) > 31 || parseInt(values[1]) > 12) return;
		return new Date(parseInt(values[2]), parseInt(values[1]) - 1, parseInt(values[0]));
	}

	public static dateToUkDate(d: Date): string {
		return moment(d).format(this.ukDateFormat);
	}

	public static dateToUkTime(d: Date): string {
		return moment(d).format(this.ukTimeFormat);
	}

	public static dateToMonthNameFormat(d: Date): string {
		return moment(d).format(this.monthNameFormat);
	}

	public static convertODataDates(dataObject: any): object {
		if (dataObject.value && Array.isArray(dataObject.value)) {
			this.convertObjectDates(dataObject.value);
		} else {
			this.convertObjectDates(dataObject);
		}
		return dataObject;
	}

	private static convertObjectDates(dataObject: object): void {
		if (dataObject && Array.isArray(dataObject)) {
			for (let d in dataObject) {
				for (let p in dataObject[d]) {
					if (dataObject[d].hasOwnProperty(p) && dataObject[d][p]) {
						if (dataObject[d][p] && Array.isArray(dataObject[d][p])) {
							this.convertObjectDates(dataObject[d][p]);
						} else {
							if (DateService.isDateString.test(dataObject[d][p])) {
								dataObject[d][p] = new Date(dataObject[d][p]);
							}
						}
					}
				}
			}
		} else {
			for (let p in dataObject) {
				if (dataObject.hasOwnProperty(p) && dataObject[p]) {
					if (dataObject[p] && Array.isArray(dataObject[p])) {
						this.convertObjectDates(dataObject[p]);
					} else {
						if (DateService.isDateString.test(dataObject[p])) {
							dataObject[p] = new Date(dataObject[p]);
						}
					}
				}
			}
		}
	}
}