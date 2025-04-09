class LearningPath{
    constructor(ID, categoryId, name, picture) {
        this.ID = ID;
        this.categoryId = categoryId;
        this.name = name;
        this.picture = picture;
    }

    setId(id) {
        this.id = id;
    }

    getId(){
        return this.ID;
    }

    setCategoryId(categoryId) {
        this.categoryId = categoryId;
    }

    getCategoryId() {
        return this.categoryId;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setPicture(picture) {
        this.picture = picture;
    }

    getPicture() {
        return this.picture;
    }

    toObject(){
        return {
            ID: this.ID,
            categoryId: this.categoryId,
            name: this.name,
            picture: this.picture,
        }
    }
}

module.exports = LearningPath;