import React, { useState } from 'react';
import '/src/componentes/administracion/admin.css';
import ModalEditarGenero from '/src/componentes/modals/ModalEditarGenero.jsx';
import ModalCrearGenero from '/src/componentes/modals/ModalCrearGenero.jsx';

const Generos = () => {
    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
    const [generoSeleccionado, setGeneroSeleccionado] = useState(null);
    const [buscador, setBuscador] = useState('');
    const [generos, setGeneros] = useState([
        {
            id: 1,
            nombre: "Ficción",
            descripcion: "Donde la acción y el suspenso se roban el escenario",
        },
        {
            id: 2,
            nombre: "Terror",
            descripcion: "Donde el miedo y el suspendo unen fuerzas para auyentar a los mas valientes",
        },
        {
            id: 3,
            nombre: "Romance",
            descripcion: "Historias de amor que conquistan corazones",
        },
        {
            id: 4,
            nombre: "Fantasía",
            descripcion: "Mundos mágicos y criaturas extraordinarias cobran vida",
        },
    ]);

    const Borrar = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este género?')) {
            setGeneros(generos.filter(genero => genero.id !== id));
            
            // Aquí deberías hacer la petición DELETE a tu API
            // fetch('/api/generos/' + id, { method: 'DELETE' })
        }
    };

    const Editar = (genero) => {
        setGeneroSeleccionado(genero);
        setMostrarModalEditar(true);
    };

    const cerrarModalEditar = () => {
        setMostrarModalEditar(false);
        setGeneroSeleccionado(null);
    };

    const cerrarModalCrear = () => {
        setMostrarModalCrear(false);
    };

    const guardarGenero = (datosActualizados) => {
        setGeneros(prevGeneros =>
            prevGeneros.map(genero =>
                genero.id === generoSeleccionado.id
                    ? {
                        ...genero,
                        nombre: datosActualizados.nombre,
                        descripcion: datosActualizados.descripcion
                    }
                    : genero
            )
        );

        setMostrarModalEditar(false);
        setGeneroSeleccionado(null);
        alert('Género actualizado correctamente');

        // Aquí deberías hacer la petición PUT a tu API
        // fetch('/api/generos/' + generoSeleccionado.id, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         nombre: datosActualizados.nombre,
        //         descripcion: datosActualizados.descripcion
        //     })
        // })
    };

    const crearGenero = (datosNuevoGenero) => {
        // Generar nuevo ID
        const nuevoId = Math.max(...generos.map(g => g.id)) + 1;

        const nuevoGenero = {
            id: nuevoId,
            nombre: datosNuevoGenero.nombre,
            descripcion: datosNuevoGenero.descripcion
        };

        setGeneros([...generos, nuevoGenero]);
        setMostrarModalCrear(false);
        alert('Género creado correctamente');

        // Aquí deberías hacer la petición POST a tu API
        // fetch('/api/generos', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         nombre: datosNuevoGenero.nombre,
        //         descripcion: datosNuevoGenero.descripcion
        //     })
        // })
    };

    const Buscar = () => {
        const resultados = generos.filter(genero => 
            genero.nombre.toLowerCase().includes(buscador.toLowerCase()) ||
            genero.descripcion.toLowerCase().includes(buscador.toLowerCase())
        );
        
        if (resultados.length === 0) {
            alert('No se encontraron géneros');
        } else {
            alert(`Se encontraron ${resultados.length} género(s)`);
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
                    placeholder="Buscar genero"
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
                        <th>GENERO</th>
                        <th>DESCRIPCION</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {generos.map((genero) => (
                        <tr key={genero.id}>
                            <td>{genero.id}</td>
                            <td>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>{genero.nombre}</p>
                            </td>
                            <td style={{ maxWidth: '300px' }}>{genero.descripcion}</td>
                            <td>
                                <button className='Borrar' onClick={() => Borrar(genero.id)}>
                                    Borrar
                                </button>
                                <button className='Editar' onClick={() => Editar(genero)}>
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mostrarModalEditar && (
                <ModalEditarGenero
                    genero={{
                        id: generoSeleccionado.id,
                        nombre: generoSeleccionado.nombre,
                        descripcion: generoSeleccionado.descripcion
                    }}
                    alCerrar={cerrarModalEditar}
                    alGuardar={guardarGenero}
                />
            )}

            {mostrarModalCrear && (
                <ModalCrearGenero
                    alCerrar={cerrarModalCrear}
                    alGuardar={crearGenero}
                />
            )}
        </div>
    );
};

export default Generos;