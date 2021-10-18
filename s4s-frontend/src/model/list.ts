/**
 * Helper class for list items.
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class ListItem<T> {
    private list: List<T>;
    private readonly index: number;

    public value: T;

    constructor(list: List<T>, value: T, index: number) {
        this.list = list;
        this.index = index;
        this.value = value;
    }

    prev(): ListItem<T> {
        return this.list.get(this.index - 1);
    }

    next(): ListItem<T> {
        return this.list.get(this.index + 1);
    }
}

/**
 * Helper class to arrange items in lists.
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class List<T> {
    private readonly items: Array<ListItem<T>>;

    constructor() {
        this.items = [];
    }

    size(): number {
        return this.items.length;
    }

    add(value: T): void {
        this.items.push(new ListItem<T>(this, value, this.size()));
    }

    get(index: number): ListItem<T> {
        return this.items[index];
    }
}
