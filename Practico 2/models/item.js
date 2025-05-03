'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Item.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Se autoincrementará
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Hacemos que el nombre sea obligatorio
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // Descripción es opcional
    },
    amount: {
      type: DataTypes.FLOAT, // Cambié a FLOAT por si los valores de amount son decimales
      allowNull: false, // Hacemos que el monto sea obligatorio
    }
  }, {
    sequelize,
    modelName: 'Item',
    tableName: 'items',
  });
  return Item;
};