class Publication {
    constructor(body) {
        this.creation_date = body.creation_date,
        this.title = body.title,
        this.body_text = body.body_text,
        this.type = body.type
    }
}
module.exports = Publication;

