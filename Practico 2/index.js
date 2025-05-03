const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes JSON

// Datos mockeados en memoria
let usuarios = [
    { id: 1, nombre: "Juan", correo: "juan@example.com" },
    { id: 2, nombre: "María", correo: "maria@example.com" }
];

// GET - Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

// POST - Crear un nuevo usuario
app.post('/usuarios', (req, res) => {
    const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre: req.body.nombre, //body: informacion que va dentro de la solicitud post, get, etc
        correo: req.body.correo
    };
    usuarios.push(nuevoUsuario);
    /* Esto establece el código de estado HTTP de la respuesta en 201 Created.
    Es un estándar de la web:
    201 significa que un recurso fue creado exitosamente.
    .json(nuevoUsuario)
    Esto convierte el objeto nuevoUsuario a JSON (formato de texto) y lo envía
    como cuerpo de la respuesta. */
    res.status(201).json(nuevoUsuario);
});

// PUT - Actualizar un usuario existente por ID
app.put('/usuarios/:id', (req, res) => {
    /* Estas dos líneas te permiten capturar un ID desde la URL y encontrar al usuario correspondiente 
    dentro de mi array mockeado. */
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }

    //Actualiza el nombre y el correo del usuario con los datos del cuerpo de la solicitud (lo que envió el usuario)
    usuario.nombre = req.body.nombre || usuario.nombre;
    usuario.correo = req.body.correo || usuario.correo;

    res.json(usuario);
});

// DELETE - Eliminar un usuario por ID
app.delete('/usuarios/:id', (req, res) => {
    // Captura el ID desde la URL de la solicitud
    const id = parseInt(req.params.id);
    
    // Busca el índice del usuario con el ID proporcionado
    const index = usuarios.findIndex(u => u.id === id);

    // Si no se encuentra el usuario, devuelve un error 404
    if (index === -1) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Elimina el usuario del array de usuarios
    const usuarioEliminado = usuarios.splice(index, 1);

    // Responde con el usuario eliminado
    res.json({ message: "Usuario eliminado", usuario: usuarioEliminado[0] });
});

// Inicia el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});