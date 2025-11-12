import React, { useEffect, useState } from 'react';
import '/src/componentes/administracion/admin.css';
import ModalEditarUsuario from '/src/componentes/modals/usuario/ModalEditarUsuario.jsx';
import ModalCrearUsuario from '/src/componentes/modals/usuario/ModalCrearUsuario.jsx';
import axios from 'axios'; 

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscador, setBuscador] = useState('');
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const token = localStorage.getItem('token');

  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });


  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await api.get('/usuarios/admin');

      const data = res.data;
      if (data.status !== 'ok') throw new Error(data.message);

      setUsuarios(data.usuarios);
    } catch (err) {
      let errorMsg = 'Error al traer usuarios';
      if (err.response) { 
        errorMsg = err.response.data.message || err.message;
      } else if (err.request) { 
        errorMsg = 'No se pudo conectar al servidor';
      } else { 
        errorMsg = err.message;
      }
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const crearUsuario = async (datos) => {
    try {
      const body = {
        nombre: datos.nombre,               
        nombre_usuario: datos.nombreUsuario,  
        correo: datos.correo,                
        contrasena: datos.contrasenaHash,     
      };

      const res = await axios.post('http://localhost:3000/api/usuarios/registro', body);

      const data = res.data;
      if (data.status !== 'ok') {
        throw new Error(data.message || 'Error en el registro');
      }

      alert('Usuario registrado exitosamente');
      setMostrarModalCrear(false);
      fetchUsuarios(); 
    } catch (err) {
      let errorMsg = 'Error al crear usuario';
      if (err.response) {
        errorMsg = err.response.data.message || err.message;
      } else if (err.request) {
        errorMsg = 'No se pudo conectar al servidor';
      } else {
        errorMsg = err.message;
      }
      alert(errorMsg);
    }
  };


  const Borrar = async (id) => {
    if (!window.confirm('¿Seguro deseas eliminar este usuario?')) return;

    try {
      const res = await api.delete(`/usuarios/admin/${id}`);

      const data = res.data;
      if (data.status !== 'ok') throw new Error(data.message);

      alert('Usuario eliminado');
      setUsuarios(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      let errorMsg = 'Error al eliminar usuario';
      if (err.response) {
        errorMsg = err.response.data.message || err.message;
      } else if (err.request) {
        errorMsg = 'No se pudo conectar al servidor';
      } else {
        errorMsg = err.message;
      }
      alert(errorMsg);
    }
  };

  const Editar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModalEditar(true);
  };

  const cerrarModalEditar = () => {
    setMostrarModalEditar(false);
    setUsuarioSeleccionado(null);
    fetchUsuarios();
  };

  const guardarUsuario = async (datos) => {
    try {
<<<<<<< HEAD
        const res = await fetch(`http://localhost:3000/api/usuarios/admin/${usuarioSeleccionado.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            nombre: datos.nombre,
            nombre_usuario: datos.nombre_usuario,
            correo: datos.correo
        })
        });

        const data = await res.json();
        if (!res.ok || data.status !== 'ok') throw new Error(data.message);

        alert('✅ Usuario actualizado correctamente');
        cerrarModalEditar(); // Se actualiza la tabla automáticamente
    } catch (err) {
        alert(`Error actualizando usuario: ${err.message}`);
=======
      const body = {
          nombre: datos.nombre,
          nombre_usuario: datos.nombre_usuario,
          correo: datos.correo
      };


      const res = await api.put(`/usuarios/admin/${usuarioSeleccionado.id}`, body);


      const data = res.data;
      if (data.status !== 'ok') throw new Error(data.message);

      alert('Usuario actualizado correctamente');
      cerrarModalEditar();
    } catch (err) {

      let errorMsg = 'Error actualizando usuario';
      if (err.response) {
        errorMsg = err.response.data.message || err.message;
      } else if (err.request) {
        errorMsg = 'No se pudo conectar al servidor';
      } else {
        errorMsg = err.message;
      }
      alert(errorMsg);
>>>>>>> origin/develop_mesias
    }
  };


  const Buscar = () => {
<<<<<<< HEAD
=======

>>>>>>> origin/develop_mesias
    const text = buscador.toLowerCase();
    const filtrados = usuarios.filter(u =>
      (u.nombre_usuario || '').toLowerCase().includes(text) ||
      (u.nombre || '').toLowerCase().includes(text) ||
      (u.correo || '').toLowerCase().includes(text)
    );
    if (filtrados.length === 0) {
      alert('Sin resultados');
    } else {
      setUsuarios(filtrados);
    }
  };

  return (
    <div>
      <div className="acciones">
        <input
          type="text"
          placeholder="Buscar usuario"
          value={buscador}
          onChange={(e) => setBuscador(e.target.value)}
          className="InputAdmin"
        />
        <button className="Buscar" onClick={Buscar}>Buscar</button>
        <button className="Nuevo" onClick={() => setMostrarModalCrear(true)}>Nuevo</button>
        <button className="Refrescar" onClick={fetchUsuarios}>
          {loading ? 'Cargando...' : 'Refrescar'}
        </button>
      </div>

      <table id="t01">
        <thead>
          <tr>
            <th>ID</th>
            <th>USUARIO</th>
            <th>ROL</th>
            <th>FECHA REGISTRO</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>
                <p style={{ fontWeight: 'bold', margin: 0 }}>{usuario.nombre_usuario}</p>
                <span style={{ fontSize: '12px', color: '#555' }}>{usuario.correo}</span>
              </td>
              <td>{usuario.rol}</td>
              <td>{usuario.fecha_creacion}</td>
              <td>
                <button className="Editar" onClick={() => Editar(usuario)}>Editar</button>
                <button className="Borrar" onClick={() => Borrar(usuario.id)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModalEditar && usuarioSeleccionado && (
        <ModalEditarUsuario
          usuario={usuarioSeleccionado}
          alCerrar={cerrarModalEditar}
          alGuardar={guardarUsuario}
        />
      )}

      {mostrarModalCrear && (
        <ModalCrearUsuario
          alCerrar={() => setMostrarModalCrear(false)}
          alGuardar={crearUsuario}
        />
      )}
    </div>
  );
};

<<<<<<< HEAD
export default Usuarios;
=======
export default Usuarios;
>>>>>>> origin/develop_mesias
