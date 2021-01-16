class User {
    constructor(body) {
        this.email = body.email,
        this.password = body.password,
        this.type = body.type
    }
}
module.exports = User;
