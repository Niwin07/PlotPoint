import React, { useState } from 'react';
import '/src/componentes/administracion/admin.css';
import ModalEditarEditorial from '/src/componentes/modals/ModalEditarEditorial.jsx';
import ModalCrearEditorial from '/src/componentes/modals/ModalCrearEditorial.jsx';

const Editoriales = () => {
    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
    const [editorialSeleccionada, setEditorialSeleccionada] = useState(null);
    const [buscador, setBuscador] = useState('');
    const [editoriales, setEditoriales] = useState([
        {
            id: 1,
            nombre: "LibroTeca",
            pais: "Ecuador",
        },
        {
            id: 2,
            nombre: "Planeta",
            pais: "España",
        },
        {
            id: 3,
            nombre: "Penguin Random House",
            pais: "Estados Unidos",
        },
        {
            id: 4,
            nombre: "Alfaguara",
            pais: "México",
        },
    ]);

    const Borrar = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta editorial?')) {
            setEditoriales(editoriales.filter(editorial => editorial.id !== id));
            
            // Aquí deberías hacer la petición DELETE a tu API
            // fetch('/api/editoriales/' + id, { method: 'DELETE' })
        }
    };

    const Editar = (editorial) => {
        setEditorialSeleccionada(editorial);
        setMostrarModalEditar(true);
    };

    const cerrarModalEditar = () => {
        setMostrarModalEditar(false);
        setEditorialSeleccionada(null);
    };

    const cerrarModalCrear = () => {
        setMostrarModalCrear(false);
    };

    const guardarEditorial = (datosActualizados) => {
        setEditoriales(prevEditoriales =>
            prevEditoriales.map(editorial =>
                editorial.id === editorialSeleccionada.id
                    ? {
                        ...editorial,
                        nombre: datosActualizados.nombre,
                        pais: datosActualizados.pais
                    }
                    : editorial
            )
        );

        setMostrarModalEditar(false);
        setEditorialSeleccionada(null);
        alert('Editorial actualizada correctamente');

        // Aquí deberías hacer la petición PUT a tu API
        // fetch('/api/editoriales/' + editorialSeleccionada.id, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         nombre: datosActualizados.nombre,
        //         pais: datosActualizados.pais
        //     })
        // })
    };

    const crearEditorial = (datosNuevaEditorial) => {
        // Generar nuevo ID
        const nuevoId = Math.max(...editoriales.map(e => e.id)) + 1;

        const nuevaEditorial = {
            id: nuevoId,
            nombre: datosNuevaEditorial.nombre,
            pais: datosNuevaEditorial.pais
        };

        setEditoriales([...editoriales, nuevaEditorial]);
        setMostrarModalCrear(false);
        alert('Editorial creada correctamente');

        // Aquí deberías hacer la petición POST a tu API
        // fetch('/api/editoriales', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         nombre: datosNuevaEditorial.nombre,
        //         pais: datosNuevaEditorial.pais
        //     })
        // })
    };

    const Buscar = () => {
        const resultados = editoriales.filter(editorial => 
            editorial.nombre.toLowerCase().includes(buscador.toLowerCase()) ||
            editorial.pais.toLowerCase().includes(buscador.toLowerCase())
        );
        
        if (resultados.length === 0) {
            alert('No se encontraron editoriales');
        } else {
            alert(`Se encontraron ${resultados.length} editorial(es)`);
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
                    placeholder="Buscar editorial"
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
                        <th>EDITORIAL</th>
                        <th>PAIS</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {editoriales.map((editorial) => (
                        <tr key={editorial.id}>
                            <td>{editorial.id}</td>
                            <td>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>{editorial.nombre}</p>
                            </td>
                            <td>{editorial.pais}</td>
                            <td>
                                <button className='Borrar' onClick={() => Borrar(editorial.id)}>
                                    Borrar
                                </button>
                                <button className='Editar' onClick={() => Editar(editorial)}>
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mostrarModalEditar && (
                <ModalEditarEditorial
                    editorial={{
                        id: editorialSeleccionada.id,
                        nombre: editorialSeleccionada.nombre,
                        pais: editorialSeleccionada.pais
                    }}
                    alCerrar={cerrarModalEditar}
                    alGuardar={guardarEditorial}
                />
            )}

            {mostrarModalCrear && (
                <ModalCrearEditorial
                    alCerrar={cerrarModalCrear}
                    alGuardar={crearEditorial}
                />
            )}
        </div>
    );
};


export default Editoriales;
/*
import React, { useState } from 'react';
import '/src/componentes/administracion/admin.css';
import ModalEditarEditorial from '/src/componentes/modals/ModalEditarEditorial.jsx';

const Editoriales = () => {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [editorialSeleccionada, setEditorialSeleccionada] = useState(null);
    const [buscador, setBuscador] = useState('');
    const [editoriales, setEditoriales] = useState([
        {
            id: 1,
            nombre: "LibroTeca",
            pais: "Ecuador",
        },
        {
            id: 2,
            nombre: "Planeta",
            pais: "España",
        },
        {
            id: 3,
            nombre: "Penguin Random House",
            pais: "Estados Unidos",
        },
        {
            id: 4,
            nombre: "Alfaguara",
            pais: "México",
        },
    ]);

    const Borrar = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta editorial?')) {
            setEditoriales(editoriales.filter(editorial => editorial.id !== id));
            
            // Aquí deberías hacer la petición DELETE a tu API
            // fetch('/api/editoriales/' + id, { method: 'DELETE' })
        }
    };

    const Editar = (editorial) => {
        setEditorialSeleccionada(editorial);
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setEditorialSeleccionada(null);
    };

    const guardarEditorial = (datosActualizados) => {
        setEditoriales(prevEditoriales =>
            prevEditoriales.map(editorial =>
                editorial.id === editorialSeleccionada.id
                    ? {
                        ...editorial,
                        nombre: datosActualizados.nombre,
                        pais: datosActualizados.pais
                    }
                    : editorial
            )
        );

        setMostrarModal(false);
        setEditorialSeleccionada(null);
        alert('Editorial actualizada correctamente');

        // Aquí deberías hacer la petición PUT a tu API
        // fetch('/api/editoriales/' + editorialSeleccionada.id, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         nombre: datosActualizados.nombre,
        //         pais: datosActualizados.pais
        //     })
        // })
    };

    const Buscar = () => {
        const resultados = editoriales.filter(editorial => 
            editorial.nombre.toLowerCase().includes(buscador.toLowerCase()) ||
            editorial.pais.toLowerCase().includes(buscador.toLowerCase())
        );
        
        if (resultados.length === 0) {
            alert('No se encontraron editoriales');
        } else {
            alert(`Se encontraron ${resultados.length} editorial(es)`);
        }
    };

    const Nuevo = () => {
        alert('Crear nueva editorial');
    };

    return (
        <div>
            <div className='acciones'>
                <input
                    type="text"
                    placeholder="Buscar editorial"
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
                        <th>EDITORIAL</th>
                        <th>PAIS</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {editoriales.map((editorial) => (
                        <tr key={editorial.id}>
                            <td>{editorial.id}</td>
                            <td>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>{editorial.nombre}</p>
                            </td>
                            <td>{editorial.pais}</td>
                            <td>
                                <button className='Borrar' onClick={() => Borrar(editorial.id)}>
                                    Borrar
                                </button>
                                <button className='Editar' onClick={() => Editar(editorial)}>
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mostrarModal && (
                <ModalEditarEditorial
                    editorial={{
                        id: editorialSeleccionada.id,
                        nombre: editorialSeleccionada.nombre,
                        pais: editorialSeleccionada.pais
                    }}
                    alCerrar={cerrarModal}
                    alGuardar={guardarEditorial}
                />
            )}
        </div>
    );
};

export default Editoriales;
*/