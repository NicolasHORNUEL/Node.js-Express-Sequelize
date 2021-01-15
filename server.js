
// 7. Ajouter la méthode db.sequelize.sync(); dans le fichier server.js
// Explication : La méthode sync() permet de synchroniser les models sequelize avec la base de données.
//    npm install express --save
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.listen(3000);

const db = require("./app/models/db");
db.sequelize.sync(console.log("db.sequelize.sync démarré"));

let lessons = require('./app/routers/lessons.router');
let students = require('./app/routers/students.router');
let users = require('./app/routers/users.router');
let teachers = require('./app/routers/teachers.router');

app.use('/lessons', lessons)
app.use('/students', students)
app.use('/auth', users)
app.use('/teachers', teachers)
app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-type, Accept"
    );
    next();
}
)


