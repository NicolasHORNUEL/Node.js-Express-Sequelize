class Student {
    constructor(body, age) {
        this.first_name = body.first_name,
        this.last_name = body.last_name,
        this.bio = body.bio,
        this.level = body.level,
        this.birthdate = body.birthdate,
        this.profile_picture = body.profile_picture,
        this.age = age,
        this.user = {email:body.email, password:body.password, type:body.type}
    }
}
module.exports = Student;
