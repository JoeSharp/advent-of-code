export class PriorityQueue<T> {
  items: {
    item: T;
    priority: number;
  }[] = [];

  toString(): string {
    return this.items
      .map(({ item, priority }) => `${JSON.stringify(item)} - ${priority}`)
      .join("\n");
  }

  push(item: T, priority: number): void {
    const index = this.items.findIndex((v) => v.priority < priority);

    if (index >= 0) {
      this.items.splice(index, 0, { item, priority });
    } else {
      this.items.push({
        item,
        priority,
      });
    }
  }

  pop(): T {
    const prioritisedItem = this.items.shift();

    if (prioritisedItem === undefined) {
      throw new Error("Queue Empty during Pop");
    }

    return prioritisedItem.item;
  }

  popBack(): T {
    const prioritisedItem = this.items.pop();

    if (prioritisedItem === undefined) {
      throw new Error("Queue Empty during Pop");
    }

    return prioritisedItem.item;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

export class Queue<T> {
  items: T[] = [];

  push(item: T) {
    this.items.push(item);
  }

  pop(): T {
    const item = this.items.shift();
    if (item === undefined) {
      throw new Error("Queue Empty during Pop");
    }

    return item;
  }
  isEmpty() {
    return this.items.length === 0;
  }
}

export class Stack<T> {
  items: T[] = [];

  push(item: T) {
    this.items.push(item);
  }

  pop(): T {
    const item = this.items.pop();

    if (item === undefined) {
      throw new Error("Stack Empty during Pop");
    }

    return item;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
