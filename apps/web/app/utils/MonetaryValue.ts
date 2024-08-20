import { z } from 'zod';

export class MonetaryValue {
  private readonly value: number;
  private readonly quantityValue: number;

  constructor(
    value: number | string,
    quantity: number | string = 1,
    private readonly currencyCode = 'PLN',
  ) {
    this.value = z
      .union([z.number(), z.string().transform((value) => Number(value))])
      .parse(value);
    this.quantityValue = z
      .union([z.number(), z.string().transform((value) => Number(value))])
      .parse(quantity);
  }

  get amount() {
    return this.quantityValue * this.value;
  }

  get currency() {
    return this.currencyCode;
  }

  get quantity() {
    return this.quantityValue;
  }

  add(other: MonetaryValue) {
    if (this.currencyCode !== other.currencyCode) {
      throw new Error('Cannot add MonetaryValues with different currencies');
    }

    return new MonetaryValue(this.amount + other.amount);
  }

  public format() {
    return this.amount.toFixed(2);
  }

  public withCurrency() {
    return `${this.format()}${this.currency}`;
  }
}
