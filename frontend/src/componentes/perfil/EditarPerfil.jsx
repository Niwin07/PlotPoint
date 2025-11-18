import React, { useState, useEffect } from 'react';

import axios from 'axios';
import '/src/componentes/perfil/EditarPerfil.css';
import ModalContraseña from '/src/componentes/modals/usuario/ModalContraseña.jsx'
import useUsuario from '/src/hooks/useUsuario';

export default function EditProfilePage() {
  const [usuario, setUsuario] = useUsuario();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const BACKEND_URL = 'http://localhost:3000';


  const atras = () => {
    window.history.back();
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/usuarios/perfil`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = response.data;
        
        setUsuario('id', data.id || '');
        setUsuario('nombre', data.nombre || '');
        setUsuario('correo', data.correo || '');
        setUsuario('biografia', data.biografia || '');
        setUsuario('urlAvatar', data.url_avatar || '');
      } catch (err) {
        setError('Error al cargar perfil');
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  const cambiarContraseña = async (contrasenaActual, contrasenaNueva) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/usuarios/perfil/cambiar-password`,
        {
          contrasenaActual,
          contrasenaNueva
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setShowModal(false);
      alert('Contraseña actualizada exitosamente');
    } catch (err) {
      console.error('Error:', err);
      throw new Error(err.response?.data?.error || 'Error al cambiar la contraseña');
    }

  }
  const uploadAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(`${BACKEND_URL}/api/usuarios/perfil/upload-avatar`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data.url_avatar;
    } catch (error) {
      console.error('Error al subir avatar:', error);
      throw error;
    }
  };



  const cambiarPerfil = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUsuario('urlAvatar', file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };


  const Guardar = async () => {
    setLoading(true);
    setError(null);

    try {
      let avatarUrl = usuario.urlAvatar;

      if(!usuario.nombre.trim()){
        alert('El nombre no puede estar vacío');
        setLoading(false);
        return;
      }
      if (usuario.biografia.length > 500) {
        alert('La biografía no puede exceder los 500 caracteres');
        setLoading(false);
        return;
      }
      if (usuario.nombre.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres');
        setLoading(false);
        return;
      }
      if(usuario.nombre.length > 50){
        alert('El nombre no puede exceder los 50 caracteres');
        setLoading(false);
        return;
      }

      if (usuario.urlAvatar instanceof File) {
        avatarUrl = await uploadAvatar(usuario.urlAvatar);
      }

      await axios.put(
        `${BACKEND_URL}/api/usuarios/perfil/actualizar`,
        {
          nombre: usuario.nombre,
          biografia: usuario.biografia,
          url_avatar: avatarUrl
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert('Perfil actualizado exitosamente!');
      window.history.back();

    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Error al actualizar perfil');
      alert('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };


  const eliminarCuenta = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta?')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/usuarios/perfil/borrar-cuenta`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        localStorage.removeItem('token');

      } catch (err) {

        alert('Error al eliminar cuenta');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      <button className='atrasperfil' onClick={atras}>VOLVER</button>
      <div className="edit-page-container">

        {error && <div className="error-message">{error}</div>}

        <div className="edit-main-content">
          <div className="field-container">
            <label className="field-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={usuario.nombre}
              onChange={(e) => setUsuario('nombre', e.target.value)}
              className="field-input"
            />
          </div>

          <div className="field-container">
            <label className="field-label">Correo electronico</label>
            <input
              type="email"
              name="correo"
              value={usuario.correo}
              className="field-input field-disabled"
              disabled
            />
          </div>

          <div className="photo-container">
            <input
              type="file"
              id="photoInput"
              accept="image/*"
              onChange={cambiarPerfil}
              style={{ display: 'none' }}
            />
            <label htmlFor="photoInput" className="photo-button">
              Cambiar foto de perfil
            </label>
            
            {(previewUrl || usuario.urlAvatar) && (
              <img
                src={previewUrl || `${BACKEND_URL}${usuario.urlAvatar}`}
                alt="Preview"
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  marginTop: '10px',
                  borderRadius: '50%'
                }}
              />
            )}
          </div>

          <div className="field-container">
            <label className="field-label">Biografia</label>
            <textarea
              name="biografia"
              value={usuario.biografia}
              onChange={(e) => setUsuario('biografia', e.target.value)}
              className="field-textarea"
              rows="8"
            />
          </div>

          <div className="button-container">
            <button
              onClick={Guardar}
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              className="password-button"
              onClick={() => setShowModal(true)}
            >
              Cambiar contraseña
            </button>
          </div>

          <div className="logout-container">
            <button
              onClick={eliminarCuenta}
              className="logout-button"
              disabled={loading}
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
        {showModal &&
          <ModalContraseña
            onClose={() => setShowModal(false)}
            onCambiarContraseña={cambiarContraseña}
          />}
      </div>
    </>
  );
}