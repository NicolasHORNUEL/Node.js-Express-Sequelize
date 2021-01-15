// ------------- SEQUELIZE et MYSQL2 -------------------
// https://bezkoder.com/node-js-express-sequelize-mysql/

// 1. Installer les modules nécessaires pour Sequelize :
// npm init
// npm sequelize mysql2 --save

// 2. Ajouter le paramètre dialect :"mysql"
module.exports = {
    HOST:"localhost",
    USER: 'root',
    PASSWORD:'Nicoboy%357',
    DB:'sequelizedb',
    DIALECT: 'mysql'
};
