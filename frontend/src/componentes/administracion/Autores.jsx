/*
import React, { useState } from 'react';
import '/src/componentes/administracion/admin.css';


const Autores = () => {
    const [buscador, setBuscador] = useState('');
    const [autores, setAutores] = useState([
        {
            "id": 1,
            "nombre": "Jorge Borges",
            "libros": 123,
            "nacionalidad": "Argentino",
            "fechaRegistro": "2023-01-23",
        },
        {
            "id": 2,
            "nombre": "Jorge Borges",
            "libros": 123,
            "nacionalidad": "Argentino",
            "fechaRegistro": "2023-01-23",
        },
        {
            "id": 3,
            "nombre": "Jorge Borges",
            "libros": 123,
            "nacionalidad": "Argentino",
            "fechaRegistro": "2023-01-23",
        },
        {
            "id": 4,
            "nombre": "Jorge Borges",
            "libros": 123,
            "nacionalidad": "Argentino",
            "fechaRegistro": "2023-01-23",
        }
    ])

    const Borrar = (id) => {
        setAutores(autores.filter(autor => autor.id !== id));
    };

    const Editar = (id) => {
        alert(`Editar autor ${id}`);
    };

    const Buscar = () => {
        alert(`Buscando: ${buscador}`);
    };

    const Nuevo = () => {
        alert('Crear nuevo autor');
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
                <tr>
                    <th>ID</th>
                    <th>AUTOR</th>
                    <th>LIBROS</th>
                    <th>NACIONALIDAD</th>
                    <th>FECHA REGISTRO</th>
                    <th>ACCIONES</th>
                </tr>
                {autores.map((autor) => (
                    <tr>
                        <td>{autor.id}</td>
                        <td>
                            <p>{autor.nombre}</p>
                        </td>
                        <td>{autor.libros}</td>
                        <td>{autor.nacionalidad}</td>
                        <td>{autor.fechaRegistro}</td>
                        <td>
                            <button className='Borrar' onClick={() => Borrar(autor.id)}>Borrar</button>
                            <button className='Editar' onClick={() => Editar(autor.id)}>Editar</button>
                        </td>
                    </tr>

                ))}

            </table>
        </div>
    );
};
export default Autores;
*/

import React, { useState } from 'react';
import '/src/componentes/administracion/admin.css';
import ModalEditarAutor from '/src/componentes/modals/ModalEditarAutor.jsx';

const Autores = () => {
    const [mostrarModal, setMostrarModal] = useState(false);
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
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setAutorSeleccionado(null);
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

        setMostrarModal(false);
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
        alert('Crear nuevo autor');
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

            {mostrarModal && (
                <ModalEditarAutor
                    autor={{
                        id: autorSeleccionado.id,
                        nombre: autorSeleccionado.nombre,
                        apellido: autorSeleccionado.apellido,
                        nacionalidad: autorSeleccionado.nacionalidad
                    }}
                    alCerrar={cerrarModal}
                    alGuardar={guardarAutor}
                />
            )}
        </div>
    );
};

export default Autores;