/* Este archivo está configurado para crear un servidor Express, conectar con la base de datos mediante Sequelize, y tener
 cuatro endpoints que manejan operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre el modelo Item. */


//Configuración de Express y Middleware
const express = require('express'); //Carga el framework Express.
const app = express(); //Crea una instancia de la aplicación Express.
const PORT = 3000; //Establece el puerto en el que el servidor escuchará (3000).

/* Middleware de Express para parsear automáticamente las solicitudes POST que contengan datos en formato JSON 
(útil para cuando recibes datos en el cuerpo de la solicitud, como en el POST y PUT). */
app.use(express.json());


//Conexión con la base de datos y sincronización de tablas
const { sequelize, Item } = require('./models');

//Sincronizar las tablas con la base de datos
// Este comando sincroniza el modelo con la base de datos.
sequelize.sync({ force: false }) // Cambiar a true si queres eliminar y volver a crear las tablas
    .then(() => { //Si la conexión es exitosa y las tablas se sincronizan, se inicia el servidor en el puerto 3000 y muestra un mensaje de éxito.
        console.log('Conectado a la base de datos y tablas sincronizadas');
        // Inicia el servidor en el puerto 3000
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((error) => { //Si hay algún error en la conexión con la base de datos, se captura y se muestra un mensaje de error.
        console.error('Error al conectar a la base de datos:', error);
    });

// GET - Obtener todos los items
/* Item.findAll() es una promesa devuelta por Sequelize.
await espera a que esa promesa se resuelva antes de continuar. */
app.get('/items', async(req, res) => { //Define el endpoint que responde a las solicitudes GET en la ruta /items.
    try {
        const items = await Item.findAll(); //Utiliza el modelo Item para obtener todos los elementos de la base de datos.
        res.json(items); //Si todo sale bien, se responde con el resultado en formato JSON (todos los items).
    } catch(error) { //Si ocurre un error, se captura y responde con un código de estado 500 (Error interno del servidor) y un mensaje.
        res.status(500).json({ error: "Error al obtener los items" });
    }
});

// POST - Crear un item
app.post('/items', async(req, res) => { //Define el endpoint para las solicitudes POST en la ruta /items.
    try {
        const newItem = await Item.create({ //Crea un nuevo registro en la base de datos con los datos recibidos en el cuerpo de la solicitud.
            //Accede a los datos enviados en el cuerpo de la solicitud (es decir, los datos JSON que mandes al crear un nuevo item).
            name: req.body.name, 
            description: req.body.description,
            amount: req.body.amount,
        });
        res.status(201).json(newItem); //Si el item se crea exitosamente, responde con el nuevo item y el código de estado 201 (creado).
    } catch(error) {
        res.status(500).json({ error: "Error al crear el item" }); //Si hay un error durante la creación, responde con el código de estado 500 y un mensaje de error.
    }
});

// PUT - Modificar un item por ID
app.put('/items/:id', async(req, res) => { //Define el endpoint para la solicitud PUT en la ruta /items/:id, donde :id es un parámetro que representa el ID del item que quieres modificar.
    try {
        const item = await Item.findByPk(req.params.id); //Busca el item en la base de datos usando el ID proporcionado en la URL.

        // Si no se encuentra el item, responde con el código 404 (no encontrado).
        if(!item) {
            return res.status(404).json({ error: "Item no encontrado" });
        }

        item.name = req.body.name || item.name;
        item.description = req.body.description || item.description;
        item.amount = req.body.amount || item.amount;

        await item.save(); //Si el item existe, actualiza sus valores y los guarda en la base de datos.
        res.json(item); //Devuelve el item actualizado
    } catch(error) {
        res.status(500).json({ error: "Error al modificar el item" }); //Si hay un error, responde con el código 500 y un mensaje de error.
    }
});

// DELETE - Eliminar un usuario por ID
app.delete('/items/:id', async(req, res) => { //Define el endpoint para las solicitudes DELETE en la ruta /items/:id, donde :id es el parámetro del ID del item que quieres eliminar.
    try {
        const item = await Item.findByPk(req.params.id);

        if(!item) {
            return res.status(404).json({ error: "Item no encontrado" });
        }

        await item.destroy(); // Si se encuentra el item, lo elimina de la base de datos.
        res.json({ message: "Item eliminado", item }); //Responde con un mensaje de éxito y el item eliminado.
    } catch(error) {
        res.status(500).json({ error: "Error al eliminar el item" });
    }
});


/* ¿Por qué es necesario async?
En Node.js (y en JavaScript moderno en general), muchas operaciones son asincrónicas, es decir, no se ejecutan de forma secuencial directa. Esto incluye:

--> Consultas a bases de datos (Item.findAll(), Item.create(), etc.).
--> Lectura y escritura de archivos.
--> Solicitudes HTTP.
--> Llamadas a servicios externos. 

Entonces:
async (req, res) => { ... }
Permite usar await para escribir código asincrónico que parece síncrono, manteniéndolo más claro, corto y fácil de depurar.*/
