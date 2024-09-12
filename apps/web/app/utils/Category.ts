export class Category {
  constructor(private readonly category: { id: string; name: string }) {}

  get name(): string {
    return this.category.name;
  }
  get id(): string {
    return this.category.id;
  }

  get icon(): string {
    switch (this.name) {
      case 'alcohol':
        return '🍻';
      case 'car':
        return '🚘';
      case 'petrol':
        return '⛽';
      case 'internet':
        return '🔗';
      case 'books':
        return '📚';
      case 'rent':
        return '🏠';
      case 'eating out':
        return '🍔';
      case 'groceries':
        return '🥦';
      case 'subscriptions':
        return '📶';
      case 'clothes':
        return '👕';
      case 'sports & activities':
        return '💪';
      case 'energy drinks':
        return '🔋';
      case 'others':
        return '❓';
      case 'entertainment':
        return '🎥';
      case 'utilities':
        return '💡';
      case 'cats':
        return '🐱';
      case 'smoking':
        return '🚬';
      case 'cleaning chemicals':
        return '🧼';
      default:
        return '';
    }
  }

  toJSON() {
    return {
      name: this.name,
      id: this.id,
      icon: this.icon,
    };
  }
}
