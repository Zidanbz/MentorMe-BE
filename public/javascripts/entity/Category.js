class Category {

    constructor(ID, name) {
        this.ID = ID;
        this.name = name;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setCategory(id) {
        this.ID = id;
    }

    getCategory() {
        return this.ID;
    }

    toObject(){
        return {
            ID: this.ID,
            name: this.name,
        }
    }

}

module.exports = Category;