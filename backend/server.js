// npm init
// npm instal mysql express
//npm cors

// Initialize Express app
const express = require('express');
const app = express();
const mysql = require('mysql');
const port = process.env.PORT || 3001;  // Corrected: Use uppercase for environment variables

const bcrypt = require('bcryptjs'); // Para encriptar y comparar contraseñas


const cors = require('cors');
app.use(cors());
app.use(express.json());

// Set up MySQL connection pooling for better performance
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bd_librarysm',
    connectionLimit: 10,  // Set a pool size limit (you can adjust based on your needs)
});

// Test database connection at the start to ensure the server can connect
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database!');
    connection.release();  // Always release the connection back to the pool after use
});

////////users///////////////////////////////
//instruccion para tomar los datos enviados desde el formulario con la ruta 
app.post('/add_users', (req, res) => {
    const cedula = req.body.cedula;
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const telefono = req.body.telefono;

    //query para enviar los datos a la base de datos
    db.query('Insert into users (cedula,nombre,direccion,telefono) values(?,?,?,?)', [cedula, nombre, direccion, telefono],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Registro Exitoso!!!!!!!");
            }
        }
    );
})



app.put('/update_users', (req, res) => {
    const { idUser, cedula, nombre, direccion, telefono } = req.body;


    //query para enviar los datos a la base de datos
    db.query('update users set cedula=?, nombre=?, direccion=?, telefono=? where usuarioId=?', [cedula, nombre, direccion, telefono, idUser],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Registro Actualizado  !!!!!!!");
            }
        }
    );
})

app.delete('/delete_users/:id', (req, res) => {
    // Extraer el id de los parámetros de la solicitud
    const { id } = req.params;

    // Ejecutar la consulta
    db.query('DELETE FROM users WHERE usuarioId = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el usuario:', err);
            return res.status(500).json({ error: 'Error al eliminar el usuario' });
        } else {
            res.json(result);
        }
    });
});

app.get('/get_users', (req, res) => {
    //query para seleccionar los datos a la base de datos
    db.query('select * from users ',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
})

/////////////fin users ////////////////////////////////


///////////////////////Autor

// Agregar un autor
app.post('/add_autores', (req, res) => {
    const nombreAutor = req.body.nombreAutor;
    const apellidoAutor = req.body.apellidoAutor;
    console.log('Autor' + nombreAutor);
    db.query('INSERT INTO autor (nombreAutor, apellidoAutor) VALUES (?, ?)', [nombreAutor, apellidoAutor], (err, result) => {
        if (err) {
            console.error('Error al agregar el autor:', err);
            res.status(500).send('Error al agregar el autor');
        } else {
            res.send('Autor agregado exitosamente');
        }
    });
});

app.get('/get_autores', (req, res) => {
    //query para seleccionar los datos a la base de datos
    db.query('select * from autor ',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
})
// Endpoint para actualizar un autor
app.put('/update_autor', (req, res) => {
    const { autorId, nombreAutor, apellidoAutor } = req.body;
    db.query('UPDATE autor SET nombreAutor = ?, apellidoAutor = ? WHERE autorId = ?', [nombreAutor, apellidoAutor, autorId],
        (err, result) => {
            if (err) {
                console.error('Error al actualizar el autor:', err);
                return res.status(500).send('Error al actualizar el autor.');
            }
            if (result.affectedRows === 0) {
                return res.status(404).send('Autor no encontrado.');
            }
            res.send('Autor actualizado con éxito.');
        }
    );
});

// Endpoint para eliminar un autor
app.delete('/delete_autor/:autorId', (req, res) => {
    const autorId = req.params.autorId;

    db.query(
        'DELETE FROM autor WHERE autorId = ?',
        [autorId],
        (err, result) => {
            if (err) {
                console.error('Error al eliminar el autor:', err);
                return res.status(500).send('Error al eliminar el autor.');
            }
            if (result.affectedRows === 0) {
                return res.status(404).send('Autor no encontrado.');
            }
            res.send('Autor eliminado con éxito.');
        }
    );
});

///////////////////////fin Autor


////EDITORIALES      
// Endpoint get editorial
app.get('/get_editoriales', (req, res) => {
    //query para seleccionar los datos a la base de datos
    db.query('select * from editorial ',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
})


// Endpoint ADD editorial
app.post('/add_editoriales', (req, res) => {
    // Extract data from request body
    const nombreEditorial = req.body.nombreEditorial;
    const direccionEditorial = req.body.direccionEditorial;
    const telefonoEditorial = req.body.telefonoEditorial;

    // Debugging information (Optional, remove in production)
    console.log(nombreEditorial, direccionEditorial, telefonoEditorial);

    // Insert data into the database
    db.query('INSERT INTO editorial (nombreEditorial, direccionEditorial, telefonoEditorial) VALUES (?, ?, ?)', [nombreEditorial, direccionEditorial, telefonoEditorial], (err, result) => {
        if (err) {
            // Log error and send error response
            console.error('Error al agregar el editorial:', err);
            res.status(500).send('Error al agregar el editorial');
        } else {
            // Send success response
            res.send('Editorial agregado exitosamente');
        }
    });
});

// Endpoint para actualizar un autor
app.put('/update_editoriales', (req, res) => {
    const { editorialId, nombreEditorial, direccionEditorial, telefonoEditorial } = req.body;

    db.query('UPDATE editorial SET nombreEditorial = ?, direccionEditorial = ?, telefonoEditorial=? WHERE editorialId = ?',
        [nombreEditorial, direccionEditorial, telefonoEditorial, editorialId],
        (err, result) => {
            if (err) {
                console.error('Error al actualizar el Editorial:', err);
                return res.status(500).send('Error al actualizar el Editorial.');
            }
            if (result.affectedRows === 0) {
                return res.status(404).send('Editorial no encontrado.');
            }
            res.send('Editorial actualizado con éxito.');
        }
    );
});

// Endpoint para eliminar un editorial
app.delete('/delete_editoriales/:editorialId', (req, res) => {
    // Extraer el id de los parámetros de la solicitud
    const { editorialId } = req.params;

    // Ejecutar la consulta
    db.query('DELETE FROM editorial WHERE editorialId = ?', [editorialId], (err, result) => {
        if (err) {
            console.error('Error al eliminar el Editorial:', err);
            return res.status(500).json({ error: 'Error al eliminar el editorial' });
        } else {
            res.json(result);
        }
    });
});


// -----------  LIBROS ----------------
// Endpoint para obtener libros
app.get('/get_libros', (req, res) => {
    //query para seleccionar los datos a la base de datos
    db.query(`SELECT l.libroId, l.nombreLibro, l.editorialId, l.autorId, l.cantidad, l.fechaCreacion, l.observacion,
        e.nombreEditorial AS nombreEditorial , 
        a.nombreAutor AS nombreAutor , a.apellidoAutor AS apellidoAutor 
       		 FROM libro l
        			INNER JOIN  editorial e
                    		ON l.editorialId = e.editorialId 
        			INNER JOIN autor a
                    		ON l.autorId = a.autorId order by l.libroId asc`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
})

app.get('/get_libros_autores', (req, res) => {
    //query para seleccionar los datos a la base de datos
    db.query(`SELECT * from autor`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
})

app.get('/get_libros_editoriales', (req, res) => {
    //query para seleccionar los datos a la base de datos
    db.query(`SELECT * from editorial`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
})



// Endpoint ADD libro
app.post('/add_libro', (req, res) => {
    const { nombrelibro, nombreeditorial, nombreautor, cantidad, fecha } = req.body;

    console.log({
        nombrelibro,
        nombreeditorial,
        nombreautor,
        cantidad,
        fecha
    });

    db.query(
        `INSERT INTO libro (nombreLibro, editorialId, autorId, cantidad, fechaCreacion) 
       VALUES (?, ?, ?, ?, ?)`,
        [nombrelibro, nombreeditorial, nombreautor, cantidad, fecha],
        (err, result) => {
            if (err) {
                console.error('Error al agregar el libro:', err);
                return res.status(500).send('Error al agregar el libro');
            }
            res.send('Libro agregado exitosamente');
        }
    );
});

// Endpoint para actualizar un libro
app.put('/update_libro', (req, res) => {
   
    const { libroid, nombrelibro, editorialid, autorid, cantidad, fecha, observacion} = req.body;

    if (!libroid || !nombrelibro || !cantidad || !fecha ) {
        return res.status(400).send('Todos los campos son requeridos.');
    }

    db.query(
        'UPDATE libro SET nombreLibro = ?, cantidad = ?, fechaCreacion = ? ,observacion = ?  WHERE libroId = ?' ,
        [nombrelibro, cantidad, fecha, observacion, libroid],
        (err, result) => {
            if (err) {
                console.error('Error al actualizar el Libro:', err);
                return res.status(500).send('Error al actualizar el Libro.');
            }
            if (result.affectedRows === 0) {
                return res.status(404).send('Libro no encontrado.');
            }
            res.send('Libro actualizado con éxito.');
        }
    );
});


// Endpoint para eliminar un libro
app.delete('/delete_libros/:libroId', (req, res) => {
    // Extraer el id de los parámetros de la solicitud
    const { libroId } = req.params;

    // Ejecutar la consulta
    db.query('DELETE FROM libro WHERE libroid=?', [libroId], (err, result) => {
        if (err) {
            console.error('Error al eliminar el libro:' + id, err);
            return res.status(500).json({ error: 'Error al eliminar el libro' });
        } else {
            res.send(result);
        }
    });
});


///----------------PRESTAMOS

// Endpoint get editorial
app.get('/get_prestamos', (req, res) => {
    //query para seleccionar los datos a la base de datos
    db.query(`SELECT p.prestamoId, p.usuarioId, p.libroId, p.estado, p.fechaFin, p.fechaCreacion, u.nombre as nombusu, l.nombrelibro as nomblibro FROM prestamo p INNER JOIN users u ON p.usuarioId = u.usuarioId INNER JOIN libro l ON p.libroId=l.libroId ORDER BY prestamoId ASC;
`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
})

// Endpoint ADD prestamo
app.post('/add_prestamo', (req, res) => {
    const { usuario, libro, estado, fechaprestamo, fechadevolucion } = req.body;

    console.log({
        usuario,
        libro,
        estado,
        fechaprestamo,
        fechadevolucion
    });

    db.query(`INSERT INTO prestamo (usuarioId, libroId, estado, fechaFin,fechaCreacion) 
       VALUES (?, ?, ?, ?, ?)`,
        [usuario, libro, estado, fechaprestamo, fechadevolucion],
        (err, result) => {
            if (err) {
                console.error('Error al agregar el prestamo:', err);
                return res.status(500).send('Error al agregar el prestamo');
            }
            res.send('prestamo agregado exitosamente');
        }
    );
});


// Endpoint para actualizar un prestamo
app.put('/update_prestamo', (req, res) => {
    const { Prestamoid, usuario, libro, estado, FechaPrestamo, FechaDevolucion} = req.body;

    if (!Prestamoid ) {
        return res.status(400).send('El ID de Prestamo no Viajo al backend');
    }

    db.query(
        'UPDATE prestamo SET estado = ?,fechaCreacion = ?, fechaFin = ? WHERE prestamoId = ?',
        [estado,FechaPrestamo, FechaDevolucion, Prestamoid],
        (err, result) => {
            if (err) {
                console.error('Error al actualizar el Prestamo:', err);
                return res.status(500).send('Error al actualizar el Libro.');
            }
            if (result.affectedRows === 0) {
                return res.status(404).send('Prestamo no encontrado.');
            }
            res.send('Prestamo actualizado con éxito.');
        }
    );
});

// Endpoint para eliminar un prestamo
app.delete('/delete_prestamo/:prestamoid', (req, res) => {
    // Extraer el id de los parámetros de la solicitud
    const { prestamoid } = req.params;

    // Ejecutar la consulta
    db.query('DELETE FROM prestamo WHERE prestamoid=?', [prestamoid], (err, result) => {
        if (err) {
            console.error('Error al eliminar el PRESTAMO:' + id, err);
            return res.status(500).json({ error: 'Error al eliminar el PRESTAMO' });
        } else {
            res.json(result);
        }
    });
});



// Endpoint para manejar el login
app.post('/login_admon', (req, res) => {
    const { email, password } = req.body; // Extraemos correo y contraseña del cuerpo de la solicitud

    console.log({ email, password });

    // Consulta para obtener el usuario por el correo
    const query = 'SELECT * FROM usersAdmon WHERE correo = ?';

    db.query(query, [email], (err, results) => {
        if (err) {
            console.log('Error en la base de datos:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        // Si no se encuentra el usuario, respondemos con error
        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'Correo o contraseña incorrectos' });
        }

        // Tomamos el primer usuario encontrado
        const user = results[0];

        // Comparamos la contraseña encriptada con la proporcionada
        bcrypt.compare(password, user.contrasena, (err, isMatch) => {
            if (err) {
                console.log('Error al comparar contraseñas:', err);
                return res.status(500).json({ success: false, message: 'Error al comparar contraseñas' });
            }

            // Si las contraseñas coinciden
            if (isMatch) {
                // Si el login es exitoso, respondemos con un mensaje de éxito y un token JWT (si usas JWT)
                return res.json({ success: true, message: 'Login exitoso', token: 'some-token' });
            } else {
                return res.status(400).json({ success: false, message: 'Correo o contraseña incorrectos' });
            }
        });
    });
});



// Start the Express server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});