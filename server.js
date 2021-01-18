// npm init
// npm install express sequelize body-parser mysql2 jsonwebtoken bcrypt --save

const express = require('express');
const bodyParser = require('body-parser');
const db = require("./app/models/db");
const lessons = require('./app/routers/lessons.router');
const students = require('./app/routers/students.router');
const users = require('./app/routers/users.router');
const teachers = require('./app/routers/teachers.router');
const publications = require("./app/routers/publications.router");
const comments = require("./app/routers/comments.router");

const app = express();
app.use(bodyParser.json()); // ajouter bodyParser comme middleware
db.sequelize.sync(console.log("db.sequelize.sync démarré"));
app.listen(3000);

app.use('/lessons', lessons);
app.use('/students', students);
app.use('/auth', users);
app.use('/teachers', teachers);
app.use('/publications', publications);
app.use('/publications', comments);


