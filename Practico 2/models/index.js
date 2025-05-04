/* Es el núcleo de inicialización de Sequelize en tu proyecto. Su función es:
Configurar la conexión a la base de datos.
Cargar automáticamente todos los modelos definidos en la carpeta models.
Exportar todo listo para usarse en otras partes del proyecto (como los controladores o rutas). */

'use strict';

//Importar módulos necesarios
const fs = require('fs'); //Modulo para leer y manejar archivos
const path = require('path'); //Modulo para leer y manejar archivos
const Sequelize = require('sequelize'); //ORM que vas a usar
const process = require('process'); //Para acceder a variables de entorno.
const basename = path.basename(__filename); //Guarda el nombre de este archivo (index.js) para excluirlo al cargar modelos
const env = process.env.NODE_ENV || 'development'; //Define si estás en entorno 'development', 'production', etc.
const config = require(__dirname + '/../config/config.json')[env]; //Carga la configuración de conexión desde config/config.json
const db = {}; //Objeto final que contenga todos los modelos y la conexión.

//Conexion a la base de datos
let sequelize;
if (config.use_env_variable) { //Si use_env_variable está definido en el archivo config.json, se usa la conexión por variable de entorno (útil en producción).
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config); //En caso contrario, se conecta usando los datos explícitos (usuario, contraseña, base de datos) del archivo config.json.
}

//Carga dinamica de modelos
/* Lee todos los archivos .js dentro de la carpeta models, excepto este index.js y archivos de test.
Los importa como módulos, y les pasa la conexión sequelize.
Agrega cada modelo al objeto db usando su nombre como clave. */
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

//Asociación de modelos (si hay relaciones)
/* Si un modelo define asociaciones (associate(models)), las ejecuta ahora.
Por ejemplo: relaciones hasMany, belongsTo, etc. */

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//Exporta el objeto db
/* Exporta todo: los modelos + la instancia de conexión.
Desde otros archivos, podés hacer:
const { sequelize, Item } = require('./models');*/
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


/* En resumen, este archivo:
| Sección     | Función                                            |
| ----------- | -------------------------------------------------- |
| Conexión    | Conecta a la base de datos usando `config.json`    |
| Autocarga   | Lee todos los modelos `.js` automáticamente        |
| Asociación  | Aplica relaciones entre modelos si están definidas |
| Exportación | Deja todo accesible desde `require('./models')`    |
*/
