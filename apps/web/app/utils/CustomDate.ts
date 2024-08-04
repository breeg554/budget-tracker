import {
  addDays,
  endOfISOWeek,
  format as fnsFormat,
  formatISO as fnsFormatISO,
  startOfISOWeek,
} from 'date-fns';

export class CustomDate {
  constructor(private readonly date: string | Date | number) {}

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
}
