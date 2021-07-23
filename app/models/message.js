'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Chatuser, {
        foreignKey: 'chatuserId',
        as: 'chatusers',
      })
    }
  };
  Message.init({
    role: DataTypes.INTEGER,
    chatuserId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    state: DataTypes.STRING,
    read: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};