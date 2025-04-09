class Voucher{
    constructor(ID, name, piece, dateStart, dateEnd, status, info ) {
        this.ID = ID;
        this.name = name;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.piece = piece;
        this.status = status;
        this.info = info;
    }

    setID(ID){
        this.ID = ID;
    }

    getID(){
        return this.ID;
    }

    setName(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }

    setDateStart(dateStart){
        this.dateStart = dateStart;
    }

    getDateStart(){
        return this.dateStart;
    }

    setDateEnd(dateEnd){
        this.dateEnd = dateEnd;
    }

    getDateEnd(){
        return this.dateEnd;
    }

    setPiece(piece){
        this.piece = piece;
    }

    getPiece(){
        return this.piece;
    }

    setStatus(status){
        this.status = status;
    }

    getStatus(){
        return this.status;
    }

    setInfo(info){
        this.info = info;
    }

    getInfo(){
        return this.info;
    }
    toObject(){
        return {
            ID: this.ID,
            name: this.name,
            piece: this.piece,
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
            status: this.status,
            info: this.info,
        }
    }
}


module.exports = Voucher;