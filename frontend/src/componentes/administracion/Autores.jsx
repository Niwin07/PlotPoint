import React, { useState } from 'react';
import '/src/componentes/administracion/admin.css';
import ModalEditarAutor from '/src/componentes/modals/ModalEditarAutor.jsx';
import ModalCrearAutor from '/src/componentes/modals/ModalCrearAutor.jsx';

const Autores = () => {
    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
    const [autorSeleccionado, setAutorSeleccionado] = useState(null);
    const [buscador, setBuscador] = useState('');
    const [autores, setAutores] = useState([
        {
            id: 1,
            nombre: "Jorge Luis",
            apellido: "Borges",
            libros: 123,
            nacionalidad: "Argentino",
            fechaRegistro: "2023-01-23",
        },
        {
            id: 2,
            nombre: "Gabriel",
            apellido: "García Márquez",
            libros: 87,
            nacionalidad: "Colombiano",
            fechaRegistro: "2023-01-23",
        },
        {
            id: 3,
            nombre: "Isabel",
            apellido: "Allende",
            libros: 56,
            nacionalidad: "Chilena",
            fechaRegistro: "2023-01-23",
        },
        {
            id: 4,
            nombre: "Julio",
            apellido: "Cortázar",
            libros: 92,
            nacionalidad: "Argentino",
            fechaRegistro: "2023-01-23",
        }
    ]);

    const Borrar = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este autor?')) {
            setAutores(autores.filter(autor => autor.id !== id));
            
            // Aquí deberías hacer la petición DELETE a tu API
            // fetch('/api/autores/' + id, { method: 'DELETE' })
        }
    };

    const Editar = (autor) => {
        setAutorSeleccionado(autor);
        setMostrarModalEditar(true);
    };

    const cerrarModalEditar = () => {
        setMostrarModalEditar(false);
        setAutorSeleccionado(null);
    };

    const cerrarModalCrear = () => {
        setMostrarModalCrear(false);
    };

    const guardarAutor = (datosActualizados) => {
        setAutores(prevAutores =>
            prevAutores.map(autor =>
                autor.id === autorSeleccionado.id
                    ? {
                        ...autor,
                        nombre: datosActualizados.nombre,
                        apellido: datosActualizados.apellido,
                        nacionalidad: datosActualizados.nacionalidad
                    }
                    : autor
            )
        );

        setMostrarModalEditar(false);
        setAutorSeleccionado(null);
        alert('Autor actualizado correctamente');

        // Aquí deberías hacer la petición PUT a tu API
        // fetch('/api/autores/' + autorSeleccionado.id, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         nombre: datosActualizados.nombre,
        //         apellido: datosActualizados.apellido,
        //         nacionalidad: datosActualizados.nacionalidad
        //     })
        // })
    };

    const crearAutor = (datosNuevoAutor) => {
        // Generar nuevo ID
        const nuevoId = Math.max(...autores.map(a => a.id)) + 1;
        
        // Obtener fecha actual
        const fechaActual = new Date().toISOString().split('T')[0];

        const nuevoAutor = {
            id: nuevoId,
            nombre: datosNuevoAutor.nombre,
            apellido: datosNuevoAutor.apellido,
            nacionalidad: datosNuevoAutor.nacionalidad,
            libros: 0,
            fechaRegistro: fechaActual
        };
        console.log(nuevoAutor)

        setAutores([...autores, nuevoAutor]);
        setMostrarModalCrear(false);
        alert('Autor creado correctamente');

        // Aquí deberías hacer la petición POST a tu API
        // fetch('/api/autores', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         nombre: datosNuevoAutor.nombre,
        //         apellido: datosNuevoAutor.apellido,
        //         nacionalidad: datosNuevoAutor.nacionalidad
        //     })
        // })
    };

    const Buscar = () => {
        const resultados = autores.filter(autor => 
            `${autor.nombre} ${autor.apellido}`.toLowerCase().includes(buscador.toLowerCase()) ||
            autor.nacionalidad.toLowerCase().includes(buscador.toLowerCase())
        );
        
        if (resultados.length === 0) {
            alert('No se encontraron autores');
        } else {
            alert(`Se encontraron ${resultados.length} autor(es)`);
        }
    };

    const Nuevo = () => {
        setMostrarModalCrear(true);
    };

    return (
        <div>
            <div className='acciones'>
                <input
                    type="text"
                    placeholder="Buscar autor"
                    value={buscador}
                    onChange={(e) => setBuscador(e.target.value)}
                    className='InputAdmin'
                />
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
                        <th>AUTOR</th>
                        <th>LIBROS</th>
                        <th>NACIONALIDAD</th>
                        <th>FECHA REGISTRO</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {autores.map((autor) => (
                        <tr key={autor.id}>
                            <td>{autor.id}</td>
                            <td>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>
                                    {autor.nombre} {autor.apellido}
                                </p>
                            </td>
                            <td>{autor.libros}</td>
                            <td>{autor.nacionalidad}</td>
                            <td>{autor.fechaRegistro}</td>
                            <td>
                                <button className='Borrar' onClick={() => Borrar(autor.id)}>
                                    Borrar
                                </button>
                                <button className='Editar' onClick={() => Editar(autor)}>
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mostrarModalEditar && (
                <ModalEditarAutor
                    autor={{
                        id: autorSeleccionado.id,
                        nombre: autorSeleccionado.nombre,
                        apellido: autorSeleccionado.apellido,
                        nacionalidad: autorSeleccionado.nacionalidad
                    }}
                    alCerrar={cerrarModalEditar}
                    alGuardar={guardarAutor}
                />
            )}

            {mostrarModalCrear && (
                <ModalCrearAutor
                    alCerrar={cerrarModalCrear}
                    alGuardar={crearAutor}
                />
            )}
        </div>
    );
};

export default Autores;