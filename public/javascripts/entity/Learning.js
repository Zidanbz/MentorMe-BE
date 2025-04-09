class Learning {

    constructor(ID, email, progress, project){
        this.ID = ID;
        this.email = email;
        this.progress = progress;
        this.project = project;
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

    setProgress(progress){
        this.progress = progress;
    }

    getProgress(){
        return this.progress;
    }

    setProject(project){
        this.project = project;
    }

    getProject(){
        return this.project;
    }

    toObject(){
        return {
            ID: this.ID,
            email: this.email,
            progress: this.progress,
            project: this.project,
        }
    }
}

module.exports = Learning;