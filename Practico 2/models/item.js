/*Define el modelo Sequelize llamado Item, y se encarga de estructurar cómo se verá
la tabla items en tu base de datos PostgreSQL
Este archivo:
Define una clase Item que extiende de Sequelize.Model.
Utiliza init() para declarar los campos de la tabla.
Exporta una función que registra el modelo con la instancia de Sequelize que llega desde models/index.js.*/

'use strict';
const { Model } = require('sequelize'); //Activa el modo estricto y extrae la clase Model de Sequelize, que vas a extender.
/* Aquí estás exportando una función que define y registra el modelo.
Item hereda de Model de Sequelize.
El método associate(models) queda disponible para definir relaciones con otros modelos más adelante
 (por ejemplo, Item.belongsTo(User) si lo necesitás en el futuro). */
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Aquí se pueden definir relaciones si las hay
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
    sequelize, //Se pasa la instancia de conexión.
    modelName: 'Item', 
    tableName: 'items', //La tabla se llamará items explícitamente (sin pluralización automática).
  });
  return Item; //Devuelve el modelo definido, que luego será recogido automáticamente por models/index.js y agregado al objeto db.
};