class Role {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    setId(id){
        this.id = id;
    }

    getId(){
        return this.id;
    }

    setName(name) {
        this.name = name;
    }

    getName(){
        return this.name;
    }
}

module.exports = Role;