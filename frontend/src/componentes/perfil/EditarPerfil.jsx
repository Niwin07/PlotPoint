
import React, { useState } from 'react';
import '/src/componentes/perfil/EditarPerfil.css';
import ModalContraseña from '/src/componentes/modals/ModalContraseña.jsx'

export default function EditProfilePage() {
  //para manejar el modal para cambiar contraseña

  const [showModal, setShowModal] = useState(false);
  //simula datos de un usuario
  const [formData, setFormData] = useState({
    nombreUsuario: 'usuario_nombre',
    correo: 'santaespinacruz@gmail.com',
    biografia: '...',
    urlAvatar: '/src/img/perfil.webp',
  });

  //si cambiar el nombre y la biografia lo setea a FormData

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  //si cambia la foto de perfil lo setea a FormData

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        urlAvatar: file,
        photoName: file.name
      }));
    }
  };
  const eliminarCuenta = () => {

    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta')) {
      window.location.href = '/registro'; 
      
    }

  }

  //simulacion si guardas los datos correctamente

  const handleSave = () => {
    console.log('Datos guardados:', formData);
    alert('Perfil actualizado exitosamente!');
  };

  return (
    <div className="edit-page-container">


      {/* Contenedor */}
      <div className="edit-main-content">
        {/* nombre de usuario*/}
        <div className="field-container">
          <label className="field-label">Nombre de usuario</label>
          <input
            type="text"
            name="username"
            value={formData.nombreUsuario}
            onChange={handleChange}
            className="field-input"
          />
        </div>

        {/* tu correo electronico (desabilitado) */}
        <div className="field-container">
          <label className="field-label">Correo electronico</label>
          <input
            type="email"
            name="email"
            value={formData.correo}
            className="field-input field-disabled"
            disabled
          />
        </div>

        {/* cambiar foto de perfil */}
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
            {formData.photoName || 'foto-de-perfil-nuevo.jpg'}
          </span>
        </div>

        {/* Biografia textarea */}
        <div className="field-container">
          <label className="field-label">Biografia</label>
          <textarea
            name="bio"
            value={formData.biografia}
            onChange={handleChange}
            className="field-textarea"
            rows="8"
          />
        </div>

        {/*botones de accion*/}
        <div className="button-container">
          <button onClick={handleSave} className="save-button">
            Guardar
          </button>
          <button className="password-button" onClick={() => setShowModal(true)}>
            Cambiar contraseña
          </button>
        </div>

        {/* cerrar sesion */}
        <div className="logout-container">
          <a onClick={eliminarCuenta} className="logout-button">Eliminar cuenta</a>
        </div>
      </div>
      {showModal && <ModalContraseña onClose={() => setShowModal(false)} />}
    </div>
  );
}