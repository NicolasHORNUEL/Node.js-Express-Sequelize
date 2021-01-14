module.exports = (sequelize, Sequelize) => {
    const Student = sequelize.define("Students", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      birthdate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      bio: {
        type: Sequelize.STRING,
        allowNull: false
      },
      class: {
        type: Sequelize.STRING,
        allowNull: false
      },
    },{
        timestamps: false
    });
  
    return Student;
  };