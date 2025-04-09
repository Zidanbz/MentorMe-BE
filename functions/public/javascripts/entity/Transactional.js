class Transactional{
    constructor(ID, email, course, status, price, voucher) {
        this.ID = ID;
        this.email = email;
        this.course = course;
        this.status = status;
        this.price = price;
        this.voucher = voucher;
    }

    setID(ID){
        this.ID = ID;
    }

    getID(){
        return this.ID;
    }

    setEmail(email){
        this.email = email;
    }

    getEmail(){
        return this.email;
    }

    setCourse(course){
        this.course = course;
    }

    getCourse(){
        return this.course;
    }

    setStatus(status){
        this.status = status;
    }

    getStatus(){
        return this.status;
    }

    setPrice(price){
        this.price = price;
    }

    getPrice(){
        return this.price;
    }

    setVoucher(voucher){
        this.voucher = voucher;
    }

    getVoucher(){
        return this.voucher;
    }

    toObject(){
        return {
            ID: this.ID,
            email: this.email,
            course: this.course,
            status: this.status,
            price: this.price,
            voucher: this.voucher,
        }
    }
}

module.exports = Transactional;