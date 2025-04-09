class Project{
    constructor(ID, linkVideo, materialName,
                info, price, picture, coinFree,
                learningPath, mentor, status) {
        this.ID = ID;
        this.linkVideo = linkVideo;
        this.materialName = materialName;
        this.info = info;
        this.price = price;
        this.picture = picture;
        this.coinFree = coinFree;
        this.learningPath = learningPath;
        this.mentor = mentor;
        this.status = status;
    }

    setID(ID) {
        this.ID = ID;
    }

    getID(){
        return this.ID;
    }

    setLinkVideo(linkVideo){
        this.linkVideo = linkVideo;
    }

    getLinkVideo(){
        return this.linkVideo;
    }

    setMaterialName(materialName){
        this.materialName = materialName;
    }

    getMaterialName(){
        return this.materialName;
    }

    setInfo(info){
        this.info = info;
    }

    getInfo(){
        return this.info;
    }

    setPrice(price){
        this.price = price;
    }

    getPrice(){
        return this.price;
    }

    setPicture(picture){
        this.picture = picture;
    }

    getPicture(){
        return this.picture;
    }

    setCoinFree(coinFree){
        this.coinFree = coinFree;
    }

    getCoinFree(){
        return this.coinFree;
    }

    setLearningPath(learningPath){
        this.learningPath = learningPath;
    }

    getLearningPath(){
        return this.learningPath;
    }

    setMentor(mentor){
        this.mentor = mentor;
    }

    getMentor(){
        return this.mentor;
    }

    setStatus(status){
        this.status = status;
    }

    getStatus(){
        return this.status;
    }

    toObject(){
        return {
            ID: this.ID,
            linkVideo: this.linkVideo,
            materialName: this.materialName,
            info: this.info,
            price: this.price,
            picture: this.picture,
            coinFree: this.coinFree,
            learningPath: this.learningPath,
            mentor: this.mentor,
            status: this.status,
        }
    }
}


module.exports = Project;