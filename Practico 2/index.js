const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes JSON

const { sequelize, Item } = require('./models');

//Sincronizar las tablas con la base de datos
sequelize.sync({ force: false }) // Cambiar a true si queres eliminar y volver a crear las tablas
    .then(() => {
        console.log('Conectado a la base de datos y tablas sincronizadas');
        // Inicia el servidor en el puerto 3000
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
    });

// GET - Obtener todos los items
app.get('/items', async(req, res) => {
    try {
        const items = await Item.findAll();
        res.json(items);
    } catch(error) {
        res.status(500).json({ error: "Error al obtener los items" });
    }
});

// POST - Crear un item
app.post('/items', async(req, res) => {
    try {
        const newItem = await Item.create({
            name: req.body.name,
            description: req.body.description,
            amount: req.body.amount,
        });
        res.status(201).json(newItem);
    } catch(error) {
        res.status(500).json({ error: "Error al crear el item" });
    }
});

// PUT - Modificar un item por ID
app.put('/items/:id', async(req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);

        if(!item) {
            return res.status(404).json({ error: "Item no encontrado" });
        }

        item.name = req.body.name || item.name;
        item.description = req.body.description || item.description;
        item.amount = req.body.amount || item.amount;

        await item.save();
        res.json(item);
    } catch(error) {
        res.status(500).json({ error: "Error al modificar el item" });
    }
});

// DELETE - Eliminar un usuario por ID
app.delete('/items/:id', async(req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);

        if(!item) {
            return res.status(404).json({ error: "Item no encontrado" });
        }

        await item.destroy();
        res.json({ message: "Item eliminado", item });
    } catch(error) {
        res.status(500).json({ error: "Error al eliminar el item" });
    }
});

