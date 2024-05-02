import { GetTransactionItemCategoryDto } from "~/api/Transaction/transactionApi.types";

export class TransactionItemCategory {
  constructor(private readonly category: GetTransactionItemCategoryDto) {}

  get name() {
    return this.category.name;
  }

  get icon() {
    switch (this.name) {
      case "alcohol":
        return "🍸";
      case "car":
        return "🚘";
      case "gasoline":
        return "⛽";
      case "internet":
        return "🔗";
      case "books":
        return "📚";
      case "rent":
        return "🏠";
      default:
        return "";
    }
  }
}
