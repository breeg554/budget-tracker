import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfISOWeek,
  endOfMonth,
  format as fnsFormat,
  formatISO as fnsFormatISO,
  getDaysInMonth,
  isValid,
  startOfDay,
  startOfISOWeek,
  startOfMonth,
} from 'date-fns';

type DateType = string | Date | number;

export class CustomDate {
  constructor(private readonly date: DateType) {}

  static isValid(date: unknown): boolean {
    return isValid(date);
  }

  format(format: string): string {
    return fnsFormat(this.date, format);
  }

  formatISO(): string {
    return fnsFormatISO(this.date);
  }

  addDays(days: number): CustomDate {
    return new CustomDate(addDays(this.date, days));
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
}
