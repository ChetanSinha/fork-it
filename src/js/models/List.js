import uniqid from "uniqid";

// This is model for our shopping list items.

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem (id) {
        const index = this.items.findIndex(el => el.id === id);

        // [2,3,5] splice(1,2) --> returns-> [3,5], now array -> [2]
        // [2,4,8] slice(1,2) --> returns-> 4, now array -> [2,4,8]
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        // find method returns the element that matches the condition
        // therefore, here we are changeing the count of returned element from find 
        this.items.find(el => el.id === id).count = newCount;
    }
}