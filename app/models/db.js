
// 3. Modifier le fichier db.js et introduire les méthodes du module sequelize après l'avoir importé
const dbConfig = require("../config/db.config");
const Sequelize = require ("sequelize");
const sequelize = new Sequelize(
  dbConfig.DB,        //database
  dbConfig.USER,      //user
  dbConfig.PASSWORD,  //password
  {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    logging: false
  }
);

// 4. Toujours dans le fichier db.js Créer l'objet "db" dans lequel on ajoute les objets "Sequelize" (le module lui même) la variable sequelize" définit dans l'étape précédente et contenant la connexion à la base de données.
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 6. Importer les models lessons.model.js et students.model.js dans le fichier db.config, ajouter les objets "lesson" et "student" dans l'object "db".
db.lessons = require("./lessons.models")(sequelize, Sequelize);
db.students = require("./students.models")(sequelize, Sequelize);
db.users = require("./users.models")(sequelize, Sequelize);
db.publications = require("./publications.models")(sequelize, Sequelize);
db.comments = require("./comments.models")(sequelize, Sequelize);
db.teachers = require("./teachers.models")(sequelize, Sequelize);

/* Relation - Type d'association - Exemple
One-to-One     : hasOne        : Un user a un profile.
one-to-Many    : hasMany       : Un user peut avoir plusieurs articles.
Many-to-One    : belongsTo     : Plusieurs articles appartiennent à un user.
Many-to-Many   : belongsToMany : Les Tags appartiennent aux articles.

// Relation Many-to-many :une table intermédiaire est créée : {through:'LessonStudents'}
*/

// User est en relation One-to-One avec Student et Teacher
db.students.hasOne(db.users);
db.users.belongsTo(db.students);
db.teachers.hasOne(db.users);
db.users.belongsTo(db.teachers);

// Student est en relation One-to-Many avec Publication
db.students.hasMany(db.publications);
db.publications.belongsTo(db.students);
// Student est en relation One-to-Many avec Comment
db.students.hasMany(db.comments);
db.comments.belongsTo(db.students);
// Student est en relation Many-to-Many avec Lesson
db.students.belongsToMany(db.lessons, {through: 'LessonStudents'})
db.lessons.belongsToMany(db.students, {through: 'LessonStudents'})
// Student est en relation Many-to-Many avec Student
db.students.belongsToMany(db.students, { as: 'Friend', through: 'StudentFriends' })
// Teacher est en relation One-to-Many avec Publication
db.teachers.hasMany(db.publications);
db.publications.belongsTo(db.teachers);
// Teacher est en relation One-to-Many avec Comment
db.teachers.hasMany(db.comments);
db.comments.belongsTo(db.teachers);
// Teacher est en relation Many-to-Many avec Lesson
db.teachers.belongsToMany(db.lessons, {through: 'LessonTeachers'})
db.lessons.belongsToMany(db.teachers, {through: 'LessonTeachers'})

// Publication est en relation One-to-Many avec Comment
db.publications.hasMany(db.comments);
db.comments.belongsTo(db.publications);

// Lesson est en relation One-to-Many avec Publication
db.lessons.hasMany(db.publications);
db.publications.belongsTo(db.lessons);


module.exports = db;