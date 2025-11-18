const db = require('../../conexion');
const fileUpload = require("express-fileupload");
const path = require('path');
const fs = require("fs");
const directorio = path.join(__dirname, "..", "..", "uploads", "portadas");
const BASE_URL = 'http://localhost:3000';
if (!fs.existsSync(directorio)){
    fs.mkdirSync(directorio, { recursive: true });
}

const transformarLibro = (libro) => {
    if (libro.url_portada && !libro.url_portada.startsWith('http')) {
        libro.url_portada = `${BASE_URL}${libro.url_portada}`;
    }
    return libro;
};

// GET /api/libros - Listar todos los libros con información completa
exports.listar = async function(req, res, next) {
    const { random, promedio, busqueda, autor_id, editorial_id, genero_id } = req.query;

    try {
        if (random){
            const sqlRandom= `
            SELECT
                id,
                titulo,
                url_portada
            FROM
                Libro
            ORDER BY
                RAND()
            LIMIT 6;
            `
            const [libros] = await db.query(sqlRandom);
            
            const librosTransformados = libros.map(transformarLibro);
            
            return res.json({ 
                status: 'ok', 
                libros: librosTransformados,
                total: librosTransformados.length 
            });
        }

        if (promedio) {
            const sqlPromedio = `
                SELECT
                    L.id,
                    L.titulo,
                    L.url_portada,
                    AVG(R.puntuacion) AS promedio_puntuacion
                FROM
                    Resena AS R
                    JOIN Libro AS L ON R.libro_id = L.id
                GROUP BY
                    L.id, L.titulo, L.url_portada
                ORDER BY
                    promedio_puntuacion DESC
                LIMIT 6;
            `;
            
            const [libros] = await db.query(sqlPromedio);
            
            const librosTransformados = libros.map(transformarLibro);

            return res.json({ 
                status: 'ok', 
                libros: librosTransformados, 
                total: librosTransformados.length 
            });
        } 
        
        const isAdmin = req.usuario && req.usuario.rol === 'admin';
        if ((autor_id || editorial_id || genero_id) && !isAdmin) {
            return res.status(403).json({
                error: 'Acceso denegado',
                message: 'Los filtros por autor, editorial y género están disponibles solo para administradores'
            });
        }

        let sql = `
            SELECT 
                l.id, l.titulo, l.isbn, l.sinopsis, l.url_portada, 
                l.paginas, l.anio_publicacion,
                a.id as autor_id, a.nombre as autor_nombre, a.apellido as autor_apellido,
                e.id as editorial_id, e.nombre as editorial_nombre,
                GROUP_CONCAT(
                    DISTINCT CONCAT(g.id, ':', g.nombre) 
                    ORDER BY g.nombre 
                    SEPARATOR '|'
                ) as generos_concatenados
            FROM Libro l
            LEFT JOIN Autor a ON l.autor_id = a.id
            LEFT JOIN Editorial e ON l.editorial_id = e.id
            LEFT JOIN LibroGenero lg ON l.id = lg.libro_id
            LEFT JOIN Genero g ON lg.genero_id = g.id
        `;
        
        let conditions = [];
        let params = [];
        
        if (busqueda) {
            conditions.push("(l.titulo LIKE ? OR l.isbn LIKE ? OR a.nombre LIKE ? OR a.apellido LIKE ?)");
            const busquedaParcial = `%${busqueda}%`;
            params.push(busquedaParcial, busquedaParcial, busquedaParcial, busquedaParcial);
        }
        
        if (isAdmin && autor_id) {
            conditions.push("l.autor_id = ?");
            params.push(autor_id);
        }
        
        if (isAdmin && editorial_id) {
            conditions.push("l.editorial_id = ?");
            params.push(editorial_id);
        }
        
        if (isAdmin && genero_id) {
            conditions.push("l.id IN (SELECT libro_id FROM LibroGenero WHERE genero_id = ?)");
            params.push(genero_id);
        }
        
        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }
        
        sql += " GROUP BY l.id, l.titulo, l.isbn, l.sinopsis, l.url_portada, l.paginas, l.anio_publicacion, a.id, a.nombre, a.apellido, e.id, e.nombre";
        sql += " ORDER BY l.titulo";

        const [libros] = await db.query(sql, params);
        
        const librosConGeneros = libros.map(libro => {
            let generos = [];
            if (libro.generos_concatenados) {
                generos = libro.generos_concatenados.split('|').map(item => {
                    const [id, nombre] = item.split(':');
                    return { id: parseInt(id), nombre };
                });
            }
            
            const { generos_concatenados, ...libroSinConcatenados } = libro;
            
            return transformarLibro({
                ...libroSinConcatenados,
                generos
            });
        });
            
        res.json({ 
            status: 'ok', 
            libros: librosConGeneros, 
            total: librosConGeneros.length 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener libros' 
        });
    }
};

// GET /api/libros/:id - Obtener un libro específico
exports.obtener = async function(req, res, next) {
    const { id } = req.params;

    try {
        const sql = `
            SELECT 
                l.id, l.titulo, l.isbn, l.sinopsis, l.url_portada, 
                l.paginas, l.anio_publicacion,
                a.id as autor_id, a.nombre as autor_nombre, 
                a.apellido as autor_apellido, a.nacionalidad as autor_nacionalidad,
                e.id as editorial_id, e.nombre as editorial_nombre, e.pais as editorial_pais
            FROM Libro l
            LEFT JOIN Autor a ON l.autor_id = a.id
            LEFT JOIN Editorial e ON l.editorial_id = e.id
            WHERE l.id = ?
        `;
        const [rows] = await db.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ 
                error: 'Libro no encontrado',
                message: 'No existe un libro con ese ID' 
            });
        }

        const libro = transformarLibro(rows[0]);

        const [generos] = await db.query(`
            SELECT g.id, g.nombre, g.descripcion 
            FROM Genero g
            INNER JOIN LibroGenero lg ON g.id = lg.genero_id
            WHERE lg.libro_id = ?
        `, [id]);

        libro.generos = generos;

        res.json(libro); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener el libro' 
        });
    }
};

// POST /api/libros - Crear un nuevo libro
exports.crear = [
    fileUpload(),
    async function(req, res, next) {
        const { 
            titulo, isbn, sinopsis, paginas, anio_publicacion, 
            autor_id, editorial_id
        } = req.body;

        let generos = req.body['generos[]'];
        
        if (generos && !Array.isArray(generos)) {
            generos = [generos];
        }

        console.log('📦 Datos recibidos:', { titulo, autor_id, editorial_id, generos });

        // Validaciones
        if (!titulo) {
            return res.status(400).json({ 
                error: 'Datos incompletos',
                message: 'El título del libro es requerido' 
            });
        }

        if (!req.files || !req.files.portada) {
            return res.status(400).json({ 
                error: 'No hay archivo',
                message: 'Debe enviar un archivo con el nombre "portada"' 
            });
        }

        const { portada } = req.files;

        const extension = path.extname(portada.name).toLowerCase();
        const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        
        if (!extensionesPermitidas.includes(extension)) {
            return res.status(400).json({ 
                error: 'Archivo no permitido',
                message: 'Solo se permiten imágenes (jpg, jpeg, png, gif, webp)' 
            });
        }

        const maxSize = 5 * 1024 * 1024;
        if (portada.size > maxSize) {
            return res.status(400).json({ 
                error: 'Archivo muy grande',
                message: 'El archivo no debe superar los 5MB' 
            });
        }

        try {
            const nombreArchivo = `portada_${Date.now()}${extension}`;
            const filepath = path.join(directorio, nombreArchivo);
            
            await portada.mv(filepath);

            const sql = `
                INSERT INTO Libro 
                (titulo, isbn, sinopsis, url_portada, paginas, anio_publicacion, autor_id, editorial_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const [result] = await db.query(sql, [
                titulo.trim(),
                isbn ? isbn.trim() : null,
                sinopsis ? sinopsis.trim() : null,
                `/uploads/portadas/${nombreArchivo}`,
                paginas || null,
                anio_publicacion || null,
                autor_id || null,
                editorial_id || null
            ]);

            const libroId = result.insertId;

            if (generos && Array.isArray(generos) && generos.length > 0) {
                const sqlGeneros = "INSERT INTO LibroGenero (libro_id, genero_id) VALUES ?";
                const valuesGeneros = generos.map(genero_id => [libroId, parseInt(genero_id)]);
                await db.query(sqlGeneros, [valuesGeneros]);
                console.log('✅ Géneros insertados:', valuesGeneros);
            }

            res.status(201).json({ 
                status: 'ok',
                message: 'Libro creado exitosamente',
                id: libroId
            });
        } catch (error) {
            console.error('❌ Error al crear libro:', error);
            res.status(500).json({ 
                error: 'Error del servidor',
                message: 'Error al crear el libro' 
            });
        }
    }
];

// PUT /api/libros/:id - Actualizar un libro
exports.actualizar = async function(req, res, next) {
    const { id } = req.params;
    const { 
        titulo, isbn, sinopsis, url_portada, 
        paginas, anio_publicacion, 
        autor_id, editorial_id, generos 
    } = req.body;

    if (!titulo && !isbn && !sinopsis && url_portada === undefined && 
        !paginas && !anio_publicacion && autor_id === undefined && editorial_id === undefined && !generos) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'Debe proporcionar al menos un campo para actualizar' 
        });
    }

    try {
        const updates = [];
        const params = [];

        if (titulo) {
            if (titulo.trim().length < 1) {
                return res.status(400).json({ 
                    error: 'Título inválido',
                    message: 'El título no puede estar vacío' 
                });
            }
            updates.push("titulo = ?");
            params.push(titulo.trim());
        }

        if (isbn !== undefined) {
            updates.push("isbn = ?");
            params.push(isbn ? isbn.trim() : null);
        }

        if (sinopsis !== undefined) {
            updates.push("sinopsis = ?");
            params.push(sinopsis ? sinopsis.trim() : null);
        }

        if (url_portada !== undefined) {
            updates.push("url_portada = ?");
            params.push(url_portada ? url_portada.trim() : null);
        }

        if (paginas !== undefined) {
            updates.push("paginas = ?");
            params.push(paginas || null);
        }

        if (anio_publicacion !== undefined) {
            updates.push("anio_publicacion = ?");
            params.push(anio_publicacion || null);
        }

        if (autor_id !== undefined) {
            if (autor_id) {
                const [autor] = await db.query("SELECT id FROM Autor WHERE id = ?", [autor_id]);
                if (autor.length === 0) {
                    return res.status(404).json({ 
                        error: 'Autor no encontrado',
                        message: 'El autor especificado no existe' 
                    });
                }
            }
            updates.push("autor_id = ?");
            params.push(autor_id || null);
        }

        if (editorial_id !== undefined) {
            if (editorial_id) {
                const [editorial] = await db.query("SELECT id FROM Editorial WHERE id = ?", [editorial_id]);
                if (editorial.length === 0) {
                    return res.status(404).json({ 
                        error: 'Editorial no encontrada',
                        message: 'La editorial especificada no existe' 
                    });
                }
            }
            updates.push("editorial_id = ?");
            params.push(editorial_id || null);
        }

        // Actualizar libro si hay cambios en los campos básicos
        if (updates.length > 0) {
            const sql = `UPDATE Libro SET ${updates.join(", ")} WHERE id = ?`;
            params.push(id);
            const [result] = await db.query(sql, params);

            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    error: 'Libro no encontrado',
                    message: 'No existe un libro con ese ID' 
                });
            }
        }

        // Actualizar géneros si se proporcionan
        if (generos && Array.isArray(generos)) {
            // Eliminar géneros existentes
            await db.query("DELETE FROM LibroGenero WHERE libro_id = ?", [id]);
            
            // Insertar nuevos géneros
            if (generos.length > 0) {
                const sqlGeneros = "INSERT INTO LibroGenero (libro_id, genero_id) VALUES ?";
                const valuesGeneros = generos.map(genero_id => [id, genero_id]);
                await db.query(sqlGeneros, [valuesGeneros]);
            }
        }

        res.json({ 
            status: 'ok',
            message: 'Libro actualizado exitosamente' 
        });
    } catch (error) {
        console.error(error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
                error: 'ISBN duplicado',
                message: 'Ya existe un libro con ese ISBN' 
            });
        }
        
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al actualizar el libro' 
        });
    }
};

exports.subirPortada = [
    fileUpload(),
    async function(req, res, next) {
        const { id } = req.params;
        
        if (!req.files || !req.files.portada) {
            return res.status(400).json({ 
                error: 'No hay archivo',
                message: 'Debe enviar un archivo con el nombre "portada"' 
            });
        }
        
        const { portada } = req.files;
        
        const extension = path.extname(portada.name).toLowerCase();
        const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        
        if (!extensionesPermitidas.includes(extension)) {
            return res.status(400).json({ 
                error: 'Archivo no permitido',
                message: 'Solo se permiten imágenes (jpg, jpeg, png, gif, webp)' 
            });
        }
        
        const maxSize = 5 * 1024 * 1024;
        if (portada.size > maxSize) {
            return res.status(400).json({ 
                error: 'Archivo muy grande',
                message: 'El archivo no debe superar los 5MB' 
            });
        }

        try {
            const [libro] = await db.query("SELECT id, url_portada FROM Libro WHERE id = ?", [id]);
            if (libro.length === 0) {
                return res.status(404).json({ 
                    error: 'Libro no encontrado',
                    message: 'No existe un libro con ese ID' 
                });
            }

            const portadaAnterior = libro[0].url_portada;
            if (portadaAnterior && portadaAnterior.startsWith('/uploads/portadas/') && !portadaAnterior.includes('default')) {
                const nombreArchivoAnterior = path.basename(portadaAnterior);
                const filepathAnterior = path.join(directorio, nombreArchivoAnterior);
                
                if (fs.existsSync(filepathAnterior)) {
                    fs.unlinkSync(filepathAnterior);
                }
            }
            
            const nombreArchivo = `portada_${id}_${Date.now()}${extension}`;
            const filepath = path.join(directorio, nombreArchivo);
            
            portada.mv(filepath, async function(error) { 
                if (error) {
                    console.error(error);
                    return res.status(500).json({ 
                        error: 'Error al guardar',
                        message: 'Ocurrió un error al guardar el archivo' 
                    });
                }
                
                const urlPortada = `/uploads/portadas/${nombreArchivo}`;
                const sql = "UPDATE Libro SET url_portada = ? WHERE id = ?";
                
                try {
                    await db.query(sql, [urlPortada, id]);
                    
                    res.status(201).json({ 
                        status: 'ok',
                        message: 'Portada actualizada exitosamente',
                        url_portada: `${BASE_URL}${urlPortada}` 
                    });
                } catch (dbError) {
                    console.error(dbError);
                    fs.unlinkSync(filepath);
                    res.status(500).json({ 
                        error: 'Error al actualizar',
                        message: 'El archivo se guardó pero no se pudo actualizar la base de datos' 
                    });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                error: 'Error del servidor',
                message: 'Error al procesar la solicitud' 
            });
        }
    }
];

exports.eliminarPortada = async function(req, res, next) {
    const { id } = req.params;
    
    try {
        const [libro] = await db.query("SELECT url_portada FROM Libro WHERE id = ?", [id]);
        
        if (libro.length === 0) {
            return res.status(404).json({ 
                error: 'Libro no encontrado',
                message: 'No existe un libro con ese ID' 
            });
        }
        
        const portadaActual = libro[0].url_portada;
        
        if (portadaActual && portadaActual.startsWith('/uploads/portadas/') && !portadaActual.includes('default')) {
            const nombreArchivo = path.basename(portadaActual);
            const filepath = path.join(directorio, nombreArchivo);
            
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }
        
        const portadaDefault = '/uploads/portadas/default.png';
        const sqlUpdate = "UPDATE Libro SET url_portada = ? WHERE id = ?";
        
        await db.query(sqlUpdate, [portadaDefault, id]);
        
        res.json({ 
            status: 'ok',
            message: 'Portada eliminada exitosamente',
            url_portada: `${BASE_URL}${portadaDefault}` 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al eliminar portada' 
        });
    }
};

exports.eliminar = async function(req, res, next) {
    const { id } = req.params;

    try {
        const [lecturas] = await db.query("SELECT COUNT(*) as total FROM Lectura WHERE libro_id = ?", [id]);
        
        if (lecturas[0].total > 0) {
            return res.status(409).json({ 
                error: 'No se puede eliminar',
                message: `El libro tiene ${lecturas[0].total} lectura(s) asociada(s). No se puede eliminar.` 
            });
        }

        const [libro] = await db.query("SELECT url_portada FROM Libro WHERE id = ?", [id]);
        
        if (libro.length === 0) {
            return res.status(404).json({ 
                error: 'Libro no encontrado',
                message: 'No existe un libro con ese ID' 
            });
        }

        const portada = libro[0].url_portada;
        if (portada && portada.startsWith('/uploads/portadas/') && !portada.includes('default')) {
            const nombreArchivo = path.basename(portada);
            const filepath = path.join(directorio, nombreArchivo);
            
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }

        const sql = "DELETE FROM Libro WHERE id = ?";
        const [result] = await db.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Libro no encontrado',
                message: 'No existe un libro con ese ID' 
            });
        }

        res.json({ 
            status: 'ok',
            message: 'Libro eliminado exitosamente' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al eliminar el libro' 
        });
    }
};