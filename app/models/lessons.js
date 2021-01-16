class Lesson {
    constructor(body) {
        this.title = body.title,
        this.hours = body.hours,
        this.description = body.description,
        this.teacher = body.teacher,
        this.file_name = body.file_name,
        this.starting_date = body.starting_date,
        this.ending_date = body.ending_date,
        this.is_finished = this.getFinished()
    }
    getFinished = () => {
        let currentDate = Date.now();
        let endingDate = Date.parse(this.ending_date);
        let is_finished = false;
        if (endingDate < currentDate) {
            is_finished = !is_finished;
        }
        return is_finished
    }
}
module.exports = Lesson;

