/* 5. Pour pouvoir utiliser sequelize, on doit créer des modèles Sequelize. On créé donc deux modèles sequelize dans les fichiers lessons.model.js et students.model.js sous le dossier "models". On utilise pour cela la méthode sequelize define.

La fonction define('nom_de_la_table',{champs}) permet de définir un modèle et de la faire concorder avec la table correspondante dans la base de données. Cette méthode permet également de créer la table si elle n'existe pas.

Liste des DataTypes de Sequelise :
https://sequelize.org/v5/manual/data-types.html

On exporte ici une méthode anonyme qui prend en paramètre "sequelize" et "Sequelize". */

module.exports = (sequelize, Sequelize) => {
    const Lesson = sequelize.define("Lessons", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hours: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      teacher: {
        type: Sequelize.STRING,
        allowNull: false
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      starting_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ending_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
    },{
        timestamps: false
    });
  
    return Lesson;
  };