/*Este archivo es una migración de Sequelize. Su propósito es crear o eliminar la tabla Items en tu base de datos mediante comandos, permitiéndote 
mantener un control de versiones del esquema de tu base de datos.*/

'use strict'; //Impide ciertos errores silenciosos.
/** @type {import('sequelize-cli').Migration} */ //ayuda al editor a darte autocompletado e información del tipo Migration
module.exports = {
  async up(queryInterface, Sequelize) { //Define el método up, que Sequelize ejecutará cuando uses el comando: npx sequelize-cli db:migrate --> Este método se usa para aplicar cambios (crear tabla, columnas, relaciones, etc.).
    await queryInterface.createTable('Items', { //Crea la tabla Items
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      amount: {
        type: Sequelize.INTEGER
      },
      createdAt: { //Columnas de auditoría (createdAt, updatedAt) para registrar cuándo se crea o modifica una fila.
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) { //Este método revierte lo hecho en up. Se ejecuta cuando corrés: npx sequelize-cli db:migrate:undo --> Sirve para deshacer una migración, útil en desarrollo o en caso de errores.
    await queryInterface.dropTable('Items');
  }
};

/* En resumen, este archivo:
| Método | Qué hace                                             |
| ------ | ---------------------------------------------------- |
| `up`   | Crea la tabla `Items` con columnas y tipos definidos |
| `down` | Elimina la tabla `Items`                             |
 */