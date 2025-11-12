const router = require('express').Router();
const { hashPass, verificarPass } = require('@damianegreco/hashpass');
const db = require('../../conexion');
const fileUpload = require("express-fileupload");
const path = require('path');
const fs = require("fs");

// Directorio para guardar las fotos de perfil
const directorio = path.join(__dirname, "..", "..", "uploads", "avatars");

// Crear directorio si no existe
if (!fs.existsSync(directorio)){
    fs.mkdirSync(directorio, { recursive: true });
}

// NOTA: Este router ya recibe verificarToken aplicado desde main.js
// Por lo tanto, req.usuario siempre estará disponible

// GET /api/usuarios/perfil - Obtener perfil del usuario autenticado
router.get('/', function(req, res, next) {
    const userId = req.usuario.id;
    
    // Solo campos que el usuario debería ver/editar en su perfil
    let sql = `SELECT id, nombre, nombre_usuario, correo, biografia, url_avatar
               FROM Usuario WHERE id = ?`;
    
    db.query(sql, [userId])
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.status(404).json({ 
                    error: 'Usuario no encontrado' 
                });
            }
            res.json(rows[0]);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ 
                error: 'Error al obtener perfil' 
            });
        });
});

// PUT /api/usuarios/perfil/actualizar - Actualizar datos del perfil
router.put('/actualizar', function(req, res, next) {
    // El usuario solo puede editar estos campos
    const { nombre, biografia, url_avatar } = req.body;
    const userId = req.usuario.id;
    
    if (!nombre && !biografia && !url_avatar) {
        return res.status(400).json({ 
            error: 'Debe proporcionar al menos un campo para actualizar' 
        });
    }
    
    const updates = [];
    const params = [];
    
    if (nombre) {
        updates.push("nombre = ?");
        params.push(nombre.trim());
    }
    
    
    if (biografia !== undefined) {
        updates.push("biografia = ?");
        params.push(biografia ? biografia.trim() : null);
    }
    
    if (url_avatar !== undefined) {
        updates.push("url_avatar = ?");
        params.push(url_avatar ? url_avatar.trim() : null);
    }
    
    const sql = `UPDATE Usuario SET ${updates.join(", ")} WHERE id = ?`;
    params.push(userId);
    
    db.query(sql, params)
        .then(() => {
            res.json({ 
                status: 'ok',
                message: 'Perfil actualizado exitosamente' 
            });
        })
        .catch((error) => {
            console.error(error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ 
                    error: 'Datos duplicados',
                    message: 'El nombre de usuario ya existe' 
                });
            }
            res.status(500).json({ 
                error: 'Error al actualizar perfil' 
            });
        });
});


// POST /api/usuarios/perfil/upload-avatar - Subir foto de perfil
// El usuario solo puede subir su propia foto (usa el ID del token, no de parámetros)
router.post('/upload-avatar', fileUpload(), function(req, res, next) {
    const userId = req.usuario.id; // ID del token JWT (ya verificado)
    
    if (!req.files || !req.files.avatar) {
        return res.status(400).json({ 
            error: 'No hay archivo',
            message: 'Debe enviar un archivo con el nombre "avatar"' 
        });
    }
    
    const { avatar } = req.files;
    
    // Validar extensión (solo imágenes)
    const extension = path.extname(avatar.name).toLowerCase();
    const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    if (!extensionesPermitidas.includes(extension)) {
        return res.status(400).json({ 
            error: 'Archivo no permitido',
            message: 'Solo se permiten imágenes (jpg, jpeg, png, gif, webp)' 
        });
    }
    
    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (avatar.size > maxSize) {
        return res.status(400).json({ 
            error: 'Archivo muy grande',
            message: 'El archivo no debe superar los 5MB' 
        });
    }
    
    // Generar nombre único para el archivo
    const nombreArchivo = `avatar_${userId}_${Date.now()}${extension}`;
    const filepath = path.join(directorio, nombreArchivo);
    
    // Guardar el archivo
    avatar.mv(filepath, function(error) { 
        if (error) {
            console.error(error);
            return res.status(500).json({ 
                error: 'Error al guardar',
                message: 'Ocurrió un error al guardar el archivo' 
            });
        }
        
        // Actualizar URL del avatar en la base de datos
        const urlAvatar = `/uploads/avatars/${nombreArchivo}`;
        const sql = "UPDATE Usuario SET url_avatar = ? WHERE id = ?";
        
        db.query(sql, [urlAvatar, userId])
            .then(() => {
                res.status(201).json({ 
                    status: 'ok',
                    message: 'Avatar actualizado exitosamente',
                    url_avatar: urlAvatar
                });
            })
            .catch((error) => {
                console.error(error);
                // Si falla la BD, eliminar el archivo guardado
                fs.unlinkSync(filepath);
                res.status(500).json({ 
                    error: 'Error al actualizar perfil',
                    message: 'El archivo se guardó pero no se pudo actualizar la base de datos' 
                });
            });
    });
});

// DELETE /api/usuarios/perfil/delete-avatar - Eliminar foto de perfil
router.delete('/delete-avatar', function(req, res, next) {
    const userId = req.usuario.id;
    
    // Obtener el avatar actual
    const sqlSelect = "SELECT url_avatar FROM Usuario WHERE id = ?";
    
    db.query(sqlSelect, [userId])
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.status(404).json({ 
                    error: 'Usuario no encontrado' 
                });
            }
            
            const avatarActual = rows[0].url_avatar;
            
            // Si tiene un avatar personalizado, eliminarlo del servidor
            if (avatarActual && avatarActual.startsWith('/uploads/avatars/')) {
                const nombreArchivo = path.basename(avatarActual);
                const filepath = path.join(directorio, nombreArchivo);
                
                if (fs.existsSync(filepath)) {
                    fs.unlinkSync(filepath);
                }
            }
            
            // Establecer avatar por defecto en la BD
            const avatarDefault = '/uploads/avatars/default.png';
            const sqlUpdate = "UPDATE Usuario SET url_avatar = ? WHERE id = ?";
            
            return db.query(sqlUpdate, [avatarDefault, userId]);
        })
        .then(() => {
            res.json({ 
                status: 'ok',
                message: 'Avatar eliminado exitosamente',
                url_avatar: '/uploads/avatars/default.png'
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ 
                error: 'Error al eliminar avatar' 
            });
        });
});

// PUT /api/usuarios/perfil/cambiar-password - Cambiar contraseña
router.put('/cambiar-password', async function(req, res, next) {
    const { contrasenaActual, contrasenaNueva } = req.body;
    const userId = req.usuario.id;
    
    try {
        // Validaciones iniciales
        if (!contrasenaActual || !contrasenaNueva) {
            return res.status(400).json({ 
                error: 'Contraseña actual y nueva son requeridas' 
            });
        }

        if (contrasenaNueva.length < 6) {
            return res.status(400).json({ 
                error: 'Contraseña débil',
                message: 'La contraseña debe tener al menos 6 caracteres' 
            });
        }
        
        // Verificar contraseña actual
        const [rows] = await db.query(
            "SELECT contrasena_hash FROM Usuario WHERE id = ?", 
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado' 
            });
        }
        
        const usuario = rows[0];
        
        if (!verificarPass(contrasenaActual, usuario.contrasena_hash)) {
            return res.status(401).json({ 
                error: 'Contraseña actual incorrecta' 
            });
        }
        
        // Actualizar con nueva contraseña hasheada
        const contrasenaHash = hashPass(contrasenaNueva);
        await db.query(
            "UPDATE Usuario SET contrasena_hash = ? WHERE id = ?", 
            [contrasenaHash, userId]
        );
        
        return res.json({ 
            status: 'ok',
            message: 'Contraseña actualizada exitosamente' 
        });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        return res.status(500).json({ 
            error: 'Error al cambiar contraseña' 
        });
    }
});

// GET /api/usuarios/publico/:id - Obtener perfil público de un usuario
router.obtenerPublico = async function(req, res, next) {
    const { id } = req.params;

    try {
        // 1. Consulta principal del perfil
        const sqlPerfil = `SELECT id, nombre, nombre_usuario, biografia, url_avatar 
                           FROM Usuario WHERE id = ?`;
        
        // 2. Consultas para las estadísticas
        const sqlResenas = `SELECT COUNT(*) as total_reseñas FROM Resena WHERE usuario_id = ?`;
        const sqlSeguidores = `SELECT COUNT(*) as total_seguidores FROM Seguidores WHERE seguido_id = ?`;
        const sqlSeguidos = `SELECT COUNT(*) as total_seguidos FROM Seguidores WHERE seguidor_id = ?`;

        // Ejecutar todas las consultas en paralelo
        const [
            [perfilRows],
            [reseñasRows],
            [seguidoresRows],
            [seguidosRows]
        ] = await Promise.all([
            db.query(sqlPerfil, [id]),
            db.query(sqlResenas, [id]),
            db.query(sqlSeguidores, [id]),
            db.query(sqlSeguidos, [id])
        ]);

        if (perfilRows.length === 0) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado' 
            });
        }
        
        // Combinar todos los resultados
        const perfil = perfilRows[0];
        perfil.reseñas = reseñasRows[0].total_reseñas;
        perfil.seguidores = seguidoresRows[0].total_seguidores;
        perfil.seguidos = seguidosRows[0].total_seguidos;

        res.json(perfil);

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error al obtener perfil público' 
        });
    }
};


module.exports = router;