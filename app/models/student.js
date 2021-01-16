class Student {
    constructor(body) {
        this.first_name = body.first_name,
        this.last_name = body.last_name,
        this.bio = body.bio,
        this.level = body.level,
        this.birthdate = body.birthdate,
        this.profile_picture = body.profile_picture,
        this.age = this.getAge(),
        this.user = {email:body.email, password:body.password, type:body.type}
    }
    getAge = () => {
        let currentDate = Date.now();
        let birthdate = Date.parse(this.birthdate); // = birthdate.getTime()
        let ageDate = new Date(currentDate - birthdate);
        return (ageDate.getUTCFullYear() - 1970);
    }
}
module.exports = Student;
