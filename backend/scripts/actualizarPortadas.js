const path = require('path'); // Módulo para manejar rutas de archivos

require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Cargar variables de entorno

const db = require('../conexion.js'); 
const axios = require('axios'); // Cliente HTTP para hacer solicitudes a la API de Google Books

const API_KEY = 'AIzaSyBzllAl1ak_biWHDC-3jnLI_n_HTCDrV00';

// Función principal para actualizar las portadas de los libros
async function actualizarPortadas() {
    try {
        console.log('✅ Iniciando script para actualizar portadas...');
        
        const [libros] = await db.execute(`
            SELECT 
                Libro.id, 
                Libro.titulo, 
                Autor.nombre as autor_nombre, 
                Autor.apellido as autor_apellido 
            FROM Libro 
            JOIN Autor ON Libro.autor_id = Autor.id
            WHERE Libro.url_portada LIKE '%default.png' OR Libro.url_portada LIKE '%example.com%' OR Libro.url_portada IS NULL
        `);

        if (libros.length === 0) {
            console.log(' ¡Excelente! Todos los libros ya tienen una portada válida.');
            return;
        }

        console.log(` Se encontraron ${libros.length} libros para actualizar.`);

        for (const libro of libros) { // Iterar sobre cada libro que necesita una portada
            try {
                const query = encodeURIComponent(`${libro.titulo} ${libro.autor_nombre} ${libro.autor_apellido}`); // Construir la consulta para la API
                const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`; // URL de la API de Google Books
                
                const response = await axios.get(apiUrl);

                if (response.data.items && response.data.items.length > 0) {
                    const bookData = response.data.items[0].volumeInfo; // Obtener la información del primer libro encontrado
                    const imageUrl = bookData.imageLinks?.thumbnail || bookData.imageLinks?.smallThumbnail; // Obtener la URL de la imagen de portada

                    if (imageUrl) {
                        const secureImageUrl = imageUrl.replace(/^http:/, 'https:'); // Asegurar que la URL use HTTPS
                        await db.execute(
                            'UPDATE Libro SET url_portada = ? WHERE id = ?',
                            [secureImageUrl, libro.id]
                        );
                        console.log(` Portada actualizada para: ${libro.titulo}`);
                    } else {
                        console.log(` No se encontró imagen para: ${libro.titulo}`);
                    }
                } else {
                    console.log(` No se encontraron resultados en la API para: ${libro.titulo}`);
                }

                await new Promise(resolve => setTimeout(resolve, 100)); // Pausa para evitar límites de tasa de la API

            } catch (apiError) {
                console.error(`Error procesando "${libro.titulo}":`, apiError.message);
            }
        }

        console.log('✨ Proceso finalizado.');

    } catch (error) {
        console.error('Ha ocurrido un error general:', error);
    } finally {
        await db.end();
        console.log('Conexión a la base de datos cerrada.');
    }
}

actualizarPortadas();