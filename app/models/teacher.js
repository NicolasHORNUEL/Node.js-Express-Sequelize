class Teacher {
    // constructor(first_name,last_name, bio, subject, profile_picture, email, password, type)
    constructor(body) {
        this.first_name = body.first_name,
        this.last_name = body.last_name,
        this.bio = body.bio,
        this.subject = body.subject,
        this.profile_picture = body.profile_picture,
        this.user = {email:body.email, password:body.password, type:body.type}
    }
}
module.exports = Teacher;
