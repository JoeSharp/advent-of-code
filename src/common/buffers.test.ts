import { PriorityQueue, Queue, Stack } from "./buffers";

describe("Priority Queue", () => {
  it("throws error if pop while empty", () => {
    const myQueue = new PriorityQueue();
    expect(() => myQueue.pop()).toThrowError();
  });

  it("throws error if pop while empty after items added and popped", () => {
    const myQueue = new PriorityQueue<string>();

    myQueue.push("A", 5);
    myQueue.push("B", 7);
    myQueue.push("C", 9);
    myQueue.pop();
    myQueue.pop();
    myQueue.pop();

    expect(() => myQueue.pop()).toThrowError();
  });

  it("can push and pull items in priority order", () => {
    const myQueue = new PriorityQueue<string>();

    myQueue.push("A", 8);
    myQueue.push("B", 10);
    myQueue.push("C", 4);
    myQueue.push("D", 2);
    myQueue.push("E", 5);
    myQueue.push("F", 5);
    myQueue.push("G", 4);
    myQueue.push("H", 4);
    myQueue.push("I", 4);

    const b = myQueue.pop();
    const a = myQueue.pop();
    const e = myQueue.pop();
    const f = myQueue.pop();
    const c = myQueue.pop();
    const g = myQueue.pop();
    const h = myQueue.pop();
    const i = myQueue.pop();
    const d = myQueue.pop();

    expect(b).toBe("B");
    expect(a).toBe("A");
    expect(e).toBe("E");
    expect(f).toBe("F");
    expect(c).toBe("C");
    expect(g).toBe("G");
    expect(h).toBe("H");
    expect(i).toBe("I");
    expect(d).toBe("D");
  });
});

describe("Queue", () => {
  it("throws error if pop while empty", () => {
    const myQueue = new Queue();
    expect(() => myQueue.pop()).toThrowError();
  });

  it("throws error if pop while empty after items added and popped", () => {
    const myQueue = new Queue<string>();

    myQueue.push("A");
    myQueue.push("B");
    myQueue.push("C");
    myQueue.pop();
    myQueue.pop();
    myQueue.pop();

    expect(() => myQueue.pop()).toThrowError();
  });

  it("can push and pull items in priority order", () => {
    const myQueue = new Queue<string>();

    myQueue.push("A");
    myQueue.push("B");
    myQueue.push("C");
    myQueue.push("D");
    myQueue.push("E");
    myQueue.push("F");
    myQueue.push("G");
    myQueue.push("H");
    myQueue.push("I");

    const a = myQueue.pop();
    const b = myQueue.pop();
    const c = myQueue.pop();
    const d = myQueue.pop();
    const e = myQueue.pop();
    const f = myQueue.pop();
    const g = myQueue.pop();
    const h = myQueue.pop();
    const i = myQueue.pop();

    expect(a).toBe("A");
    expect(b).toBe("B");
    expect(c).toBe("C");
    expect(d).toBe("D");
    expect(e).toBe("E");
    expect(f).toBe("F");
    expect(g).toBe("G");
    expect(h).toBe("H");
    expect(i).toBe("I");
  });
});

describe("Stack", () => {
  it("throws error if pop while empty", () => {
    const myStack = new Stack();
    expect(() => myStack.pop()).toThrowError();
  });

  it("throws error if pop while empty after items added and popped", () => {
    const myStack = new Stack<string>();

    myStack.push("A");
    myStack.push("B");
    myStack.push("C");
    myStack.pop();
    myStack.pop();
    myStack.pop();

    expect(() => myStack.pop()).toThrowError();
  });

  it("can push and pull items in priority order", () => {
    const myStack = new Stack<string>();

    myStack.push("A");
    myStack.push("B");
    myStack.push("C");
    myStack.push("D");
    myStack.push("E");
    myStack.push("F");
    myStack.push("G");
    myStack.push("H");
    myStack.push("I");

    const i = myStack.pop();
    const h = myStack.pop();
    const g = myStack.pop();
    const f = myStack.pop();
    const e = myStack.pop();
    const d = myStack.pop();
    const c = myStack.pop();
    const b = myStack.pop();
    const a = myStack.pop();

    expect(a).toBe("A");
    expect(b).toBe("B");
    expect(c).toBe("C");
    expect(d).toBe("D");
    expect(e).toBe("E");
    expect(f).toBe("F");
    expect(g).toBe("G");
    expect(h).toBe("H");
    expect(i).toBe("I");
  });
});
