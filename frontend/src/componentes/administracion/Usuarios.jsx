import React, { useState } from 'react';
import '/src/componentes/administracion/admin.css';
import ModalEditarUsuario from '/src/componentes/modals/ModalEditarUsuario.jsx';
import ModalCrearUsuario from '/src/componentes/modals/ModalCrearUsuario.jsx';

const Usuarios = () => {
    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [buscador, setBuscador] = useState('');
    const [usuarios, setUsuarios] = useState([
        {
            id: 1,
            nombreUsuario: "Maria_Jose_Rodriguez2006",
            correo: "mariajose@gmail.com",
            nombre: "María José Rodríguez",
            biografia: "Amante de la lectura y los libros de fantasía",
            urlAvatar: null,
            rol: "usuario",
            actividad: 23,
            seguidores: 12,
            fechaRegistro: "2023-01-23",
        },
        {
            id: 2,
            nombreUsuario: "JuanPerez_Lector",
            correo: "juanperez@gmail.com",
            nombre: "Juan Pérez",
            biografia: "Lector empedernido de novelas policiales",
            urlAvatar: null,
            rol: "usuario",
            actividad: 45,
            seguidores: 28,
            fechaRegistro: "2023-02-15",
        },
        {
            id: 3,
            nombreUsuario: "Carlos_Libros",
            correo: "carlos@gmail.com",
            nombre: "Carlos Gómez",
            biografia: "Coleccionista de libros antiguos",
            urlAvatar: null,
            rol: "usuario",
            actividad: 156,
            seguidores: 89,
            fechaRegistro: "2022-11-10",
        },
        {
            id: 4,
            nombreUsuario: "Sofia_Escritora",
            correo: "sofia.escribe@gmail.com",
            nombre: "Sofía García",
            biografia: "Escritora y crítica literaria",
            urlAvatar: null,
            rol: "usuario",
            actividad: 78,
            seguidores: 45,
            fechaRegistro: "2023-03-22",
        },
    ]);

    const Borrar = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            setUsuarios(usuarios.filter(usuario => usuario.id !== id));
            
            // Aquí deberías hacer la petición DELETE a tu API
            // fetch('/api/usuarios/' + id, { method: 'DELETE' })
        }
    };

    const Editar = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setMostrarModalEditar(true);
    };

    const cerrarModalEditar = () => {
        setMostrarModalEditar(false);
        setUsuarioSeleccionado(null);
    };

    const cerrarModalCrear = () => {
        setMostrarModalCrear(false);
    };

    const guardarUsuario = (datosActualizados) => {
        setUsuarios(prevUsuarios =>
            prevUsuarios.map(usuario =>
                usuario.id === usuarioSeleccionado.id
                    ? {
                        ...usuario,
                        nombreUsuario: datosActualizados.nombreUsuario,
                        correo: datosActualizados.correo
                    }
                    : usuario
            )
        );

        setMostrarModalEditar(false);
        setUsuarioSeleccionado(null);
        alert('Usuario actualizado correctamente');

        // Aquí deberías hacer la petición PUT a tu API
        // fetch('/api/usuarios/' + usuarioSeleccionado.id, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         nombre_usuario: datosActualizados.nombreUsuario,
        //         correo: datosActualizados.correo
        //     })
        // })
    };

    const crearUsuario = (datosNuevoUsuario) => {
        // Generar nuevo ID
        const nuevoId = Math.max(...usuarios.map(u => u.id)) + 1;
        
        // Obtener fecha actual
        const fechaActual = new Date().toISOString().split('T')[0];

        const nuevoUsuario = {
            id: nuevoId,
            nombreUsuario: datosNuevoUsuario.nombreUsuario,
            correo: datosNuevoUsuario.correo,
            nombre: "",
            biografia: "",
            urlAvatar: null,
            rol: "usuario",
            actividad: 0,
            seguidores: 0,
            fechaRegistro: fechaActual
        };
        

        setUsuarios([...usuarios, nuevoUsuario]);
        setMostrarModalCrear(false);
        alert('Usuario creado correctamente');

        // Aquí deberías hacer la petición POST a tu API
        // fetch('/api/usuarios', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         nombre_usuario: datosNuevoUsuario.nombreUsuario,
        //         correo: datosNuevoUsuario.correo,
        //         contrasena: datosNuevoUsuario.contrasena // Se hasheará en el backend
        //     })
        // })
    };

    const Buscar = () => {
        const resultados = usuarios.filter(usuario => 
            usuario.nombreUsuario.toLowerCase().includes(buscador.toLowerCase()) ||
            usuario.correo.toLowerCase().includes(buscador.toLowerCase())
        );
        
        if (resultados.length === 0) {
            alert('No se encontraron usuarios');
        } else {
            alert(`Se encontraron ${resultados.length} usuario(s)`);
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
                    placeholder="Buscar usuario"
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
                        <th>USUARIO</th>
                        <th>ACTIVIDAD</th>
                        <th>SEGUIDORES</th>
                        <th>FECHA REGISTRO</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>{usuario.nombreUsuario}</p>
                                <span style={{ fontSize: '13px', color: '#666' }}>{usuario.correo}</span>
                            </td>
                            <td>{usuario.actividad} reseñas</td>
                            <td>{usuario.seguidores}</td>
                            <td>{usuario.fechaRegistro}</td>
                            <td>
                                <button className='Borrar' onClick={() => Borrar(usuario.id)}>
                                    Borrar
                                </button>
                                <button className='Editar' onClick={() => Editar(usuario)}>
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mostrarModalEditar && (
                <ModalEditarUsuario
                    usuario={{
                        id: usuarioSeleccionado.id,
                        nombreUsuario: usuarioSeleccionado.nombreUsuario,
                        correo: usuarioSeleccionado.correo
                    }}
                    alCerrar={cerrarModalEditar}
                    alGuardar={guardarUsuario}
                />
            )}

            {mostrarModalCrear && (
                <ModalCrearUsuario
                    alCerrar={cerrarModalCrear}
                    alGuardar={crearUsuario}
                />
            )}
        </div>
    );
};

export default Usuarios;