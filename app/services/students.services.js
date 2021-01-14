
module.exports = function MyFunction(response) {
    if (response.length > 1) {
        let students = [];
        response.forEach(student => {
            students.push(getAge(student));
        })        
        return students;
    } else {
        return getAge(response);
    }
}

function getAge(student) {
    let currentDate = Date.now();
    let birthdate = Date.parse(student.birthdate); // = student.birthdate.getTime()
    let ageDate = new Date(currentDate - birthdate);
    student.age = (ageDate.getUTCFullYear() - 1970);
    return student;
}
