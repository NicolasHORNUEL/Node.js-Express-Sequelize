
module.exports = function getFinished(response) {
    if (response.length > 1) {
        let lessons = [];
        response.forEach(lesson => {
            lessons.push(getFin(lesson));
        })        
        return lessons;
    } else if (response.length = 1) {
        return getFin(response);
    }
}

function getFin(lesson){
    let currentDate = Date.now();
    let endingDate = Date.parse(lesson.dataValues.ending_date);
    let is_finished = false;
    if (endingDate < currentDate) {
        is_finished = !is_finished;
    }
    lesson.dataValues.is_finished = is_finished;
    return lesson
}