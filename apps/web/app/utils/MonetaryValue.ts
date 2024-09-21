import { z } from 'zod';

export class MonetaryValue {
  private readonly _value: number;

  constructor(
    value: number | string,
    private readonly currencyCode = 'PLN',
  ) {
    this._value = z
      .union([z.number(), z.string().transform((value) => Number(value))])
      .parse(value);
  }

  public add(other: MonetaryValue): MonetaryValue {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add MonetaryValues with different currencies');
    }

    return new MonetaryValue(this.value + other.value);
  }

  public format(): string {
    return Intl.NumberFormat('pl-PL', {
      currency: this.currencyCode,
      style: 'currency',
    }).format(this.value);
  }

  public toJSON() {
    return {
      value: this.value,
      currency: this.currency,
      formatted: this.format(),
    };
  }

  public percentageDifference(other: MonetaryValue): number {
    if (other.value === 0) return 100;
    return ((this.value - other.value) / other.value) * 100;
  }

  get value() {
    return this._value;
  }

  get currency() {
    return this.currencyCode;
  }
}

export const monetaryValue = (value: number | string) =>
  new MonetaryValue(value);

export class TransactionItemValue {
  private readonly _quantity: number;
  constructor(
    private readonly price: MonetaryValue,
    quantity: number | string,
  ) {
    this._quantity = z
      .union([z.number(), z.string().transform((value) => Number(value))])
      .parse(quantity);
  }

  get quantity() {
    return this._quantity;
  }

  get total() {
    return new MonetaryValue(this.price.value * this.quantity);
  }

  get value() {
    return this.price;
  }

  public toJSON() {
    return {
      quantity: this.quantity,
      total: this.total.toJSON(),
    };
  }
}
