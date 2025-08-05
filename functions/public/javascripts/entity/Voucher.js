class Voucher{
    constructor(ID, name, piece, dateStart, dateEnd, status, info, voucherCode = null, maxClaims = null, currentClaims = 0 ) {
        this.ID = ID;
        this.name = name;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.piece = piece;
        this.status = status;
        this.info = info;
        this.voucherCode = voucherCode; // Kode unik untuk claim voucher
        this.maxClaims = maxClaims; // Maksimal berapa kali bisa diklaim
        this.currentClaims = currentClaims; // Berapa kali sudah diklaim
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

    setVoucherCode(voucherCode){
        this.voucherCode = voucherCode;
    }

    getVoucherCode(){
        return this.voucherCode;
    }

    setMaxClaims(maxClaims){
        this.maxClaims = maxClaims;
    }

    getMaxClaims(){
        return this.maxClaims;
    }

    setCurrentClaims(currentClaims){
        this.currentClaims = currentClaims;
    }

    getCurrentClaims(){
        return this.currentClaims;
    }

    // Method untuk increment claim count
    incrementClaims(){
        this.currentClaims += 1;
    }

    // Method untuk check apakah voucher masih bisa diklaim
    canBeClaimed(){
        if (this.maxClaims === null)return true; // Unlimited claims
        return this.currentClaims < this.maxClaims;
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
            voucherCode: this.voucherCode,
            maxClaims: this.maxClaims,
            currentClaims: this.currentClaims,
        }
    }
}


module.exports = Voucher;