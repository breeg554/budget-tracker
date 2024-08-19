import {
  addDays,
  addMonths,
  addWeeks,
  differenceInDays,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfISOWeek,
  endOfMonth,
  format as fnsFormat,
  formatISO9075,
  getDaysInMonth,
  isValid,
  parseISO,
  setHours,
  startOfDay,
  startOfISOWeek,
  startOfMonth,
} from 'date-fns';

type DateType = string | Date | number;

export class CustomDate {
  constructor(private readonly date: DateType) {}

  static parseIso(date: string): CustomDate {
    return new CustomDate(parseISO(date));
  }

  static isValid(date: unknown): boolean {
    return isValid(date);
  }

  static isStringValidDate(value: string): boolean {
    return isValid(parseISO(value));
  }

  format(format: string): string {
    return fnsFormat(this.toLocaleDate(), format);
  }

  formatISO(): string {
    return new Date(this.date).toISOString();
  }

  toLocaleDate(): Date {
    return new Date(this.date);
  }

  formatISO9075(): string {
    return formatISO9075(this.date);
  }

  addDays(days: number): CustomDate {
    return new CustomDate(addDays(this.date, days));
  }

  addWeeks(weeks: number): CustomDate {
    return new CustomDate(addWeeks(this.date, weeks));
  }

  addMonths(months: number): CustomDate {
    return new CustomDate(addMonths(this.date, months));
  }

  startOfWeek(): CustomDate {
    return new CustomDate(startOfISOWeek(this.date));
  }

  endOfWeek(): CustomDate {
    return new CustomDate(endOfISOWeek(this.date));
  }

  startOfDay(): CustomDate {
    return new CustomDate(startOfDay(this.date));
  }

  endOfDay(): CustomDate {
    return new CustomDate(endOfDay(this.date));
  }

  startOfMonth(): CustomDate {
    return new CustomDate(startOfMonth(this.date));
  }

  endOfMonth(): CustomDate {
    return new CustomDate(endOfMonth(this.date));
  }

  differenceInDays(date: DateType): number {
    return differenceInDays(this.date, date);
  }

  getDaysInMonth(): number {
    return getDaysInMonth(this.date);
  }

  eachDayOfInterval(date: DateType): Date[] {
    return eachDayOfInterval({ start: this.date, end: date });
  }

  eachHourOfInterval(date: DateType): Date[] {
    return eachHourOfInterval({ start: this.date, end: date });
  }

  setHours(hours: number): CustomDate {
    return new CustomDate(setHours(this.date, hours));
  }
}
