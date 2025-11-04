import React, { useState, useEffect } from 'react';

import axios from 'axios';
import '/src/componentes/perfil/EditarPerfil.css';
import ModalContraseña from '/src/componentes/modals/ModalContraseña.jsx'

export default function EditProfilePage() {

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const BACKEND_URL = 'http://localhost:3000';

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    biografia: '',
    urlAvatar: '',
    previewUrl: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/usuarios/perfil`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = response.data;
        setFormData({
          nombre: data.nombre || '',
          correo: data.correo || '',
          biografia: data.biografia || '',
          urlAvatar: data.url_avatar || '',
          previewUrl: null
        });
      } catch (err) {
        setError('Error al cargar perfil');
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  //luego de realizar una breve verificacion en el modal, se enviara la consulta para confirmar el cambio o avisar que los datos son incorrectos
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
  //actualizamos la foto de perfil del usuario por separado

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

  //setea los valores que cambiemos

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  //setea la imagen que cambiemos

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        urlAvatar: file,
        photoName: file.name,
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  //al apretar guardar se enviara la peticion con la foto de perfil, nombre y biografia 

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      let avatarUrl = formData.urlAvatar;

      // Si hay un nuevo archivo de avatar, súbelo primero
      if (formData.urlAvatar instanceof File) {
        avatarUrl = await uploadAvatar(formData.urlAvatar);
      }

      // Actualiza el perfil con JSON
      await axios.put(
        `${BACKEND_URL}/api/usuarios/perfil/actualizar`,
        {
          nombre: formData.nombre,
          biografia: formData.biografia,
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
      window.location.href = '/perfil/'


    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Error al actualizar perfil');
      alert('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  // se elimina la cuenta que poseas ahora mismo

  const eliminarCuenta = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta?')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/usuarios/perfil`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        localStorage.removeItem('token');

      } catch (err) {
        setError(err.response?.data?.error || 'Error al eliminar cuenta');
        alert('Error al eliminar cuenta');
      }
    }
  };

  // Limpia las URLs de preview cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (formData.previewUrl) {
        URL.revokeObjectURL(formData.previewUrl);
      }
    };
  }, [formData.previewUrl]);

  return (
    <div className="edit-page-container">
      {/*imprimimos los datos del usuario */}
      {error && <div className="error-message">{error}</div>}

      <div className="edit-main-content">
        <div className="field-container">
          <label className="field-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="field-input"
          />
        </div>

        <div className="field-container">
          <label className="field-label">Correo electronico</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            className="field-input field-disabled"
            disabled
          />
        </div>

        <div className="photo-container">
          <input
            type="file"
            id="photoInput"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="photoInput" className="photo-button">
            Cambiar foto de perfil
          </label>
          <span className="photo-filename">
            {formData.photoName || 'Seleccionar archivo...'}
          </span>
          {/*preview de la foto de perfil */}
          {(formData.previewUrl || formData.urlAvatar) && (
            <img
              src={formData.previewUrl || `${BACKEND_URL}${formData.urlAvatar}`}
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
            value={formData.biografia}
            onChange={handleChange}
            className="field-textarea"
            rows="8"
          />
        </div>

        <div className="button-container">
          <button
            onClick={handleSave}
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
          //decimos que la funcion onCambiarContraseña llamara a la funcion cambiarContraseña del componente perfil
          onCambiarContraseña={cambiarContraseña}
        />}
    </div>
  );
}