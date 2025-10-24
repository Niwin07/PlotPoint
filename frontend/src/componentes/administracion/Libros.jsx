
import React, { useState } from 'react';
import '/src/componentes/administracion/admin.css';
import ModalEditarLibro from '/src/componentes/modals/ModalEditarLibro.jsx';
import ModalCrearLibro from '/src/componentes/modals/ModalCrearLibro.jsx';

const Libros = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    const [buscador, setBuscador] = useState('');
    const [buscarFecha, setBuscarFecha] = useState('');
    const [buscarCategoria, setBuscarCategoria] = useState('');
    const [buscarLetra, setBuscarLetra] = useState('');
    const [libros, setLibros] = useState([
        {
            id: 1,
            titulo: "Harry Potter",
            isbn: "978-030-563-636-3",
            sinopsis: "Harry Potter es un huérfano que vive con sus desagradables tíos, los Dursley, y su repelente primo Dudley...",
            url_portada: null,
            paginas: 223,
            anio_publicacion: 2001,
            editorial_id: 1,
            autor_id: 1,
            autor_nombre: "J.K. Rowling",
            editorial_nombre: "Salamandra",
            generos: ["Fantasía", "Aventura"],
            reviews: 13,
            rating: 4.5,
        },
        {
            id: 2,
            titulo: "Harry Potter y la Cámara Secreta",
            isbn: "978-030-563-636-4",
            sinopsis: "Tras derrotar una vez más a lord Voldemort, su siniestro enemigo en Harry Potter y la piedra filosofal...",
            url_portada: null,
            paginas: 251,
            anio_publicacion: 2002,
            editorial_id: 1,
            autor_id: 1,
            autor_nombre: "J.K. Rowling",
            editorial_nombre: "Salamandra",
            generos: ["Fantasía", "Aventura"],
            reviews: 13,
            rating: 4.5,
        },
        {
            id: 3,
            titulo: "Cien años de soledad",
            isbn: "978-030-563-636-5",
            sinopsis: "La novela narra la historia de la familia Buendía a lo largo de siete generaciones...",
            url_portada: null,
            paginas: 471,
            anio_publicacion: 1967,
            editorial_id: 2,
            autor_id: 2,
            autor_nombre: "Gabriel García Márquez",
            editorial_nombre: "Editorial Sudamericana",
            generos: ["Ficción", "Realismo Mágico", "Drama"],
            reviews: 13,
            rating: 4.5,
        },
        {
            id: 4,
            titulo: "El Código Da Vinci",
            isbn: "978-030-563-636-6",
            sinopsis: "Robert Langdon, experto en simbología, es convocado a un museo para investigar un misterioso asesinato...",
            url_portada: null,
            paginas: 656,
            anio_publicacion: 2003,
            editorial_id: 3,
            autor_id: 3,
            autor_nombre: "Dan Brown",
            editorial_nombre: "Planeta",
            generos: ["Misterio", "Thriller"],
            reviews: 13,
            rating: 4.5,
        },
    ]);

    const Buscar = () => {
        alert(`Buscando: ${buscador}`);
    };

    const Nuevo = () => {
        setShowCreateModal(true);
    };

    const handleEdit = (book) => {
        setSelectedBook(book);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedBook(null);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleSaveBook = (updatedBook) => {
        setLibros(prevLibros =>
            prevLibros.map(libro =>
                libro.id === selectedBook.id
                    ? { 
                        ...libro,
                        titulo: updatedBook.title,
                        isbn: updatedBook.isbn,
                        sinopsis: updatedBook.synopsis,
                        url_portada: updatedBook.coverImage,
                        paginas: parseInt(updatedBook.pages),
                        anio_publicacion: parseInt(updatedBook.year),
                        autor_nombre: updatedBook.author,
                        editorial_nombre: updatedBook.publisher,
                        generos: updatedBook.genres
                    }
                    : libro
            )
        );

        setShowEditModal(false);
        setSelectedBook(null);
        alert('Libro actualizado correctamente');

          // Aquí deberías hacer la petición a tu API para actualizar en la base de datos
        // fetch('/api/libros/' + selectedBook.id, {
        //     method: 'PUT',
        //     body: JSON.stringify({
        //         titulo: updatedBook.title,
        //         isbn: updatedBook.isbn,
        //         sinopsis: updatedBook.synopsis,
        //         url_portada: updatedBook.coverImage,
        //         paginas: updatedBook.pages,
        //         anio_publicacion: updatedBook.year,
        //         editorial_id: updatedBook.editorial_id,
        //         autor_id: updatedBook.autor_id
        //     })
        // })
    };

    const handleCreateBook = (newBookData) => {
        // Generar nuevo ID
        const newId = Math.max(...libros.map(l => l.id)) + 1;
        
        const newBook = {
            id: newId,
            titulo: newBookData.title,
            isbn: newBookData.isbn,
            sinopsis: newBookData.synopsis,
            url_portada: newBookData.coverImage,
            paginas: parseInt(newBookData.pages),
            anio_publicacion: parseInt(newBookData.year),
            editorial_id: 1, // Aquí deberías obtener el ID real según la editorial seleccionada
            autor_id: 1, // Aquí deberías obtener el ID real según el autor seleccionado
            autor_nombre: newBookData.author,
            editorial_nombre: newBookData.publisher,
            generos: newBookData.genres,
            reviews: 0,
            rating: 0,
        };

        setLibros([...libros, newBook]);
        setShowCreateModal(false);
        alert('Libro creado correctamente');

        // Aquí deberías hacer la petición POST a tu API
        // fetch('/api/libros', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         titulo: newBookData.title,
        //         isbn: newBookData.isbn,
        //         sinopsis: newBookData.synopsis,
        //         url_portada: newBookData.coverImage,
        //         paginas: newBookData.pages,
        //         anio_publicacion: newBookData.year,
        //         editorial_id: ...,
        //         autor_id: ...
        //     })
        // })
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este libro?')) {
            setLibros(libros.filter(libro => libro.id !== id));
        }
    };

    return (
        <div>
            <div className='acciones'>
                <input
                    type="text"
                    placeholder="Buscar libro por nombre"
                    value={buscador}
                    onChange={(e) => setBuscador(e.target.value)}
                    className='InputAdmin'
                />
                <select
                    value={buscarFecha}
                    onChange={(e) => setBuscarFecha(e.target.value)}
                    className='InputAdmin'
                >
                    <option value="">Fecha de creación</option>
                    <option value="1">Mas Recientes</option>
                    <option value="2">Mas Antiguos</option>
                </select>
                <select
                    value={buscarCategoria}
                    onChange={(e) => setBuscarCategoria(e.target.value)}
                    className='InputAdmin'
                >
                    <option value="">Categoría</option>
                    <option value="ficcion">Ficción</option>
                    <option value="terror">Terror</option>
                    <option value="humor">Humor</option>
                    <option value="romance">Romance</option>
                </select>
                <select
                    value={buscarLetra}
                    onChange={(e) => setBuscarLetra(e.target.value)}
                    className='InputAdmin'
                >
                    <option value="">A - Z</option>
                    <option value="a-z">A - Z</option>
                    <option value="z-a">Z - A</option>
                </select>
                <button className='Buscar' onClick={Buscar}>
                    Buscar
                </button>
                <button className='Nuevo' onClick={Nuevo}>
                    Nuevo
                </button>
            </div>

            <table id="t01">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>LIBRO</th>
                        <th>GENEROS</th>
                        <th>RESEÑAS</th>
                        <th>CALIFICACION</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {libros.map((libro) => (
                        <tr key={libro.id}>
                            <td>{libro.id}</td>
                            <td>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>{libro.titulo}</p>
                                <span style={{ fontSize: '13px', color: '#666' }}>{libro.autor_nombre}</span>
                            </td>
                            <td>
                                {libro.generos.map((genre, index) => (
                                    <span key={index}>
                                        {genre}
                                        {index < libro.generos.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </td>
                            <td>{libro.reviews}</td>
                            <td>{libro.rating}</td>
                            <td>
                                <button className='Borrar' onClick={() => handleDelete(libro.id)}>
                                    Borrar
                                </button>
                                <button className='Editar' onClick={() => handleEdit(libro)}>
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showEditModal && (
                <ModalEditarLibro
                    book={{
                        id: selectedBook.id,
                        title: selectedBook.titulo,
                        author: selectedBook.autor_nombre,
                        year: selectedBook.anio_publicacion.toString(),
                        pages: selectedBook.paginas.toString(),
                        isbn: selectedBook.isbn,
                        genres: selectedBook.generos,
                        publisher: selectedBook.editorial_nombre,
                        synopsis: selectedBook.sinopsis,
                        coverImage: selectedBook.url_portada,
                        autor_id: selectedBook.autor_id,
                        editorial_id: selectedBook.editorial_id
                    }}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveBook}
                />
            )}

            {showCreateModal && (
                <ModalCrearLibro
                    onClose={handleCloseCreateModal}
                    onSave={handleCreateBook}
                />
            )}
        </div>
    );
};

export default Libros;