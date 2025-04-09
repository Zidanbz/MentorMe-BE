class User {

    constructor(fullName, email, password, authorities, phone, picture){
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.phone = phone;
        this.picture = picture;
    }

    setEmail(email){
        this.email = email;
    }

    getEmail() {
        return this.email;
    }

    setPassword(password){
        this.password = password;
    }

    getPassword(){
        return this.password;
    }

    setAuthorities(authorities){
        this.authorities = authorities;
    }

    getAuthorities() {
        return this.authorities;
    }

    setPhone(phone){
        this.phone = phone;
    }

    getPhone(){
        return this.phone;
    }

    setPicture(picture){
        this.picture = picture;
    }

    getPicture(){
        return picture;
    }

    toObject() {
        return {
            fullName: this.fullName,
            email: this.email,
            password: this.password, // Jangan lupa untuk menyimpan password yang telah di-hash
            role: this.authorities,
            phone : this.phone,
            picture: this.picture,
        };
    }
}

module.exports = User;
