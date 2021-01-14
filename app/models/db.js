
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
  }
);

// 4. Toujours dans le fichier db.js Créer l'objet "db" dans lequel on ajoute les objets "Sequelize" (le module lui même) la variable sequelize" définit dans l'étape précédente et contenant la connexion à la base de données.
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 6. Importer les models lessons.model.js et students.model.js dans le fichier db.config, ajouter les objets "lesson" et "student" dans l'object "db".
db.lessons = require("./lessons.models")(sequelize, Sequelize);
db.students = require("./students.models")(sequelize, Sequelize);
db.users = require("./users.model")(sequelize, Sequelize);

// Relation One-to-One
db.students.hasOne(db.users);
db.users.belongsTo(db.students);

// Relation Many-to-many
// une table intermédiaire est créée : {through:'LessonStudents'}
db.students.belongsToMany(db.lessons, {through: 'LessonStudents'})
db.lessons.belongsToMany(db.students, {through: 'LessonStudents'})

module.exports = db;