
import React, { useState } from 'react';
import '/src/componentes/administracion/admin.css';
import ModalEditarLibro from '/src/componentes/modals/ModalEditarLibro.jsx';
import ModalCrearLibro from '/src/componentes/modals/ModalCrearLibro.jsx';

const Libros = () => {
    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);

    const [buscador, setBuscador] = useState('');
    const [buscarFecha, setBuscarFecha] = useState('');
    const [buscarCategoria, setBuscarCategoria] = useState('');
    const [buscarLetra, setBuscarLetra] = useState('');

    // Definir autores y editoriales disponibles (idealmente vendrían de tu API)
    const autoresDisponibles = [
        { id: 1, nombre: 'Gabriel García Márquez' },
        { id: 2, nombre: 'J.K. Rowling' },
        { id: 3, nombre: 'Stephen King' },
        { id: 4, nombre: 'Isabel Allende' },
        { id: 5, nombre: 'Paulo Coelho' },
        { id: 6, nombre: 'Mario Vargas Llosa' },
        { id: 7, nombre: 'Julio Cortázar' },
        { id: 8, nombre: 'Jorge Luis Borges' },
        { id: 9, nombre: 'Laura Esquivel' },
        { id: 10, nombre: 'Carlos Ruiz Zafón' }
    ];

    const editorialesDisponibles = [
        { id: 1, nombre: 'LibroTeca' },
        { id: 2, nombre: 'Penguin Random House' },
        { id: 3, nombre: 'Planeta' },
        { id: 4, nombre: 'Alfaguara' },
        { id: 5, nombre: 'Anagrama' },
        { id: 6, nombre: 'Salamandra' },
        { id: 7, nombre: 'Tusquets' },
        { id: 8, nombre: 'Ediciones B' },
        { id: 9, nombre: 'Destino' },
        { id: 10, nombre: 'Santillana' }
    ];

    const [libros, setLibros] = useState([
        {
            id: 1,
            titulo: "Harry Potter y la Piedra Filosofal",
            isbn: "978-030-563-636-3",
            sinopsis: "Harry Potter es un huérfano que vive con sus desagradables tíos, los Dursley, y su repelente primo Dudley...",
            urlPortada: null,
            paginas: 223,
            anioPublicacion: 2001,
            editorialId: 6,
            autorId: 2,
            autorNombre: "J.K. Rowling",
            editorialNombre: "Salamandra",
            generos: ["Fantasía", "Aventura"],
            resenas: 13,
            calificacion: 4.5,
        },
        {
            id: 2,
            titulo: "Harry Potter y la Cámara Secreta",
            isbn: "978-030-563-636-4",
            sinopsis: "Tras derrotar una vez más a lord Voldemort, su siniestro enemigo en Harry Potter y la piedra filosofal...",
            urlPortada: null,
            paginas: 251,
            anioPublicacion: 2002,
            editorialId: 6,
            autorId: 2,
            autorNombre: "J.K. Rowling",
            editorialNombre: "Salamandra",
            generos: ["Fantasía", "Aventura"],
            resenas: 13,
            calificacion: 4.5,
        },
        {
            id: 3,
            titulo: "Cien años de soledad",
            isbn: "978-030-563-636-5",
            sinopsis: "La novela narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo...",
            urlPortada: null,
            paginas: 471,
            anioPublicacion: 1967,
            editorialId: 4,
            autorId: 1,
            autorNombre: "Gabriel García Márquez",
            editorialNombre: "Alfaguara",
            generos: ["Ficción", "Realismo Mágico", "Drama"],
            resenas: 13,
            calificacion: 4.5,
        },
        {
            id: 4,
            titulo: "El Código Da Vinci",
            isbn: "978-030-563-636-6",
            sinopsis: "Robert Langdon, experto en simbología, es convocado a un museo para investigar un misterioso asesinato...",
            urlPortada: null,
            paginas: 656,
            anioPublicacion: 2003,
            editorialId: 3,
            autorId: 3,
            autorNombre: "Dan Brown",
            editorialNombre: "Planeta",
            generos: ["Misterio", "Thriller"],
            resenas: 13,
            calificacion: 4.5,
        },
    ]);

    const Buscar = () => {
        const resultados = libros.filter(libro => 
            libro.titulo.toLowerCase().includes(buscador.toLowerCase()) ||
            libro.autorNombre.toLowerCase().includes(buscador.toLowerCase())
        );
        
        if (resultados.length === 0) {
            alert('No se encontraron libros');
        } else {
            alert(`Se encontraron ${resultados.length} libro(s)`);
        }
    };

    const Nuevo = () => {
        setMostrarModalCrear(true);
    };

    const Editar = (libro) => {
        setLibroSeleccionado(libro);
        setMostrarModalEditar(true);
    };

    const cerrarModalEditar = () => {
        setMostrarModalEditar(false);
        setLibroSeleccionado(null);
    };

    const cerrarModalCrear = () => {
        setMostrarModalCrear(false);
    };

    const guardarLibro = (datosActualizados) => {
        // Encontrar el autor y editorial por ID
        const autorSeleccionado = autoresDisponibles.find(a => a.id === parseInt(datosActualizados.autorId));
        const editorialSeleccionada = editorialesDisponibles.find(e => e.id === parseInt(datosActualizados.editorialId));

        // Actualizar el libro en el estado
        setLibros(prevLibros =>
            prevLibros.map(libro =>
                libro.id === libroSeleccionado.id
                    ? { 
                        ...libro,
                        titulo: datosActualizados.titulo,
                        isbn: datosActualizados.isbn,
                        sinopsis: datosActualizados.sinopsis,
                        urlPortada: datosActualizados.urlPortada,
                        paginas: parseInt(datosActualizados.paginas),
                        anioPublicacion: parseInt(datosActualizados.anioPublicacion),
                        editorialId: parseInt(datosActualizados.editorialId),
                        autorId: parseInt(datosActualizados.autorId),
                        generos: datosActualizados.generos,
                        autorNombre: autorSeleccionado ? autorSeleccionado.nombre : libro.autorNombre,
                        editorialNombre: editorialSeleccionada ? editorialSeleccionada.nombre : libro.editorialNombre
                    }
                    : libro
            )
        );

        setMostrarModalEditar(false);
        setLibroSeleccionado(null);
        alert('Libro actualizado correctamente');
    };

    const crearLibro = (datosNuevoLibro) => {
        // Generar nuevo ID
        const nuevoId = Math.max(...libros.map(l => l.id)) + 1;

        // Encontrar el autor y editorial por ID
        const autorSeleccionado = autoresDisponibles.find(a => a.id === parseInt(datosNuevoLibro.autorId));
        const editorialSeleccionada = editorialesDisponibles.find(e => e.id === parseInt(datosNuevoLibro.editorialId));

        const nuevoLibro = {
            id: nuevoId,
            titulo: datosNuevoLibro.titulo,
            isbn: datosNuevoLibro.isbn,
            sinopsis: datosNuevoLibro.sinopsis,
            urlPortada: datosNuevoLibro.urlPortada,
            paginas: parseInt(datosNuevoLibro.paginas),
            anioPublicacion: parseInt(datosNuevoLibro.anioPublicacion),
            editorialId: parseInt(datosNuevoLibro.editorialId),
            autorId: parseInt(datosNuevoLibro.autorId),
            generos: datosNuevoLibro.generos,
            autorNombre: autorSeleccionado ? autorSeleccionado.nombre : 'Autor Desconocido',
            editorialNombre: editorialSeleccionada ? editorialSeleccionada.nombre : 'Editorial Desconocida',
            resenas: 0,
            calificacion: 0,
        };

        setLibros([...libros, nuevoLibro]);
        setMostrarModalCrear(false);
        alert('Libro creado correctamente');
    };

    const Borrar = (id) => {
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
                                <span style={{ fontSize: '13px', color: '#666' }}>{libro.autorNombre}</span>
                            </td>
                            <td>
                                {libro.generos.map((genero, index) => (
                                    <span key={index}>
                                        {genero}
                                        {index < libro.generos.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </td>
                            <td>{libro.resenas}</td>
                            <td>{libro.calificacion}</td>
                            <td>
                                <button className='Borrar' onClick={() => Borrar(libro.id)}>
                                    Borrar
                                </button>
                                <button className='Editar' onClick={() => Editar(libro)}>
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mostrarModalEditar && (
                <ModalEditarLibro
                    libro={{
                        id: libroSeleccionado.id,
                        titulo: libroSeleccionado.titulo,
                        isbn: libroSeleccionado.isbn,
                        sinopsis: libroSeleccionado.sinopsis,
                        urlPortada: libroSeleccionado.urlPortada,
                        paginas: libroSeleccionado.paginas.toString(),
                        anioPublicacion: libroSeleccionado.anioPublicacion.toString(),
                        editorialId: libroSeleccionado.editorialId,
                        autorId: libroSeleccionado.autorId,
                        generos: libroSeleccionado.generos
                    }}
                    alCerrar={cerrarModalEditar}
                    alGuardar={guardarLibro}
                />
            )}

            {mostrarModalCrear && (
                <ModalCrearLibro
                    alCerrar={cerrarModalCrear}
                    alGuardar={crearLibro}
                />
            )}
        </div>
    );
};

export default Libros;