/* Pour pouvoir utiliser sequelize, on doit créer des modèles Sequelize. Sous le dossier "models". On utilise pour cela la méthode sequelize define.
La fonction define('nom_de_la_table',{champs}) permet de définir un modèle et de la faire concorder avec la table correspondante dans la base de données. Cette méthode permet également de créer la table si elle n'existe pas.
Liste des DataTypes de Sequelise :
https://sequelize.org/v5/manual/data-types.html
On exporte ici une méthode anonyme qui prend en paramètre "sequelize" et "Sequelize". */

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    },{
        timestamps: false
    }); 
    return User;
  };