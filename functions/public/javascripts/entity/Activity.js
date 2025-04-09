class Activity{
    constructor(ID, learning,
                syllabus, status, task,
                criticism, statusReport,
                activity, documentasi,
                ){
        this.ID = ID;
        this.learning = learning;
        this.syllabus = syllabus;
        this.status = status;
        this.task = task;
        this.task = task;
        this.criticism = criticism;
        this.statusReport = statusReport;
        this.activity = activity;
        this.documentasi = documentasi;
    }

    setID(ID){
        this.ID = ID;
    }

    getID(){
        return this.ID;
    }

    setLearning(learning){
        this.learning = learning;
    }

    getLearning(){
        return this.learning;
    }

    setSyllabus(syllabus){
        this.syllabus = syllabus;
    }

    getSyllabus(){
        return this.syllabus;
    }

    setStatus(status){
        this.status = status;
    }

    getStatus(){
        return this.status;
    }

    setTask(task){
        this.task = task;
    }

    getTask(){
        return this.task;
    }

    setCriticism(criticism){
        this.criticism = criticism;
    }

    getCriticism(){
        return this.criticism;
    }

    toObject(){
        return {
            ID: this.ID,
            learning: this.learning,
            syllabus: this.syllabus,
            status: this.status,
            task: this.task,
            criticism: this.criticism,
            statusReport: this.statusReport,
            activity: this.activity,
            documentasi: this.documentasi,
        }
    }
}

module.exports = Activity;