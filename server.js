const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();


// Configuración de la base de datos
const dbConfig = {
    user: 'usr_DesaWeb',
    password: 'GuasTa360#',  // Cambia esto por la contraseña correcta
    server: 'svr-sql-ctezo.southcentralus.cloudapp.azure.com',
    database: 'db_banco',
    options: {
        encrypt: false  // Esto depende de tu configuración de SQL Server
    }
};

// Configuración de multer para manejar la carga de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Carpeta donde se almacenarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para la imagen
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));  // Sirve archivos estáticos como las imágenes

// Ruta principal para obtener productos según categoría o nombre
app.get('/api/productos', async (req, res) => {
    const { nombre, categoria } = req.query;

    let query = "SELECT * FROM Productos WHERE 1=1";

    if (nombre) {
        query += ` AND Nombre LIKE '%${nombre}%'`;
    }

    if (categoria) {
        query += ` AND Categoria = '${categoria}'`;
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para cargar una imagen
app.post('/api/upload', upload.single('imagen'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha cargado ninguna imagen.');
    }

    const imagenPath = '/uploads/' + req.file.filename; // Ruta de la imagen en el servidor

    try {
        const pool = await sql.connect(dbConfig);
        const query = `INSERT INTO Imagenes (Ruta) VALUES ('${imagenPath}')`;
        await pool.request().query(query);
        
        res.status(200).send({ message: 'Imagen cargada exitosamente', imagePath: imagenPath });
    } catch (error) {
        console.error('Error al cargar imagen:', error);
        res.status(500).send('Error al cargar la imagen');
    }
});

// Ruta para obtener todas las imágenes
app.get('/api/imagenes', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM Imagenes');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener imágenes:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para eliminar una imagen
app.delete('/api/imagenes/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`SELECT * FROM Imagenes WHERE Id = ${id}`);
        
        if (result.recordset.length === 0) {
            return res.status(404).send('Imagen no encontrada');
        }

        const imagePath = result.recordset[0].Ruta;
        const filePath = path.join(__dirname, 'public', imagePath);

        // Eliminar la imagen del sistema de archivos
        fs.unlink(filePath, async (err) => {
            if (err) {
                return res.status(500).send('Error al eliminar la imagen');
            }

            // Eliminar la imagen de la base de datos
            await pool.request().query(`DELETE FROM Imagenes WHERE Id = ${id}`);
            res.status(200).send('Imagen eliminada correctamente');
        });
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        res.status(500).send('Error al eliminar la imagen');
    }
});

// Ruta para manejar contactos enviados desde el formulario de contacto
app.post('/api/contacto', async (req, res) => {
    const { nombre, correo, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
        return res.status(400).send('Faltan datos');
    }

    try {
        const pool = await sql.connect(dbConfig);
        const query = `
            INSERT INTO Contacto (Nombre, Correo, Mensaje) 
            VALUES ('${nombre}', '${correo}', '${mensaje}')
        `;
        await pool.request().query(query);

        res.status(200).send('Contacto enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar contacto:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
