class Syllabus {

    constructor(ID, mentor, project, meeting, materialNameSyllabus, description, task) {
        this.ID = ID;
        this.mentor = mentor;
        this.project = project;
        this.meeting = meeting;
        this.materialNameSyllabus = materialNameSyllabus;
        this.description = description;
        this.task = task;
    }

    setID(ID){
        this.ID = ID;
    }

    getID(){
        return this.ID;
    }

    setMentor(mentor){
        this.mentor = mentor;
    }

    getMentor(){
        return this.mentor;
    }

    setProject(project){
        this.project = project;
    }

    getProject(){
        return this.project;
    }

    setMeeting(meeting){
        this.meeting = meeting;
    }

    getMeeting(){
        return this.meeting;
    }

    setMaterialNameSyllabus(materialNameSyllabus){
        this.materialNameSyllabus = materialNameSyllabus;
    }

    getMaterialNameSyllabus(){
        return this.materialNameSyllabus;
    }

    setDescription(description){
        this.description = description;
    }

    getDescription(){
        return this.description;
    }

    setTask(task){
        this.task = task;
    }

    getTask(){
        return this.task;
    }

    toObject(){
        return {
            ID: this.ID,
            Mentor: this.mentor,
            Project: this.project,
            Meeting: this.meeting,
            MaterialNameSyllabus: this.materialNameSyllabus,
            Description: this.description,
            Task: this.task,
        }
    }
}

module.exports = Syllabus;
