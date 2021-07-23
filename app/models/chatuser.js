'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chatuser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Role, {
        foreignKey: 'role',
        as: 'roles',
      })
    }
  };
  Chatuser.init({
    email: DataTypes.STRING,
    ip: DataTypes.STRING,
    socketId: DataTypes.STRING,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    role: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Chatuser',
  });
  return Chatuser;
};